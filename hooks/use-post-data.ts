"use client";

import {
  useMutation,
  useQueryClient,
  type MutationKey,
  type QueryKey,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios-instance";

type ApiEnvelope<TData> = {
  message?: string;
  data?: TData;
  meta?: unknown;
  error?: unknown;
};

type RequestParams = Record<
  string,
  string | number | boolean | null | undefined | Array<string | number | boolean>
>;

type MaybeFactory<TValue, TVariables> = TValue | ((variables: TVariables) => TValue);

type UsePostDataParams<TData, TVariables, TContext> = {
  key?: MutationKey;
  endpoint: MaybeFactory<string, TVariables>;
  params?: MaybeFactory<RequestParams | undefined, TVariables>;
  headers?: MaybeFactory<Record<string, string> | undefined, TVariables>;
  successMessage?: string | ((data: TData) => string);
  errorMessage?: string | ((error: AxiosError) => string);
  invalidateKeys?: QueryKey[];
  extractData?: boolean;
  options?: Omit<
    UseMutationOptions<TData, AxiosError, TVariables, TContext>,
    "mutationFn" | "mutationKey"
  >;
};

const resolveValue = <TValue, TVariables>(
  value: MaybeFactory<TValue, TVariables>,
  variables: TVariables
) => (typeof value === "function" ? (value as (v: TVariables) => TValue)(variables) : value);

const getErrorMessage = (error: AxiosError, fallback: string) =>
  (error.response?.data as { message?: string } | undefined)?.message ?? fallback;

export function usePostData<TData, TVariables = unknown, TContext = unknown>({
  key,
  endpoint,
  params,
  headers,
  successMessage = "Request completed successfully.",
  errorMessage = "Request failed.",
  invalidateKeys = [],
  extractData = true,
  options,
}: UsePostDataParams<TData, TVariables, TContext>) {
  const queryClient = useQueryClient();

  return useMutation<TData, AxiosError, TVariables, TContext>({
    ...options,
    mutationKey: key,
    mutationFn: async (variables) => {
      const resolvedEndpoint = resolveValue(endpoint, variables);
      const resolvedParams = params ? resolveValue(params, variables) : undefined;
      const resolvedHeaders = headers ? resolveValue(headers, variables) : undefined;

      const response = await axiosInstance.post<ApiEnvelope<TData> | TData>(
        resolvedEndpoint,
        variables,
        {
          params: resolvedParams,
          headers: resolvedHeaders,
        }
      );

      if (!extractData) {
        return response.data as TData;
      }

      return ((response.data as ApiEnvelope<TData>).data ?? response.data) as TData;
    },
    onSuccess: async (data, variables, onMutateResult, context) => {
      if (successMessage) {
        toast.success(
          typeof successMessage === "function" ? successMessage(data) : successMessage
        );
      }

      if (invalidateKeys.length > 0) {
        await Promise.all(
          invalidateKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey }))
        );
      }

      await options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: async (error, variables, onMutateResult, context) => {
      const fallbackMessage =
        typeof errorMessage === "function" ? errorMessage(error) : errorMessage;
      toast.error(getErrorMessage(error, fallbackMessage));
      await options?.onError?.(error, variables, onMutateResult, context);
    },
  });
}



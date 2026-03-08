"use client";

import { useQuery, type QueryKey, type UseQueryOptions } from "@tanstack/react-query";
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

type UseGetDataParams<TQueryFnData, TData> = {
  key: QueryKey;
  endpoint: string;
  params?: RequestParams;
  enabled?: boolean;
  successMessage?: string;
  errorMessage?: string;
  extractData?: boolean;
  options?: Omit<
    UseQueryOptions<TQueryFnData, AxiosError, TData, QueryKey>,
    "queryKey" | "queryFn" | "enabled"
  >;
};

const getErrorMessage = (error: AxiosError, fallback: string) => {
  const responseMessage =
    (error.response?.data as { message?: string } | undefined)?.message ?? fallback;
  return responseMessage;
};

export function useGetData<TQueryFnData, TData = TQueryFnData>({
  key,
  endpoint,
  params,
  enabled = true,
  successMessage,
  errorMessage = "Failed to load data.",
  extractData = true,
  options,
}: UseGetDataParams<TQueryFnData, TData>) {
  return useQuery<TQueryFnData, AxiosError, TData, QueryKey>({
    ...options,
    queryKey: key,
    enabled,
    queryFn: async () => {
      try {
        const response = await axiosInstance.get<ApiEnvelope<TQueryFnData> | TQueryFnData>(
          endpoint,
          {
            params,
          }
        );

        const payload = extractData
          ? ((response.data as ApiEnvelope<TQueryFnData>).data ??
            (response.data as TQueryFnData))
          : (response.data as TQueryFnData);

        if (successMessage) {
          toast.success(successMessage);
        }

        return payload;
      } catch (error) {
        const axiosError = error as AxiosError;
        toast.error(getErrorMessage(axiosError, errorMessage));
        throw axiosError;
      }
    },
  });
}



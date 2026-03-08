"use client";

import { useState } from "react";
import { useMutation, type MutationKey, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios-instance";

type ApiEnvelope<TData> = {
  message?: string;
  data?: TData;
  meta?: unknown;
  error?: unknown;
};

export type UploadResponseData = {
  url: string;
  publicId: string;
};

type UseUploadFileParams<TData, TContext> = {
  key?: MutationKey;
  endpoint?: string;
  fileFieldName?: string;
  successMessage?: string | ((data: TData) => string);
  errorMessage?: string | ((error: AxiosError) => string);
  extractData?: boolean;
  options?: Omit<UseMutationOptions<TData, AxiosError, File, TContext>, "mutationFn" | "mutationKey">;
};

const getErrorMessage = (error: AxiosError, fallback: string) =>
  (error.response?.data as { message?: string } | undefined)?.message ?? fallback;

export function useUploadFile<TData = UploadResponseData, TContext = unknown>({
  key,
  endpoint = "/uploads",
  fileFieldName = "file",
  successMessage = "File uploaded successfully.",
  errorMessage = "Failed to upload file.",
  extractData = true,
  options,
}: UseUploadFileParams<TData, TContext> = {}) {
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation<TData, AxiosError, File, TContext>({
    ...options,
    mutationKey: key,
    mutationFn: async (file) => {
      setUploadProgress(0);
      const formData = new FormData();
      formData.append(fileFieldName, file);

      const response = await axiosInstance.post<ApiEnvelope<TData> | TData>(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          if (!event.total) {
            return;
          }

          const nextProgress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(nextProgress);
        },
      });

      if (!extractData) {
        return response.data as TData;
      }

      return ((response.data as ApiEnvelope<TData>).data ?? response.data) as TData;
    },
    onSuccess: async (data, variables, onMutateResult, context) => {
      setUploadProgress(100);
      if (successMessage) {
        toast.success(
          typeof successMessage === "function" ? successMessage(data) : successMessage
        );
      }

      await options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: async (error, variables, onMutateResult, context) => {
      setUploadProgress(0);
      const fallbackMessage =
        typeof errorMessage === "function" ? errorMessage(error) : errorMessage;
      toast.error(getErrorMessage(error, fallbackMessage));
      await options?.onError?.(error, variables, onMutateResult, context);
    },
  });

  return {
    ...mutation,
    uploadProgress,
    isUploading: mutation.isPending,
    uploadFile: mutation.mutateAsync,
  };
}

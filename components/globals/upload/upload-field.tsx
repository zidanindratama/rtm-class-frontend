"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { File, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  useUploadFile,
  type UploadResponseData,
} from "@/hooks/use-upload-file";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

type UploadFieldProps = {
  value: string;
  onChange: (nextValue: string) => void;
  endpoint?: string;
  fileFieldName?: string;
  accept?: string;
  label?: string;
  showValueInput?: boolean;
  showUploadedUrl?: boolean;
  showPreview?: boolean;
  placeholder?: string;
  uploadedUrlLabel?: string;
  uploadButtonLabel?: string;
  uploadingLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  disabled?: boolean;
  validateFile?: (file: File) => string | null;
  onUploaded?: (result: UploadResponseData) => void;
};

export function UploadField({
  value,
  onChange,
  endpoint = "/uploads",
  fileFieldName = "file",
  accept = "*/*",
  label = "Upload File",
  showValueInput = false,
  showUploadedUrl = false,
  showPreview = true,
  placeholder = "",
  uploadedUrlLabel = "Uploaded URL",
  uploadButtonLabel = "Upload",
  uploadingLabel = "Uploading...",
  successMessage = "File uploaded successfully.",
  errorMessage = "Failed to upload file.",
  disabled,
  validateFile,
  onUploaded,
}: UploadFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const uploadMutation = useUploadFile<UploadResponseData>({
    endpoint,
    fileFieldName,
    successMessage,
    errorMessage,
  });

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const validationError = validateFile?.(file);
    if (validationError) {
      toast.error(validationError);
      event.target.value = "";
      return;
    }

    try {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }

      const result = await uploadMutation.uploadFile(file);
      onChange(result.url);
      onUploaded?.(result);
    } finally {
      event.target.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const isImageByUrl = (url: string) =>
    /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)$/i.test(url);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }

    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={inputId}>{label}</Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={disabled || uploadMutation.isUploading}
          className="cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadMutation.isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {uploadingLabel}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              {uploadButtonLabel}
            </>
          )}
        </Button>
        <input
          ref={fileInputRef}
          id={`${inputId}-file`}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled || uploadMutation.isUploading}
        />
      </div>

      {showValueInput ? (
        <Input
          id={inputId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="bg-muted/20"
        />
      ) : showUploadedUrl && value ? (
        <p className="rounded-md border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground break-all">
          {uploadedUrlLabel}: {value}
        </p>
      ) : null}

      {showPreview ? (
        <div className="rounded-md border border-border/60 bg-muted/20 p-3">
          {selectedFile ? (
            selectedFile.type.startsWith("image/") && previewUrl ? (
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-background">
                  <Image
                    src={previewUrl}
                    alt={selectedFile.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedFile.type || "Image"} • {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <File className="h-4 w-4 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="truncate font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedFile.type || "Unknown type"} •{" "}
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
            )
          ) : value ? (
            isImageByUrl(value) ? (
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-background">
                  <Image
                    src={value}
                    alt="Uploaded file"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <p className="truncate text-sm text-muted-foreground">Image uploaded</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <File className="h-4 w-4 text-muted-foreground" />
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-primary hover:underline"
                >
                  Open uploaded file
                </a>
              </div>
            )
          ) : (
            <p className="text-xs text-muted-foreground">No file selected</p>
          )}
        </div>
      ) : null}

      {uploadMutation.isUploading ? (
        <div className="space-y-1.5">
          <Progress value={uploadMutation.uploadProgress} />
          <p className="text-xs text-muted-foreground">
            Uploading... {uploadMutation.uploadProgress}%
          </p>
        </div>
      ) : null}
    </div>
  );
}

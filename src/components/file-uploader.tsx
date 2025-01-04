"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "./thumbnail";
import { useToast } from "@/hooks/use-toast";
import { MAX_FILE_SIZE } from "@/lib/constance";
import { uploadFileAction } from "@/lib/actions/file.action";
import { usePathname } from "next/navigation";
interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}
export default function FileUploader({ ownerId, accountId }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const pathname = usePathname();
  
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      const uploadPromises = acceptedFiles.map((file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prev) => prev.filter((f) => f.name !== file.name));
          return toast({
            description: (
              <p className="body-2 text-white">
                <span className="font-semibold">{file.name}</span> is too large.
                Max file size is 50MB
              </p>
            ),
            className: "error-toast",
          });
        }
        return uploadFileAction({
          path: pathname,
          file: file,
          ownerId: ownerId,
          accountId: accountId,
        }).then((uploadedFile) => {
          if (uploadedFile) {
            setFiles((prev) => prev.filter((f) => f.name !== file.name));
          }
        });
      });
      await Promise.all(uploadPromises);
    },
    [accountId, ownerId, pathname, toast]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement>,
    filename: string
  ) => {
    e.stopPropagation();
    setFiles((prev) => prev.filter((f) => f.name !== filename));
  };
  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button w-full")}>
        <Image
          src={"/assets/icons/upload.svg"}
          alt="upload"
          width={24}
          height={24}
        />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type as FileType}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />
                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src={"/assets/icons/file-loader.gif"}
                      alt="loader"
                      width={80}
                      height={26}
                    />
                  </div>
                </div>
                <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

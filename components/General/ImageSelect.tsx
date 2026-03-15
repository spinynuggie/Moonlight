import Image from "next/image";
import { useState } from "react";

import ImageCropDialog from "@/components/General/ImageCropDialog";
import Spinner from "@/components/Spinner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/hooks/use-toast";
import { useT } from "@/lib/i18n/utils";

type Props = {
  setFile: (file: File | null) => void;
  file: File | null;
  isWide?: boolean;
  maxFileSizeBytes?: number;
  enableCrop?: boolean;
  type?: "avatar" | "banner";
};

export default function ImageSelect({
  setFile,
  file,
  isWide,
  maxFileSizeBytes,
  enableCrop,
  type,
}: Props) {
  const t = useT("components.imageSelect");
  const uniqueId = Math.random().toString(36).slice(7);

  const { toast } = useToast();

  const [rawFileForCrop, setRawFileForCrop] = useState<File | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  const handleFileSelected = (nextFile: File) => {
    if (enableCrop && type) {
      setRawFileForCrop(nextFile);
      setIsCropOpen(true);
    }
    else {
      setFile(nextFile);
    }
  };

  const handleCropped = (croppedFile: File) => {
    setFile(croppedFile);
    setRawFileForCrop(null);
  };

  return (
    <>
      <div className="flex w-full items-center justify-center">
        <label htmlFor={uniqueId} className="w-full cursor-pointer">
          <div
            className={`flex flex-col items-center justify-center ${
              isWide
                ? "w-72 max-w-full flex-shrink md:w-96"
                : "w-40 max-w-full flex-shrink"
            }`}
          >
            <div className="flex w-full items-center justify-center rounded-lg bg-transparent">
              <input
                type="file"
                id={uniqueId}
                accept=".png, .jpg, .jpeg, .gif"
                className="hidden"
                onChange={(e) => {
                  const nextFile = e.target.files?.[0];
                  if (!nextFile)
                    return;
                  if (maxFileSizeBytes && nextFile.size > maxFileSizeBytes) {
                    toast({
                      title: t("imageTooBig"),
                      variant: "destructive",
                    });
                    return;
                  }
                  handleFileSelected(nextFile);
                }}
              />

              {file ? (
                <div className="w-full flex-shrink">
                  <AspectRatio ratio={isWide ? 4 / 1 : 1 / 1} className="w-full">
                    <div className="relative size-full">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="avatar"
                        fill
                        style={{ objectFit: "cover" }}
                        className="smooth-transition rounded-lg hover:opacity-80"
                      />
                    </div>
                  </AspectRatio>
                </div>
              ) : (
                <div className="mx-auto px-12">
                  <Spinner size="lg" />
                </div>
              )}
            </div>
          </div>
        </label>
      </div>
      {enableCrop && type && rawFileForCrop && (
        <ImageCropDialog
          file={rawFileForCrop}
          type={type}
          open={isCropOpen}
          onOpenChange={setIsCropOpen}
          onCropped={handleCropped}
        />
      )}
    </>
  );
}

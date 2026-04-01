import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useState } from "react";

import ImageCropDialog from "@/components/General/ImageCropDialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
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
  const inputId = useId();

  const { toast } = useToast();

  const [rawFileForCrop, setRawFileForCrop] = useState<File | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileSelected = (nextFile: File) => {
    const isGif = nextFile.type === "image/gif";
    const shouldCrop = Boolean(enableCrop && type && !isGif);

    if (shouldCrop) {
      setRawFileForCrop(nextFile);
      setIsCropOpen(true);
      return;
    }

    setFile(nextFile);
  };

  const handleCropped = (croppedFile: File) => {
    setFile(croppedFile);
    setRawFileForCrop(null);
  };

  return (
    <>
      <div className="flex w-full items-center justify-center">
        <label htmlFor={inputId} className="w-full cursor-pointer">
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
                id={inputId}
                accept="image/png,image/jpeg,image/gif"
                className="hidden"
                onChange={(e) => {
                  const nextFile = e.target.files?.[0];
                  e.currentTarget.value = "";

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

              <div className="w-full flex-shrink">
                <AspectRatio ratio={isWide ? 4 / 1 : 1 / 1} className="w-full">
                  <div className="relative size-full overflow-hidden rounded-lg">
                    <AnimatePresence mode="wait">
                      {previewUrl ? (
                        <motion.img
                          key="preview"
                          src={previewUrl}
                          alt="upload preview"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ opacity: 0.8 }}
                          transition={{ duration: 0.3 }}
                          className="size-full object-cover"
                        />
                      ) : (
                        <motion.div
                          key="skeleton"
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="size-full"
                        >
                          <Skeleton className="size-full rounded-lg" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </AspectRatio>
              </div>
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

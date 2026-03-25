import Image from "next/image";

import { useT } from "@/lib/i18n/utils";

interface ContentNotExistProps {
  text?: string;
  description?: string;
}

export function ContentNotExist({ text, description }: ContentNotExistProps) {
  const t = useT("components.contentNotExist");
  return (
    <div className="flex flex-col items-center justify-center space-x-4 rounded-lg p-4 text-center text-current duration-300 animate-in fade-in md:flex-row">
      <Image
        src="/images/content-not-found.png"
        alt="content-not-found"
        width={200}
        height={200}
      />
      <div>
        <h1 className="text-2xl font-semibold">{text ?? t("defaultText")}</h1>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

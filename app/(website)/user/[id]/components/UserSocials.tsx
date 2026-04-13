import {
  Briefcase,
  Globe2,
  HeartIcon,
  MapPin,
  Twitch,
} from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";
import * as React from "react";

import { CopyElement } from "@/components/CopyElement";
import { BiTwitterX } from "@/components/ui/icons/bi-twitter-x";
import { IcBaselineDiscord } from "@/components/ui/icons/ic-baseline-discord";
import { MdiTelegram } from "@/components/ui/icons/mdi-telegram";
import type { UserMetadataResponse } from "@/lib/types/api";

interface UserSocialsProps {
  metadata: UserMetadataResponse;
}

const bioFields = ["location", "interest", "occupation"] as const;
const socialFields = ["telegram", "twitch", "twitter", "discord", "website"] as const;

const icons: Partial<Record<keyof UserMetadataResponse, ReactElement>> = {
  location: <MapPin className="size-3.5 shrink-0" />,
  interest: <HeartIcon className="size-3.5 shrink-0" />,
  occupation: <Briefcase className="size-3.5 shrink-0" />,
  telegram: <MdiTelegram className="size-3.5 shrink-0" />,
  twitch: <Twitch className="size-3.5 shrink-0" />,
  twitter: <BiTwitterX className="size-3.5 shrink-0" />,
  discord: <IcBaselineDiscord className="size-3.5 shrink-0" />,
  website: <Globe2 className="size-3.5 shrink-0" />,
};

function SocialValue({ field, value }: { field: string; value: string }) {
  switch (field) {
    case "telegram":
      return <Link className="font-semibold text-primary hover:underline" href={`https://t.me/${value}`}>{value}</Link>;
    case "twitch":
      return <Link className="font-semibold text-primary hover:underline" href={`https://twitch.tv/${value}`}>{value}</Link>;
    case "twitter":
      return <Link className="font-semibold text-primary hover:underline" href={`https://x.com/${value}`}>@{value}</Link>;
    case "discord":
      return (
        <CopyElement copyContent={value}>
          <span className="cursor-pointer font-semibold text-primary hover:underline">{value}</span>
        </CopyElement>
      );
    case "website":
      return <Link className="font-semibold text-primary hover:underline" href={value}>{value.replace(/^https?:\/\//, "")}</Link>;
    default:
      return <span className="font-semibold text-foreground/80">{value}</span>;
  }
}

export default function UserSocials({ metadata }: UserSocialsProps) {
  const bioItems = bioFields.filter(
    f => metadata[f]?.toString().trim(),
  );
  const socialItems = socialFields.filter(
    f => metadata[f]?.toString().trim(),
  );

  if (bioItems.length === 0 && socialItems.length === 0)
    return null;

  return (
    <div className="space-y-2">
      {bioItems.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
          {bioItems.map(field => (
            <div className="flex items-center gap-1.5" key={field}>
              {icons[field]}
              <SocialValue field={field} value={metadata[field] as string} />
            </div>
          ))}
        </div>
      )}
      {socialItems.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
          {socialItems.map(field => (
            <div className="flex items-center gap-1.5" key={field}>
              {icons[field]}
              <SocialValue field={field} value={metadata[field] as string} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { icons as socialIcons };

import * as React from "react";

import { Tooltip } from "@/components/Tooltip";
import { useUserFriendsCount } from "@/lib/hooks/api/user/useUserFriends";
import { useT } from "@/lib/i18n/utils";
import type {
  UserMetadataResponse,
  UserResponse,
} from "@/lib/types/api";
import {
  UserPlaystyle,
} from "@/lib/types/api";
import { timeSince } from "@/lib/utils/timeSince";

interface UserGeneralInformationProps {
  user: UserResponse;
  metadata?: UserMetadataResponse;
  forumPostsCount?: number | null;
  commentsCount?: number | null;
}

export default function UserGeneralInformation({
  user,
  metadata,
  forumPostsCount,
  commentsCount,
}: UserGeneralInformationProps) {
  const t = useT("pages.user.components.generalInformation");
  const tPlaystyle = useT("pages.settings.components.playstyle");

  const friendsQuery = useUserFriendsCount(user.user_id);
  const friendsData = friendsQuery.data;

  const localizedPlaystyle = metadata
    ? metadata.playstyle.filter(p => p !== UserPlaystyle.NONE).map(p => tPlaystyle(`options.${p}`)).join(", ")
    : null;

  const bold = (chunks: React.ReactNode) => (
    <span className="font-semibold text-foreground">{chunks}</span>
  );

  const items: Array<{ key: string; node: React.ReactNode }> = [
    {
      key: "joined",
      node: (
        <Tooltip content={new Date(user.register_date).toLocaleString()}>
          {t.rich("joined", { b: bold, time: timeSince(user.register_date) })}
        </Tooltip>
      ),
    },
    {
      key: "followers",
      node: t.rich("followers", { b: bold, count: friendsData?.followers ?? 0 }),
    },
    {
      key: "following",
      node: t.rich("following", { b: bold, count: friendsData?.following ?? 0 }),
    },
    ...(localizedPlaystyle && localizedPlaystyle !== UserPlaystyle.NONE
      ? [{ key: "playstyle", node: t.rich("playsWith", { b: bold, playstyle: localizedPlaystyle }) }]
      : []),
    ...(forumPostsCount != null && forumPostsCount > 0
      ? [{ key: "forum", node: t.rich("forumPosts", { b: bold, count: forumPostsCount.toLocaleString() }) }]
      : []),
    ...(commentsCount != null && commentsCount > 0
      ? [{ key: "comments", node: t.rich("comments", { b: bold, count: commentsCount.toLocaleString() }) }]
      : []),
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
      {items.map((item, i) => (
        <React.Fragment key={item.key}>
          {i > 0 && <span className="text-border">·</span>}
          <span>{item.node}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

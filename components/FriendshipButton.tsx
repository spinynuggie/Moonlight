"use client";

import { UserMinus, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  useUpdateUserFriendshipStatus,
  useUserFriendshipStatus,
} from "@/lib/hooks/api/user/useUserFriends";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import { UpdateFriendshipStatusAction } from "@/lib/types/api";
import { cn } from "@/lib/utils";

export function FriendshipButton({
  userId,
  includeText = true,
  className,
}: {
  userId: number;
  includeText?: boolean;
  className?: string;
}) {
  const t = useT("components.friendshipButton");
  const { self } = useSelf();

  const { trigger } = useUpdateUserFriendshipStatus(userId);

  const { data, isLoading } = useUserFriendshipStatus(userId);

  const userFriendshipStatus = data;

  const updateFriendshipStatus = async (
    action: UpdateFriendshipStatusAction,
  ) => {
    trigger(
      { action },
      {
        optimisticData: data && {
          ...data,
          is_followed_by_you: action === UpdateFriendshipStatusAction.ADD,
        },
      },
    );
    toast({
      description: action === UpdateFriendshipStatusAction.ADD
        ? "Followed successfully!"
        : "Unfollowed successfully.",
      variant: action === UpdateFriendshipStatusAction.ADD
        ? "success"
        : "destructive",
    });
  };

  if (!self || userId === self.user_id)
    return;

  const { is_followed_by_you, is_following_you } = userFriendshipStatus ?? {};
  const isMutual = is_followed_by_you && is_following_you;

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!userFriendshipStatus)
          return;

        updateFriendshipStatus(
          is_followed_by_you
            ? UpdateFriendshipStatusAction.REMOVE
            : UpdateFriendshipStatusAction.ADD,
        );
      }}
      className={cn(
        isMutual
          ? "bg-pink-700 text-white hover:bg-pink-500"
          : is_followed_by_you
            ? "bg-lime-700 text-white hover:bg-lime-500"
            : "",
        className,
      )}
      isLoading={isLoading}
      variant={isLoading ? "secondary" : "default"}
    >
      {is_followed_by_you ? <UserMinus /> : <UserPlus />}
      {includeText && (
        <span className="hidden md:inline">
          {isMutual
            ? t("unfriend")
            : is_followed_by_you
              ? t("unfollow")
              : t("follow")}
        </span>
      )}
    </Button>
  );
}

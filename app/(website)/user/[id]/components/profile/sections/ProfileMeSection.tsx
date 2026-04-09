"use client";

import { Edit3 } from "lucide-react";
import { useEffect, useState } from "react";

import BBCodeInput from "@/components/BBCode/BBCodeInput";
import BBCodeTextField from "@/components/BBCode/BBCodeTextField";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAdminEditDescription } from "@/lib/hooks/api/user/useAdminUserEdit";
import { useEditDescription } from "@/lib/hooks/api/user/useEditDescription";
import type { ProfileUserResponse } from "@/lib/hooks/api/user/useUserProfile";
import useSelf from "@/lib/hooks/useSelf";
import { isUserHasAdminPrivilege } from "@/lib/utils/userPrivileges.util";

interface ProfileMeSectionProps {
  user: ProfileUserResponse;
}

export function ProfileMeSection({ user }: ProfileMeSectionProps) {
  const { self } = useSelf();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(user.description ?? "");

  const isOwnProfile = self?.user_id === user.user_id;
  const canEdit = Boolean(isOwnProfile || (self && isUserHasAdminPrivilege(self)));

  const selfEditDescription = useEditDescription();
  const adminEditDescription = useAdminEditDescription(user.user_id);

  useEffect(() => {
    setCurrentText(user.description ?? "");
  }, [user.description]);

  const saveDescription = async (text: string) => {
    const trigger = isOwnProfile
      ? selfEditDescription.trigger
      : adminEditDescription.trigger;

    try {
      await trigger({ description: text });
      setCurrentText(text);
      setIsEditing(false);
      toast({
        title: "Profile page updated",
        variant: "success",
      });
    }
    catch (error) {
      toast({
        title: error instanceof Error ? error.message : "Failed to update profile page",
        variant: "destructive",
      });
    }
  };

  if (isEditing) {
    return (
      <BBCodeInput
        defaultText={currentText}
        isSaving={selfEditDescription.isMutating || adminEditDescription.isMutating}
        onSave={saveDescription}
      />
    );
  }

  if (!currentText.trim()) {
    if (!canEdit) {
      return (
        <div className="flex min-h-[220px] items-center justify-center rounded-[14px] border border-dashed border-border/50 bg-secondary/30 text-sm text-muted-foreground">
          This player hasn&apos;t added anything to their me! section yet.
        </div>
      );
    }

    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-[14px] border border-dashed border-border/50 bg-secondary/30 px-6 text-center">
        <div>
          <p className="text-base font-semibold text-foreground">
            Tell us a bit about yourself :O
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add BBCode content, artwork, links, or a short intro right here.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
          <Edit3 />
          Edit me!
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {canEdit && (
        <div className="flex justify-end">
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            <Edit3 />
            Edit me!
          </Button>
        </div>
      )}
      <div className="max-h-[520px] overflow-y-auto rounded-[14px] border border-border/40 bg-secondary/30 p-4">
        <BBCodeTextField text={currentText} />
      </div>
    </div>
  );
}

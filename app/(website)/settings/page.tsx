"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  Cog,
  LockOpenIcon,
  NotebookPenIcon,
  User2Icon,
} from "lucide-react";
import { useState } from "react";

import ChangeCountryInput from "@/app/(website)/settings/components/ChangeCountryInput";
import ChangeDescriptionInput from "@/app/(website)/settings/components/ChangeDescriptionInput";
import ChangePasswordInput from "@/app/(website)/settings/components/ChangePasswordInput";
import ChangePlaystyleForm from "@/app/(website)/settings/components/ChangePlaystyleForm";
import ChangeSocialsForm from "@/app/(website)/settings/components/ChangeSocialsForm";
import ChangeUsernameInput from "@/app/(website)/settings/components/ChangeUsernameInput";
import SiteLocalOptions from "@/app/(website)/settings/components/SiteLocalOptions";
import UploadImageForm from "@/app/(website)/settings/components/UploadImageForm";
import { FilterOption } from "@/components/FilterOption";
import { FilterPanel } from "@/components/FilterPanel";
import Spinner from "@/components/Spinner";
import { useUserMetadata } from "@/lib/hooks/api/user/useUserMetadata";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import { cn } from "@/lib/utils";

type SettingsSection = "profile" | "about" | "account" | "preferences";

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6 border-b border-border/40 pb-4">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      {description && (
        <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

function SubsectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-[15px] font-semibold">{title}</h3>
  );
}

function SectionDivider() {
  return <div className="border-t border-border/40" />;
}

export default function Settings() {
  const t = useT("pages.settings");

  const sectionsMeta: Array<{
    id: SettingsSection;
    icon: React.ReactNode;
    label: string;
  }> = [
    { id: "profile", icon: <User2Icon className="size-4" />, label: t("sectionLabels.profile") },
    { id: "about", icon: <NotebookPenIcon className="size-4" />, label: t("sectionLabels.about") },
    { id: "account", icon: <LockOpenIcon className="size-4" />, label: t("sectionLabels.account") },
    { id: "preferences", icon: <Cog className="size-4" />, label: t("sectionLabels.preferences") },
  ];
  const { self, isLoading } = useSelf();
  const { data: userMetadata } = useUserMetadata(self?.user_id ?? null);
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!self) {
    return (
      <div className="rounded-[10px] border border-border/50 bg-card p-6 shadow-md">
        <p className="text-muted-foreground">{t("notLoggedIn")}</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div>
            <SectionHeader
              title={t("sectionLabels.profile")}
              description={t("sectionDescriptions.profile")}
            />
            <div className="space-y-6">
              <div className="space-y-3">
                <SubsectionHeader title={t("sections.changeAvatar")} />
                <UploadImageForm type="avatar" hideNote />
              </div>
              <SectionDivider />
              <div className="space-y-3">
                <SubsectionHeader title={t("sections.changeBanner")} />
                <UploadImageForm type="banner" hideNote />
              </div>
            </div>
          </div>
        );

      case "about":
        return (
          <div>
            <SectionHeader title={t("sectionLabels.about")} />
            <div className="space-y-6">
              <div className="space-y-3">
                <SubsectionHeader title={t("sections.changeDescription")} />
                <ChangeDescriptionInput user={self} />
                <p className="text-xs text-muted-foreground">
                  {t("description.reminder")}
                </p>
              </div>

              <SectionDivider />

              <div className="space-y-3">
                {userMetadata ? (
                  <ChangeSocialsForm metadata={userMetadata} user={self} />
                ) : (
                  <Spinner />
                )}
              </div>

              <SectionDivider />

              <div className="space-y-3">
                <SubsectionHeader title={t("sections.playstyle")} />
                {userMetadata ? (
                  <ChangePlaystyleForm metadata={userMetadata} user={self} />
                ) : (
                  <Spinner />
                )}
              </div>
            </div>
          </div>
        );

      case "account":
        return (
          <div>
            <SectionHeader title={t("sectionLabels.account")} />
            <div className="space-y-6">
              <div className="space-y-3">
                <SubsectionHeader title={t("sections.changeUsername")} />
                <ChangeUsernameInput />
              </div>

              <SectionDivider />

              <div className="space-y-3">
                <SubsectionHeader title={t("sections.changePassword")} />
                <ChangePasswordInput />
              </div>

              <SectionDivider />

              <div className="space-y-3">
                <SubsectionHeader title={t("sections.changeCountryFlag")} />
                <ChangeCountryInput user={self} />
              </div>
            </div>
          </div>
        );

      case "preferences":
        return (
          <div>
            <SectionHeader title={t("sectionLabels.preferences")} />
            <SiteLocalOptions />
          </div>
        );
    }
  };

  return (
    <div className="flex w-full flex-col space-y-2">
      <FilterPanel className="md:hidden">
        <div className="flex gap-0.5 overflow-x-auto px-3 py-2.5">
          {sectionsMeta.map((section, i) => (
            <FilterOption
              key={section.id}
              label={section.label}
              active={activeSection === section.id}
              onClick={() => setActiveSection(section.id)}
              index={i}
            />
          ))}
        </div>
      </FilterPanel>

      <div className="flex gap-2">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="hidden w-52 shrink-0 md:block"
        >
          <nav className="sticky top-20 space-y-0.5 rounded-[10px] border border-border/50 bg-card p-2 shadow-md">
            {sectionsMeta.map((section, i) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150",
                  activeSection === section.id
                    ? "bg-secondary font-medium text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                )}
                style={{
                  animation: `fade-in 300ms ease-out ${150 + i * 50}ms backwards`,
                }}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </nav>
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="rounded-[10px] border border-border/50 bg-card p-6 shadow-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

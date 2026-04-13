"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useT } from "@/lib/i18n/utils";
import { cn } from "@/lib/utils";

type RuleSectionId = "generalRules" | "chatCommunityRules" | "disclaimer";

const SECTIONS: RuleSectionId[] = ["generalRules", "chatCommunityRules", "disclaimer"];

export default function Rules() {
  const t = useT("pages.rules");
  const tGeneral = useT("pages.rules.sections.generalRules");
  const tChat = useT("pages.rules.sections.chatCommunityRules");
  const tDisclaimer = useT("pages.rules.sections.disclaimer");

  const [activeSection, setActiveSection] = useState<RuleSectionId>("generalRules");

  const sectionTitles: Record<RuleSectionId, string> = useMemo(() => ({
    generalRules: tGeneral("title"),
    chatCommunityRules: tChat("title"),
    disclaimer: tDisclaimer("title"),
  }), [tGeneral, tChat, tDisclaimer]);

  const handleSectionChange = useCallback((value: string) => {
    setActiveSection(value as RuleSectionId);
  }, []);

  const renderContent = (section: RuleSectionId) => {
    switch (section) {
      case "generalRules":
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground/90">{tGeneral.rich("noCheating.title")}</p>
              <p className="text-sm leading-relaxed text-foreground/70">{tGeneral("noCheating.description")}</p>
              <p className="text-xs italic leading-relaxed text-muted-foreground/60">{tGeneral("noCheating.warning")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground/90">{tGeneral.rich("noMultiAccount.title")}</p>
              <p className="text-sm leading-relaxed text-foreground/70">{tGeneral("noMultiAccount.description")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground/90">{tGeneral.rich("noImpersonation.title")}</p>
              <p className="text-sm leading-relaxed text-foreground/70">{tGeneral("noImpersonation.description")}</p>
            </div>
          </div>
        );

      case "chatCommunityRules":
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground/90">{tChat.rich("beRespectful.title")}</p>
              <p className="text-sm leading-relaxed text-foreground/70">{tChat("beRespectful.description")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground/90">{tChat.rich("noNSFW.title")}</p>
              <p className="text-sm leading-relaxed text-foreground/70">{tChat("noNSFW.description")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground/90">{tChat.rich("noAdvertising.title")}</p>
              <p className="text-sm leading-relaxed text-foreground/70">{tChat("noAdvertising.description")}</p>
            </div>
          </div>
        );

      case "disclaimer":
        return (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-foreground/80">{tDisclaimer("intro")}</p>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground/90">{tDisclaimer.rich("noLiability.title")}</p>
              <p className="text-sm leading-relaxed text-foreground/70">{tDisclaimer("noLiability.description")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground/90">{tDisclaimer.rich("accountRestrictions.title")}</p>
              <p className="text-sm leading-relaxed text-foreground/70">{tDisclaimer("accountRestrictions.description")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground/90">{tDisclaimer.rich("ruleChanges.title")}</p>
              <p className="text-sm leading-relaxed text-foreground/70">{tDisclaimer("ruleChanges.description")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground/90">{tDisclaimer.rich("agreementByParticipation.title")}</p>
              <p className="text-sm leading-relaxed text-foreground/70">{tDisclaimer("agreementByParticipation.description")}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex w-full flex-col space-y-2">
      {/* Mobile dropdown */}
      <div className="md:hidden">
        <Select value={activeSection} onValueChange={handleSectionChange}>
          <SelectTrigger className="rounded-[10px] border-border/50 bg-card shadow-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SECTIONS.map(s => (
              <SelectItem key={s} value={s}>
                {sectionTitles[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sidebar + Content */}
      <div className="flex gap-2">
        {/* Desktop Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="hidden w-52 shrink-0 md:block"
        >
          <nav className="sticky top-20 rounded-[10px] border border-border/50 bg-card p-2 shadow-md">
            <p className="mb-0.5 px-3 pb-0.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/40">
              {t("header")}
            </p>
            {SECTIONS.map((s, idx) => (
              <button
                key={s}
                type="button"
                onClick={() => setActiveSection(s)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-[13px] leading-snug transition-colors duration-150",
                  activeSection === s
                    ? "bg-secondary font-medium text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                )}
                style={{ animation: `fade-in 300ms ease-out ${150 + idx * 50}ms backwards` }}
              >
                {sectionTitles[s]}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Content Panel */}
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
                <div className="mb-6 border-b border-border/40 pb-4">
                  <h2 className="text-xl font-bold tracking-tight">
                    {sectionTitles[activeSection]}
                  </h2>
                </div>
                {renderContent(activeSection)}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

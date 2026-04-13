import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import { clearAuthCookies } from "@/lib/utils/clearAuthCookies";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function HeaderLogoutAlert({ children, ...props }: Props) {
  const t = useT("components.headerLogoutAlert");
  const { revalidate } = useSelf();
  const { toast } = useToast();

  return (
    <AlertDialog>
      <AlertDialogTrigger {...props}>{children}</AlertDialogTrigger>
      <AlertDialogContent className="rounded-[16px] border-border/50 bg-card/95 shadow-xl backdrop-blur">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              clearAuthCookies();
              revalidate();
              toast({
                title: t("toast.success"),
                variant: "success",
              });
            }}
          >
            {t("continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

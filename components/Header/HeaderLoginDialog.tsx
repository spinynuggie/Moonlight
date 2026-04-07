"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useContext, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { MobileDrawerContext } from "@/components/Header/HeaderMobileDrawer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuthorize } from "@/lib/hooks/api/auth/useAuthorize";
import useRestriction from "@/lib/hooks/useRestriction";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";

export default function HeaderLoginDialog() {
  const t = useT("components.headerLoginDialog");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const { revalidate } = useSelf();
  const { toast } = useToast();

  const { setSelfRestricted } = useRestriction();
  const { trigger: triggerAuthorize } = useAuthorize();

  const setMobileDrawerOpen = useContext(MobileDrawerContext);

  const formSchema = useMemo(
    () =>
      z.object({
        username: z
          .string()
          .min(2, {
            message: t("validation.usernameMinLength"),
          })
          .max(32, {
            message: t("validation.usernameMaxLength"),
          }),
        password: z
          .string()
          .min(8, {
            message: t("validation.passwordMinLength"),
          })
          .max(32, {
            message: t("validation.passwordMaxLength"),
          }),
      }),
    [t],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { username, password } = values;

    triggerAuthorize(
      {
        username,
        password,
      },
      {
        onSuccess(data) {
          Cookies.set("session_token", data.token, {
            expires: new Date(Date.now() + data.expires_in * 1000),
          });

          Cookies.set("refresh_token", data.refresh_token, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          });

          revalidate();

          setOpen(false);

          toast({
            title: t("toast.success"),
            variant: "success",
          });

          router.push("/");
        },
        onError(err) {
          const errorMessage = err.message ?? "Unknown error";

          if (errorMessage?.includes("restrict")) {
            setSelfRestricted(true, errorMessage);
            return;
          }

          setError(errorMessage || "Unknown error");
        },
      },
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          form.reset();
          setError("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">{t("signIn")}</Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden rounded-[16px] border-border/50 bg-card/95 p-0 shadow-xl backdrop-blur sm:max-w-[425px]">
        <DialogTitle className="sr-only">{t("title")}</DialogTitle>
        <div className="space-y-6 p-6">
          <div className="flex flex-col items-center gap-1 text-center">
            <h2 className="text-xl font-bold tracking-tight">
              {t("title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("username.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("username.placeholder")}
                        className="bg-secondary/30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("password.label")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t("password.placeholder")}
                        className="bg-secondary/30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>{t("error")}</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="smooth-transition w-full transform-gpu bg-primary font-medium text-primary-foreground hover:scale-[1.01] hover:bg-primary/90 hover:shadow-[0_0_24px_rgba(141,163,185,0.2)]"
              >
                {t("login")}
              </Button>
            </form>
          </Form>

          <Separator className="bg-border/50" />

          <div className="flex justify-center">
            <Button
              variant="link"
              onClick={() => {
                setOpen(false);
                router.push("/register");
                setMobileDrawerOpen?.(false);
              }}
              className="text-muted-foreground hover:text-primary"
            >
              {t("signUp")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

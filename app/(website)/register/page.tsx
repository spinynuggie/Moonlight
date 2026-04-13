"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { AlertCircle, Check, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useRegister } from "@/lib/hooks/api/auth/useRegister";
import { useUserSearch } from "@/lib/hooks/api/user/useUserSearch";
import useDebounce from "@/lib/hooks/useDebounce";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";

export default function Register() {
  const [isSuccessfulDialogOpen, setIsSuccessfulDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordRef = useRef<string>("");

  const { trigger } = useRegister();
  const { self, revalidate } = useSelf();
  const { toast } = useToast();
  const t = useT("pages.register");

  const [usernameInput, setUsernameInput] = useState("");
  const debouncedUsername = useDebounce(usernameInput, 400);

  const isUsernameValid = debouncedUsername.length >= 2 && /^[\w\- ]{1,32}$/.test(debouncedUsername);
  const { data: searchResults, isLoading: isCheckingUsername } = useUserSearch(
    isUsernameValid ? debouncedUsername : null,
    undefined,
    5,
    { revalidateOnFocus: false },
  );

  const isUsernameTaken = isUsernameValid && searchResults
    ? searchResults.some(u => u.username.toLowerCase() === debouncedUsername.toLowerCase())
    : false;
  const isUsernameAvailable = isUsernameValid && searchResults && !isUsernameTaken;
  const isUsernameChecking = isUsernameValid && (isCheckingUsername || debouncedUsername !== usernameInput);

  const formSchema = useMemo(
    () =>
      z.object({
        username: z
          .string()
          .min(2, {
            message: t("form.validation.usernameMin", { min: 2 }),
          })
          .max(32, {
            message: t("form.validation.usernameMax", { max: 32 }),
          }),
        email: z.string(),
        password: z
          .string()
          .min(8, {
            message: t("form.validation.passwordMin", { min: 8 }),
          })
          .max(32, {
            message: t("form.validation.passwordMax", { max: 32 }),
          })
          .refine((value) => {
            passwordRef.current = value;
            return true;
          }),
        confirmPassword: z
          .string()
          .min(8, {
            message: t("form.validation.passwordMin", { min: 8 }),
          })
          .max(32, {
            message: t("form.validation.passwordMax", { max: 32 }),
          })
          .refine(
            value => value === passwordRef.current,
            t("form.validation.passwordsDoNotMatch"),
          ),
      }),
    [t],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      setError(null);

      const { username, email, password } = values;

      trigger(
        {
          email,
          username,
          password,
        },
        {
          onSuccess: (data) => {
            Cookies.set("session_token", data.token, {
              expires: new Date(Date.now() + data.expires_in),
            });

            Cookies.set("refresh_token", data.refresh_token, {
              expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            });

            form.reset();

            revalidate();

            toast({ title: t("success.toast") });

            setIsSuccessfulDialogOpen(true);
          },
          onError(err) {
            setError(err.message ?? t("form.error.unknown"));
          },
        },
      );
    },
    [trigger, form, revalidate, toast, t],
  );

  const welcomeDescription = useMemo(
    () =>
      t.rich("welcome.description", {
        a: chunks => (
          <Link href="/wiki" className="text-primary hover:underline">
            {chunks}
          </Link>
        ),
      }),
    [t],
  );

  const termsText = useMemo(
    () =>
      t.rich("form.terms", {
        a: chunks => (
          <Link href="/rules" className="text-primary hover:underline">
            {chunks}
          </Link>
        ),
      }),
    [t],
  );

  const successMessage = useMemo(
    () =>
      t.rich("success.dialog.message", {
        a: chunks => (
          <Link
            href="/wiki#How%20to%20connect"
            className="text-primary hover:underline"
          >
            {chunks}
          </Link>
        ),
      }),
    [t],
  );

  return (
    <div className="flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-lg overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md"
      >
        <div className="relative space-y-6 p-6 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col items-center gap-1 text-center"
          >
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              {t("welcome.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {welcomeDescription}
            </p>
          </motion.div>

          <Separator className="bg-border/50" />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
          >
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
                      <FormLabel>{t("form.labels.username")}</FormLabel>
                      <FormControl>
                        <Input
                          pattern="^[a-zA-Z0-9_\- ]{1,32}$"
                          placeholder={t("form.placeholders.username")}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setUsernameInput(e.target.value);
                          }}
                        />
                      </FormControl>
                      <AnimatePresence mode="wait">
                        {isUsernameChecking && (
                          <motion.p
                            key="checking"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground"
                          >
                            <Loader2 className="size-3 animate-spin" />
                            {t("form.validation.checkingUsername")}
                          </motion.p>
                        )}
                        {!isUsernameChecking && isUsernameTaken && (
                          <motion.p
                            key="taken"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-1.5 text-xs text-destructive"
                          >
                            <X className="size-3" />
                            {t("form.validation.usernameTaken")}
                          </motion.p>
                        )}
                        {!isUsernameChecking && isUsernameAvailable && (
                          <motion.p
                            key="available"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-1.5 text-xs"
                            style={{ color: "#8C977D" }}
                          >
                            <Check className="size-3" />
                            {t("form.validation.usernameAvailable")}
                          </motion.p>
                        )}
                      </AnimatePresence>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.labels.email")}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          pattern="^.+@.+\.[a-zA-Z]{2,63}$"
                          placeholder={t("form.placeholders.email")}
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
                      <FormLabel>{t("form.labels.password")}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t("form.placeholders.password")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.labels.confirmPassword")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t("form.placeholders.password")}
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
                    <AlertTitle>{t("form.error.title")}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="smooth-transition w-full transform-gpu bg-primary font-medium text-primary-foreground hover:scale-[1.01] hover:bg-primary/90 hover:shadow-[0_0_24px_rgba(141,163,185,0.2)]"
                >
                  {t("form.submit")}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  {termsText}
                </p>
              </form>
            </Form>
          </motion.div>
        </div>
      </motion.div>

      <Dialog
        open={isSuccessfulDialogOpen}
        onOpenChange={setIsSuccessfulDialogOpen}
      >
        <DialogContent className="sm:min-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("success.dialog.title")}</DialogTitle>

            <DialogDescription>
              {t("success.dialog.description")}
            </DialogDescription>
          </DialogHeader>
          <p>{successMessage}</p>

          <DialogFooter>
            <Button asChild variant="secondary" className="my-2 md:my-0">
              <Link href="/wiki#How%20to%20connect">
                {t("success.dialog.buttons.viewWiki")}
              </Link>
            </Button>

            {self && (
              <Button asChild className="my-2 md:my-0">
                <Link href={`/user/${self?.user_id}`}>
                  {t("success.dialog.buttons.goToProfile")}
                </Link>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

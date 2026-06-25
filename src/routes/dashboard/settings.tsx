import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useState } from "react"
import { KeyRound, Loader2, ShieldAlert } from "lucide-react"
import { apiClient } from "@/api/client"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErrorMessage } from "@/components/ui/error-message"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export const Route = createFileRoute("/dashboard/settings")({
  component: DashboardSettings,
})

function DashboardSettings() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // ── Change password ─────────────────────────────────────────────────
  const changePasswordSchema = z
    .object({
      currentPassword: z
        .string()
        .min(1, t("settings.changePassword.currentPasswordRequired")),
      newPassword: z.string().superRefine((val, ctx) => {
        const issues: string[] = []
        if (val.length < 8) issues.push(t("auth.validation.passwordMin"))
        if (!/[A-Z]/.test(val))
          issues.push(t("auth.validation.passwordUppercase"))
        if (!/[0-9]/.test(val)) issues.push(t("auth.validation.passwordNumber"))
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val))
          issues.push(t("auth.validation.passwordSpecial"))

        if (issues.length > 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: issues.join("\n"),
          })
        }
      }),
      confirmNewPassword: z
        .string()
        .min(1, t("settings.changePassword.confirmRequired")),
    })
    .refine((d) => d.newPassword === d.confirmNewPassword, {
      message: t("settings.changePassword.mismatch"),
      path: ["confirmNewPassword"],
    })

  type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  })

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordFormValues) =>
      apiClient.auth.authControllerChangePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      toast.success(t("settings.changePassword.success"))
      reset()
    },
    onError: () => {
      toast.error(t("settings.changePassword.error"))
    },
  })

  const onChangePassword = (data: ChangePasswordFormValues) => {
    changePasswordMutation.mutate(data)
  }

  // ── Delete account ───────────────────────────────────────────────────
  const deleteAccountMutation = useMutation({
    mutationFn: () => apiClient.users.usersControllerDeleteAccount(),
    onSuccess: () => {
      toast.success(t("settings.deleteAccount.success"))
      logout()
      navigate({ to: "/" })
    },
    onError: () => {
      toast.error(t("settings.deleteAccount.error"))
      setDeleteDialogOpen(false)
    },
  })

  return (
    <div className="animate-[fade-in-up_0.3s_ease_both] space-y-8">
      {/* Page heading */}
      <div className="flex items-center gap-3">
        <div className="bg-brand-gradient flex h-10 w-10 items-center justify-center rounded-xl">
          <KeyRound className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {t("dashboard.menu.settings")}
        </h1>
      </div>

      {/* Change password card */}
      <section
        className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5"
        aria-labelledby="change-password-heading"
      >
        <h2
          id="change-password-heading"
          className="mb-1 text-lg font-semibold text-gray-900"
        >
          {t("settings.changePassword.title")}
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          {t("settings.changePassword.description")}
        </p>

        <form
          onSubmit={handleSubmit(onChangePassword)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="currentPassword">
              {t("settings.changePassword.currentPassword")}
            </Label>
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              {...register("currentPassword")}
            />
            <ErrorMessage>{errors.currentPassword?.message}</ErrorMessage>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">
              {t("settings.changePassword.newPassword")}
            </Label>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              {...register("newPassword", {
                onChange: () => {
                  void trigger("newPassword")
                  void trigger("confirmNewPassword")
                },
              })}
            />
            <ErrorMessage>{errors.newPassword?.message}</ErrorMessage>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">
              {t("settings.changePassword.confirmNewPassword")}
            </Label>
            <Input
              id="confirmNewPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmNewPassword")}
            />
            <ErrorMessage>{errors.confirmNewPassword?.message}</ErrorMessage>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              id="change-password-btn"
              className="bg-brand-gradient border-0 text-white hover:opacity-90"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("settings.changePassword.pending")}
                </>
              ) : (
                t("settings.changePassword.submit")
              )}
            </Button>
          </div>
        </form>
      </section>

      {/* Delete account card */}
      <section
        className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-red-100"
        aria-labelledby="delete-account-heading"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
            <ShieldAlert className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h2
              id="delete-account-heading"
              className="mb-1 text-lg font-semibold text-gray-900"
            >
              {t("settings.deleteAccount.title")}
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              {t("settings.deleteAccount.description")}
            </p>
            <Button
              id="delete-account-btn"
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => setDeleteDialogOpen(true)}
            >
              {t("settings.deleteAccount.button")}
            </Button>
          </div>
        </div>
      </section>

      {/* Delete account confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("settings.deleteAccount.confirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("settings.deleteAccount.confirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("settings.deleteAccount.confirmCancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              id="confirm-delete-account-btn"
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => deleteAccountMutation.mutate()}
              disabled={deleteAccountMutation.isPending}
            >
              {deleteAccountMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("settings.deleteAccount.confirmPending")}
                </>
              ) : (
                t("settings.deleteAccount.confirmAction")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

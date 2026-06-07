import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
})

function ResetPassword() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Supabase attaches parameters to the URL fragment (#)
  const hash = window.location.hash
  const hashParams = new URLSearchParams(hash.substring(1))

  const token = hashParams.get("access_token")

  const resetSchema = z
    .object({
      password: z.string().min(8, t("auth.validation.passwordMin")),
      confirmPassword: z.string().min(1, t("auth.validation.confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.validation.passwordsMismatch"),
      path: ["confirmPassword"],
    })

  type ResetFormValues = z.infer<typeof resetSchema>

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  })

  const resetMutation = useMutation({
    mutationFn: ({ password }: ResetFormValues) =>
      apiClient.auth.authControllerConfirmReset({
        accessToken: token || "",
        newPassword: password,
      }),
    onSuccess: () => {
      toast.success(t("auth.resetPassword.success"))
      navigate({ to: "/login" })
    },
    onError: () => {
      toast.error(t("auth.resetPassword.error"))
    },
  })

  const onSubmit = (data: ResetFormValues) => {
    if (!token) {
      toast.error(t("auth.resetPassword.error"))
      return
    }
    resetMutation.mutate(data)
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {t("auth.resetPassword.title")}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t("auth.resetPassword.description")}
          </p>
        </div>

        {!token ? (
          <div className="text-center text-red-500">
            {t("auth.resetPassword.error")}
          </div>
        ) : (
          <form
            className="mt-8 space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleSubmit(onSubmit)()
              }
            }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  {t("auth.resetPassword.newPassword")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register("password", {
                    onChange: () => void trigger("confirmPassword"),
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {t("auth.resetPassword.confirmPassword")}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="bg-brand-gradient w-full rounded-full border-0 text-white hover:opacity-90"
              disabled={resetMutation.isPending}
            >
              {resetMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("auth.resetPassword.pending")}
                </>
              ) : (
                t("auth.resetPassword.submit")
              )}
            </Button>
          </form>
        )}

        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            {t("auth.resetPassword.backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  )
}

import { createFileRoute, Link } from "@tanstack/react-router"
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

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
})

function ForgotPassword() {
  const { t } = useTranslation()

  const forgotSchema = z.object({
    email: z.string().email(t("auth.validation.emailInvalid")),
  })

  type ForgotFormValues = z.infer<typeof forgotSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  })

  const forgotMutation = useMutation({
    mutationFn: (data: ForgotFormValues) =>
      apiClient.auth.authControllerResetPassword(data),
    onSuccess: () => {
      toast.success(t("auth.forgotPassword.success"))
    },
    onError: () => {
      toast.error(t("auth.forgotPassword.error"))
    },
  })

  const onSubmit = (data: ForgotFormValues) => {
    forgotMutation.mutate(data)
  }

  return (
    <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {t("auth.forgotPassword.title")}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t("auth.forgotPassword.description")}
          </p>
        </div>

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
              <Label htmlFor="email">{t("auth.forgotPassword.email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-gradient border-0 text-white hover:opacity-90 rounded-full"
            disabled={forgotMutation.isPending}
          >
            {forgotMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("auth.forgotPassword.pending")}
              </>
            ) : (
              t("auth.forgotPassword.submit")
            )}
          </Button>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              {t("auth.forgotPassword.backToLogin")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

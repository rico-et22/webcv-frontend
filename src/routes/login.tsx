import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/api/client"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export const Route = createFileRoute("/login")({
  component: Login,
})

function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setSession } = useAuth()

  const loginSchema = z.object({
    email: z.string().email(t("auth.validation.emailInvalid")),
    password: z.string().min(1, t("auth.validation.passwordRequired")),
  })

  type LoginFormValues = z.infer<typeof loginSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormValues) =>
      apiClient.auth.authControllerLogin(data),
    onSuccess: (response) => {
      const { access_token, refresh_token, user } = response.data.data

      if (access_token && refresh_token && user) {
        setSession(access_token, refresh_token, user)
        toast.success(t("auth.login.success"))
        navigate({ to: "/dashboard" })
      } else {
        toast.error(t("auth.login.invalidResponse"))
      }
    },
    onError: () => {
      toast.error(t("auth.login.error"))
    },
  })

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {t("auth.login.title")}
          </h2>
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
              <Label htmlFor="email">{t("auth.login.email")}</Label>
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

            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.login.password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-gradient border-0 text-white hover:opacity-90 rounded-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("auth.login.pending")}
              </>
            ) : (
              t("auth.login.submit")
            )}
          </Button>

          <div className="mt-6 flex flex-col items-center space-y-4 text-center">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t("auth.login.forgotPassword")}
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t("auth.login.noAccount")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

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
import { Loader2, MailCheck } from "lucide-react"
import { useState } from "react"

export const Route = createFileRoute("/register")({
  component: Register,
})

function Register() {
  const { t } = useTranslation()
  const [isSuccess, setIsSuccess] = useState(false)

  const registerSchema = z
    .object({
      email: z.string().email(t("auth.validation.emailInvalid")),
      password: z.string().min(8, t("auth.validation.passwordMin")),
      confirmPassword: z.string().min(1, t("auth.validation.confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.validation.passwordsMismatch"),
      path: ["confirmPassword"],
    })

  type RegisterFormValues = z.infer<typeof registerSchema>

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const registerMutation = useMutation({
    mutationFn: ({ email, password }: RegisterFormValues) =>
      apiClient.auth.authControllerRegister({ email, password }),
    onSuccess: () => {
      setIsSuccess(true)
    },
    onError: () => {
      toast.error(t("auth.register.error"))
    },
  })

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data)
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        {isSuccess ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <MailCheck className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {t("auth.register.successTitle")}
            </h2>
            <p className="text-sm text-gray-600">
              {t("auth.register.successDescription")}
            </p>
            <div className="mt-8">
              <Link to="/login">
                <Button className="bg-brand-gradient w-full rounded-full border-0 text-white hover:opacity-90">
                  {t("auth.register.backToLogin")}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                {t("auth.register.title")}
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
                  <Label htmlFor="email">{t("auth.register.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    {t("auth.register.password")}
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
                    {t("auth.register.confirmPassword")}
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
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("auth.register.pending")}
                  </>
                ) : (
                  t("auth.register.submit")
                )}
              </Button>

              <div className="mt-4 text-center">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  {t("auth.register.hasAccount")}
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

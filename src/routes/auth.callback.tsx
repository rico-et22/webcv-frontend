import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/api/client"

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
})

function AuthCallback() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  )

  useEffect(() => {
    const handleCallback = async () => {
      const hash = window.location.hash
      if (!hash) {
        setStatus("error")
        return
      }

      const params = new URLSearchParams(hash.substring(1))
      const type = params.get("type")
      const accessToken = params.get("access_token")
      const refreshToken = params.get("refresh_token")

      if (type === "signup" && accessToken && refreshToken) {
        try {
          // Set token temporarily so apiClient can use it to fetch user details
          localStorage.setItem("accessToken", accessToken)

          const response = await apiClient.users.usersControllerGetMe()
          const result = response as any
          const user = result.data?.data || result.data

          if (user) {
            setSession(accessToken, refreshToken, user)
            toast.success(t("auth.callback.success"))
            navigate({ to: "/dashboard" })
          } else {
            throw new Error("Could not fetch user")
          }
        } catch (error) {
          console.error("Failed to auto-login after confirmation", error)
          localStorage.removeItem("accessToken")
          setStatus("success") // Show success but ask them to log in manually
        }
      } else if (type === "recovery") {
        // Just in case Supabase sends recovery here, redirect to reset-password
        navigate({ to: "/reset-password", hash: window.location.hash })
      } else {
        setStatus("error")
      }
    }

    handleCallback()
  }, [])

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="animate-pulse text-gray-500">
          {t("auth.callback.loading")}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
        {status === "success" ? (
          <>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {t("auth.callback.successTitle")}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t("auth.callback.successDescription")}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold tracking-tight text-red-600">
              {t("auth.callback.errorTitle")}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t("auth.callback.errorDescription")}
            </p>
          </>
        )}

        <div className="mt-8">
          <Link to="/login">
            <Button className="bg-brand-gradient w-full rounded-full border-0 text-white hover:opacity-90">
              {t("auth.forgotPassword.backToLogin")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { apiClient } from "@/api/client"
import { useTranslation } from "react-i18next"

export const Route = createFileRoute("/github/callback")({
  component: GithubCallbackPage,
})

function GithubCallbackPage() {
  const { t } = useTranslation()
  const params = new URLSearchParams(window.location.search)
  const code = params.get("code")
  const [error, setError] = useState<string | null>(
    code ? null : t("auth.githubCallback.noCode")
  )

  useEffect(() => {
    if (!code) {
      return
    }

    let isMounted = true

    apiClient.github
      .githubControllerExchange({ code })
      .then((res) => {
        if (!isMounted) return

        const payload = res.data?.data || res.data
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "GITHUB_AUTH_SUCCESS",
              token: payload.githubToken,
              username: payload.githubUsername,
            },
            window.location.origin
          )
          window.close()
        } else {
          setError(t("auth.githubCallback.noOpener"))
        }
      })
      .catch((err) => {
        if (!isMounted) return
        setError(err.message || t("auth.githubCallback.error"))
      })

    return () => {
      isMounted = false
    }
  }, [code, t])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {error ? (
        <div className="text-center">
          <p className="font-semibold text-destructive">
            {t("auth.githubCallback.errorPrefix")}: {error}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("auth.githubCallback.closeWindow")}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium">
            {t("auth.githubCallback.loading")}
          </p>
        </div>
      )}
    </div>
  )
}

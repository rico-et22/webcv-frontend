import { useTranslation } from "react-i18next"
import {
  Download,
  Globe,
  FolderOpen,
  ExternalLink,
  CheckCircle2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { apiClient } from "@/api/client"

interface PublishModalProps {
  open: boolean
  onClose: () => void
  siteId: string
}

export function PublishModal({ open, onClose, siteId }: PublishModalProps) {
  const { t } = useTranslation()
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [githubUsername, setGithubUsername] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      const username = sessionStorage.getItem("githubUsername")
      if (username) setGithubUsername(username)
    }
  }, [open])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type === "GITHUB_AUTH_SUCCESS") {
        sessionStorage.setItem("githubToken", event.data.token)
        sessionStorage.setItem("githubUsername", event.data.username)
        setGithubUsername(event.data.username)

        // Automatically trigger deployment after auth
        setIsDeploying(true)
        apiClient.github
          .githubControllerDeploy(siteId, { githubToken: event.data.token })
          .then(() => {
            toast.success(t("sites.publishModal.githubSuccess"))
            onClose()
          })
          .catch(() => {
            toast.error(t("sites.saveError"))
          })
          .finally(() => {
            setIsDeploying(false)
          })
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [siteId, t, onClose])

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const res = await apiClient.generator.generatorControllerZip(siteId)
      const blob = await (res as unknown as Response).blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `portfolio-${siteId}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error(t("sites.saveError"))
    } finally {
      setIsDownloading(false)
    }
  }

  const handleGithubDeploy = async () => {
    const activeToken = sessionStorage.getItem("githubToken")

    if (!activeToken) {
      // Initiate OAuth Flow
      const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID
      if (!clientId) {
        toast.error("Brak konfiguracji VITE_GITHUB_CLIENT_ID")
        return
      }
      const state = encodeURIComponent(JSON.stringify({ siteId }))
      const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo&state=${state}`
      window.open(url, "githubAuth", "width=600,height=700")
      return
    }

    setIsDeploying(true)
    try {
      await apiClient.github.githubControllerDeploy(siteId, {
        githubToken: activeToken,
      })
      toast.success(t("sites.publishModal.githubSuccess"))
      onClose()
    } catch {
      toast.error(t("sites.saveError"))
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("sites.publishModal.title")}</DialogTitle>
          <DialogDescription>{t("sites.publishModal.desc")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Option 1 – FTP */}
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/40 p-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <FolderOpen className="h-4 w-4 text-primary" />
                {t("sites.publishModal.option1Title")}
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {t("sites.publishModal.option1Desc")}
              </p>
            </div>
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              variant="outline"
              className="gap-2"
              id="publish-download-btn"
            >
              {isDownloading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {t("sites.publishModal.download")}
            </Button>
          </div>

          {/* Option 2 – GitHub Pages */}
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/40 p-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Globe className="h-4 w-4 text-primary" />
                {t("sites.publishModal.option2Title")}
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {t("sites.publishModal.option2Desc", {
                  username: githubUsername || "<nazwa_github>",
                })}
              </p>
            </div>
            <Button
              onClick={handleGithubDeploy}
              disabled={isDeploying}
              className="bg-brand-gradient gap-2 border-0 text-white hover:opacity-90"
              id="publish-github-btn"
            >
              {isDeploying ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t("sites.publishModal.githubPublishing")}
                </>
              ) : githubUsername ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {t("sites.publishModal.githubPublishAs", {
                    username: githubUsername,
                  })}
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" />
                  {t("sites.publishModal.githubConnect")}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

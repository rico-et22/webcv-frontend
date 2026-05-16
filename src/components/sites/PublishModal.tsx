import { useTranslation } from "react-i18next"
import { Download, Globe, FolderOpen } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"
import { apiClient } from "@/api/client"

interface PublishModalProps {
  open: boolean
  onClose: () => void
  siteId: string
}

export function PublishModal({ open, onClose, siteId }: PublishModalProps) {
  const { t } = useTranslation()
  const [isDownloading, setIsDownloading] = useState(false)

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("sites.publishModal.title")}</DialogTitle>
          <DialogDescription>{t("sites.publishModal.desc")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <ol className="flex flex-col gap-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="bg-brand-gradient flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white">
                1
              </span>
              <span>{t("sites.publishModal.step1")}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-brand-gradient flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white">
                2
              </span>
              <span>{t("sites.publishModal.step2")}</span>
            </li>
          </ol>

          {/* Option 1 – FTP */}
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <FolderOpen className="h-4 w-4 text-primary" />
              {t("sites.publishModal.step3Title")}
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {t("sites.publishModal.step3")}
            </p>
          </div>

          {/* Option 2 – GitHub Pages */}
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Globe className="h-4 w-4 text-primary" />
              {t("sites.publishModal.step4Title")}
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {t("sites.publishModal.step4")}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-brand-gradient flex-1 gap-2 border-0 text-white hover:opacity-90"
              id="publish-download-btn"
            >
              {isDownloading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t("sites.publishModal.downloading")}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  {t("sites.publishModal.download")}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose} id="publish-close-btn">
              {t("sites.publishModal.close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

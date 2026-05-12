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

interface PublishModalProps {
  open: boolean
  onClose: () => void
  onDownload: () => void
  isDownloading: boolean
}

export function PublishModal({
  open,
  onClose,
  onDownload,
  isDownloading,
}: PublishModalProps) {
  const { t } = useTranslation()

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
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-[11px] font-bold text-white">
                1
              </span>
              <span>{t("sites.publishModal.step1")}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-[11px] font-bold text-white">
                2
              </span>
              <span>{t("sites.publishModal.step2")}</span>
            </li>
          </ol>

          {/* Option 1 – FTP */}
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <FolderOpen className="h-4 w-4 text-primary" />
              {t("sites.publishModal.step3Title")}
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {t("sites.publishModal.step3")}
            </p>
          </div>

          {/* Option 2 – GitHub Pages */}
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <Globe className="h-4 w-4 text-primary" />
              {t("sites.publishModal.step4Title")}
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {t("sites.publishModal.step4")}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onDownload}
              disabled={isDownloading}
              className="bg-brand-gradient flex-1 border-0 text-white hover:opacity-90 gap-2"
              id="publish-download-btn"
            >
              {isDownloading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Pobieranie...
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

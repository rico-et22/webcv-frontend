import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { X, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { apiClient } from "@/api/client"

interface SitePreviewProps {
  siteId: string
  /** Mobile only: whether the preview modal is open */
  mobileOpen?: boolean
  onMobileClose?: () => void
  className?: string
}

function usePreviewHtml(siteId: string) {
  const {
    data: html,
    isLoading: loading,
    isError: error,
  } = useQuery({
    queryKey: ["site-preview", siteId],
    queryFn: () =>
      apiClient.generator
        .generatorControllerPreview(siteId)
        .then((res) => res.text()),
    enabled: !!siteId,
  })

  return { html: html ?? null, loading, error }
}

function PreviewFrame({
  html,
  loading,
  error,
  className,
}: {
  html: string | null
  loading: boolean
  error: boolean
  className?: string
}) {
  const { t } = useTranslation()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  if (loading) {
    return (
      <div
        className={cn("flex items-center justify-center bg-gray-50", className)}
      >
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !html) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 bg-gray-50 p-8 text-center",
          className
        )}
      >
        <p className="text-sm text-muted-foreground">
          {t("sites.previewPlaceholder")}
        </p>
      </div>
    )
  }

  return (
    <iframe
      ref={iframeRef}
      srcDoc={html}
      title={t("sites.preview")}
      sandbox="allow-same-origin"
      className={cn("border-0 bg-white", className)}
    />
  )
}

export function SitePreview({
  siteId,
  mobileOpen,
  onMobileClose,
  className,
}: SitePreviewProps) {
  const { t } = useTranslation()
  const { html, loading, error } = usePreviewHtml(siteId)

  return (
    <>
      {/* Desktop: inline panel */}
      <PreviewFrame
        html={html}
        loading={loading}
        error={error}
        className={cn("hidden h-full w-full rounded-xl lg:block", className)}
      />

      {/* Mobile: full-height modal */}
      <Dialog open={mobileOpen} onOpenChange={onMobileClose}>
        <DialogContent className="flex h-[100dvh] max-h-[100dvh] w-full max-w-full flex-col gap-0 rounded-none p-0 lg:hidden">
          <DialogHeader className="flex h-fit flex-row items-center justify-between border-b px-4 py-3">
            <DialogTitle className="text-base">
              {t("sites.preview")}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileClose}
              id="preview-modal-close-btn"
              className="-mr-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogHeader>
          <PreviewFrame
            html={html}
            loading={loading}
            error={error}
            className="w-full flex-1"
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

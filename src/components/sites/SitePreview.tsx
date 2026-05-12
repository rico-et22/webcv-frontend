import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface SitePreviewProps {
  siteId: string
  /** Increment this to trigger a refresh (e.g. after successful PUT) */
  refreshKey: number
  /** Mobile only: whether the preview modal is open */
  mobileOpen?: boolean
  onMobileClose?: () => void
  className?: string
}

function usePreviewHtml(siteId: string, refreshKey: number) {
  const [html, setHtml] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!siteId) return
    setLoading(true)
    setError(false)
    const token = localStorage.getItem("accessToken")
    fetch(`${import.meta.env.VITE_API_URL}/generator/preview/${siteId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async (res) => {
        if (!res.ok) throw new Error()
        return res.text()
      })
      .then((text) => {
        setHtml(text)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [siteId, refreshKey])

  return { html, loading, error }
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
        className={cn(
          "flex items-center justify-center bg-gray-50",
          className
        )}
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
      title="Podgląd strony"
      sandbox="allow-same-origin"
      className={cn("border-0 bg-white", className)}
    />
  )
}

export function SitePreview({
  siteId,
  refreshKey,
  mobileOpen,
  onMobileClose,
  className,
}: SitePreviewProps) {
  const { t } = useTranslation()
  const { html, loading, error } = usePreviewHtml(siteId, refreshKey)

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
        <DialogContent className="h-[100dvh] max-h-[100dvh] w-full max-w-full rounded-none p-0 lg:hidden">
          <DialogHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
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
            className="h-full w-full"
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

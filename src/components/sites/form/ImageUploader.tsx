import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { X } from "lucide-react"
import { apiClient } from "@/api/client"
import { FileUpload } from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"

export function ImageUploader({
  label,
  currentPath,
  currentUrl,
  bucket,
  onUploaded,
  onRemoved,
}: {
  label: string
  currentPath?: string
  currentUrl?: string
  bucket: "avatars" | "screenshots"
  onUploaded: (url: string, storagePath: string) => void
  onRemoved: () => void
}) {
  const { t } = useTranslation()
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const res = await apiClient.storage.storageControllerUpload({
        file,
        bucket,
      })
      const { url, storagePath } = res.data.data
      onUploaded(url, storagePath)
    } catch {
      toast.error(t("sites.form.imageError"))
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    if (currentPath) {
      try {
        await apiClient.storage.storageControllerDeleteFile({
          path: currentPath,
          bucket,
        })
      } catch {
        // Silent — we still clear the field
      }
    }
    onRemoved()
  }

  if (currentUrl) {
    return (
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/10">
          <img
            src={currentUrl}
            alt={label}
            className="h-full w-full object-cover"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRemove}
          className="gap-1.5 text-destructive hover:border-destructive/40 hover:text-destructive"
        >
          <X className="h-3.5 w-3.5" />
          {t("sites.form.removeImage")}
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      {uploading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/80">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
      <FileUpload
        accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
        maxBytes={50 * 1024 * 1024}
        label={label}
        hint={t("sites.upload.imageOnly")}
        onFile={handleUpload}
      />
    </div>
  )
}

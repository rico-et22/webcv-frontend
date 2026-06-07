import { useCallback, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ErrorMessage } from "@/components/ui/error-message"

interface FileUploadProps {
  accept: string
  maxBytes: number
  label: string
  hint: string
  onFile: (file: File) => void
  className?: string
}

export function FileUpload({
  accept,
  maxBytes,
  label,
  hint,
  onFile,
  className,
}: FileUploadProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validate = useCallback(
    (file: File): boolean => {
      const mimeTypes = accept.split(",").map((s) => s.trim())
      const isAccepted = mimeTypes.some((mt) => {
        if (mt.startsWith(".")) {
          return file.name.toLowerCase().endsWith(mt.toLowerCase())
        }
        if (mt.endsWith("/*")) {
          return file.type.startsWith(mt.replace("/*", ""))
        }
        return file.type === mt
      })

      if (!isAccepted) {
        setError(hint)
        return false
      }
      if (file.size > maxBytes) {
        setError(hint)
        return false
      }
      setError(null)
      return true
    },
    [accept, maxBytes, hint]
  )

  const handleFile = useCallback(
    (file: File) => {
      if (validate(file)) onFile(file)
    },
    [validate, onFile]
  )

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const onDragLeave = () => setIsDragging(false)
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Reset so same file can be re-selected
    e.target.value = ""
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-sm transition-colors",
          isDragging
            ? "border-primary/60 bg-primary/5"
            : "border-border hover:border-primary/40 hover:bg-muted/50"
        )}
      >
        <Upload className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium text-foreground">
          {isDragging ? t("sites.upload.dropzoneActive") : label}
        </span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </button>

      {/* Hidden input: capture=environment removed so mobile shows file explorer not camera */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onInputChange}
        className="hidden"
        aria-label={label}
      />

      {error && (
        <ErrorMessage className="flex items-center gap-1 text-xs">
          <X className="h-3 w-3" />
          {error}
        </ErrorMessage>
      )}
    </div>
  )
}

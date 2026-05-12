import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Sparkles, X, Check, ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/api/client"
import type { AnalyzeCvResponseDto } from "@/api/index"
import { FileUpload } from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type AiSection = keyof AnalyzeCvResponseDto

const SECTIONS: AiSection[] = [
  "fullName",
  "jobTitle",
  "location",
  "bio",
  "contacts",
  "skills",
  "experience",
  "education",
]

function renderValue(value: unknown, sectionKey: AiSection): string {
  if (value === null || value === undefined) return "—"
  if (typeof value === "string") return value || "—"

  // contacts: { email, phone, linkedin, github, website }
  if (sectionKey === "contacts" && typeof value === "object" && !Array.isArray(value)) {
    const c = value as Record<string, string>
    return Object.entries(c)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n") || "—"
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "—"
    if (typeof value[0] === "string") return (value as string[]).join(", ")

    // experience items
    if (sectionKey === "experience") {
      return (value as Array<{ role?: string; company?: string; startDate?: string; endDate?: string; description?: string }>)
        .map((e) => {
          const period = [e.startDate, e.endDate ?? "obecnie"].filter(Boolean).join(" – ")
          return `${e.role ?? ""} @ ${e.company ?? ""} (${period})${e.description ? "\n" + e.description : ""}`
        })
        .join("\n\n")
    }

    // education items
    if (sectionKey === "education") {
      return (value as Array<{ degree?: string; institution?: string; startDate?: string; endDate?: string }>)
        .map((e) => {
          const period = [e.startDate, e.endDate ?? "obecnie"].filter(Boolean).join(" – ")
          return `${e.degree ?? ""} @ ${e.institution ?? ""} (${period})`
        })
        .join("\n")
    }

    // generic object array fallback
    return JSON.stringify(value, null, 2)
  }

  return String(value)
}


function SectionRow({
  sectionKey,
  value,
  selected,
  onToggle,
}: {
  sectionKey: AiSection
  value: unknown
  selected: boolean
  onToggle: () => void
}) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const raw = renderValue(value, sectionKey)

  const isLong = raw.length > 120

  return (
    <div
      className={cn(
        "rounded-xl border p-3 transition-colors",
        selected
          ? "border-primary/40 bg-primary/5"
          : "border-border bg-muted/30"
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
            selected
              ? "border-primary bg-primary text-white"
              : "border-border bg-white"
          )}
          aria-label={
            selected
              ? `Odznacz ${t(`sites.ai.sections.${sectionKey}`)}`
              : `Zaznacz ${t(`sites.ai.sections.${sectionKey}`)}`
          }
        >
          {selected && <Check className="h-3 w-3" />}
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t(`sites.ai.sections.${sectionKey}`)}
          </p>
          <pre
            className={cn(
              "mt-1 whitespace-pre-wrap break-words font-sans text-sm text-foreground",
              !expanded && isLong && "line-clamp-3"
            )}
          >
            {raw}
          </pre>
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="mt-1 flex items-center gap-1 text-xs text-primary"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Zwiń
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  Rozwiń
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

interface AiAnalyzerProps {
  onApply: (data: Partial<AnalyzeCvResponseDto>) => void
}

export function AiAnalyzer({ onApply }: AiAnalyzerProps) {
  const { t } = useTranslation()
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<AnalyzeCvResponseDto | null>(null)
  const [selected, setSelected] = useState<Set<AiSection>>(new Set())
  const [open, setOpen] = useState(false)

  const handleFile = async (file: File) => {
    setIsUploading(true)
    try {
      const res = await apiClient.ai.aiControllerAnalyzeCv({ file })
      const data = res.data.data
      setResult(data)
      // Pre-select all sections that have data
      const initialSelected = new Set(
        SECTIONS.filter((k) => {
          const v = data[k]
          if (v === null || v === undefined) return false
          if (typeof v === "string") return v.trim().length > 0
          if (Array.isArray(v)) return v.length > 0
          if (typeof v === "object") return Object.keys(v).length > 0
          return true
        }) as AiSection[]
      )
      setSelected(initialSelected)
      setOpen(true)
    } catch {
      toast.error(t("sites.ai.error"))
    } finally {
      setIsUploading(false)
    }
  }

  const toggle = (key: AiSection) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const handleApply = () => {
    if (!result) return
    const partial: Partial<AnalyzeCvResponseDto> = {}
    for (const key of selected) {
      // @ts-expect-error dynamic key assignment
      partial[key] = result[key]
    }
    onApply(partial)
    setOpen(false)
    handleClose()
  }

  const handleClose = () => {
    setOpen(false)
    setResult(null)
    setSelected(new Set())
  }

  return (
    <>
      {/* Rainbow-bordered AI banner */}
      <div
        className="rounded-2xl p-0.5"
        style={{
          background:
            "linear-gradient(135deg, #f97316, #ec4899, #8b5cf6, #06b6d4, #22c55e)",
        }}
      >
        <div className="rounded-[16px] bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)",
                }}
              >
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {t("sites.ai.banner")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("sites.ai.bannerDesc")}
                </p>
              </div>
            </div>

            {isUploading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                {t("sites.ai.uploading")}
              </div>
            ) : (
              <FileUpload
                accept=".pdf,application/pdf"
                maxBytes={5 * 1024 * 1024}
                label={t("sites.ai.upload")}
                hint={t("sites.ai.pdfError")}
                onFile={handleFile}
                className="sm:w-56"
              />
            )}
          </div>
        </div>
      </div>


      {/* Results dialog */}
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("sites.ai.modalTitle")}</DialogTitle>
            <DialogDescription>{t("sites.ai.modalDesc")}</DialogDescription>
          </DialogHeader>

          {result && (
            <div className="flex flex-col gap-3">
              {/* Select all / deselect all */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelected(new Set(SECTIONS))}
                  className="gap-1.5"
                  id="ai-accept-all-btn"
                >
                  <Check className="h-3.5 w-3.5" />
                  {t("sites.ai.acceptAll")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelected(new Set())}
                  className="gap-1.5"
                  id="ai-reject-all-btn"
                >
                  <X className="h-3.5 w-3.5" />
                  {t("sites.ai.rejectAll")}
                </Button>
              </div>

              {/* Section rows */}
              {SECTIONS.filter((k) => {
                const v = result[k]
                if (v === null || v === undefined) return false
                if (typeof v === "string") return v.trim().length > 0
                if (Array.isArray(v)) return v.length > 0
                if (typeof v === "object") return Object.keys(v).length > 0
                return true
              }).map((key) => (
                <SectionRow
                  key={key}
                  sectionKey={key}
                  value={result[key]}
                  selected={selected.has(key)}
                  onToggle={() => toggle(key)}
                />
              ))}

              <Button
                type="button"
                onClick={handleApply}
                disabled={selected.size === 0}
                className="bg-brand-gradient border-0 text-white hover:opacity-90"
                id="ai-apply-btn"
              >
                {t("sites.ai.apply")}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

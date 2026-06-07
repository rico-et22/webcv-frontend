import { useTranslation } from "react-i18next"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function Field({
  label,
  htmlFor,
  required,
  error,
  children,
  className,
}: {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  children: React.ReactNode
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="ml-1 text-xs text-destructive">
            ({t("sites.form.required")})
          </span>
        )}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

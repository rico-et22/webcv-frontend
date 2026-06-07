import { Separator } from "@/components/ui/separator"

export function FormSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="bg-brand-gradient flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
          <Icon className="h-3.5 w-3.5 text-white" />
        </div>
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {title}
        </h2>
      </div>
      <Separator />
      {children}
    </section>
  )
}

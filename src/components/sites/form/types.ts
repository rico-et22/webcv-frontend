import type { CreateSiteDto } from "@/api/index"

export type SiteFormValues = CreateSiteDto & {
  avatarUrl?: string
}

import { ReactNode } from "react"
import { OrgProvider } from "@/components/org-provider"
import { AdminShell } from "@/components/admin/admin-shell"

export default function AdminLayout({ children }: { children: ReactNode }) {
return (
  <OrgProvider>
    <AdminShell>{children}</AdminShell>
  </OrgProvider>
)
}

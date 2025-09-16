'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { LayoutDashboard, Dog, FolderKanban, Inbox, Megaphone, Share2, Globe, CalendarDays, SettingsIcon, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOrg } from '@/components/org-provider'

const items = [
  { slug: 'home', label: 'Dashboard', icon: LayoutDashboard, href: '/studio/home', type: 'page' },
  { slug: 'animals', label: 'Pets', icon: Dog, href: '/admin/animals', type: 'admin' },
  { slug: 'applications', label: 'Applications', icon: FolderKanban, href: '/applications', type: 'external' },
  { slug: 'campaigns', label: 'Campaigns', icon: Megaphone, href: '/admin', type: 'admin' },
  { slug: 'inbox', label: 'Inbox', icon: Inbox, href: '/admin', type: 'admin' },
  { slug: 'communications', label: 'Communications', icon: Megaphone, href: '/admin', type: 'admin' },
  { slug: 'social', label: 'Social Media', icon: Share2, href: '/admin', type: 'admin' },
  { slug: 'live', label: 'Live Site', icon: Globe, href: '/', type: 'external' },
  { slug: 'events', label: 'Events', icon: CalendarDays, href: '/studio/events', type: 'page' },
  { slug: 'settings', label: 'Settings', icon: SettingsIcon, href: '/admin/settings', type: 'admin' },
]

export function StudioShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { orgId } = useOrg()
  const router = useRouter()
  const activeSlug = useMemo(() => pathname?.split('/')[2] ?? 'home', [pathname])

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" className="border-r">
        <SidebarHeader className="h-16">
          <Link href="/" className="px-3 py-2 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <span className="font-semibold">Barkhaus Studio</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon
                const isActive =
                  item.type === 'page'
                    ? activeSlug === item.slug
                    : pathname === item.href
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon className="h-4 w-4 mr-2" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="px-3 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Org: {orgId}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                localStorage.removeItem('xano_auth_token')
                fetch('/api/auth/xano-token', { method: 'DELETE' })
                router.replace('/login')
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {/* Keep a slim header for nav toggle; page-level controls live with the iframe */}
        <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
          <div className="flex h-14 items-center px-4 gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mx-2 h-6" />
            <div className="text-sm text-muted-foreground">Barkhaus Studio</div>
          </div>
        </header>
        <main className="p-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

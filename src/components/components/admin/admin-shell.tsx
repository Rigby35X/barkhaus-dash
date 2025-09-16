"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment, ReactNode } from "react"
import { PawPrint, LayoutDashboard, FileText, Settings, Dog, Wand2, MessageSquare, DollarSign, Mail, Users, Globe, Palette, Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useOrg } from "@/components/org-provider"

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pets", label: "Pets", icon: Heart },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/campaigns", label: "Campaigns", icon: DollarSign },
  { href: "/admin/inbox", label: "Inbox", icon: Mail },
  { href: "/admin/communications", label: "Communications", icon: MessageSquare },
  { href: "/admin/volunteers", label: "Volunteers", icon: Users },
  { href: "/admin/live-site", label: "Live Site", icon: Globe },
  { href: "/admin/advanced-editor", label: "Advanced Editor", icon: Palette },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { orgId } = useOrg()

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" className="border-r">
        <SidebarHeader className="h-16">
          <Link href="/" className="flex items-center gap-2 px-3 py-2">
            <PawPrint className="h-5 w-5" />
            <span className="font-semibold">Barkhaus Admin</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {nav.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild className={cn(active && "bg-muted")}>
                      <Link href={item.href}>
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="text-xs text-muted-foreground px-3">
          Org: {orgId}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
          <div className="flex h-14 items-center px-4">
            <SidebarTrigger className="mr-2" />
            <Separator orientation="vertical" className="mx-2 h-6" />
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Link href="/?edit=true">
                <Button size="sm" variant="outline">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Edit Website
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

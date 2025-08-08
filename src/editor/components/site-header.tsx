"use client"

import Link from '@/editor/next-shims'
import { usePathname } from '@/editor/router-shims'
import { Menu, PawPrint, ChevronDown } from 'lucide-react'
import { Button } from "@/editor/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/editor/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/editor/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useEditor } from "@/components/editor-provider"
import { useSiteSettings } from "@/components/site-settings-provider"

const baseNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/animals", label: "Available Animals" },
  // Applications handled via dropdown
  { href: "/donate", label: "Donate" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { state } = useEditor()
  const { settings } = useSiteSettings()

  return (
    <header className={cn("sticky z-40 w-full border-b bg-background/90 backdrop-blur", state.isEditing ? "top-14" : "top-0")}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          {settings.logoUrl ? (
            <img src={settings.logoUrl || "/placeholder.svg"} alt="Barkhaus Logo" className="h-6 w-auto" />
          ) : (
            <>
              <PawPrint className="h-6 w-6" />
              <span className="font-semibold">{settings.orgName || "Barkhaus"}</span>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {baseNav.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm transition-colors",
                  active
                    ? "bg-muted font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {item.label}
              </Link>
            )
          })}

          {/* Applications dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="px-3">
                Applications
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/applications">Overview</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/applications/adopt">Adopt</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/applications/volunteer">Volunteer</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/applications/foster">Foster</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-6 flex flex-col gap-2">
                {[...baseNav, { href: "/applications", label: "Applications" }].map((item) => {
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm transition-colors",
                        active
                          ? "bg-muted font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {item.label}
                    </Link>
                  )
                })}
                <div className="pl-3 text-xs text-muted-foreground">Applications</div>
                <div className="flex flex-col gap-1 pl-3">
                  <Link href="/applications/adopt" className="text-sm text-muted-foreground hover:text-foreground">Adopt</Link>
                  <Link href="/applications/volunteer" className="text-sm text-muted-foreground hover:text-foreground">Volunteer</Link>
                  <Link href="/applications/foster" className="text-sm text-muted-foreground hover:text-foreground">Foster</Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

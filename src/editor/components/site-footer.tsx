import Link from '@/editor/next-shims'
import { useSiteSettings } from "@/components/site-settings-provider"

export function SiteFooter() {
  const { settings } = useSiteSettings()

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
        <div className="space-y-2">
          <h3 className="font-semibold">{settings.orgName || "Barkhaus"}</h3>
          <p className="text-sm text-muted-foreground">
            {settings.tagline || "Caring for pets. Building forever homes."}
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Navigate</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
            <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
            <li><Link href="/animals" className="text-muted-foreground hover:text-foreground">Available Animals</Link></li>
            <li><Link href="/applications" className="text-muted-foreground hover:text-foreground">Applications</Link></li>
            <li><Link href="/donate" className="text-muted-foreground hover:text-foreground">Donate</Link></li>
            <li><Link href="/events" className="text-muted-foreground hover:text-foreground">Events</Link></li>
            <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Visit</h4>
          <p className="text-sm text-muted-foreground">
            {settings.addressLine1}<br />{settings.addressLine2}
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <p className="text-sm text-muted-foreground">
            {settings.email}<br />{settings.phone}
          </p>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto px-4 py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {settings.orgName || "Barkhaus"}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

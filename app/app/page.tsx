'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PawPrint, Wand2, LogIn, ShieldCheck } from 'lucide-react'
import { DashboardIntegration } from '@/components/dashboard-integration'

export default function MarketingHome() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardIntegration />
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <PawPrint className="h-5 w-5" />
            <span className="font-semibold">Barkhaus</span>
          </Link>
          <div className="flex gap-2">
            <Link href="/login">
              <Button size="sm" variant="outline">
                <LogIn className="mr-2 h-4 w-4" />
                Log in
              </Button>
            </Link>
            <Link href="/studio/home">
              <Button size="sm">
                <Wand2 className="mr-2 h-4 w-4" />
                Open Studio
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="grid gap-10 md:grid-cols-2 items-center">
          <div className="space-y-5">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              One platform for your rescue site, inline editing, and publishing
            </h1>
            <p className="text-muted-foreground text-lg">
              Log in to your studio, edit your live site inline, and publish changes with confidence.
              Animal listings, events, and brand settings stay in sync with your backend.
            </p>
            <div className="flex gap-3">
              <Link href="/login">
                <Button size="lg">
                  <LogIn className="mr-2 h-5 w-5" />
                  Log in
                </Button>
              </Link>
              <Link href="/studio/home">
                <Button size="lg" variant="outline">
                  <Wand2 className="mr-2 h-5 w-5" />
                  Try the Studio
                </Button>
              </Link>
            </div>
          </div>
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Why Barkhaus Studio?</CardTitle>
              <CardDescription>Inline editor + admin in one place</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>• Edit content directly on the page with visual hints</div>
              <div>• Save to Xano and publish to your live site</div>
              <div>• Org-aware settings, branding, and animals</div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Secure token forwarding to backend
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}

// app/layout.tsx
import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Fira_Code } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ServiceWorkerProvider } from "@/components/service-worker-provider"
import { SiteHeader } from "@/components/site-header"
import { NotificationsProvider } from "@/components/notifications-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { SeedClient } from "./seed-client"

const firaCode = Fira_Code({ subsets: ["latin"], weight: ["400", "500", "700"] })

export const metadata: Metadata = {
  title: "Events Management App",
  description: "A comprehensive events management application",
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={firaCode.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <NotificationsProvider>
              <ServiceWorkerProvider>
                <div className="relative flex min-h-screen flex-col bg-background text-foreground font-mono">
                  <SiteHeader />
                  {children}
                </div>
                <Toaster />
                <SeedClient />
              </ServiceWorkerProvider>
            </NotificationsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

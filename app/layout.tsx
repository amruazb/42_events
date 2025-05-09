import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { SocketProvider } from "@/components/socket-provider"
import { SessionProvider } from "@/components/session-provider"
import { headers } from "next/headers"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "42 Abu Dhabi Events",
  description: "Event Management Web App for the 42 Abu Dhabi community",
  manifest: "/manifest.json",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get the locale from the URL path
  const headersList = headers()
  const pathname = headersList.get("x-pathname") || ""
  const locale = pathname.split("/")[1] || "en"

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SessionProvider>
            <LanguageProvider>
              <SocketProvider>
                {children}
                <Toaster />
              </SocketProvider>
            </LanguageProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

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
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LanguageProvider>
            <SessionProvider>
              <SocketProvider>
                {children}
                <Toaster />
              </SocketProvider>
            </SessionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

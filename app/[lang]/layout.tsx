import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { SocketProvider } from "@/components/socket-provider"
import { SessionProvider } from "@/components/session-provider"

const inter = Inter({ subsets: ["latin"] })

export default function LocaleLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html lang={lang} suppressHydrationWarning>
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
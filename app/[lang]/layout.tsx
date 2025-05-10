import { Metadata } from "next"
import { Inter } from "next/font/google"
import { LanguageProvider } from "@/components/language-provider"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "42 Events",
  description: "Events platform for 42 Abu Dhabi",
  manifest: "/manifest.json",
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const lang = await Promise.resolve(params.lang)

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
        <LanguageProvider defaultLanguage={lang}>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  )
} 
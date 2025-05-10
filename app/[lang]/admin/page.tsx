"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { AdminEventList } from "@/components/admin/event-list"
import { AdminImportExport } from "@/components/admin/import-export"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/components/language-provider"
import { useSocket } from "@/components/socket-provider"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw } from "lucide-react"

export default function AdminPage({
  params: { lang },
}: {
  params: { lang: string }
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useLanguage()
  const { isConnected } = useSocket()
  const [activeTab, setActiveTab] = useState("events")
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${lang}/auth/signin`)
    }
  }, [status, router, lang])

  // Handle refresh events
  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/42/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        throw new Error("Failed to refresh events")
      }
      // Refresh the page to show updated events
      router.refresh()
    } catch (error) {
      console.error("Error refreshing events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col bg-[#1A1A1A] text-white">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-12 w-full" />
            <div className="grid gap-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  // If not authenticated, don't render anything (will redirect in useEffect)
  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1A1A1A] text-white">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/${lang}`)}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("back_to_home")}
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{t("admin")}</h1>
              <p className="text-sm text-gray-400">
                {isConnected ? (
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    {t("connected")}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    {t("disconnected")}
                  </span>
                )}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            {t("refresh_events")}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 mb-8 bg-[#242424] p-1">
            <TabsTrigger value="events" className="data-[state=active]:bg-[#1A1A1A]">
              {t("events")}
            </TabsTrigger>
            <TabsTrigger value="import-export" className="data-[state=active]:bg-[#1A1A1A]">
              {t("import_export")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <AdminEventList />
          </TabsContent>

          <TabsContent value="import-export">
            <AdminImportExport />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-[#1A1A1A] border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <p className="text-sm text-gray-500 text-center">© 2024 42 Abu Dhabi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
} 
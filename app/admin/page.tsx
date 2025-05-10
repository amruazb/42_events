"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { AdminEventList } from "@/components/admin/event-list"
import { AdminEventForm } from "@/components/admin/event-form"
import { AdminImportExport } from "@/components/admin/import-export"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/components/language-provider"
import { useSocket } from "@/components/socket-provider"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useLanguage()
  const { isConnected } = useSocket()
  const [activeTab, setActiveTab] = useState("events")
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  // Handle event selection for editing
  const handleEditEvent = (event: any) => {
    setSelectedEvent(event)
    setActiveTab("create")
  }

  // Clear selected event when switching to create tab
  const handleTabChange = (value: string) => {
    if (value === "create" && activeTab !== "create") {
      setSelectedEvent(null)
    }
    setActiveTab(value)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col">
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{t("admin")}</h1>
          <p className="text-muted-foreground mt-2">
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

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="events">{t("events")}</TabsTrigger>
            <TabsTrigger value="create">{selectedEvent ? t("edit_event") : t("create_event")}</TabsTrigger>
            <TabsTrigger value="import-export">{t("import_export")}</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <AdminEventList onEditEvent={handleEditEvent} />
          </TabsContent>

          <TabsContent value="create">
            <AdminEventForm event={selectedEvent} />
          </TabsContent>

          <TabsContent value="import-export">
            <AdminImportExport />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-background border-t border-border py-6">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground text-center">© 2024 42 Abu Dhabi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

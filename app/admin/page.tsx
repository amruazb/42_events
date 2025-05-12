"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminEventsList from "@/components/admin-events-list"
import CreateEventForm from "@/components/create-event-form"
import CsvImport from "@/components/csv-import"
import AdminStats from "@/components/admin-stats"
import { NotificationsProvider } from "@/components/notifications-provider"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login/admin")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4">
        <div className="w-full space-y-6 rounded-lg border bg-card p-6 shadow-md">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Loading...</h1>
            <p className="text-sm text-muted-foreground">Please wait while we verify your credentials</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null // Will redirect in useEffect
  }

  return (
    <NotificationsProvider>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-secondary">ADMIN DASHBOARD</h1>
            <div className="flex gap-2">
              <button className="rounded-md border border-secondary px-4 py-2 text-secondary hover:bg-secondary hover:text-white">
                MANAGE EVENTS
              </button>
              <button className="rounded-md border border-secondary px-4 py-2 text-secondary hover:bg-secondary hover:text-white">
                SETTINGS
              </button>
            </div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <AdminStats />
          </div>

          <Tabs defaultValue="events">
            <TabsList className="mb-6 bg-secondary/10">
              <TabsTrigger value="events" className="data-[state=active]:bg-secondary data-[state=active]:text-white">
                Events
              </TabsTrigger>
              <TabsTrigger value="create" className="data-[state=active]:bg-secondary data-[state=active]:text-white">
                Create Event
              </TabsTrigger>
              <TabsTrigger value="import" className="data-[state=active]:bg-secondary data-[state=active]:text-white">
                Import CSV
              </TabsTrigger>
            </TabsList>

            <TabsContent value="events">
              <AdminEventsList />
            </TabsContent>

            <TabsContent value="create">
              <CreateEventForm />
            </TabsContent>

            <TabsContent value="import">
              <CsvImport />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </NotificationsProvider>
  )
}

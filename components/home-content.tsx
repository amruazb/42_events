"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { EventList } from "@/components/event-list"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/components/language-provider"

interface HomeContentProps {
  lang: string
  initialEvents: any[]
}

export function HomeContent({ lang, initialEvents }: HomeContentProps) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              42 Abu Dhabi Events
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover and participate in exciting events at 42 Abu Dhabi. From workshops to hackathons, find everything
              happening in our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${lang}/events`}>
                <Button size="lg">{t("browse_all_events")}</Button>
              </Link>
              <Link href={`/${lang}/auth/signin`}>
                <Button variant="outline" size="lg">
                  {t("sign_in")}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">{t("upcoming_events")}</h2>
              <Link href={`/${lang}/events`}>
                <Button variant="link">{t("view_all")}</Button>
              </Link>
            </div>

            <Suspense
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="space-y-3">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              }
            >
              <EventList initialEvents={initialEvents} />
            </Suspense>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">{t("features")}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">{t("multilingual_support")}</h3>
                <p className="text-muted-foreground">
                  {t("multilingual_support_desc")}
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">{t("offline_access")}</h3>
                <p className="text-muted-foreground">
                  {t("offline_access_desc")}
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">{t("realtime_updates")}</h3>
                <p className="text-muted-foreground">
                  {t("realtime_updates_desc")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">© 2024 42 Abu Dhabi. All rights reserved.</p>
            </div>

            <div className="flex space-x-6 rtl:space-x-reverse">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                {t("privacy_policy")}
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                {t("terms_of_service")}
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                {t("contact")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 
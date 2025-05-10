"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Calendar, ArrowRight, MapPin, Clock } from "lucide-react"
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
    <div className="min-h-screen flex flex-col bg-[#1A1A1A] text-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('/42-pattern.svg')] opacity-10" />
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                42 Abu Dhabi
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                {t("hero_description")}
              </p>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="py-16 bg-[#242424]">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{t("upcoming_events")}</h2>
                <p className="text-gray-400">{t("discover_events")}</p>
              </div>
              <Link href={`/${lang}/events`}>
                <Button variant="outline" className="gap-2 border-gray-700 text-white hover:bg-gray-800">
                  {t("view_all")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <Suspense
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-gray-800">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-6 space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex gap-4">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {initialEvents.slice(0, 3).map((event) => (
                  <div key={event._id} className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors">
                    {event.image && (
                      <div className="relative h-48">
                        <img
                          src={event.image}
                          alt={event.title[lang]}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-semibold text-white">{event.title[lang]}</h3>
                      <p className="text-gray-400 line-clamp-2">{event.description[lang]}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(event.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location[lang]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{event.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Suspense>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-[#1A1A1A]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">{t("about_42")}</h2>
              <p className="text-gray-400 text-lg">
                {t("about_42_description")}
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#1A1A1A] border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">© 2024 42 Abu Dhabi. All rights reserved.</p>
            </div>

            <div className="flex space-x-6 rtl:space-x-reverse">
              <Link href={`/${lang}/privacy`} className="text-sm text-gray-500 hover:text-white transition-colors">
                {t("privacy_policy")}
              </Link>
              <Link href={`/${lang}/terms`} className="text-sm text-gray-500 hover:text-white transition-colors">
                {t("terms_of_service")}
              </Link>
              <Link href={`/${lang}/contact`} className="text-sm text-gray-500 hover:text-white transition-colors">
                {t("contact")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 
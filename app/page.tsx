"use client"

import { Suspense } from "react"
import EventsList from "@/components/events-list"
import SearchBar from "@/components/search-bar"
import EventsListSkeleton from "@/components/events-list-skeleton"
import NotificationProvider from "@/components/notification-provider"
import { NotificationsProvider } from "@/components/notifications-provider"
import EventsStats from "@/components/events-stats"
import EventsFilters from "@/components/events-filters"

export default function Home() {
  return (
    <NotificationsProvider>
      <NotificationProvider>
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">42 Events</h1>
            <nav className="space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
              <a href="/" className="hover:text-blue-500">Home</a>
              <a href="/admin" className="hover:text-blue-500">Admin</a>
              <a href="/export" className="hover:text-blue-500">Export</a>
            </nav>
          </div>
        </header>

        <main className="bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 min-h-screen">

          {/* Hero Section */}
          <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-6 text-center shadow-md">
            <h2 className="text-4xl font-bold mb-3">Code. Learn. Connect.</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Discover and participate in exciting events at 42 Abu Dhabi — from workshops to hackathons.
            </p>
            <button className="bg-white text-blue-700 font-semibold py-2 px-4 rounded hover:bg-gray-100 shadow">
              🎯 Suggest an Event
            </button>
          </section>

          {/* Just Announced Events */}
          <section className="max-w-7xl mx-auto px-6 py-12">
            <h3 className="text-2xl font-bold mb-8 text-center">🔥 Just Announced</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-xl transition space-y-4">
                <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400">Hack42: 48hr Coding Sprint</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">📍 Auditorium A • 🕒 May 20, 2025 - 10:00 AM</p>
                <p className="text-gray-700 dark:text-gray-200 text-sm">
                  Solve real coding challenges in teams. Prizes, mentors, and fun guaranteed. Open to all 42 students!
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-white text-xs font-semibold px-3 py-1 rounded-full">Hackathon</span>
                  <span className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 text-xs font-semibold px-3 py-1 rounded-full">Team Event</span>
                </div>
                <button className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Learn More</button>
              </div>

              {/* Card 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-xl transition space-y-4">
                <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400">Terminal Art Workshop</h4>
                <p className="text-sm text-gray-50ls0 dark:text-gray-400">📍 Cluster C Lab • 🕒 May 22, 2025 - 2:00 PM</p>
                <p className="text-gray-700 dark:text-gray-200 text-sm">
                  Learn how to create ASCII and terminal-based digital art using creative tools and GitHub Readmes.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-white text-xs font-semibold px-3 py-1 rounded-full">Creative</span>
                  <span className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 text-xs font-semibold px-3 py-1 rounded-full">Workshop</span>
                </div>
                <button className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Learn More</button>
              </div>

              {/* Card 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-xl transition space-y-4">
                <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400">42 Talks: DevOps in Action</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">📍 Online • 🕒 May 25, 2025 - 5:00 PM</p>
                <p className="text-gray-700 dark:text-gray-200 text-sm">
                  Industry experts from DevOps teams share real-world CI/CD demos and tips for automation pipelines.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-800 dark:bg-green-700 dark:text-white text-xs font-semibold px-3 py-1 rounded-full">Talk</span>
                  <span className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 text-xs font-semibold px-3 py-1 rounded-full">Online</span>
                </div>
                <button className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Learn More</button>
              </div>
            </div>
          </section>

          {/* Search + Event List + Sidebar */}
          <div className="max-w-7xl mx-auto px-6 py-12 grid gap-12 md:grid-cols-[1fr_320px]">
            <div className="space-y-8">
              <SearchBar />
              <Suspense fallback={<EventsListSkeleton />}>
                <EventsList />
              </Suspense>
            </div>

            <div className="space-y-8">
              <button className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded hover:bg-blue-700 transition shadow">
                + New Event
              </button>
              <EventsStats />
              <div>
                <h4 className="font-semibold text-lg mb-3">Filter Events</h4>
                <EventsFilters />
              </div>
            </div>
          </div>

          {/* Feedback Button */}
          <div className="fixed bottom-5 right-5 z-50">
            <button className="bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 transition">
              💬 Feedback
            </button>
          </div>
        </main>
      </NotificationProvider>
    </NotificationsProvider>
  )
}

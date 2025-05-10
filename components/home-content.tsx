"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Navbar } from "@/components/navbar"
import { EventList } from "@/components/event-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Terminal } from "lucide-react"
import { motion } from "framer-motion"

interface HomeContentProps {
  lang: string
  initialEvents?: any[]
}

export function HomeContent({ lang, initialEvents }: HomeContentProps) {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('/42-pattern.svg')] opacity-10" />
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white font-mono">
                  <span className="text-[#00BABC]">&gt;</span> 42 Abu Dhabi
                </h1>
                <p className="text-xl text-gray-300 mb-8 font-mono">
                  {t("hero_description")}
                </p>
                <Button 
                  className="bg-[#00BABC] hover:bg-[#00BABC]/90 text-white font-mono px-8 py-6 text-lg rounded-none border-2 border-[#00BABC] hover:border-[#00BABC]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,186,188,0.5)]"
                >
                  {t("browse_events")}
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 bg-[#1A1A1A] border-y border-[#00BABC]/20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00BABC]" />
                <Input
                  type="text"
                  placeholder={t("search_events")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#121212] border-[#00BABC]/20 text-white font-mono rounded-none focus:border-[#00BABC] focus:ring-[#00BABC] focus:ring-1"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold font-mono flex items-center">
                <Terminal className="mr-2 text-[#00BABC]" />
                {t("upcoming_events")}
              </h2>
            </div>
            <EventList initialEvents={initialEvents} limit={3} upcoming={true} />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-[#1A1A1A] border-t border-[#00BABC]/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 font-mono">
                Built by 42 Students
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <a
                  href="https://github.com/42abudhabi/42-events"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00BABC] hover:text-[#00BABC]/80 font-mono transition-colors"
                >
                  GitHub
                </a>
                <span className="text-gray-600">|</span>
                <a
                  href="https://42abudhabi.ae"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00BABC] hover:text-[#00BABC]/80 font-mono transition-colors"
                >
                  42 Abu Dhabi
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
} 
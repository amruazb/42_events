import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { WifiOff } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="flex justify-center mb-6">
            <WifiOff className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">You're offline</h1>
          <p className="text-muted-foreground mb-6">
            It looks like you're not connected to the internet. Some features may be unavailable until you reconnect.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Don't worry, you can still view cached events and content that was previously loaded.
          </p>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

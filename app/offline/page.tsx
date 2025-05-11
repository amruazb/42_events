import { Button } from "@/components/ui/button"
import { WifiOff } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <WifiOff className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">You're offline</h1>
        <p className="mt-4 text-muted-foreground">
          You appear to be offline. Some content may not be available until you reconnect.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button>Go to Homepage</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

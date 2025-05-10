"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { LanguageSelector } from "@/components/language-selector"

export default function SignInPage() {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    await signIn("42-school", { callbackUrl: "/admin" })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>{t("back_to_home")}</span>
          </Button>
        </Link>
      </div>

      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("login")}</CardTitle>
          <CardDescription>{t("login_description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="mb-6">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="42 Abu Dhabi"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
          <Button onClick={handleSignIn} disabled={isLoading} className="w-full">
            {isLoading ? t("signing_in") : t("sign_in_with_42")}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          <p>{t("admin_access_only")}</p>
        </CardFooter>
      </Card>
    </div>
  )
}

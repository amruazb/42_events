"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"

export default function AuthErrorPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get("error")
    setError(errorParam)
  }, [searchParams])

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

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-destructive">{t("auth_error")}</CardTitle>
          <CardDescription>{t("auth_error_description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-muted p-4 rounded-md text-sm">
              <p className="font-medium mb-1">{t("error_details")}:</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          )}
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">{t("auth_error_help")}</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>{t("auth_error_help_1")}</li>
              <li>{t("auth_error_help_2")}</li>
              <li>{t("auth_error_help_3")}</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Link href="/auth/signin">
            <Button variant="outline">{t("try_again")}</Button>
          </Link>
          <Link href="/">
            <Button>{t("back_to_home")}</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

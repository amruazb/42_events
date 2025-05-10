"use client"

import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-provider"

export function LanguageSelector() {
  const { language, setLanguage, t, direction } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span>{language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={direction === "rtl" ? "end" : "start"}>
        <DropdownMenuItem onClick={() => setLanguage("en")}>{t("english")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("ar")}>{t("arabic")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("fr")}>{t("french")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

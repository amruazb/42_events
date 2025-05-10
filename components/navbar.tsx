"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react"
import { Menu, X, Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-provider"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()
  const { language, setLanguage, t, direction } = useLanguage()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse" onClick={closeMenu}>
              <span className="text-primary font-bold text-xl">42</span>
              <span className="text-foreground font-medium">Events</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            <Link
              href="/"
              className={`text-sm font-medium ${isActive("/") ? "text-primary" : "text-foreground hover:text-primary transition-colors"}`}
              onClick={closeMenu}
            >
              {t("home")}
            </Link>
            <Link
              href="/events"
              className={`text-sm font-medium ${isActive("/events") ? "text-primary" : "text-foreground hover:text-primary transition-colors"}`}
              onClick={closeMenu}
            >
              {t("events")}
            </Link>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">{language.toUpperCase()}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={direction === "rtl" ? "end" : "start"}>
                <DropdownMenuItem onClick={() => setLanguage("en")}>{t("english")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ar")}>{t("arabic")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("fr")}>{t("french")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {session ? (
              <div className="flex items-center gap-2">
                {session.user?.isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      {t("admin")}
                    </Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                        <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={direction === "rtl" ? "end" : "start"}>
                    <DropdownMenuItem onClick={() => signOut()}>{t("logout")}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button variant="default" size="sm" onClick={() => signIn("42-school")}>
                {t("login")}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={direction === "rtl" ? "end" : "start"}>
                <DropdownMenuItem onClick={() => setLanguage("en")}>{t("english")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ar")}>{t("arabic")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("fr")}>{t("french")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <Link
              href="/"
              className={`text-sm font-medium p-2 rounded ${isActive("/") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}
              onClick={closeMenu}
            >
              {t("home")}
            </Link>
            <Link
              href="/events"
              className={`text-sm font-medium p-2 rounded ${isActive("/events") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}
              onClick={closeMenu}
            >
              {t("events")}
            </Link>

            {session ? (
              <>
                {session.user?.isAdmin && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium p-2 rounded text-foreground hover:bg-muted"
                    onClick={closeMenu}
                  >
                    {t("admin")}
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="justify-start p-2 h-auto font-medium"
                  onClick={() => {
                    signOut()
                    closeMenu()
                  }}
                >
                  {t("logout")}
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                className="w-full"
                onClick={() => {
                  signIn("42-school")
                  closeMenu()
                }}
              >
                {t("login")}
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

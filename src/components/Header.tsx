
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentLanguage } = useLanguage();
  
  const isRTL = currentLanguage === 'ar';

  return (
    <header className="bg-background border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-primary font-bold text-xl">42</span>
          <span className="text-white font-medium text-xl ml-1">{t('app.name')}</span>
        </Link>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>

        {/* Desktop Navigation */}
        <nav className={cn(
          "hidden md:flex items-center gap-x-6",
          isRTL && "flex-row-reverse"
        )}>
          <Link to="/" className="text-white hover:text-primary transition-colors">
            {t('nav.home')}
          </Link>
          <Link to="/events" className="text-white hover:text-primary transition-colors">
            {t('nav.events')}
          </Link>
          <Link to="/about" className="text-white hover:text-primary transition-colors">
            {t('nav.about')}
          </Link>
          <Link to="/contact" className="text-white hover:text-primary transition-colors">
            {t('nav.contact')}
          </Link>
          <Link to="/admin" className="text-white hover:text-primary transition-colors">
            Admin
          </Link>
          <LanguageSwitcher />
          <Button className="bg-primary hover:bg-primary/90 text-white">{t('nav.login')}</Button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-background z-50 pt-16 px-4">
            <nav className="flex flex-col gap-y-4">
              <Link 
                to="/" 
                className="text-lg text-white hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/events" 
                className="text-lg text-white hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.events')}
              </Link>
              <Link 
                to="/about" 
                className="text-lg text-white hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link 
                to="/contact" 
                className="text-lg text-white hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              <Link 
                to="/admin" 
                className="text-lg text-white hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
              <div className="flex items-center mt-4">
                <LanguageSwitcher />
                <span className="text-white mx-2">{t('languages.' + currentLanguage)}</span>
              </div>
              <Button 
                className="mt-4 bg-primary hover:bg-primary/90 text-white w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.login')}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;


import * as React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-primary/20">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background text-foreground border-border">
        <DropdownMenuItem 
          className={currentLanguage === 'en' ? 'bg-primary/20' : ''}
          onClick={() => changeLanguage('en')}
        >
          {t('languages.en')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={currentLanguage === 'ar' ? 'bg-primary/20' : ''}
          onClick={() => changeLanguage('ar')}
        >
          {t('languages.ar')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={currentLanguage === 'fr' ? 'bg-primary/20' : ''}
          onClick={() => changeLanguage('fr')}
        >
          {t('languages.fr')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;

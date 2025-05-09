
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export function Footer() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';

  return (
    <footer className="bg-background text-white border-t border-border mt-auto py-8">
      <div className="container mx-auto px-4">
        <div className={cn(
          "flex flex-col md:flex-row justify-between items-center gap-4",
          isRTL && "md:flex-row-reverse"
        )}>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-2">
              <span className="text-primary font-bold text-xl">42</span>
              <span className="text-white font-medium text-xl ml-1">{t('app.name')}</span>
            </div>
            <p className="text-sm text-gray-400">{t('app.tagline')}</p>
          </div>
          
          <div className={cn(
            "flex gap-6 text-sm",
            isRTL && "flex-row-reverse"
          )}>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              {t('footer.privacy')}
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              {t('footer.terms')}
            </a>
          </div>
        </div>
        
        <div className="text-center mt-8 text-sm text-gray-500">
          {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}

export default Footer;

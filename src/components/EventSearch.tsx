
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface EventSearchProps {
  onSearch: (query: string) => void;
}

export function EventSearch({ onSearch }: EventSearchProps) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const isRTL = currentLanguage === 'ar';

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, onSearch]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Search className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4`} />
      <Input
        type="search"
        placeholder={t('home.search')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`bg-muted text-foreground pl-3 ${isRTL ? 'pr-10' : 'pl-10'} py-6 rounded-lg border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
    </div>
  );
}

export default EventSearch;


import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { Event } from "@/hooks/useEvents";
import EventCard from "@/components/EventCard";
import EventSearch from "@/components/EventSearch";
import { cn } from "@/lib/utils";

interface EventListProps {
  events: Event[];
  title?: string;
  showSearch?: boolean;
  limit?: number;
}

export function EventList({ events, title, showSearch = false, limit }: EventListProps) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [searchResults, setSearchResults] = useState<Event[]>(events);
  const isRTL = currentLanguage === 'ar';
  
  const handleSearch = (query: string) => {
    if (!query) {
      setSearchResults(events);
      return;
    }
    
    const results = events.filter(event => {
      const titleField = currentLanguage === 'en' ? 'titleEn' : 
                          currentLanguage === 'ar' ? 'titleAr' : 'titleFr';
      const descField = currentLanguage === 'en' ? 'descriptionEn' : 
                          currentLanguage === 'ar' ? 'descriptionAr' : 'descriptionFr';
      
      return (
        event[titleField as keyof Event].toString().toLowerCase().includes(query.toLowerCase()) ||
        event[descField as keyof Event].toString().toLowerCase().includes(query.toLowerCase()) ||
        event.location.toLowerCase().includes(query.toLowerCase())
      );
    });
    
    setSearchResults(results);
  };
  
  // Apply limit if provided
  const displayEvents = limit ? searchResults.slice(0, limit) : searchResults;

  return (
    <div className="w-full">
      <div className={cn(
        "flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4",
        isRTL && "md:flex-row-reverse"
      )}>
        {title && <h2 className="text-2xl font-bold text-white">{title}</h2>}
        {showSearch && <EventSearch onSearch={handleSearch} />}
      </div>
      
      {displayEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">{t('home.noEvents')}</p>
        </div>
      )}
    </div>
  );
}

export default EventList;

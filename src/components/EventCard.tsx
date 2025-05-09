
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "@/hooks/useEvents";
import { Link } from "react-router-dom";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  
  // Select the appropriate title based on current language
  const title = currentLanguage === 'en' 
    ? event.titleEn 
    : currentLanguage === 'ar'
      ? event.titleAr
      : event.titleFr;

  // Format the date based on language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      currentLanguage === 'en' ? 'en-US' : 
      currentLanguage === 'ar' ? 'ar-AE' : 'fr-FR', 
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  return (
    <Card className="overflow-hidden border border-border bg-card hover:border-primary transition-colors duration-300 h-full flex flex-col animate-fade-in">
      <div className="h-48 overflow-hidden">
        <img 
          src={event.image || "/placeholder.svg"} 
          alt={title} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
      </div>
      <CardContent className="pt-6 flex-grow">
        <div className="mb-2 text-primary">{formatDate(event.date)} • {event.time}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-2">{event.location}</p>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <span>{event.attendees}</span>
          <span>{t('event.attendees')}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="default" 
          className="w-full bg-primary hover:bg-primary/80"
          asChild
        >
          <Link to={`/events/${event.id}`}>
            {t('event.viewMore')}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default EventCard;

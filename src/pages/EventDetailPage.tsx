
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { CalendarIcon, MapPin, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEvents } from "@/hooks/useEvents";
import { cn } from "@/lib/utils";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { getEventById } = useEvents();
  const isRTL = currentLanguage === 'ar';
  
  const event = getEventById(id || "");
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  // If event not found
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Event not found</h1>
            <Button asChild>
              <Link to="/events">Back to Events</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Select content based on language
  const title = currentLanguage === 'en' 
    ? event.titleEn 
    : currentLanguage === 'ar' 
    ? event.titleAr 
    : event.titleFr;
  
  const description = currentLanguage === 'en' 
    ? event.descriptionEn 
    : currentLanguage === 'ar' 
    ? event.descriptionAr 
    : event.descriptionFr;
  
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Image */}
        <div className="h-64 md:h-96 w-full relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
          <img 
            src={event.image || "/placeholder.svg"} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Event Details */}
        <div className="container mx-auto px-4 -mt-16 relative z-20">
          <div className="bg-card border border-border rounded-lg shadow-lg p-6 md:p-10">
            <div className={cn(
              "flex flex-col md:flex-row gap-8",
              isRTL && "md:flex-row-reverse"
            )}>
              {/* Main Content */}
              <div className="md:w-2/3">
                <h1 className={cn(
                  "text-3xl md:text-4xl font-bold mb-6",
                  isRTL && "text-right"
                )}>{title}</h1>
                
                <div className={cn(
                  "prose prose-invert max-w-none mb-8",
                  isRTL && "text-right"
                )}>
                  <p>{description}</p>
                </div>
                
                <div className="mb-8">
                  <h2 className={cn(
                    "text-xl font-semibold mb-4",
                    isRTL && "text-right"
                  )}>{t('event.details')}</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={cn(
                      "flex items-center gap-2",
                      isRTL && "flex-row-reverse justify-end"
                    )}>
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className={cn(
                      "flex items-center gap-2",
                      isRTL && "flex-row-reverse justify-end"
                    )}>
                      <Clock className="h-5 w-5 text-primary" />
                      <span>{event.time}</span>
                    </div>
                    <div className={cn(
                      "flex items-center gap-2",
                      isRTL && "flex-row-reverse justify-end"
                    )}>
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>{event.location}</span>
                    </div>
                    <div className={cn(
                      "flex items-center gap-2",
                      isRTL && "flex-row-reverse justify-end"
                    )}>
                      <Users className="h-5 w-5 text-primary" />
                      <span>{event.attendees} {t('event.attendees')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="md:w-1/3">
                <div className="bg-muted rounded-lg p-6 sticky top-24">
                  <h3 className={cn(
                    "text-lg font-semibold mb-4",
                    isRTL && "text-right"
                  )}>{t('event.organizer')}</h3>
                  <div className={cn(
                    "flex items-center gap-3 mb-6",
                    isRTL && "flex-row-reverse"
                  )}>
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-medium">{event.organizer.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{event.organizer}</p>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    {t('event.register')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventDetailPage;

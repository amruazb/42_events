
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventList from "@/components/EventList";
import { useEvents } from "@/hooks/useEvents";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const Index = () => {
  const { t } = useTranslation();
  const { events, loading, error } = useEvents();
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className={cn(
              "flex flex-col md:flex-row items-center",
              isRTL && "md:flex-row-reverse"
            )}>
              <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
                <h1 className={cn(
                  "text-4xl md:text-5xl font-bold mb-4 text-gradient",
                  isRTL ? "md:text-right" : "md:text-left"
                )}>
                  {t('home.welcome')}
                </h1>
                <p className={cn(
                  "text-xl text-gray-300 mb-8",
                  isRTL ? "md:text-right" : "md:text-left"
                )}>
                  {t('home.subtitle')}
                </p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium px-8">
                  <Link to="/events">{t('home.viewAll')}</Link>
                </Button>
              </div>
              <div className="md:w-1/2 flex justify-center md:justify-end">
                <div className="w-full max-w-md h-64 md:h-80 bg-gradient-to-br from-primary/40 to-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-6xl font-bold text-white">42</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <EventList 
              title={t('home.upcomingEvents')} 
              events={events} 
              limit={3} 
              showSearch={false} 
            />
            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                asChild
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Link to="/events">{t('home.viewAll')}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

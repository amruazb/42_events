import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Calendar, Users, MapPin, ArrowRight } from "lucide-react";
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
        <section className="relative bg-gradient-to-b from-background to-background/95 py-20 md:py-32 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          
          <div className="container mx-auto px-4 relative">
            <div className={cn(
              "flex flex-col md:flex-row items-center gap-12",
              isRTL && "md:flex-row-reverse"
            )}>
              <div className="md:w-1/2 space-y-8">
                <div className="space-y-4">
                  <h1 className={cn(
                    "text-4xl md:text-6xl font-bold leading-tight",
                    "bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent",
                    isRTL ? "md:text-right" : "md:text-left"
                  )}>
                    {t('home.welcome')}
                  </h1>
                  <p className={cn(
                    "text-xl text-muted-foreground",
                    isRTL ? "md:text-right" : "md:text-left"
                  )}>
                    {t('home.subtitle')}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium px-8">
                    <Link to="/events" className="flex items-center gap-2">
                      {t('home.viewAll')}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
                    <Link to="/about">{t('nav.about')}</Link>
                  </Button>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-3xl" />
                  <div className="relative bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Upcoming Events</h3>
                          <p className="text-muted-foreground">Stay updated with the latest events</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Community</h3>
                          <p className="text-muted-foreground">Connect with fellow students</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Locations</h3>
                          <p className="text-muted-foreground">Find events near you</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Events Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('home.upcomingEvents')}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover and join the most exciting events happening in our community
              </p>
            </div>
            
            <EventList 
              events={events} 
              limit={3} 
              showSearch={false} 
            />
            
            <div className="mt-12 text-center">
              <Button 
                variant="outline" 
                asChild
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Link to="/events" className="flex items-center gap-2">
                  {t('home.viewAll')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background/50 backdrop-blur-sm border border-border rounded-xl p-6">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Event Management</h3>
                <p className="text-muted-foreground">
                  Easily create, manage, and track all your events in one place
                </p>
              </div>
              
              <div className="bg-background/50 backdrop-blur-sm border border-border rounded-xl p-6">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Engagement</h3>
                <p className="text-muted-foreground">
                  Connect with other students and participate in community events
                </p>
              </div>
              
              <div className="bg-background/50 backdrop-blur-sm border border-border rounded-xl p-6">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Location Tracking</h3>
                <p className="text-muted-foreground">
                  Find events happening near you and get directions easily
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

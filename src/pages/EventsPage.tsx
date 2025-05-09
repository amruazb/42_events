
import React from "react"; // Add explicit React import
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventList from "@/components/EventList";
import { useEvents } from "@/hooks/useEvents";

const EventsPage = () => {
  const { t } = useTranslation();
  const { events, loading, error } = useEvents();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">{t('nav.events')}</h1>
          
          <EventList 
            events={events} 
            showSearch={true}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventsPage;


import React from "react"; // Add explicit React import
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
          <p className="text-gray-400 mb-8">The page you are looking for doesn't exist or has been moved.</p>
          <Button asChild>
            <Link to="/">
              {t('nav.home')}
            </Link>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;

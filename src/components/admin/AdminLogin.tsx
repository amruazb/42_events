import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const { t } = useTranslation();

  const handleLogin = () => {
    const CLIENT_ID = import.meta.env.VITE_FORTY_TWO_CLIENT_ID;
    const REDIRECT_URI = "https://42-events-iota.vercel.app/admin";
    const SCOPES = "public events";
    
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPES)}`;
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>{t('admin.login')}</CardTitle>
            <CardDescription>
              {t('admin.loginDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleLogin}
              className="w-full"
            >
              {t('admin.loginWith42')}
            </Button>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminLogin;

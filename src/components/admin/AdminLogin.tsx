
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface AdminLoginProps {
  onLogin: (e: React.FormEvent) => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8 border border-border rounded-lg bg-background/50 backdrop-blur-sm">
          <h1 className="text-3xl font-bold mb-6 text-center text-primary">{t('admin.login')}</h1>
          <p className="text-white mb-6 text-center">{t('admin.loginDescription')}</p>
          
          <form onSubmit={onLogin} className="space-y-4">
            <Button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              {t('admin.loginWith42')}
            </Button>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminLogin;

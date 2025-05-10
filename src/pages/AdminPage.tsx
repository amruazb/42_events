
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminEventsList from "@/components/admin/AdminEventsList";
import AdminImport from "@/components/admin/AdminImport";
import AdminExport from "@/components/admin/AdminExport";
import { useEvents } from "@/hooks/useEvents";
import { Images, Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { events } = useEvents();
  
  // Temporary mock login function (to be replaced with OAuth)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock successful authentication
    setIsAuthenticated(true);
    toast({
      title: "Logged in successfully",
      description: "Welcome to the admin dashboard.",
      variant: "default",
    });
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Content for the authenticated admin view
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">{t('admin.dashboard')}</h1>
            <Button 
              variant="outline" 
              onClick={() => setIsAuthenticated(false)}
              className="border-primary text-primary hover:bg-primary/10"
            >
              {t('admin.logout')}
            </Button>
          </div>
          
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Images className="h-4 w-4" />
                {t('admin.events')}
              </TabsTrigger>
              <TabsTrigger value="import" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {t('admin.import')}
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                {t('admin.export')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="events">
              <AdminEventsList events={events} />
            </TabsContent>
            
            <TabsContent value="import">
              <AdminImport />
            </TabsContent>
            
            <TabsContent value="export">
              <AdminExport />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;

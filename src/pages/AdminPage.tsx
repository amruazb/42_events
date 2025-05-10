import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
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
import { exchangeCodeForToken, getUserInfo } from "@/lib/auth";

const AdminPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { events } = useEvents();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        console.error("OAuth error:", error);
        toast({
          title: "Authentication failed",
          description: `Error from 42 OAuth: ${error}`,
          variant: "destructive",
        });
        return;
      }

      if (!code) {
        return;
      }

      try {
        const tokenResponse = await exchangeCodeForToken(code);
        const userInfo = await getUserInfo(tokenResponse.access_token);

        // Store the tokens and user info in localStorage
        localStorage.setItem("access_token", tokenResponse.access_token);
        localStorage.setItem("refresh_token", tokenResponse.refresh_token);
        localStorage.setItem("user_info", JSON.stringify(userInfo));

        setIsAuthenticated(true);
        toast({
          title: "Logged in successfully",
          description: "Welcome to the admin dashboard.",
          variant: "default",
        });
      } catch (error) {
        console.error("Error during authentication:", error);
        let errorMessage = "There was an error during authentication.";
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'details' in error) {
          errorMessage = (error as { details: string }).details;
        }

        toast({
          title: "Authentication failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    handleOAuthCallback();
  }, [searchParams, toast]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_info");
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
      variant: "default",
    });
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => {}} />;
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
              onClick={handleLogout}
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

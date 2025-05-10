import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventForm from "@/components/EventForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MediaUpload from "@/components/MediaUpload";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEvents } from "@/hooks/useEvents";
import { Images, Upload, FileUp, Download } from "lucide-react";

const AdminPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { events } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<any>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  
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
  
  const handleCreateEvent = (formData: any) => {
    console.log('Creating event with data:', formData);
    
    // Here you would normally send this data to your backend
    // For now, we'll just show a success toast
    toast({
      title: "Event created",
      description: `Event "${formData.titleEn}" has been created successfully.`,
      variant: "default",
    });
    
    setShowEventForm(false);
  };
  
  const handleEditEvent = (id: string) => {
    const event = events.find(e => e.id === id);
    if (event) {
      setEventToEdit(event);
      setShowEventForm(true);
    }
  };
  
  const handleUpdateEvent = (formData: any) => {
    console.log('Updating event with data:', formData);
    
    // Here you would normally send this data to your backend
    toast({
      title: "Event updated",
      description: `Event "${formData.titleEn}" has been updated successfully.`,
      variant: "default",
    });
    
    setShowEventForm(false);
    setEventToEdit(null);
  };
  
  const handleDeleteEvent = (id: string) => {
    console.log('Deleting event with ID:', id);
    
    // Here you would normally send this request to your backend
    toast({
      title: "Event deleted",
      description: "The event has been deleted successfully.",
      variant: "default",
    });
  };
  
  const handleImportCSV = () => {
    if (!csvFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import.",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would normally process the CSV file
    toast({
      title: "Import started",
      description: "Your events are being imported. This may take a few moments.",
      variant: "default",
    });
    
    // Reset the file input
    setCsvFile(null);
  };
  
  const handleExportCSV = () => {
    // Here you would normally generate and download a CSV file
    toast({
      title: "Export started",
      description: "Your events are being exported to CSV.",
      variant: "default",
    });
  };
  
  const handleExportCalendar = () => {
    // Here you would normally generate and download an iCal file
    toast({
      title: "Calendar export started",
      description: "Your events are being exported to calendar format.",
      variant: "default",
    });
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-md p-8 border border-border rounded-lg bg-background/50 backdrop-blur-sm">
            <h1 className="text-3xl font-bold mb-6 text-center text-primary">{t('admin.login')}</h1>
            <p className="text-white mb-6 text-center">{t('admin.loginDescription')}</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
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
            
            <TabsContent value="events" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-white">{t('admin.manageEvents')}</h2>
                
                <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                      {t('admin.createEvent')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {eventToEdit ? t('admin.editEvent') : t('admin.createEvent')}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <EventForm 
                      event={eventToEdit}
                      onSubmit={eventToEdit ? handleUpdateEvent : handleCreateEvent}
                      onCancel={() => {
                        setShowEventForm(false);
                        setEventToEdit(null);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('event.title')}</TableHead>
                      <TableHead>{t('event.date')}</TableHead>
                      <TableHead>{t('event.location')}</TableHead>
                      <TableHead>{t('event.media')}</TableHead>
                      <TableHead className="text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.titleEn}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          {event.image ? (
                            <div className="h-10 w-16 overflow-hidden rounded">
                              <img 
                                src={event.image} 
                                alt={event.titleEn} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 text-primary"
                            onClick={() => handleEditEvent(event.id)}
                          >
                            {t('common.edit')}
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2 text-destructive"
                              >
                                {t('common.delete')}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('admin.deleteEvent')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{event.titleEn}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  {t('common.delete')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="import" className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">{t('admin.importEvents')}</h2>
              <div className="bg-background/50 backdrop-blur-sm p-6 border rounded-md">
                <p className="text-muted-foreground mb-4">{t('admin.importDescription')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-3">{t('admin.csvImport')}</h3>
                    <div className="flex flex-col gap-4">
                      <Input 
                        type="file" 
                        accept=".csv" 
                        className="bg-background" 
                        onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                      />
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-white"
                        onClick={handleImportCSV}
                      >
                        <FileUp className="mr-2 h-4 w-4" />
                        {t('admin.upload')}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-3">{t('admin.mediaImport')}</h3>
                    <MediaUpload
                      type="all"
                      onFileSelect={(file) => {
                        console.log('Media file selected:', file);
                        toast({
                          title: "Media uploaded",
                          description: `File "${file.name}" has been uploaded successfully.`,
                          variant: "default",
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="export" className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">{t('admin.exportEvents')}</h2>
              <div className="bg-background/50 backdrop-blur-sm p-6 border rounded-md">
                <p className="text-muted-foreground mb-4">{t('admin.exportDescription')}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white"
                    onClick={handleExportCSV}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {t('admin.exportCSV')}
                  </Button>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white"
                    onClick={handleExportCalendar}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {t('admin.exportCalendar')}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;

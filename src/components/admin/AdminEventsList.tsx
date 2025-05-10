
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import EventForm from "@/components/EventForm";
import { Event } from "@/hooks/useEvents";
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

interface AdminEventsListProps {
  events: Event[];
}

const AdminEventsList = ({ events }: AdminEventsListProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);

  const handleCreateEvent = (formData: any) => {
    console.log('Creating event with data:', formData);
    
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
    
    toast({
      title: "Event deleted",
      description: "The event has been deleted successfully.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
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
              event={eventToEdit || undefined}
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
    </div>
  );
};

export default AdminEventsList;

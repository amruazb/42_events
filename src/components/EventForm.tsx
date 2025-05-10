
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import MediaUpload from "./MediaUpload";
import { Event } from "@/hooks/useEvents";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  titleEn: z.string().min(1, { message: "Title is required" }),
  titleAr: z.string().min(1, { message: "Arabic title is required" }),
  titleFr: z.string().min(1, { message: "French title is required" }),
  descriptionEn: z.string().min(10, { message: "Description must be at least 10 characters" }),
  descriptionAr: z.string().min(10, { message: "Arabic description must be at least 10 characters" }),
  descriptionFr: z.string().min(10, { message: "French description must be at least 10 characters" }),
  date: z.date(),
  time: z.string(),
  location: z.string().min(1, { message: "Location is required" }),
  organizer: z.string().min(1, { message: "Organizer is required" }),
});

interface EventFormProps {
  event?: Event;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const EventForm = ({ event, onSubmit, onCancel }: EventFormProps) => {
  const { t } = useTranslation();
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [currentTab, setCurrentTab] = useState("en");
  
  // Initialize the form with default values or existing event data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: event ? {
      titleEn: event.titleEn,
      titleAr: event.titleAr || "",
      titleFr: event.titleFr || "",
      descriptionEn: event.descriptionEn,
      descriptionAr: event.descriptionAr || "",
      descriptionFr: event.descriptionFr || "",
      date: event.date ? new Date(event.date) : new Date(),
      time: event.time || "",
      location: event.location || "",
      organizer: event.organizer || "",
    } : {
      titleEn: "",
      titleAr: "",
      titleFr: "",
      descriptionEn: "",
      descriptionAr: "",
      descriptionFr: "",
      date: new Date(),
      time: "18:00",
      location: "",
      organizer: "",
    },
  });

  const handleFileSelect = (file: File) => {
    setMediaFile(file);
  };

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    // Include the media file in the submission data
    const formData = new FormData();
    
    // Add all form values to the FormData
    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value as string);
      }
    });
    
    // Add media file if available
    if (mediaFile) {
      formData.append('media', mediaFile);
    }
    
    onSubmit({
      ...values,
      media: mediaFile,
      id: event ? event.id : undefined,
      // Format the date for the API
      date: format(values.date, "yyyy-MM-dd"),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {event ? t('admin.editEvent') : t('admin.createEvent')}
        </h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">{t('admin.eventMedia')}</h3>
          <MediaUpload 
            onFileSelect={handleFileSelect}
            currentMedia={event?.image}
            type="all"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {t('admin.mediaDescription')}
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ar">العربية</TabsTrigger>
                <TabsTrigger value="fr">Français</TabsTrigger>
              </TabsList>
              
              {/* English Content */}
              <TabsContent value="en" className="space-y-4">
                <FormField
                  control={form.control}
                  name="titleEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('event.title')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="descriptionEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('event.description')}</FormLabel>
                      <FormControl>
                        <Textarea rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              {/* Arabic Content */}
              <TabsContent value="ar" className="space-y-4">
                <FormField
                  control={form.control}
                  name="titleAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('event.title')}</FormLabel>
                      <FormControl>
                        <Input dir="rtl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="descriptionAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('event.description')}</FormLabel>
                      <FormControl>
                        <Textarea dir="rtl" rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              {/* French Content */}
              <TabsContent value="fr" className="space-y-4">
                <FormField
                  control={form.control}
                  name="titleFr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('event.title')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="descriptionFr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('event.description')}</FormLabel>
                      <FormControl>
                        <Textarea rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('event.date')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('event.time')}</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input type="time" {...field} />
                        <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('event.location')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="organizer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('event.organizer')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {event ? t('common.save') : t('admin.createEvent')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EventForm;

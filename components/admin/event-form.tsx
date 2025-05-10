"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"
import { useSocket } from "@/components/socket-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { z } from "zod"

// Form schema
const eventFormSchema = z.object({
  title: z.object({
    en: z.string().min(3, { message: "Title must be at least 3 characters" }),
    ar: z.string().min(3, { message: "Title must be at least 3 characters" }),
    fr: z.string().min(3, { message: "Title must be at least 3 characters" }),
  }),
  description: z.object({
    en: z.string().min(10, { message: "Description must be at least 10 characters" }),
    ar: z.string().min(10, { message: "Description must be at least 10 characters" }),
    fr: z.string().min(10, { message: "Description must be at least 10 characters" }),
  }),
  location: z.object({
    en: z.string().min(3, { message: "Location must be at least 3 characters" }),
    ar: z.string().min(3, { message: "Location must be at least 3 characters" }),
    fr: z.string().min(3, { message: "Location must be at least 3 characters" }),
  }),
  startDate: z.date(),
  endDate: z.date(),
  category: z.string(),
  image: z.string().optional(),
  capacity: z.number().optional(),
})

type EventFormValues = z.infer<typeof eventFormSchema>

interface AdminEventFormProps {
  event?: any
}

export function AdminEventForm({ event }: AdminEventFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { t, language } = useLanguage()
  const { socket } = useSocket()
  const [activeTab, setActiveTab] = useState<"en" | "ar" | "fr">("en")

  // Default form values
  const defaultValues: EventFormValues = {
    title: {
      en: "",
      ar: "",
      fr: "",
    },
    description: {
      en: "",
      ar: "",
      fr: "",
    },
    location: {
      en: "",
      ar: "",
      fr: "",
    },
    startDate: new Date(),
    endDate: new Date(new Date().setHours(new Date().getHours() + 2)),
    category: "workshop",
    image: "",
    capacity: 50,
  }

  // Initialize form
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: event
      ? {
          ...defaultValues,
          title: event.title,
          description: event.description,
          location: event.location,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          category: event.category,
          image: event.image || "",
          capacity: event.capacity || 50,
        }
      : defaultValues,
  })

  // Handle form submission
  const onSubmit = async (values: EventFormValues) => {
    try {
      const url = event ? `/api/events/${event._id}` : "/api/events"
      const method = event ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        const savedEvent = await response.json()

        toast({
          title: event ? t("event_updated") : t("event_created"),
          description: values.title[language],
        })

        // Reset form if creating a new event
        if (!event) {
          form.reset(defaultValues)
        }

        // Redirect to events list
        router.push("/admin?tab=events")
        router.refresh()
      } else {
        throw new Error("Failed to save event")
      }
    } catch (error) {
      console.error("Error saving event:", error)
      toast({
        title: t("error"),
        description: t("error_saving_event"),
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{event ? t("edit_event") : t("create_event")}</h2>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "en" | "ar" | "fr")}>
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="ar">العربية</TabsTrigger>
            <TabsTrigger value="fr">Français</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Title */}
              <TabsContent value="en" forceMount={activeTab === "en"}>
                <FormField
                  control={form.control}
                  name="title.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("title")} (English)</FormLabel>
                      <FormControl>
                        <Input placeholder="Event title in English" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="ar" forceMount={activeTab === "ar"}>
                <FormField
                  control={form.control}
                  name="title.ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("title")} (العربية)</FormLabel>
                      <FormControl>
                        <Input placeholder="عنوان الفعالية بالعربية" {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="fr" forceMount={activeTab === "fr"}>
                <FormField
                  control={form.control}
                  name="title.fr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("title")} (Français)</FormLabel>
                      <FormControl>
                        <Input placeholder="Titre de l'événement en français" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Location */}
              <TabsContent value="en" forceMount={activeTab === "en"}>
                <FormField
                  control={form.control}
                  name="location.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("location")} (English)</FormLabel>
                      <FormControl>
                        <Input placeholder="Event location in English" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="ar" forceMount={activeTab === "ar"}>
                <FormField
                  control={form.control}
                  name="location.ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("location")} (العربية)</FormLabel>
                      <FormControl>
                        <Input placeholder="موقع الفعالية بالعربية" {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="fr" forceMount={activeTab === "fr"}>
                <FormField
                  control={form.control}
                  name="location.fr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("location")} (Français)</FormLabel>
                      <FormControl>
                        <Input placeholder="Lieu de l'événement en français" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("category")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="workshop">{t("workshop")}</SelectItem>
                        <SelectItem value="hackathon">{t("hackathon")}</SelectItem>
                        <SelectItem value="meetup">{t("meetup")}</SelectItem>
                        <SelectItem value="conference">{t("conference")}</SelectItem>
                        <SelectItem value="other">{t("other")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image URL */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("image_url")}</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>{t("image_url_description")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Capacity */}
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("capacity")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("start_date")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("end_date")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <TabsContent value="en" forceMount={activeTab === "en"}>
                <FormField
                  control={form.control}
                  name="description.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("description")} (English)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Event description in English" className="min-h-[200px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="ar" forceMount={activeTab === "ar"}>
                <FormField
                  control={form.control}
                  name="description.ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("description")} (العربية)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="وصف الفعالية بالعربية" className="min-h-[200px]" {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="fr" forceMount={activeTab === "fr"}>
                <FormField
                  control={form.control}
                  name="description.fr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("description")} (Français)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description de l'événement en français"
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin?tab=events")}>
              {t("cancel")}
            </Button>
            <Button type="submit">{event ? t("update") : t("create")}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

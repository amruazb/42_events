"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type Language = "en" | "ar" | "fr"
type Direction = "ltr" | "rtl"

interface LanguageContextType {
  language: Language
  direction: Direction
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    home: "Home",
    events: "Events",
    about: "About",
    login: "Login",
    logout: "Logout",
    admin: "Admin Dashboard",
    search: "Search events...",
    upcoming_events: "Upcoming Events",
    past_events: "Past Events",
    event_details: "Event Details",
    date: "Date",
    time: "Time",
    location: "Location",
    description: "Description",
    register: "Register",
    create_event: "Create Event",
    edit_event: "Edit Event",
    delete_event: "Delete Event",
    export_events: "Export Events",
    import_events: "Import Events",
    title: "Title",
    start_date: "Start Date",
    end_date: "End Date",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    language: "Language",
    english: "English",
    arabic: "Arabic",
    french: "French",
    no_events: "No events found",
    loading: "Loading...",
    error: "An error occurred",
    event_created: "Event created successfully",
    event_updated: "Event updated successfully",
    event_deleted: "Event deleted successfully",
    events_imported: "Events imported successfully",
    events_exported: "Events exported successfully",
    filter: "Filter",
    all: "All",
    today: "Today",
    this_week: "This Week",
    this_month: "This Month",
    category: "Category",
    workshop: "Workshop",
    hackathon: "Hackathon",
    meetup: "Meetup",
    conference: "Conference",
    other: "Other",
  },
  ar: {
    home: "الرئيسية",
    events: "الفعاليات",
    about: "حول",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    admin: "لوحة الإدارة",
    search: "البحث عن الفعاليات...",
    upcoming_events: "الفعاليات القادمة",
    past_events: "الفعاليات السابقة",
    event_details: "تفاصيل الفعالية",
    date: "التاريخ",
    time: "الوقت",
    location: "الموقع",
    description: "الوصف",
    register: "التسجيل",
    create_event: "إنشاء فعالية",
    edit_event: "تعديل الفعالية",
    delete_event: "حذف الفعالية",
    export_events: "تصدير الفعاليات",
    import_events: "استيراد الفعاليات",
    title: "العنوان",
    start_date: "تاريخ البدء",
    end_date: "تاريخ الانتهاء",
    save: "حفظ",
    cancel: "إلغاء",
    confirm: "تأكيد",
    language: "اللغة",
    english: "الإنجليزية",
    arabic: "العربية",
    french: "الفرنسية",
    no_events: "لم يتم العثور على فعاليات",
    loading: "جاري التحميل...",
    error: "حدث خطأ",
    event_created: "تم إنشاء الفعالية بنجاح",
    event_updated: "تم تحديث الفعالية بنجاح",
    event_deleted: "تم حذف الفعالية بنجاح",
    events_imported: "تم استيراد الفعاليات بنجاح",
    events_exported: "تم تصدير الفعاليات بنجاح",
    filter: "تصفية",
    all: "الكل",
    today: "اليوم",
    this_week: "هذا الأسبوع",
    this_month: "هذا الشهر",
    category: "الفئة",
    workshop: "ورشة عمل",
    hackathon: "هاكاثون",
    meetup: "لقاء",
    conference: "مؤتمر",
    other: "أخرى",
  },
  fr: {
    home: "Accueil",
    events: "Événements",
    about: "À propos",
    login: "Connexion",
    logout: "Déconnexion",
    admin: "Tableau de bord",
    search: "Rechercher des événements...",
    upcoming_events: "Événements à venir",
    past_events: "Événements passés",
    event_details: "Détails de l'événement",
    date: "Date",
    time: "Heure",
    location: "Lieu",
    description: "Description",
    register: "S'inscrire",
    create_event: "Créer un événement",
    edit_event: "Modifier l'événement",
    delete_event: "Supprimer l'événement",
    export_events: "Exporter les événements",
    import_events: "Importer des événements",
    title: "Titre",
    start_date: "Date de début",
    end_date: "Date de fin",
    save: "Enregistrer",
    cancel: "Annuler",
    confirm: "Confirmer",
    language: "Langue",
    english: "Anglais",
    arabic: "Arabe",
    french: "Français",
    no_events: "Aucun événement trouvé",
    loading: "Chargement...",
    error: "Une erreur est survenue",
    event_created: "Événement créé avec succès",
    event_updated: "Événement mis à jour avec succès",
    event_deleted: "Événement supprimé avec succès",
    events_imported: "Événements importés avec succès",
    events_exported: "Événements exportés avec succès",
    filter: "Filtrer",
    all: "Tous",
    today: "Aujourd'hui",
    this_week: "Cette semaine",
    this_month: "Ce mois-ci",
    category: "Catégorie",
    workshop: "Atelier",
    hackathon: "Hackathon",
    meetup: "Rencontre",
    conference: "Conférence",
    other: "Autre",
  },
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  direction: "ltr",
  setLanguage: () => {},
  t: (key: string) => key,
})

export function useLanguage() {
  return useContext(LanguageContext)
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [direction, setDirection] = useState<Direction>("ltr")
  const router = useRouter()

  useEffect(() => {
    // Get language from localStorage or browser preference
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["en", "ar", "fr"].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    } else {
      const browserLanguage = navigator.language.split("-")[0]
      if (["en", "ar", "fr"].includes(browserLanguage)) {
        setLanguageState(browserLanguage as Language)
      }
    }
  }, [])

  useEffect(() => {
    // Update direction based on language
    setDirection(language === "ar" ? "rtl" : "ltr")

    // Update HTML dir attribute
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"

    // Save language preference
    localStorage.setItem("language", language)
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    // Refresh the page to apply language change
    router.refresh()
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>{children}</LanguageContext.Provider>
}


import { useState, useEffect } from 'react';

export interface Event {
  id: string;
  titleEn: string;
  titleAr: string;
  titleFr: string;
  descriptionEn: string;
  descriptionAr: string;
  descriptionFr: string;
  date: string;
  time: string;
  location: string;
  image: string;
  organizerId: string;
  organizer: string;
  attendees: number;
}

// Mock events data for the initial implementation
const mockEvents: Event[] = [
  {
    id: '1',
    titleEn: 'Introduction to Artificial Intelligence',
    titleAr: 'مقدمة في الذكاء الاصطناعي',
    titleFr: 'Introduction à l\'Intelligence Artificielle',
    descriptionEn: 'Learn the fundamentals of AI and how it\'s shaping our future. This workshop will cover basic concepts, real-world applications, and hands-on exercises.',
    descriptionAr: 'تعلم أساسيات الذكاء الاصطناعي وكيف يشكل مستقبلنا. ستغطي ورشة العمل هذه المفاهيم الأساسية والتطبيقات في العالم الحقيقي والتمارين العملية.',
    descriptionFr: 'Apprenez les fondamentaux de l\'IA et comment elle façonne notre avenir. Cet atelier couvrira les concepts de base, les applications réelles et des exercices pratiques.',
    date: '2025-06-15',
    time: '14:00-17:00',
    location: 'Main Auditorium',
    image: '/placeholder.svg',
    organizerId: 'u1',
    organizer: 'Dr. Sarah Johnson',
    attendees: 45
  },
  {
    id: '2',
    titleEn: 'Web3 Development Workshop',
    titleAr: 'ورشة عمل تطوير ويب3',
    titleFr: 'Atelier de Développement Web3',
    descriptionEn: 'Dive into blockchain technology and learn how to build decentralized applications. This hands-on workshop covers smart contracts, NFTs, and more.',
    descriptionAr: 'انغمس في تقنية البلوكشين وتعلم كيفية بناء تطبيقات لامركزية. تغطي ورشة العمل العملية هذه العقود الذكية و NFTs والمزيد.',
    descriptionFr: 'Plongez dans la technologie blockchain et apprenez à créer des applications décentralisées. Cet atelier pratique couvre les contrats intelligents, les NFT et plus encore.',
    date: '2025-06-22',
    time: '10:00-13:00',
    location: 'Lab 42',
    image: '/placeholder.svg',
    organizerId: 'u2',
    organizer: 'Ahmed Al Mansouri',
    attendees: 30
  },
  {
    id: '3',
    titleEn: 'Cybersecurity Essentials',
    titleAr: 'أساسيات الأمن السيبراني',
    titleFr: 'Principes Essentiels de Cybersécurité',
    descriptionEn: 'Protect yourself and your organization with essential cybersecurity knowledge. Topics include threat detection, secure coding practices, and ethical hacking.',
    descriptionAr: 'احمِ نفسك ومؤسستك بمعرفة أساسية في الأمن السيبراني. تشمل الموضوعات اكتشاف التهديدات وممارسات البرمجة الآمنة والقرصنة الأخلاقية.',
    descriptionFr: 'Protégez-vous et votre organisation avec des connaissances essentielles en cybersécurité. Les sujets comprennent la détection des menaces, les pratiques de codage sécurisé et le piratage éthique.',
    date: '2025-07-05',
    time: '09:00-16:00',
    location: 'Security Lab',
    image: '/placeholder.svg',
    organizerId: 'u3',
    organizer: 'Marie Dupont',
    attendees: 35
  }
];

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getEventById = (id: string): Event | undefined => {
    return events.find(event => event.id === id);
  };

  const searchEvents = (query: string, lang: string = 'en'): Event[] => {
    if (!query) return events;
    
    const titleField = lang === 'en' ? 'titleEn' : lang === 'ar' ? 'titleAr' : 'titleFr';
    const descriptionField = lang === 'en' ? 'descriptionEn' : lang === 'ar' ? 'descriptionAr' : 'descriptionFr';
    
    return events.filter(event => 
      event[titleField as keyof Event].toString().toLowerCase().includes(query.toLowerCase()) ||
      event[descriptionField as keyof Event].toString().toLowerCase().includes(query.toLowerCase()) ||
      event.location.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    events,
    loading,
    error,
    getEventById,
    searchEvents
  };
};

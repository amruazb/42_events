import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  kind: string;
  max_people: number;
  nbr_subscribers: number;
  begin_at: string;
  end_at: string;
  campus_ids: number[];
  cursus_ids: number[];
  themes: Array<{
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  }>;
  waitlist: {
    id: number;
    created_at: string;
    updated_at: string;
    waitlistable_id: number;
    waitlistable_type: string;
  } | null;
  prohibition_of_cancellation: number;
  created_at: string;
  updated_at: string;
}

interface PaginationInfo {
  total: number | null;
  totalPages: number | null;
  currentPage: number;
  perPage: number;
}

interface EventsResponse {
  events: Event[];
  pagination: PaginationInfo;
}

export function useEvents(page = 1, perPage = 30) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: null,
    totalPages: null,
    currentPage: page,
    perPage
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('No access token found');
        }

        const response = await fetch(`/api/events?page=${page}&per_page=${perPage}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Failed to fetch events');
        }

        const data: EventsResponse = await response.json();
        setEvents(data.events);
        setPagination(data.pagination);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching events';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page, perPage, toast]);

  return {
    events,
    loading,
    error,
    pagination,
  };
}

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Slot {
  date: string;
  time: string;
  available: boolean;
  maxParticipants: number;
}

export interface Experience {
  _id: string;
  title: string;
  tags: string[];
  location: string;
  description: string;
  price: number;
  imageUrl: string;
  slots: Slot[];
}

export interface BookingRequest {
  experienceId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  selectedDate: string;
  selectedTime: string;
  numberOfGuests: number;
  promoCode?: string;
}

export interface PromoValidation {
  code: string;
}

export interface Booking {
  _id: string;
  experienceId: string;
  experienceTitle: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  selectedDate: string;
  selectedTime: string;
  numberOfGuests: number;
  promoCode?: string;
  discount: number;
  totalAmount: number;
  bookingStatus: string;
  bookingDate: string;
}

export interface Promo {
  _id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  isActive: boolean;
}

export const experiencesApi = {
  getAll: async (): Promise<Experience[]> => {
    const response = await api.get('/experiences');
    return response.data;
  },
  getById: async (id: string): Promise<Experience> => {
    const response = await api.get(`/experiences/${id}`);
    return response.data;
  },
};

export const bookingsApi = {
  create: async (booking: BookingRequest) => {
    const response = await api.post('/bookings', booking);
    return response.data;
  },
};

export const promoApi = {
  validate: async (code: string) => {
    const response = await api.post('/promo/validate', { code });
    return response.data;
  },
  getAll: async (): Promise<Promo[]> => {
    const response = await api.get('/promo');
    return response.data;
  },
};

export const adminApi = {
  getBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings');
    return response.data;
  },
};


import axios, { AxiosError } from 'axios';

// --- Configuration ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// 1. Configure Axios Instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add an Interceptor for Authentication (Recommended for real-world apps)
api.interceptors.request.use((config) => {
  // In a real app, you would fetch the token from localStorage or a state management store
  // const token = localStorage.getItem('authToken'); 
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- Utility Functions ---

/**
 * Extracts a readable error message from an Axios error object.
 */
export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Attempt to get a detailed message from the backend response body
    const backendMessage = error.response?.data?.message || error.response?.data?.error;
    if (backendMessage) return backendMessage;

    // Fallback to HTTP status or generic Axios message
    if (error.response) {
      return `Server Error (${error.response.status}): Could not complete the request.`;
    }
    return 'Network Error: Cannot connect to the API server.';
  }
  return 'An unexpected error occurred.';
};


// --- Interfaces (No Changes Needed Here, they are correct!) ---
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

// 3. **ENHANCEMENT:** Added missing response type for the booking creation success payload
export interface BookingCreationResponse {
  booking: Booking;
  message: string;
}

// 4. **ENHANCEMENT:** Added response type for promo validation
export interface PromoValidationResponse {
  valid: boolean;
  promo: Promo;
  message: string;
}

export interface PromoValidationRequest {
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
  bookingStatus: string; // e.g., 'Pending', 'Confirmed'
  bookingDate: string;
}

export interface Promo {
  _id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  isActive: boolean;
}


// --- API Services (Enhanced with return types) ---

// **Experience API**
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

// **Bookings API**
export const bookingsApi = {
  create: async (booking: BookingRequest): Promise<BookingCreationResponse> => {
    const response = await api.post('/bookings', booking);
    // 5. **CORRECTED:** Added return type
    return response.data as BookingCreationResponse; 
  },
};

// **Promo API**
export const promoApi = {
  validate: async (code: string): Promise<PromoValidationResponse> => {
    const response = await api.post('/promo/validate', { code });
    // 6. **CORRECTED:** Added return type
    return response.data as PromoValidationResponse; 
  },
  getAll: async (): Promise<Promo[]> => {
    const response = await api.get('/promo');
    return response.data;
  },
};

// **Admin API**
export const adminApi = {
  getBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings');
    return response.data;
  },
};
export type Language = 'en' | 'ru';

export interface ServiceItem {
  id: string;
  category: 'massage' | 'facials' | 'aroma' | 'sauna';
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  highlights: string[];
}

export interface RitualPhase {
  step: number;
  title: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
}

export interface RitualProgram {
  title: string;
  dates: string;
  tagline: string;
  description: string;
  durationMinutes: number;
  price: string;
  phases: RitualPhase[];
}

export interface GalleryRoom {
  id: string;
  name: string;
  indexLabel: string;
  description: string;
  image: string;
  features: string[];
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  phone: string;
  selectedDate: string;
  selectedTime: string;
  serviceId?: string;
  agreeToTerms: boolean;
}

export interface BookingConfirmation {
  id: string;
  guestName: string;
  phone: string;
  date: string;
  timeSlot: string;
  serviceTitle: string;
  price: string;
  roomName: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  titleOrLocation: string;
  ritualExperienced: string;
  rating: number;
  date: string;
  quote: string;
  fullReview: string;
  verifiedGuest: boolean;
}


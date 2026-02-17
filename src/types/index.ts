/**
 * Core TypeScript types for BarberHub
 * Based on the data model from the deep research report
 */

export type UUID = string;

export interface User {
  id: UUID;
  email?: string;
  phoneE164?: string;
  displayName: string;
  avatarUrl?: string;
  roleFlags: {
    isClient: boolean;
    isBarber: boolean;
    isOwner: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Barber {
  barberId: UUID;
  bio: string;
  specialties: string[];
  languages: string[];
  yearsExperience: number;
  instagramHandle?: string;
  portfolioCoverUrl: string;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  ratingAvg: number;
  ratingCount: number;
  user: User;
  portfolioImages: string[];
}

export interface Shop {
  id: UUID;
  ownerUserId: UUID;
  name: string;
  brandSlug: string;
  description: string;
  supportPhone: string;
  timezone: string;
  createdAt: string;
  logoUrl?: string;
  coverImageUrl?: string;
}

export interface Location {
  id: UUID;
  shopId: UUID;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  country: string;
  postalCode: string;
  lat: number;
  lng: number;
}

export interface BarberShopMembership {
  id: UUID;
  barberUserId: UUID;
  shopId: UUID;
  locationId?: UUID;
  relationshipType: 'employee' | 'chair_renter' | 'owner';
  payoutModel: 'commission' | 'booth_rent' | 'hybrid';
  commissionRateBps?: number;
  boothRentCents?: number;
  startDate: string;
  endDate?: string;
  shop: Shop;
  location?: Location;
}

export interface Service {
  id: UUID;
  shopId: UUID;
  name: string;
  description: string;
  durationMinutes: number;
  priceCents: number;
  currency: string;
  isAddon: boolean;
  active: boolean;
  createdAt: string;
}

export interface Appointment {
  id: UUID;
  clientUserId: UUID;
  barberUserId: UUID;
  shopId: UUID;
  locationId: UUID;
  status: 'draft' | 'confirmed' | 'checked_in' | 'completed' | 'canceled' | 'no_show' | 'disputed';
  startAt: string;
  endAt: string;
  quotedTotalCents: number;
  appliedDiscountCents: number;
  createdAt: string;
  barber?: Barber;
  shop?: Shop;
  location?: Location;
  services?: AppointmentLineItem[];
}

export interface AppointmentLineItem {
  id: UUID;
  appointmentId: UUID;
  serviceId?: UUID;
  name: string;
  durationMinutes: number;
  priceCents: number;
}

export interface Payment {
  id: UUID;
  appointmentId: UUID;
  provider: 'stripe' | 'square' | 'adyen';
  providerPaymentId: string;
  status: 'pending' | 'authorized' | 'captured' | 'refunded' | 'failed';
  amountCents: number;
  type: 'deposit' | 'final' | 'tip' | 'no_show_fee';
  capturedAt?: string;
}

export interface Review {
  id: UUID;
  appointmentId: UUID;
  clientUserId: UUID;
  barberUserId: UUID;
  rating: number;
  text: string;
  createdAt: string;
  client?: User;
}

export interface InventoryProduct {
  id: UUID;
  shopId: UUID;
  sku: string;
  name: string;
  description: string;
  priceCents: number;
  stockOnHand: number;
  reorderThreshold: number;
  active: boolean;
  imageUrl?: string;
}

export interface Promotion {
  id: UUID;
  shopId: UUID;
  code: string;
  type: 'percent' | 'fixed';
  amount: number;
  startAt: string;
  endAt: string;
  usageLimit: number;
  perUserLimit: number;
}

export interface SearchFilters {
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
  specialties?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  date?: string;
  time?: string;
  availability?: boolean;
}

export interface BarberWithDistance extends Barber {
  distance?: number;
  shop?: Shop;
  location?: Location;
  membership?: BarberShopMembership;
  nextAvailableSlot?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface BookingState {
  barber?: BarberWithDistance;
  selectedServices: Service[];
  selectedDate?: string;
  selectedTimeSlot?: TimeSlot;
  totalCents: number;
  depositCents: number;
}

export interface BusinessAnalytics {
  totalRevenue: number;
  totalAppointments: number;
  averageRating: number;
  repeatClientRate: number;
  noShowRate: number;
  popularServices: Array<{
    service: Service;
    count: number;
    revenue: number;
  }>;
  revenueByDay: Array<{
    date: string;
    revenue: number;
    appointments: number;
  }>;
}

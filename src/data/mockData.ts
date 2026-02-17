/**
 * Mock data for BarberHub
 * Premium, realistic data with Unsplash images
 */

import { 
  Barber, 
  Shop, 
  Location, 
  Service, 
  Appointment, 
  Review, 
  InventoryProduct,
  BarberShopMembership,
  BarberWithDistance 
} from '../types';

// Mock Users and Barbers
export const mockBarbers: BarberWithDistance[] = [
  {
    barberId: 'b1',
    bio: 'Master barber specializing in precision fades and classic cuts. 15+ years transforming looks and building confidence. Your hair is my canvas.',
    specialties: ['Skin Fade', 'Taper Fade', 'Beard Sculpting', 'Hot Towel Shave', 'Kids Cuts'],
    languages: ['English', 'Spanish'],
    yearsExperience: 15,
    instagramHandle: '@marcuscuts',
    portfolioCoverUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800',
    verificationStatus: 'verified',
    ratingAvg: 4.9,
    ratingCount: 347,
    user: {
      id: 'u1',
      displayName: 'Marcus Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      email: 'marcus@barberhub.com',
      roleFlags: { isClient: false, isBarber: true, isOwner: true },
      createdAt: '2023-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    portfolioImages: [
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800',
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800',
      'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800',
      'https://images.unsplash.com/photo-1632781297772-1d68f375d878?w=800',
    ],
    distance: 0.8,
    nextAvailableSlot: '2026-02-17T14:00:00Z',
  },
  {
    barberId: 'b2',
    bio: 'Creating signature styles for the modern gentleman. Expert in textured cuts, lineups, and beard artistry. Walk-ins welcome.',
    specialties: ['Textured Cuts', 'Lineup', 'Beard Design', 'Color Services', 'Hair Tattoos'],
    languages: ['English', 'French'],
    yearsExperience: 8,
    instagramHandle: '@jaylinesbarber',
    portfolioCoverUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800',
    verificationStatus: 'verified',
    ratingAvg: 4.8,
    ratingCount: 256,
    user: {
      id: 'u2',
      displayName: 'Jay Martinez',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      email: 'jay@barberhub.com',
      roleFlags: { isClient: false, isBarber: true, isOwner: false },
      createdAt: '2023-06-20T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    portfolioImages: [
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800',
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800',
      'https://images.unsplash.com/photo-1620122455315-0e6f832aee1e?w=800',
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800',
      'https://images.unsplash.com/photo-1627481391841-9dc857f2b0a6?w=800',
      'https://images.unsplash.com/photo-1619199363537-1616f0ad7ae9?w=800',
    ],
    distance: 1.2,
    nextAvailableSlot: '2026-02-17T15:30:00Z',
  },
  {
    barberId: 'b3',
    bio: 'Traditional barbering meets contemporary style. Passionate about classic techniques and modern trends. Every cut tells a story.',
    specialties: ['Classic Cuts', 'Pompadour', 'Undercut', 'Straight Razor', 'Scalp Treatments'],
    languages: ['English', 'Italian'],
    yearsExperience: 12,
    instagramHandle: '@deandrocuts',
    portfolioCoverUrl: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800',
    verificationStatus: 'verified',
    ratingAvg: 4.95,
    ratingCount: 412,
    user: {
      id: 'u3',
      displayName: 'DeAndre Williams',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      email: 'deandre@barberhub.com',
      roleFlags: { isClient: false, isBarber: true, isOwner: false },
      createdAt: '2022-03-10T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    portfolioImages: [
      'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800',
      'https://images.unsplash.com/photo-1632781297772-1d68f375d878?w=800',
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800',
      'https://images.unsplash.com/photo-1620122455315-0e6f832aee1e?w=800',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800',
    ],
    distance: 2.1,
    nextAvailableSlot: '2026-02-17T13:00:00Z',
  },
  {
    barberId: 'b4',
    bio: 'Award-winning barber with a passion for creative styling. Specializing in fashion-forward cuts and color transformations.',
    specialties: ['Fashion Cuts', 'Color Expert', 'Curly Hair', 'Loc Maintenance', 'Perms'],
    languages: ['English', 'Portuguese'],
    yearsExperience: 10,
    instagramHandle: '@alexstyles',
    portfolioCoverUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800',
    verificationStatus: 'verified',
    ratingAvg: 4.85,
    ratingCount: 289,
    user: {
      id: 'u4',
      displayName: 'Alex Santos',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
      email: 'alex@barberhub.com',
      roleFlags: { isClient: false, isBarber: true, isOwner: false },
      createdAt: '2023-02-28T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    portfolioImages: [
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800',
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800',
      'https://images.unsplash.com/photo-1627481391841-9dc857f2b0a6?w=800',
      'https://images.unsplash.com/photo-1619199363537-1616f0ad7ae9?w=800',
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800',
      'https://images.unsplash.com/photo-1620122455315-0e6f832aee1e?w=800',
    ],
    distance: 3.5,
    nextAvailableSlot: '2026-02-17T16:00:00Z',
  },
];

// Mock Shops
export const mockShops: Shop[] = [
  {
    id: 's1',
    ownerUserId: 'u1',
    name: 'Northside Studio',
    brandSlug: 'northside-studio',
    description: 'Premium barbershop serving the community since 2010. Experience the art of grooming.',
    supportPhone: '+1-416-555-0100',
    timezone: 'America/Toronto',
    createdAt: '2010-05-01T10:00:00Z',
    logoUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400',
    coverImageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200',
  },
  {
    id: 's2',
    ownerUserId: 'u2',
    name: 'Downtown Fades',
    brandSlug: 'downtown-fades',
    description: 'Modern barbershop in the heart of the city. Walk-ins and appointments welcome.',
    supportPhone: '+1-416-555-0200',
    timezone: 'America/Toronto',
    createdAt: '2018-03-15T10:00:00Z',
    logoUrl: 'https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=400',
    coverImageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200',
  },
];

// Mock Locations
export const mockLocations: Location[] = [
  {
    id: 'l1',
    shopId: 's1',
    addressLine1: '123 Queen Street West',
    city: 'Toronto',
    region: 'Ontario',
    country: 'CA',
    postalCode: 'M5H 2M9',
    lat: 43.6532,
    lng: -79.3832,
  },
  {
    id: 'l2',
    shopId: 's2',
    addressLine1: '456 King Street East',
    city: 'Toronto',
    region: 'Ontario',
    country: 'CA',
    postalCode: 'M5A 1L1',
    lat: 43.6520,
    lng: -79.3700,
  },
];

// Mock Services
export const mockServices: Service[] = [
  {
    id: 'svc1',
    shopId: 's1',
    name: 'Signature Fade',
    description: 'Our most popular cut. Precision fade with styling.',
    durationMinutes: 45,
    priceCents: 4500,
    currency: 'CAD',
    isAddon: false,
    active: true,
    createdAt: '2023-01-01T10:00:00Z',
  },
  {
    id: 'svc2',
    shopId: 's1',
    name: 'Beard Trim & Shape',
    description: 'Professional beard grooming with hot towel treatment.',
    durationMinutes: 30,
    priceCents: 3000,
    currency: 'CAD',
    isAddon: false,
    active: true,
    createdAt: '2023-01-01T10:00:00Z',
  },
  {
    id: 'svc3',
    shopId: 's1',
    name: 'Hot Towel Shave',
    description: 'Traditional straight razor shave with premium products.',
    durationMinutes: 40,
    priceCents: 5500,
    currency: 'CAD',
    isAddon: false,
    active: true,
    createdAt: '2023-01-01T10:00:00Z',
  },
  {
    id: 'svc4',
    shopId: 's1',
    name: 'Kids Cut (12 & under)',
    description: 'Professional haircut for children in a fun environment.',
    durationMinutes: 30,
    priceCents: 3500,
    currency: 'CAD',
    isAddon: false,
    active: true,
    createdAt: '2023-01-01T10:00:00Z',
  },
  {
    id: 'svc5',
    shopId: 's1',
    name: 'Hair Tattoo Design',
    description: 'Custom hair design or pattern.',
    durationMinutes: 20,
    priceCents: 2000,
    currency: 'CAD',
    isAddon: true,
    active: true,
    createdAt: '2023-01-01T10:00:00Z',
  },
  {
    id: 'svc6',
    shopId: 's1',
    name: 'Scalp Treatment',
    description: 'Revitalizing scalp massage and treatment.',
    durationMinutes: 15,
    priceCents: 1500,
    currency: 'CAD',
    isAddon: true,
    active: true,
    createdAt: '2023-01-01T10:00:00Z',
  },
];

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: 'r1',
    appointmentId: 'a1',
    clientUserId: 'c1',
    barberUserId: 'b1',
    rating: 5,
    text: 'Best fade I\'ve ever gotten! Marcus really takes his time and pays attention to every detail. The shop is clean, professional, and the vibe is perfect. Will definitely be back.',
    createdAt: '2026-02-10T18:30:00Z',
    client: {
      id: 'c1',
      displayName: 'James Wilson',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      roleFlags: { isClient: true, isBarber: false, isOwner: false },
      createdAt: '2025-06-01T10:00:00Z',
      updatedAt: '2026-02-10T18:30:00Z',
    },
  },
  {
    id: 'r2',
    appointmentId: 'a2',
    clientUserId: 'c2',
    barberUserId: 'b1',
    rating: 5,
    text: 'Marcus is a true professional. He listens to what you want and delivers every time. The hot towel shave is incredible - you can tell he uses premium products.',
    createdAt: '2026-02-08T15:20:00Z',
    client: {
      id: 'c2',
      displayName: 'David Chen',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      roleFlags: { isClient: true, isBarber: false, isOwner: false },
      createdAt: '2025-08-15T10:00:00Z',
      updatedAt: '2026-02-08T15:20:00Z',
    },
  },
  {
    id: 'r3',
    appointmentId: 'a3',
    clientUserId: 'c3',
    barberUserId: 'b1',
    rating: 5,
    text: 'I\'ve been going to Marcus for 2 years now and wouldn\'t trust anyone else with my hair. Consistent quality, great conversation, and always on time.',
    createdAt: '2026-02-05T12:00:00Z',
    client: {
      id: 'c3',
      displayName: 'Michael Brown',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
      roleFlags: { isClient: true, isBarber: false, isOwner: false },
      createdAt: '2024-02-05T10:00:00Z',
      updatedAt: '2026-02-05T12:00:00Z',
    },
  },
  {
    id: 'r4',
    appointmentId: 'a4',
    clientUserId: 'c4',
    barberUserId: 'b1',
    rating: 4,
    text: 'Great cut and service. Only small wait time but totally worth it. The attention to detail is impressive.',
    createdAt: '2026-02-01T16:45:00Z',
    client: {
      id: 'c4',
      displayName: 'Robert Taylor',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
      roleFlags: { isClient: true, isBarber: false, isOwner: false },
      createdAt: '2025-11-20T10:00:00Z',
      updatedAt: '2026-02-01T16:45:00Z',
    },
  },
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: 'a_upcoming_1',
    clientUserId: 'current_user',
    barberUserId: 'b1',
    shopId: 's1',
    locationId: 'l1',
    status: 'confirmed',
    startAt: '2026-02-18T14:00:00Z',
    endAt: '2026-02-18T14:45:00Z',
    quotedTotalCents: 4500,
    appliedDiscountCents: 0,
    createdAt: '2026-02-15T10:00:00Z',
    barber: mockBarbers[0],
    shop: mockShops[0],
    location: mockLocations[0],
    services: [
      {
        id: 'ali1',
        appointmentId: 'a_upcoming_1',
        serviceId: 'svc1',
        name: 'Signature Fade',
        durationMinutes: 45,
        priceCents: 4500,
      },
    ],
  },
  {
    id: 'a_past_1',
    clientUserId: 'current_user',
    barberUserId: 'b2',
    shopId: 's2',
    locationId: 'l2',
    status: 'completed',
    startAt: '2026-01-15T16:00:00Z',
    endAt: '2026-01-15T16:45:00Z',
    quotedTotalCents: 7500,
    appliedDiscountCents: 0,
    createdAt: '2026-01-12T10:00:00Z',
    barber: mockBarbers[1],
    shop: mockShops[1],
    location: mockLocations[1],
    services: [
      {
        id: 'ali2',
        appointmentId: 'a_past_1',
        serviceId: 'svc1',
        name: 'Signature Fade',
        durationMinutes: 45,
        priceCents: 4500,
      },
      {
        id: 'ali3',
        appointmentId: 'a_past_1',
        serviceId: 'svc2',
        name: 'Beard Trim & Shape',
        durationMinutes: 30,
        priceCents: 3000,
      },
    ],
  },
];

// Mock Inventory Products
export const mockProducts: InventoryProduct[] = [
  {
    id: 'p1',
    shopId: 's1',
    sku: 'POM-001',
    name: 'Premium Matte Pomade',
    description: 'Strong hold, matte finish pomade for all-day styling.',
    priceCents: 2800,
    stockOnHand: 24,
    reorderThreshold: 10,
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=600',
  },
  {
    id: 'p2',
    shopId: 's1',
    sku: 'BO-001',
    name: 'Signature Beard Oil',
    description: 'Nourishing blend of natural oils for healthy beard growth.',
    priceCents: 3200,
    stockOnHand: 18,
    reorderThreshold: 8,
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600',
  },
  {
    id: 'p3',
    shopId: 's1',
    sku: 'SC-001',
    name: 'Styling Clay',
    description: 'Medium hold clay for textured, natural looks.',
    priceCents: 2600,
    stockOnHand: 15,
    reorderThreshold: 10,
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600',
  },
];

// Utility function to format price
export const formatPrice = (cents: number, currency: string = 'CAD'): string => {
  const amount = cents / 100;
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Generate time slots
export const generateTimeSlots = (date: Date): string[] => {
  const slots: string[] = [];
  const startHour = 9; // 9 AM
  const endHour = 20; // 8 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = new Date(date);
      time.setHours(hour, minute, 0, 0);
      slots.push(time.toISOString());
    }
  }
  
  return slots;
};

export default {
  mockBarbers,
  mockShops,
  mockLocations,
  mockServices,
  mockReviews,
  mockAppointments,
  mockProducts,
  formatPrice,
  generateTimeSlots,
};

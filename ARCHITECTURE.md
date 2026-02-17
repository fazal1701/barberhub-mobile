# BarberHub - Technical Architecture & Implementation Guide

## 🏛️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Mobile Clients                       │
│            iOS (Swift) | Android (Kotlin)                │
│               React Native + Expo                        │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ REST/GraphQL APIs
                      │
┌─────────────────────▼───────────────────────────────────┐
│                   API Gateway                            │
│              (Rate limiting, Auth, Routing)              │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Auth    │  │ Booking  │  │ Payment  │
│ Service  │  │ Service  │  │ Service  │
└──────────┘  └──────────┘  └──────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│PostgreSQL│  │  Redis   │  │   S3     │
│          │  │  Cache   │  │ Storage  │
└──────────┘  └──────────┘  └──────────┘
```

---

## 🗄️ Database Schema (PostgreSQL)

### Core Tables

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  phone_e164 VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255),
  display_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role_flags JSONB DEFAULT '{"is_client": false, "is_barber": false, "is_owner": false}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_e164);
```

#### barbers
```sql
CREATE TABLE barbers (
  barber_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  years_experience INTEGER DEFAULT 0,
  instagram_handle VARCHAR(255),
  portfolio_cover_url TEXT,
  verification_status VARCHAR(20) DEFAULT 'unverified' 
    CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  rating_avg NUMERIC(3,2) DEFAULT 0.00,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_barbers_verification ON barbers(verification_status);
CREATE INDEX idx_barbers_rating ON barbers(rating_avg DESC);
```

#### shops
```sql
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  brand_slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  support_phone VARCHAR(20),
  timezone VARCHAR(50) DEFAULT 'America/Toronto',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shops_owner ON shops(owner_user_id);
CREATE INDEX idx_shops_slug ON shops(brand_slug);
```

#### locations
```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  region VARCHAR(100) NOT NULL,
  country CHAR(2) NOT NULL,
  postal_code VARCHAR(20),
  lat NUMERIC(9,6),
  lng NUMERIC(9,6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE INDEX idx_locations_geography ON locations USING GIST(
  geography(ST_MakePoint(lng, lat))
);
```

#### services
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  currency CHAR(3) DEFAULT 'CAD',
  is_addon BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_shop ON services(shop_id);
CREATE INDEX idx_services_active ON services(active);
```

#### appointments
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  barber_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'draft' 
    CHECK (status IN ('draft', 'confirmed', 'checked_in', 'completed', 'canceled', 'no_show', 'disputed')),
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  quoted_total_cents INTEGER NOT NULL,
  applied_discount_cents INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent double booking
  CONSTRAINT no_overlap EXCLUDE USING gist (
    barber_user_id WITH =,
    tstzrange(start_at, end_at) WITH &&
  ) WHERE (status NOT IN ('canceled', 'no_show'))
);

CREATE INDEX idx_appointments_client ON appointments(client_user_id);
CREATE INDEX idx_appointments_barber ON appointments(barber_user_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_start_at ON appointments(start_at);
```

#### payments
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  provider VARCHAR(20) CHECK (provider IN ('stripe', 'square', 'adyen')),
  provider_payment_id VARCHAR(255) UNIQUE,
  status VARCHAR(20) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'authorized', 'captured', 'refunded', 'failed')),
  amount_cents INTEGER NOT NULL,
  type VARCHAR(20) CHECK (type IN ('deposit', 'final', 'tip', 'no_show_fee')),
  captured_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_appointment ON payments(appointment_id);
CREATE INDEX idx_payments_status ON payments(status);
```

#### reviews
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  client_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  barber_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_barber ON reviews(barber_user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
```

---

## 🔐 Authentication & Authorization

### JWT Token Structure
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "roles": ["client", "barber"],
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Role-Based Access Control (RBAC)

| Resource | Client | Barber | Owner | Admin |
|----------|--------|--------|-------|-------|
| View barbers | ✅ | ✅ | ✅ | ✅ |
| Book appointment | ✅ | ❌ | ❌ | ✅ |
| Manage schedule | ❌ | ✅ | ✅ | ✅ |
| View analytics | ❌ | Own | Own | ✅ |
| Manage services | ❌ | ❌ | ✅ | ✅ |

---

## 📡 API Design

### RESTful Endpoints

#### Discovery
```
GET /api/v1/barbers
  ?lat=43.6532&lng=-79.3832
  &radius=5
  &specialties=Skin+Fade,Taper
  &available_date=2026-02-17
  &rating_min=4.5
  &sort=distance

Response:
{
  "data": [...],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 20
  }
}
```

#### Barber Profile
```
GET /api/v1/barbers/:barberId

Response:
{
  "id": "uuid",
  "user": {...},
  "bio": "...",
  "specialties": [...],
  "portfolio_images": [...],
  "rating_avg": 4.9,
  "rating_count": 347,
  "reviews": [...],
  "services": [...],
  "next_available_slot": "2026-02-17T14:00:00Z"
}
```

#### Availability
```
GET /api/v1/barbers/:barberId/availability
  ?date=2026-02-17
  &duration=45

Response:
{
  "date": "2026-02-17",
  "slots": [
    {
      "start_time": "2026-02-17T09:00:00Z",
      "end_time": "2026-02-17T09:45:00Z",
      "available": true
    },
    ...
  ]
}
```

#### Booking Creation
```
POST /api/v1/appointments

Body:
{
  "barber_id": "uuid",
  "service_ids": ["uuid1", "uuid2"],
  "start_at": "2026-02-17T14:00:00Z",
  "payment_method_id": "pm_xxx"
}

Response:
{
  "appointment": {...},
  "payment": {
    "deposit_cents": 900,
    "status": "captured"
  },
  "confirmation_code": "BH-ABC123"
}
```

---

## 💳 Payment Integration (Stripe Connect)

### Flow Diagram
```
Client → Platform → Barber/Shop
  $45      $9       $36 - $4.50 (10% fee)
          (deposit) (remaining balance + payout)
```

### Implementation
```typescript
// 1. Create Payment Intent (Deposit)
const paymentIntent = await stripe.paymentIntents.create({
  amount: 900, // $9.00 deposit
  currency: 'cad',
  payment_method: paymentMethodId,
  confirmation_method: 'manual',
  capture_method: 'automatic',
  metadata: {
    appointment_id: appointmentId,
    type: 'deposit'
  }
});

// 2. Capture Remaining Balance (At appointment completion)
const finalPayment = await stripe.paymentIntents.create({
  amount: 3600, // $36.00 remaining
  currency: 'cad',
  payment_method: savedPaymentMethodId,
  transfer_data: {
    destination: barberStripeAccountId, // Connected account
  },
  application_fee_amount: 450, // $4.50 platform fee (10%)
});

// 3. Handle Cancellation Refund
const refund = await stripe.refunds.create({
  payment_intent: paymentIntentId,
  amount: 900, // Full deposit refund if > 24hrs notice
});
```

---

## 🔍 Search & Discovery

### Elasticsearch Index Mapping
```json
{
  "mappings": {
    "properties": {
      "barber_id": { "type": "keyword" },
      "display_name": { 
        "type": "text",
        "analyzer": "standard"
      },
      "specialties": { "type": "keyword" },
      "location": { "type": "geo_point" },
      "rating_avg": { "type": "float" },
      "years_experience": { "type": "integer" },
      "availability_slots": {
        "type": "nested",
        "properties": {
          "start_time": { "type": "date" },
          "end_time": { "type": "date" }
        }
      }
    }
  }
}
```

### Search Query
```json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "specialties": "Skin Fade" } }
      ],
      "filter": [
        {
          "geo_distance": {
            "distance": "5km",
            "location": { "lat": 43.6532, "lon": -79.3832 }
          }
        },
        { "range": { "rating_avg": { "gte": 4.5 } } }
      ]
    }
  },
  "sort": [
    {
      "_geo_distance": {
        "location": { "lat": 43.6532, "lon": -79.3832 },
        "order": "asc",
        "unit": "km"
      }
    }
  ]
}
```

---

## 📊 Analytics & Business Intelligence

### Key Metrics to Track

#### Client Metrics
- **Conversion Funnel**: Discovery → Profile → Booking → Completion
- **Retention**: Repeat booking rate, time between bookings
- **Satisfaction**: Average rating, review sentiment

#### Barber Metrics
- **Revenue**: Daily/weekly/monthly totals, trends
- **Utilization**: Booked hours / available hours
- **No-shows**: Rate, lost revenue
- **Client Base**: New vs. repeat, average lifetime value

#### Platform Metrics
- **GMV** (Gross Merchandise Value): Total booking value
- **Take Rate**: Platform fee as % of GMV
- **Active Barbers**: Daily/monthly active
- **Supply/Demand Balance**: Booking request fulfillment rate

### Event Tracking (Mixpanel/Amplitude)
```typescript
// Client events
track('Barber Profile Viewed', {
  barber_id: 'uuid',
  source: 'search',
  position: 3
});

track('Booking Started', {
  barber_id: 'uuid',
  services: ['Signature Fade'],
  total_cents: 4500
});

track('Booking Completed', {
  appointment_id: 'uuid',
  deposit_cents: 900,
  time_to_convert: 180 // seconds
});

// Barber events
track('Appointment Accepted', {
  appointment_id: 'uuid',
  response_time: 300 // seconds
});
```

---

## 🚀 Deployment & Infrastructure

### Cloud Architecture (AWS Example)

```
┌─────────────┐
│ CloudFront  │ ← CDN for static assets
└──────┬──────┘
       │
┌──────▼──────┐
│   Route53   │ ← DNS management
└──────┬──────┘
       │
┌──────▼──────┐
│     ALB     │ ← Application Load Balancer
└──────┬──────┘
       │
┌──────▼──────┐
│  ECS/EKS    │ ← Container orchestration
│  (API)      │
└──────┬──────┘
       │
┌──────▼──────┐
│    RDS      │ ← PostgreSQL (Multi-AZ)
│ (PostgreSQL)│
└─────────────┘
```

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/barberhub
REDIS_URL=redis://host:6379

# Auth
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d

# Payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Storage
AWS_S3_BUCKET=barberhub-prod
AWS_REGION=us-east-1

# Search
ELASTICSEARCH_URL=https://search.example.com

# Notifications
TWILIO_ACCOUNT_SID=...
SENDGRID_API_KEY=...
```

---

## 🧪 Testing Strategy

### Unit Tests (Jest)
```typescript
describe('Booking Service', () => {
  it('calculates deposit correctly', () => {
    const totalCents = 4500;
    const depositCents = calculateDeposit(totalCents);
    expect(depositCents).toBe(900); // 20%
  });

  it('enforces cancellation policy', () => {
    const appointment = { start_at: '2026-02-17T14:00:00Z' };
    const cancelAt = '2026-02-16T12:00:00Z'; // >24hrs
    const refundEligible = canRefundDeposit(appointment, cancelAt);
    expect(refundEligible).toBe(true);
  });
});
```

### Integration Tests (Supertest)
```typescript
describe('POST /api/v1/appointments', () => {
  it('creates appointment with deposit', async () => {
    const response = await request(app)
      .post('/api/v1/appointments')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        barber_id: barberId,
        service_ids: [serviceId],
        start_at: '2026-02-17T14:00:00Z',
        payment_method_id: 'pm_test'
      });

    expect(response.status).toBe(201);
    expect(response.body.payment.deposit_cents).toBe(900);
  });
});
```

### E2E Tests (Detox)
```typescript
describe('Booking Flow', () => {
  it('completes full booking journey', async () => {
    await element(by.id('search-input')).typeText('Marcus');
    await element(by.id('barber-card-0')).tap();
    await element(by.id('book-now-button')).tap();
    await element(by.id('service-signature-fade')).tap();
    await element(by.id('continue-button')).tap();
    // ... continue through all steps
    await expect(element(by.text('Booking Confirmed'))).toBeVisible();
  });
});
```

---

## 🔒 Security Best Practices

### Input Validation
```typescript
import { z } from 'zod';

const createAppointmentSchema = z.object({
  barber_id: z.string().uuid(),
  service_ids: z.array(z.string().uuid()).min(1),
  start_at: z.string().datetime(),
  payment_method_id: z.string().startsWith('pm_')
});
```

### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use('/api/', apiLimiter);
```

### SQL Injection Prevention
```typescript
// ❌ BAD - String interpolation
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ GOOD - Parameterized queries
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [email]);
```

---

## 📈 Performance Optimization

### Caching Strategy

**Redis Cache Layers**:
```typescript
// 1. Barber profile (TTL: 5 minutes)
const barberProfile = await cache.get(`barber:${barberId}`);
if (!barberProfile) {
  barberProfile = await db.getBarberProfile(barberId);
  await cache.set(`barber:${barberId}`, barberProfile, { ttl: 300 });
}

// 2. Availability slots (TTL: 1 minute)
const slots = await cache.get(`availability:${barberId}:${date}`);
if (!slots) {
  slots = await calculateAvailability(barberId, date);
  await cache.set(`availability:${barberId}:${date}`, slots, { ttl: 60 });
}

// 3. Search results (TTL: 30 seconds)
const cacheKey = `search:${lat}:${lng}:${JSON.stringify(filters)}`;
```

### Database Indexing
```sql
-- Composite index for common queries
CREATE INDEX idx_appointments_barber_date 
ON appointments(barber_user_id, start_at DESC);

-- Partial index for active appointments
CREATE INDEX idx_appointments_active 
ON appointments(barber_user_id, start_at) 
WHERE status IN ('confirmed', 'checked_in');
```

### API Response Pagination
```typescript
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    has_more: boolean;
  };
}
```

---

## 📱 Mobile-Specific Considerations

### Offline-First Architecture
```typescript
// Store pending bookings locally
const offlineQueue = await AsyncStorage.getItem('offline_bookings');
const bookings = JSON.parse(offlineQueue || '[]');
bookings.push(newBooking);
await AsyncStorage.setItem('offline_bookings', JSON.stringify(bookings));

// Sync when online
NetInfo.addEventListener(state => {
  if (state.isConnected) {
    syncOfflineBookings();
  }
});
```

### Image Optimization
```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: barber.portfolioCoverUrl }}
  placeholder={blurhash}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk" // Cache strategy
/>
```

### Push Notifications (Expo)
```typescript
import * as Notifications from 'expo-notifications';

// Schedule appointment reminder
await Notifications.scheduleNotificationAsync({
  content: {
    title: 'Appointment Reminder',
    body: 'Your appointment with Marcus is in 2 hours',
    data: { appointmentId }
  },
  trigger: {
    date: new Date(appointmentStartTime - 2 * 60 * 60 * 1000) // 2 hours before
  }
});
```

---

<div align="center">
  <p>Technical architecture designed for scale and performance</p>
  <p>Built with best practices and modern tech stack</p>
</div>

# FeedbackLoop Development Guide

This document provides detailed information about the FeedbackLoop project architecture, development workflow, and technical decisions.

## 📚 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Structure](#component-structure)
3. [API Design](#api-design)
4. [Database Design](#database-design)
5. [Development Workflow](#development-workflow)
6. [Testing](#testing)
7. [Performance Optimization](#performance-optimization)
8. [Security](#security)

## 🏗️ Architecture Overview

FeedbackLoop follows a modern full-stack architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│  (React Components, Next.js Pages, shadcn/ui)           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    API Layer                             │
│  (Next.js API Routes, Route Handlers)                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Database Layer                          │
│  (Prisma ORM, PostgreSQL)                               │
└─────────────────────────────────────────────────────────┘
```

### Key Principles

- **Separation of Concerns**: Clear separation between UI, API, and data layers
- **Type Safety**: Full TypeScript coverage for compile-time safety
- **Reusability**: Modular components and utilities
- **Scalability**: Database design supports growth
- **Performance**: Optimized queries and caching strategies

## 🧩 Component Structure

### Page Components

#### `/app/page.tsx` - Main Feedback Board
- Displays all feedback posts
- Implements filtering by category
- Implements sorting (Newest, Popular, Trending)
- Modal dialog for feedback submission
- Real-time updates after actions

**Key Features:**
- Server-side data fetching
- Client-side state management for filters
- Responsive grid layout
- Loading and empty states

#### `/app/admin/page.tsx` - Admin Dashboard
- Statistics overview (total, under-review, planned, completed, rejected)
- Feedback filtering by status
- Status management interface
- Real-time stats updates

**Key Features:**
- Admin-only access (future: add auth)
- Status change functionality
- Comprehensive statistics
- Responsive card layout

### UI Components

#### `FeedbackForm.tsx`
**Purpose**: Handles feedback submission

**Features:**
- Form validation with Zod
- React Hook Form integration
- Category selection dropdown
- Author information collection
- Error handling and toast notifications

**Props:**
```typescript
interface FeedbackFormProps {
  onSuccess?: () => void
}
```

#### `FeedbackCard.tsx`
**Purpose**: Displays individual feedback post in board view

**Features:**
- Vote buttons (upvote/downvote)
- Category and status badges
- Comment count display
- Click to view details
- Responsive layout

**Props:**
```typescript
interface FeedbackCardProps {
  post: FeedbackPost
  onVoteChange?: () => void
}
```

#### `FeedbackDetail.tsx`
**Purpose**: Shows full feedback details with comments

**Features:**
- Full post information
- Comments section
- Comment submission form
- Vote display
- Real-time comment loading

**Props:**
```typescript
interface FeedbackDetailProps {
  postId: string
  onClose?: () => void
}
```

#### `AdminFeedbackCard.tsx`
**Purpose**: Admin view of feedback with status management

**Features:**
- Status dropdown selector
- Vote and comment statistics
- Category and status badges
- Responsive grid layout

**Props:**
```typescript
interface AdminFeedbackCardProps {
  post: FeedbackPost
  onStatusChange: (postId: string, newStatus: string) => void
}
```

## 🔌 API Design

### RESTful Endpoints

All endpoints follow REST conventions with proper HTTP methods and status codes.

#### Feedback Endpoints

**GET /api/feedback**
- List all feedback posts
- Query Parameters:
  - `category`: Filter by category (feature-request, bug-report, improvement, other)
  - `status`: Filter by status (under-review, planned, completed, rejected)
  - `sort`: Sort order (newest, popular, trending)
- Response: Array of FeedbackPost objects

**POST /api/feedback**
- Create new feedback post
- Body:
  ```json
  {
    "title": "string",
    "description": "string",
    "category": "feature-request|bug-report|improvement|other",
    "authorId": "string"
  }
  ```
- Response: Created FeedbackPost object

**GET /api/feedback/[id]**
- Get detailed feedback post with comments
- Response: FeedbackPost with related comments and votes

**PATCH /api/feedback/[id]**
- Update feedback post (status, category)
- Body:
  ```json
  {
    "status": "under-review|planned|completed|rejected",
    "category": "feature-request|bug-report|improvement|other"
  }
  ```
- Response: Updated FeedbackPost object

**DELETE /api/feedback/[id]**
- Delete feedback post
- Response: Deleted FeedbackPost object

#### Vote Endpoints

**POST /api/votes**
- Create or toggle a vote
- Body:
  ```json
  {
    "postId": "string",
    "userId": "string",
    "type": "upvote|downvote"
  }
  ```
- Logic:
  - Same vote type: removes the vote
  - Different vote type: changes the vote
  - New vote: creates the vote
- Response: Updated vote counts

#### Comment Endpoints

**POST /api/comments**
- Create a comment
- Body:
  ```json
  {
    "postId": "string",
    "authorId": "string",
    "content": "string"
  }
  ```
- Response: Created Comment object

**PATCH /api/comments/[id]**
- Update a comment
- Body:
  ```json
  {
    "content": "string"
  }
  ```
- Response: Updated Comment object

**DELETE /api/comments/[id]**
- Delete a comment
- Response: Deleted Comment object

#### User Endpoints

**POST /api/users**
- Create or retrieve a user
- Body:
  ```json
  {
    "email": "string",
    "name": "string"
  }
  ```
- Response: User object

### Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "status": 400
}
```

Common status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `404`: Not Found
- `500`: Server Error

## 🗄️ Database Design

### Schema Overview

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  isAdmin   Boolean  @default(false)
  posts     FeedbackPost[]
  votes     Vote[]
  comments  Comment[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model FeedbackPost {
  id          String   @id @default(cuid())
  title       String
  description String
  category    String   // feature-request, bug-report, improvement, other
  status      String   @default("under-review")
  upvotes     Int      @default(0)
  downvotes   Int      @default(0)
  author      User     @relation(fields: [authorId], references: [id])
  authorId    String
  votes       Vote[]
  comments    Comment[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Vote {
  id        String   @id @default(cuid())
  type      String   // upvote, downvote
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  post      FeedbackPost @relation(fields: [postId], references: [id])
  postId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, postId])
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  post      FeedbackPost @relation(fields: [postId], references: [id])
  postId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Key Design Decisions

1. **Vote Uniqueness**: `@@unique([userId, postId])` ensures one vote per user per post
2. **Vote Counts**: Stored as integers on FeedbackPost for fast queries
3. **Timestamps**: All models include `createdAt` and `updatedAt` for audit trails
4. **Relationships**: Proper foreign keys for data integrity
5. **Cascading**: Delete operations cascade to related records

## 🔄 Development Workflow

### Local Development

1. **Start PostgreSQL**
```bash
# Ensure PostgreSQL is running
psql -h localhost -U postgres
```

2. **Set up environment**
```bash
cp .env.example .env.local
# Edit .env.local with your database URL
```

3. **Run migrations**
```bash
npx prisma migrate dev
```

4. **Start dev server**
```bash
npm run dev
```

5. **Access application**
- Main board: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin

### Database Migrations

**Create a new migration:**
```bash
npx prisma migrate dev --name add_new_field
```

**View migration status:**
```bash
npx prisma migrate status
```

**Reset database (development only):**
```bash
npx prisma migrate reset
```

### Code Organization

```
src/
├── app/
│   ├── api/
│   │   ├── feedback/
│   │   │   ├── route.ts       # GET, POST
│   │   │   └── [id]/
│   │   │       └── route.ts   # GET, PATCH, DELETE
│   │   ├── votes/
│   │   │   └── route.ts       # POST
│   │   ├── comments/
│   │   │   ├── route.ts       # POST
│   │   │   └── [id]/
│   │   │       └── route.ts   # PATCH, DELETE
│   │   └── users/
│   │       └── route.ts       # POST
│   ├── admin/
│   │   └── page.tsx           # Admin dashboard
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main board
├── components/
│   ├── FeedbackForm.tsx
│   ├── FeedbackCard.tsx
│   ├── FeedbackDetail.tsx
│   ├── AdminFeedbackCard.tsx
│   └── ui/                    # shadcn/ui components
├── lib/
│   └── db.ts                  # Prisma client
└── prisma/
    └── schema.prisma          # Database schema
```

## 🧪 Testing

### Unit Testing (Future)

```bash
npm run test
```

### Integration Testing (Future)

```bash
npm run test:integration
```

### E2E Testing (Future)

```bash
npm run test:e2e
```

## ⚡ Performance Optimization

### Database Optimization

1. **Indexes**: Add indexes on frequently queried fields
```prisma
model FeedbackPost {
  @@index([category])
  @@index([status])
  @@index([authorId])
}
```

2. **Query Optimization**: Use Prisma's `select` and `include` strategically
```typescript
const post = await prisma.feedbackPost.findUnique({
  where: { id: postId },
  include: {
    author: true,
    comments: {
      include: { author: true }
    },
    votes: true
  }
})
```

3. **Pagination**: Implement for large datasets
```typescript
const posts = await prisma.feedbackPost.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize
})
```

### Frontend Optimization

1. **Code Splitting**: Next.js automatically splits code
2. **Image Optimization**: Use Next.js Image component
3. **Lazy Loading**: Load components on demand
4. **Memoization**: Use React.memo for expensive components

### Caching Strategy

1. **Server-side**: Cache API responses
2. **Client-side**: Use React Query or SWR (future)
3. **Database**: Implement Redis caching (future)

## 🔒 Security

### Input Validation

All inputs validated with Zod schemas:
```typescript
const feedbackSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(5000),
  category: z.enum(['feature-request', 'bug-report', 'improvement', 'other']),
})
```

### SQL Injection Prevention

Prisma ORM prevents SQL injection through parameterized queries.

### CORS Configuration

Configure CORS headers in API routes:
```typescript
headers: {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL,
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE',
}
```

### Authentication (Future)

Implement NextAuth.js for user authentication:
```typescript
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const session = await getServerSession(authOptions)
```

### Rate Limiting (Future)

Implement rate limiting to prevent abuse:
```typescript
import { Ratelimit } from "@upstash/ratelimit"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
})
```

## 📊 Monitoring & Logging

### Error Tracking (Future)

Integrate Sentry for error tracking:
```typescript
import * as Sentry from "@sentry/nextjs"

Sentry.captureException(error)
```

### Analytics (Future)

Integrate analytics to track user behavior:
```typescript
import { analytics } from "@/lib/analytics"

analytics.track('feedback_submitted', {
  category: feedback.category,
  timestamp: new Date()
})
```

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Build succeeds without errors
- [ ] All tests passing
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Error tracking configured
- [ ] Analytics configured
- [ ] Monitoring set up

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Last Updated**: November 2025

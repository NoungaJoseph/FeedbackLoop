# FeedbackLoop Quick Start Guide

Get FeedbackLoop up and running in 5 minutes! 🚀

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 12+ ([Download](https://www.postgresql.org/download/))
- Git ([Download](https://git-scm.com/))

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd feedbackloop
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
bun install
```

### 3. Create Database

```bash
# Create the database
createdb -h localhost feedbackloop

# Or using psql
psql -h localhost -U postgres
CREATE DATABASE feedbackloop;
\q
```

### 4. Configure Environment

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your database URL
# DATABASE_URL="postgresql://user:password@localhost:5432/feedbackloop"
```

### 5. Run Database Migrations

```bash
npx prisma migrate dev
```

This will:
- Create all database tables
- Set up relationships
- Create indexes

### 6. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`

## 🎯 First Steps

### Access the Application

1. **Main Board**: http://localhost:3000
   - View all feedback posts
   - Submit new feedback
   - Vote on posts
   - Comment on feedback

2. **Admin Dashboard**: http://localhost:3000/admin
   - View statistics
   - Manage feedback status
   - Filter by status

### Submit Your First Feedback

1. Click **"+ Submit Feedback"** button
2. Fill in the form:
   - Your Name
   - Email Address
   - Feedback Type (Feature Request, Bug Report, etc.)
   - Title
   - Description
3. Click **"Submit Feedback"**

### Vote on Feedback

1. Click the **👍 Upvote** or **👎 Downvote** button on any post
2. Click again to remove your vote
3. Change your vote by clicking the opposite button

### Comment on Feedback

1. Click on a feedback post to view details
2. Scroll to the comments section
3. Type your comment
4. Click **"Post Comment"**

### Manage Feedback (Admin)

1. Go to http://localhost:3000/admin
2. View statistics at the top
3. Use filter buttons to view specific statuses
4. Click the status dropdown on any feedback item to change its status

## 📁 Project Structure

```
feedbackloop/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── FeedbackForm.tsx
│   ├── FeedbackCard.tsx
│   ├── FeedbackDetail.tsx
│   └── AdminFeedbackCard.tsx
├── lib/                   # Utilities
│   └── db.ts             # Database client
├── prisma/               # Database
│   └── schema.prisma     # Database schema
└── public/               # Static files
```

## 🔧 Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npx prisma migrate dev

# View database in Prisma Studio
npx prisma studio

# Reset database (development only)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

## 🐛 Troubleshooting

### Database Connection Error

**Problem**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution**:
```bash
# Check if PostgreSQL is running
psql -h localhost -U postgres -c "SELECT 1"

# If not running, start PostgreSQL
# macOS with Homebrew:
brew services start postgresql

# Linux with systemd:
sudo systemctl start postgresql

# Windows:
# Start PostgreSQL from Services or use pgAdmin
```

### Port 3000 Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Use a different port
npm run dev -- -p 3001

# Or kill the process using port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Prisma Migration Error

**Problem**: `Error: P3005 Database does not exist`

**Solution**:
```bash
# Create the database
createdb -h localhost feedbackloop

# Then run migrations
npx prisma migrate dev
```

### Module Not Found Error

**Problem**: `Error: Cannot find module '@/components/...'`

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📚 Next Steps

1. **Read the Documentation**
   - [README.md](./README.md) - Project overview
   - [DEVELOPMENT.md](./DEVELOPMENT.md) - Architecture and design

2. **Explore the Code**
   - Check out `app/page.tsx` for the main board
   - Look at `app/admin/page.tsx` for the admin dashboard
   - Review API routes in `app/api/`

3. **Customize**
   - Update branding in `app/layout.tsx`
   - Modify colors in `tailwind.config.ts`
   - Add new features to components

4. **Deploy**
   - Deploy to [Vercel](https://vercel.com/) (recommended)
   - Or use Docker for self-hosting
   - See [README.md](./README.md#-deployment) for details

## 🆘 Need Help?

- Check [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed documentation
- Review [README.md](./README.md) for feature overview
- Check error messages in the browser console
- Review server logs in the terminal

## 🎉 You're Ready!

You now have a fully functional feedback management system. Start collecting feedback from your users!

---

**Happy Feedback Managing! 🚀**

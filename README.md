# FeedbackLoop 🎯

A comprehensive feedback management platform for businesses. FeedbackLoop allows users to submit feedback posts, vote on them (upvote/downvote), comment on posts, and provides an admin panel for categorizing and managing feedback.

## 🌟 Features

### User Features
- **Submit Feedback**: Users can submit feedback with title, description, category, and contact information
- **Vote on Feedback**: Upvote or downvote feedback posts to show support or disagreement
- **Comment on Posts**: Add comments to feedback posts to provide additional context or discussion
- **Filter & Sort**: Filter feedback by category (Features, Bugs, Improvements) and sort by newest, popular, or trending
- **Real-time Updates**: See changes instantly as votes and comments are added
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Admin Features
- **Admin Dashboard**: Comprehensive dashboard to manage all feedback
- **Status Management**: Change feedback status (Under Review, Planned, Completed, Rejected)
- **Statistics**: View real-time statistics on feedback distribution
- **Filtering**: Filter feedback by status to focus on specific items
- **Feedback Details**: View complete feedback information including all comments and votes

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 📋 Database Schema

### User
- `id`: Unique identifier
- `email`: User email address (unique)
- `name`: User name
- `isAdmin`: Admin flag
- `createdAt`, `updatedAt`: Timestamps

### FeedbackPost
- `id`: Unique identifier
- `title`: Feedback title
- `description`: Detailed feedback description
- `category`: Category (feature-request, bug-report, improvement, other)
- `status`: Status (under-review, planned, completed, rejected)
- `upvotes`: Count of upvotes
- `downvotes`: Count of downvotes
- `authorId`: Reference to User
- `createdAt`, `updatedAt`: Timestamps

### Vote
- `id`: Unique identifier
- `type`: Vote type (upvote, downvote)
- `userId`: Reference to User
- `postId`: Reference to FeedbackPost
- `createdAt`, `updatedAt`: Timestamps
- **Unique constraint**: One vote per user per post

### Comment
- `id`: Unique identifier
- `content`: Comment text
- `authorId`: Reference to User
- `postId`: Reference to FeedbackPost
- `createdAt`, `updatedAt`: Timestamps

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/bun
- PostgreSQL 12+

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd feedbackloop
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
bun install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your database configuration:
```
DATABASE_URL="postgresql://user:password@localhost:5432/feedbackloop"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Create the database**
```bash
createdb -h localhost feedbackloop
```

5. **Run Prisma migrations**
```bash
npx prisma migrate dev
```

6. **Start the development server**
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

7. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
feedbackloop/
├── app/
│   ├── api/
│   │   ├── feedback/          # Feedback CRUD endpoints
│   │   ├── votes/             # Voting endpoints
│   │   ├── comments/          # Comments endpoints
│   │   └── users/             # User management endpoints
│   ├── admin/
│   │   └── page.tsx           # Admin dashboard
│   ├── layout.tsx             # Root layout with metadata
│   └── page.tsx               # Main feedback board
├── components/
│   ├── FeedbackForm.tsx       # Feedback submission form
│   ├── FeedbackCard.tsx       # Feedback post card
│   ├── FeedbackDetail.tsx     # Detailed feedback view
│   ├── AdminFeedbackCard.tsx  # Admin feedback card
│   └── ui/                    # shadcn/ui components
├── lib/
│   └── db.ts                  # Prisma client
├── prisma/
│   └── schema.prisma          # Database schema
└── public/                    # Static assets
```

## 🔌 API Endpoints

### Feedback
- `GET /api/feedback` - List all feedback with optional filtering
- `POST /api/feedback` - Create new feedback
- `GET /api/feedback/[id]` - Get feedback details
- `PATCH /api/feedback/[id]` - Update feedback status
- `DELETE /api/feedback/[id]` - Delete feedback

### Votes
- `POST /api/votes` - Create or toggle a vote

### Comments
- `POST /api/comments` - Create a comment
- `PATCH /api/comments/[id]` - Update a comment
- `DELETE /api/comments/[id]` - Delete a comment

### Users
- `POST /api/users` - Create or retrieve a user

## 🎨 Design System

The application uses the **Asana Vibrant** design aesthetic with:
- **Primary Colors**: Blue (#3B82F6) and Purple (#A855F7)
- **Accent Colors**: Green (#10B981), Yellow (#F59E0B), Red (#EF4444)
- **Typography**: Clean, modern sans-serif fonts
- **Spacing**: Consistent 4px grid system
- **Shadows**: Subtle elevation shadows for depth

## 🔐 Security Considerations

- Input validation using Zod schemas
- SQL injection prevention through Prisma ORM
- CORS headers configured
- Environment variables for sensitive data
- Type-safe API routes with TypeScript

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Docker
```bash
docker build -t feedbackloop .
docker run -p 3000:3000 feedbackloop
```

### Manual
```bash
npm run build
npm start
```

## 📊 Performance

- **Server-side rendering** for optimal SEO
- **Incremental Static Regeneration** for fast page loads
- **Image optimization** with Next.js Image component
- **Code splitting** for smaller bundle sizes
- **Database query optimization** with Prisma

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql -h localhost -U postgres -c "SELECT 1"

# Reset database
npx prisma migrate reset
```

### Port Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/feedbackloop` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `FeedbackLoop` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Created with ❤️ for better feedback management

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

## 📞 Support

For support, email support@feedbackloop.com or open an issue on GitHub.

---

**Happy Feedback Managing! 🎉**

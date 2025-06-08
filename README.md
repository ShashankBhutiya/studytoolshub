<<<<<<< HEAD
# StudyToolsHub

A premium subscription platform for JEE/NEET students to discover and compare study tools.

## Features

- **Authentication**: Email/password login with 30-day free trial
- **Subscription**: Monthly billing (₹299/month) with mock payment system
- **Tools Directory**: 100+ categorized study tools with search, filters, and comparison
- **Community Forum**: Discussion boards with posts, comments, and likes
- **Admin Panel**: CRUD operations for tools and user management

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Storage**: File-based JSON storage (no database required)
- **Authentication**: NextAuth.js
- **Data Fetching**: React Query

## Setup Instructions

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd studytoolshub
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in the NextAuth secrets:
     \`\`\`
     NEXTAUTH_URL=http://localhost:3000
     NEXTAUTH_SECRET=your-nextauth-secret-here
     JWT_SECRET=your-jwt-secret-here
     \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Seed Sample Data** (Optional)
   - Visit `/api/tools/seed` to add sample study tools

6. **Admin Access**
   - Default admin credentials:
     - Email: admin@studytoolshub.com
     - Password: admin123

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Authentication pages
│   ├── (dashboard)/      # Protected dashboard pages
│   ├── api/             # API routes
│   └── globals.css      # Global styles
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── tools/           # Tool-related components
│   └── layout/          # Layout components
├── lib/
│   ├── file-db.ts       # File-based data storage
│   ├── auth.ts          # NextAuth configuration
│   └── utils.ts         # Utility functions
├── models/              # Model interfaces
└── types/               # TypeScript type definitions
```

## Key Features Implementation

### Authentication & Authorization
- NextAuth.js with credentials provider
- Role-based access (USER/ADMIN)
- Session management with JWT

### Subscription System
- 30-day free trial for new users
- Mock payment system
- Subscription status tracking

### Tools Directory
- Advanced search and filtering
- Tool comparison (max 4 tools)
- Category-based organization
- Responsive design

### Community Forum
- Create and view posts
- Like and comment system
- Category-based discussions
- Real-time updates with React Query

### Admin Features
- Tool management (CRUD operations)
- User management
- Analytics dashboard

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Tools
- `GET /api/tools` - Get tools with filters
- `POST /api/tools` - Create tool (admin only)
- `POST /api/tools/seed` - Seed sample data

### Community
- `GET /api/community/posts` - Get forum posts
- `POST /api/community/posts` - Create new post
- `POST /api/community/posts/[id]/like` - Toggle like

### Subscription
- `POST /api/subscription/mock-payment` - Process mock payment

## Deployment

1. **Build the application**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

## License

This project is licensed under the MIT License.
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> bf74304 (Initial commit from Create Next App)

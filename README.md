# ShopHub - Modern E-commerce Platform

A stunning, feature-rich e-commerce platform built with Next.js 15, TypeScript, and modern web technologies. This project showcases advanced web development capabilities and is perfect for portfolio demonstration.

## 🚀 Features

### Core Features
- **Modern UI/UX** with Framer Motion animations
- **Authentication System** with NextAuth.js (Google, GitHub, Email)
- **Admin Dashboard** with real-time analytics
- **Advanced Search** with filtering and sorting
- **Wishlist Management** with persistent storage
- **Shopping Cart** with real-time updates
- **Product Reviews** with image support
- **Responsive Design** for all devices
- **Dark Mode** support
- **Real-time Features** with WebSocket

### Technical Features
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Supabase** for database and authentication
- **Tailwind CSS** with shadcn/ui components
- **Framer Motion** for animations
- **TanStack Query** for data fetching
- **NextAuth.js** for authentication
- **Recharts** for data visualization
- **PWA** ready with offline support

### Admin Features
- **Dashboard Analytics** with charts and metrics
- **Product Management** with CRUD operations
- **Order Management** with status tracking
- **User Management** with role-based access
- **Sales Reports** with detailed analytics
- **Real-time Notifications** with WebSocket

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Framer Motion** - Animations
- **TanStack Query** - Data fetching
- **NextAuth.js** - Authentication
- **Recharts** - Charts

### Backend
- **Next.js API Routes** - Backend
- **Supabase** - Database & Auth
- **PostgreSQL** - Database
- **WebSocket** - Real-time features
- **Node.js** - Runtime

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **Supabase** - Database hosting

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shophub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   
   # OAuth Providers
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_ID=your_github_id
   GITHUB_SECRET=your_github_secret
   ```

4. **Set up Supabase database**
   ```bash
   # Apply the database schema
   psql -h your-db-host -U your-user -d your-db -f supabase-schema.sql
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Configure build command: `npm run build`
4. Configure start command: `npm start`

### Database (Supabase)
1. Create a new Supabase project
2. Run the SQL schema provided in `supabase-schema.sql`
3. Configure authentication providers
4. Set up Row Level Security (RLS) policies

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── search/            # Advanced search
│   ├── wishlist/          # Wishlist management
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── providers/         # Context providers
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helper functions
├── types/                # TypeScript definitions
└── hooks/                # Custom React hooks
```

## 🔐 Authentication

The app supports multiple authentication methods:
- **Google OAuth** - One-click sign-in
- **GitHub OAuth** - Developer-friendly
- **Email/Password** - Traditional authentication

### Demo Accounts
- **Admin**: `admin@example.com`
- **User**: `sarah@example.com`
- **User**: `mike@example.com`
- **User**: `emma@example.com`

## 🎨 UI/UX Features

### Animations
- **Page transitions** with Framer Motion
- **Hover effects** on interactive elements
- **Loading states** with skeleton screens
- **Micro-interactions** throughout

### Responsive Design
- **Mobile-first** approach
- **Touch-friendly** interface
- **Adaptive layouts** for all screen sizes
- **Optimized images** with Next.js Image

### Dark Mode
- **System preference** detection
- **Manual toggle** option
- **Persistent** user preference
- **Smooth transitions** between themes

## 📊 Analytics & Monitoring

### Admin Dashboard
- **Real-time metrics** with live updates
- **Sales analytics** with interactive charts
- **User engagement** tracking
- **Performance monitoring** with alerts

### Features
- **Revenue tracking** with breakdowns
- **Product performance** analytics
- **Customer behavior** insights
- **Conversion rate** optimization

## 🔍 Advanced Search

### Search Capabilities
- **Full-text search** across products
- **Category filtering** with multi-select
- **Price range** filtering with slider
- **Rating-based** filtering
- **Stock availability** filtering

### Sorting Options
- **Relevance** - Smart ranking
- **Price** - Low to high / High to low
- **Rating** - Highest rated first
- **Newest** - Latest additions
- **Bestselling** - Most popular

## 🛒 Shopping Features

### Cart Management
- **Real-time updates** with WebSocket
- **Persistent storage** across sessions
- **Quantity management** with validation
- **Price calculations** with tax

### Wishlist
- **Save for later** functionality
- **Share wishlist** with others
- **Stock notifications** for wishlist items
- **Price drop** alerts

## 📱 PWA Features

### Offline Support
- **Service Worker** for caching
- **Offline page** for network issues
- **Background sync** for actions
- **Cached assets** for performance

### Mobile Features
- **Install prompt** for PWA
- **Push notifications** support
- **Touch gestures** for navigation
- **Optimized performance** for mobile

## 🧪 Testing

### Running Tests
```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

### Code Quality
```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run formatting
npm run format
```

## 📈 Performance

### Optimization
- **Code splitting** for faster loads
- **Image optimization** with Next.js
- **Lazy loading** for components
- **Caching strategies** for API calls

### Metrics
- **Lighthouse score**: 95+
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Debugging
- **React DevTools** for component inspection
- **Next.js DevTools** for framework debugging
- **Supabase Dashboard** for database management
- **Chrome DevTools** for performance analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - The React framework
- **Supabase** - Backend as a service
- **shadcn/ui** - Component library
- **Tailwind CSS** - CSS framework
- **Framer Motion** - Animation library

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using modern web technologies**
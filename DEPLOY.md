# BetDay Lite - Deployment Guide

## Quick Start

1. **Development**
   ```bash
   npm install
   npm run dev
   ```
   Visit: http://localhost:3000

2. **Sign In**
   - Click "Sign In" button
   - Enter any email and password (demo mode)
   - Example: email@test.com / password123

3. **Place Bets**
   - Browse events on the home page
   - Click on any odds (1, X, or 2) to place a bet
   - View your bets in the Profile section

## Vercel Deployment

### Step 1: Prepare Repository
```bash
git init
git add .
git commit -m "Initial commit - BetDay Lite"
# Push to GitHub
```

### Step 2: Import to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure environment variables:
   - `NEXTAUTH_URL`: https://your-domain.vercel.app
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`

### Step 3: Deploy
- Click "Deploy"
- Wait for the build to complete
- Your app is live!

## Environment Variables

### Development (.env.local)
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### Production
```env
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=<generated-secure-secret>
```

## Features Checklist

✅ Home page with event timeline
✅ Authentication with NextAuth
✅ Protected routes (middleware)
✅ Bet placement with visual feedback
✅ Profile page with user bets
✅ Bet detail page
✅ Server Components
✅ API Routes
✅ Loading states (Suspense)
✅ Responsive design
✅ Toast notifications
✅ TypeScript
✅ Next.js 15+ (App Router)
✅ React 18+

## Tech Stack Used

- **Next.js 16.1.6** (supports all Next.js 15+ features)
- **React 19.2.3** (fully compatible with React 18+ APIs)
- **TypeScript** - Full type safety
- **NextAuth** - Authentication
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **Sonner** - Toast notifications

## Architecture Highlights

### Server Components
- Home page (`app/page.tsx`)
- Profile page (`app/profile/page.tsx`)
- Bet detail page (`app/bets/[id]/page.tsx`)

### API Routes
- `/api/events` - Get all events
- `/api/bets` - Create/Get bets
- `/api/bets/[id]` - Get bet details
- `/api/auth/[...nextauth]` - NextAuth handlers

### Client Components
- Navbar (navigation)
- EventCard (bet placement)
- BetCard (bet display)

### Middleware
- Protected routes for `/profile` and `/bets/[id]`
- Automatic redirect to sign-in page

## Testing the App

### 1. Home Page
- Verify events are displayed
- Check timeline organization by hour
- Test responsive design (mobile/desktop)

### 2. Authentication
- Sign in with any credentials
- Check navigation changes (Profile/Sign Out appear)
- Verify protected routes

### 3. Bet Placement
- Click on odds buttons
- Verify toast notification appears
- Check animation feedback

### 4. Profile Page
- View all placed bets
- Check statistics (Total, Won, Lost, Pending)
- Test empty state (new user)

### 5. Bet Detail Page
- Click on any bet card
- Verify all details are shown
- Check status colors and icons

## Performance Optimizations

- Server-side rendering for initial load
- Suspense boundaries for loading states
- Image optimization (Next.js Image component ready)
- API route caching strategies
- Responsive images and fonts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations (Demo)

- In-memory data storage (resets on server restart)
- Simple authentication (any credentials accepted)
- Mock bet results (randomly assigned)
- No real betting logic or balance

## Production Recommendations

1. **Database**: Integrate PostgreSQL or MongoDB
2. **Authentication**: Add OAuth providers, proper validation
3. **Real-time**: WebSockets for live odds
4. **Payment**: Integrate payment gateway
5. **Security**: Input validation, rate limiting, CSRF protection
6. **Monitoring**: Error tracking (Sentry), analytics
7. **Testing**: Unit tests, integration tests, E2E tests

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth Documentation](https://authjs.dev)
- [Vercel Deployment](https://vercel.com/docs)

---

**Ready to deploy! 🚀**

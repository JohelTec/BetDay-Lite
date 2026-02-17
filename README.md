This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🎲 BetDay Lite - Sports Betting Platform

A modern sports betting application built with Next.js 15+, React 18+, TypeScript, and NextAuth. Place simulated bets on daily sports events with a beautiful, responsive interface.

## 🚀 Features

### Core Features
- **📅 Daily Event Timeline**: Browse sports events organized by hour with 1X2 betting markets
- **🔐 Authentication**: Secure login system using NextAuth
- **💰 Bet Placement**: Place simulated bets on multiple sports events
- **👤 User Profile**: View all your bets with status (PENDING, WON, LOST)
- **📊 Bet Details**: Detailed view of individual bets with comprehensive information
- **🎨 Modern UI**: Beautiful, responsive design with smooth animations
- **📱 Responsive**: Fully optimized for mobile and desktop devices

### Technical Features
- **Server Components**: Leveraging Next.js 15 App Router for optimal performance
- **API Routes**: RESTful API endpoints for events and bets management
- **Loading States**: Suspense and loading UI throughout the application
- **Protected Routes**: Middleware-based route protection
- **Toast Notifications**: Real-time feedback using Sonner
- **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.6 (supports Next.js 15+ features)
- **React**: React 19.2.3 (fully compatible with React 18+ APIs)
- **TypeScript**: Full type safety
- **Authentication**: NextAuth (beta for Next.js 15+)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone <your-repository-url>
cd my-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
```

> **Note**: For production, generate a secure secret using:
> ```bash
> openssl rand -base64 32
> ```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Authentication
1. Click "Sign In" in the navigation bar
2. Enter any email and password (demo mode accepts any credentials)
3. You'll be authenticated and redirected to the home page

### Placing Bets
1. Browse the timeline of events on the home page
2. Each event shows the 1X2 market (Home/Draw/Away)
3. Click on any odds button to place a bet
4. You'll see a success notification and the bet will be saved

### Viewing Your Bets
1. Click "Profile" in the navigation
2. View all your bets with their status
3. See statistics: Total, Won, Lost, and Pending bets
4. Click on any bet card to see detailed information

## 📂 Project Structure

```
my-app/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth endpoints
│   │   ├── events/route.ts               # Events API
│   │   └── bets/
│   │       ├── route.ts                  # Bets CRUD
│   │       └── [id]/route.ts             # Single bet endpoint
│   ├── auth/
│   │   └── signin/page.tsx               # Sign in page
│   ├── profile/page.tsx                  # User profile
│   ├── bets/[id]/page.tsx               # Bet detail page
│   ├── layout.tsx                        # Root layout
│   ├── page.tsx                          # Home page
│   ├── loading.tsx                       # Global loading
│   └── not-found.tsx                     # 404 page
├── components/
│   ├── Navbar.tsx                        # Navigation component
│   ├── EventCard.tsx                     # Event display card
│   ├── BetCard.tsx                       # Bet display card
│   └── Loading.tsx                       # Loading component
├── lib/
│   ├── types.ts                          # TypeScript types
│   └── data.ts                           # Data management
├── auth.ts                               # NextAuth configuration
├── middleware.ts                         # Route protection
└── .env.local                            # Environment variables
```

## 🔒 Authentication

The app uses NextAuth with a simple Credentials provider for demo purposes. In production, you should:
- Implement proper user validation against a database
- Add additional providers (Google, GitHub, etc.)
- Store user data securely
- Implement password hashing

## 🎨 UI/UX Features

- **Gradient Backgrounds**: Modern gradient color schemes
- **Smooth Animations**: Scale and color transitions on interactions
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Status Indicators**: Color-coded bet statuses
- **Empty States**: Helpful messages when no data is available
- **Loading States**: Skeleton screens and spinners
- **Toast Notifications**: Real-time feedback for user actions

## 🚀 Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Add environment variables:
     - `NEXTAUTH_URL`: Your production URL
     - `NEXTAUTH_SECRET`: Generate a secure secret

3. **Done!** Your app is now live

## 🔧 Development

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 📝 API Endpoints

### Events
- `GET /api/events` - Get all events for today

### Bets
- `POST /api/bets` - Create a new bet (requires authentication)
- `GET /api/bets` - Get user's bets (requires authentication)
- `GET /api/bets/[id]` - Get specific bet details (requires authentication)

## 🔐 Protected Routes

The following routes require authentication (handled by middleware):
- `/profile`
- `/bets/[id]`

Unauthenticated users will be redirected to the sign-in page.

## 🎯 Future Enhancements

- Real-time odds updates using WebSockets
- Live match scores integration
- User balance and transaction history
- Multiple bet types (over/under, handicap, etc.)
- Bet slip for multiple selections
- Social features (sharing bets, leaderboards)
- Real database integration (PostgreSQL, MongoDB)
- Email notifications
- Two-factor authentication

## 📄 License

This project is for demonstration purposes.

## 👨‍💻 Author

Built as a technical challenge to demonstrate proficiency with modern web technologies.

---

**Note**: This is a simulated betting application for demonstration purposes. No real money is involved.

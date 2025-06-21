# TramAnSys - Financial Transfer Management System

> **Mobile-First PWA for Financial Transfer Management between Exchange Offices and Admin**

## 📋 Project Overview

**TramAnSys** is a comprehensive financial transfer management system designed specifically for exchange offices operating in Jordan. The system provides real-time order management, balance tracking, and commission calculations optimized for mobile devices and 3G/4G networks.

### Key Features

- **Mobile-First Design**: Optimized for 320px - 768px screens
- **Real-time Updates**: Live order status changes and notifications
- **Secure File Management**: Screenshot uploads with Firebase Storage
- **Role-Based Access**: Admin and Exchange Office user types
- **Commission Management**: Flexible commission rates and calculations
- **Bank Integration**: Multiple bank assignments and platform bank management
- **PWA Support**: Offline functionality and native-like experience

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Custom username-based system
- **Analytics**: Firebase Analytics
- **PWA**: Service Worker with Workbox

## 🚀 Performance Targets

- **Bundle Size**: < 100KB per page
- **LCP**: < 2.5 seconds on 3G
- **TTI**: < 3 seconds on mobile
- **Network**: Optimized for Jordan's 3G/4G networks

## 📁 Project Structure

```
tramansys/
├── app/                    # Next.js App Router
├── components/             # Reusable UI components
├── lib/                   # Utilities and Firebase config
├── types/                 # TypeScript definitions
├── public/                # Static assets
├── .env.local            # Environment variables (create from .env.example)
└── Development-Phases.md  # Development roadmap
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/riftvanta/tramansys.git
   cd tramansys
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tramansys.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tramansys
   # ... other Firebase config
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Credentials

For testing the authentication system, use these credentials:

- **Admin Access**: `admin` / `admin123`
- **Exchange Access**: `exchange` / `exchange123`

The login page will redirect you to the appropriate dashboard based on your role.

## 🏗️ Development Phases

This project follows a structured 10-phase development approach:

1. **Phase 1**: Project Setup & Infrastructure ✅
2. **Phase 2**: Authentication System ✅
3. **Phase 3**: Database Schema & Models
4. **Phase 4**: Admin User Management
5. **Phase 5**: Order Management Core
6. **Phase 6**: Real-time Features
7. **Phase 7**: File Management & Screenshots
8. **Phase 8**: Mobile Optimization & PWA
9. **Phase 9**: Testing & Quality Assurance
10. **Phase 10**: Deployment & Production

See `Development-Phases.md` for detailed specifications.

## 🔐 Security

- Username-based authentication (no public registration)
- Role-based access control (Admin vs Exchange)
- Secure file uploads with size and format validation
- Firebase Security Rules for data isolation
- Session management with HTTP-only cookies

## 📱 Mobile Optimization

- Touch-friendly UI elements
- Responsive breakpoints (320px - 768px)
- Network-aware loading strategies
- Progressive Web App capabilities
- Optimized for Jordanian network conditions

## 🌍 Localization

- Designed for Jordan market
- Jordanian mobile number validation (07/8/9 format)
- JOD currency formatting
- Arabic/English language support (future)
- Jordanian timezone (Asia/Amman)

## 🤝 Contributing

This is an internal company project. All development follows the structured phase approach outlined in `Development-Phases.md`.

## 📄 License

Internal Company Project - All Rights Reserved

## 📞 Support

For technical support and questions, contact the development team.

---

**Built with ❤️ for efficient financial transfer management in Jordan** 
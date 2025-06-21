# EatWhatNow - Frontend Client

A modern, Tinder-style restaurant discovery app that helps users find their next dining destination with intuitive swipe gestures and location-based recommendations.

![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.3.5-brightgreen?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.8-blue?logo=tailwindcss)

## 🍽️ Overview

EatWhatNow is a restaurant discovery platform that makes finding your next meal effortless and fun. Built with a Tinder-inspired interface, users can swipe through curated restaurant recommendations, view detailed information, and make dining decisions quickly.

## Project Preferences

- building project without global states by design because why not :)

## ✨ Features

### 🎯 **Core Features**

- **Tinder-Style Swiping**: Intuitive swipe-left/right gestures for browsing restaurants
- **Stack Card Interface**: Beautiful 3-card stack with smooth animations and rotations
- **Infinite Scroll**: Seamless pagination with automatic data fetching as you swipe
- **Real-time Feedback**: Visual "LIKE" and "PASS" indicators during swipes

### 🔐 **Authentication**

- **User Registration**: Secure account creation with email validation
- **JWT Login**: Token-based authentication with automatic session management
- **Password Credential API**: Browser-native password saving and auto-fill

### 🏠 **Restaurant Discovery**

- **Location-Based Feed**: Restaurants sorted by proximity and preference
- **Detailed Restaurant Cards**: Name, cuisine, rating, price range, and address
- **Smart Filtering**: Filter by cuisine type, price range, and minimum rating
- **Daily Randomized Feed**: Fresh restaurant order updated daily

### 📱 **User Experience**

- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Touch & Mouse Support**: Works seamlessly across all input methods
- **Loading States**: Clear feedback during data fetching
- **Error Handling**: Graceful error recovery with user-friendly messages

## 🛠️ Tech Stack

### **Frontend Framework**

- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5.8.3** - Type-safe development
- **Vite 6.3.5** - Fast build tool and dev server

### **Styling & UI**

- **TailwindCSS 4.1.8** - Utility-first CSS framework
- **CSS Animations** - Smooth transitions and spring animations
- **Responsive Grid** - Mobile-first responsive design

### **State Management**

- **TanStack Query 5.79.0** - Server state management with caching
- **React Hooks** - Local component state (no global state by design)

### **Routing & Navigation**

- **React Router 7.6.1** - Client-side routing
- **Protected Routes** - Authentication-based route protection

### **Development Tools**

- **ESLint 9.25.0** - Code linting with React hooks rules
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Vite Plugin React** - Fast refresh and optimal React support

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Backend API** running (see [server README](../server/README.md))

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd eat-what-now/client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env
   ```

   Configure your environment variables:

   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📜 Available Scripts

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build production bundle                  |
| `npm run preview` | Preview production build locally         |
| `npm run lint`    | Run ESLint for code quality checks       |

### **TailwindCSS Configuration**

Configured for optimal development experience with:

- Responsive breakpoints
- Custom color palette
- Component utilities
- Animation classes

## 🔄 API Integration

### **Query Client Setup**

- Automatic retries on network failures
- Background refetching for fresh data
- Optimistic updates for better UX
- Error boundary integration

### **Endpoints Used**

- `GET /feed` - Restaurant feed with pagination
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /restaurants` - Restaurant details

## 📱 Responsive Design

### **Breakpoints**

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### **Mobile-First Approach**

- Touch-optimized interactions
- Swipe gesture recognition
- Optimized card sizing for mobile screens
- Fast loading with efficient image handling

## 🎯 Design Philosophy

### **Project Preferences**

- **No Global State**: Intentional decision to build without Redux/Zustand
- **Server State Focus**: Using TanStack Query for all server interactions
- **Component Composition**: Reusable, composable component architecture
- **Performance First**: Optimized rendering and minimal re-renders

### **User Experience Principles**

- **Immediate Feedback**: Visual responses to all user interactions
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Accessibility**: Keyboard navigation and screen reader support
- **Fast & Smooth**: 60fps animations and instant loading states

## 🚀 Deployment

### **Build for Production**

```bash
npm run build
```

### **Preview Production Build**

```bash
npm run preview
```

### **Deploy to Vercel/Netlify**

The app is ready for deployment to any static hosting service:

- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- **Tinder** - Inspiration for the swipe interface
- **TanStack Query** - Excellent server state management
- **Tailwind CSS** - Amazing utility-first CSS framework
- **Vite** - Blazingly fast build tool

---

**Built with ❤️ for food lovers everywhere** 🍕🍜🍔

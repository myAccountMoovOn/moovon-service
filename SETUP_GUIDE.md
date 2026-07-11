# Moovon Service - Complete Setup Guide

This document outlines the architecture, environment variables, and steps to run the complete Moovon platform (Backend, Frontend Web App, and Mobile App) locally.

## Project Architecture

Moovon is a multi-tenant SaaS platform featuring a 4-tier hierarchy:
**Super Admin -> Reseller -> Business -> Customer**

The codebase consists of three main applications:
1. **backend**: NestJS API with Supabase (PostgreSQL) and BullMQ (Redis) for background tasks.
2. **frontend**: React (Vite) Web Application for Admins, Businesses, Resellers, and Customers.
3. **moovon-notification**: Expo (React Native) Mobile Application.

---

## 1. Prerequisites

Make sure you have the following installed on your machine:
- **Node.js** (v18 or higher)
- **Redis** (Required for background jobs and email queues)
- **PostgreSQL** (Managed via Supabase)
- **Expo CLI** (`npm install -g expo-cli`) for running the mobile app

---

## 2. Environment Variables

Each application requires its own `.env` file at its root directory.

### Backend (`/backend/.env`)
Create a `.env` file in the `backend/` directory:

```env
# Database Connection (Supabase)
DATABASE_URL="postgresql://postgres.nyabeywmcoccyjnqlsma:ir63YC81klGYKQMY@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.nyabeywmcoccyjnqlsma:ir63YC81klGYKQMY@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"

# Supabase Auth Settings
SUPABASE_URL="https://nyabeywmcoccyjnqlsma.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YWJleXdtY29jY3lqbnFsc21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNDQxMzUsImV4cCI6MjA5ODcyMDEzNX0.NyyzTdGHA7afonsAv3OqYD6AUpoHrrtFZZUSq2fAr_A"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzE0NDEzNSwiZXhwIjoyMDk4NzIwMTM1fQ.ZbL18q4BVrjpyh6-TMwgDMl8CefL8s0yAXZrSAohxZc"
SUPABASE_JWT_SECRET="2cadb688-1bde-4404-8339-a0a3d55b1480"

# Server Configuration
PORT=3001
FRONTEND_URL="http://localhost:5173"
ADMIN_EMAIL="emeehemant159@gmail.com"

# Redis Connection for BullMQ (Required for email queues)
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""

# SMTP (Email Provider)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=h2inc.co@gmail.com
SMTP_PASS=fbyl gwfu tlgs zsoz

# Razorpay Credentials (Optional / Payment Gateway)
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_secret_..."
```

### Frontend (`/frontend/.env`)
Create a `.env` file in the `frontend/` directory:

```env
# API URL pointing to the local backend
VITE_API_URL=http://localhost:3001/api/v1

# Supabase Settings (Must match the backend keys)
VITE_SUPABASE_URL=https://nyabeywmcoccyjnqlsma.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YWJleXdtY29jY3lqbnFsc21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNDQxMzUsImV4cCI6MjA5ODcyMDEzNX0.NyyzTdGHA7afonsAv3OqYD6AUpoHrrtFZZUSq2fAr_A
```

### Mobile App (`/moovon-notification/.env`)
Create a `.env` file in the `moovon-notification/` directory:

```env
# Replace the IP address with your local machine's IPv4 address.
# Do NOT use 'localhost' because the physical device/emulator cannot resolve localhost to your machine.
EXPO_PUBLIC_API_URL=http://192.168.29.139:3001/api/v1
```

---

## 3. Installation & Running Locally

You will need three separate terminal windows to run the entire stack.

### Step 1: Start Redis (If you haven't already)
Ensure your Redis server is running locally on port `6379`. If using WSL on Windows:
```bash
sudo service redis-server start
```

### Step 2: Start the Backend
Open a terminal in the `backend/` directory:
```bash
cd backend
npm install
npm run start:dev
```
*The backend should start at http://localhost:3001*

### Step 3: Start the Frontend Web App
Open a terminal in the `frontend/` directory:
```bash
cd frontend
npm install
npm run dev
```
*The web app should start at http://localhost:5173*

### Step 4: Start the Mobile App
Open a terminal in the `moovon-notification/` directory:
```bash
cd moovon-notification
npm install
npx expo start -c
```
*Press `a` to run on an Android emulator, `i` for iOS, or scan the QR code with the Expo Go app on your physical device. Make sure your physical device is on the exact same Wi-Fi network as your computer so it can reach the API IP address.*

---

## 4. Key Features & Accounts

- **Root Access:** Log in using `emeehemant159@gmail.com` to access the Super Admin Dashboard.
- **Brand Settings:** White-label settings are available in the web dashboard. Super Admins control the root brand, Resellers control their agency brand, and Businesses inherit from their parent Reseller (or directly from the Super Admin).
- **Signup Flow:** Visit `/signup` to see the unified portal where users can register as a Customer, Business, or Reseller. Companies can dynamically link to each other using the searchable dropdown UI.

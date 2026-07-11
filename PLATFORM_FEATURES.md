# Moovon Service Platform - Exhaustive Feature & Technical Specification

This document provides a highly detailed, comprehensive breakdown of every feature, architectural decision, data model, and functional capability built into the Moovon SaaS Platform. It covers the backend, the React web frontend, and the React Native mobile application.

---

## 1. Core Architecture & Multi-Tenancy Engine

### 1.1 The 4-Tier Hierarchical Structure
The platform is designed to scale across multiple organizations and layers using a robust 4-tier hierarchy. This enables a B2B2B2C business model.

1. **Super Admin (Root Level)**
   - **Role:** The root owner of the entire Moovon Platform.
   - **Capabilities:** Controls global settings, creates core templates (emails, system notifications), manages system-wide configurations, and oversees all Resellers and Businesses.
   - **Branding:** Defines the root "Moovon" brand which acts as the ultimate fallback for all child accounts.

2. **Reseller (Agency Level)**
   - **Role:** Independent agencies or regional partners that white-label the platform.
   - **Capabilities:** Onboards their own Businesses, tracks aggregate metrics, and earns revenue/commissions from the businesses under their umbrella.
   - **Linking Mechanism:** Assigned a unique `Company Code`. Businesses use this code during signup to establish a `resellerId` link in the database.

3. **Business / Provider (Tenant Level)**
   - **Role:** The actual service providers (e.g., local cleaning companies, salons, gyms).
   - **Capabilities:** Manages staff, services, packages, subscriptions, and their direct end Customers. They operate within their own isolated tenant space.
   - **Linking Mechanism:** Assigned a unique `Company Code`. Customers use this code during signup to establish a link.

4. **Customer (End User Level)**
   - **Role:** The people booking services or buying subscriptions from a specific Business.
   - **Capabilities:** Can book appointments, manage active subscriptions, update payment methods, and view their history exclusively within the branding of their linked Business.

---

## 2. Authentication, Security & Unified Onboarding

### 2.1 Unified Registration Flow (Web & Mobile)
- **Single Entry Point:** A unified `/signup` route for both platforms. Users click a single "Sign Up" button and are presented with a dynamic form.
- **Dynamic Field Injection based on Account Type:**
  - **Customer Selection:** Instantly fetches a public endpoint (`/companies/public/list?type=business`) and displays a searchable dropdown list of available Businesses to join.
  - **Business Selection:** Displays an optional searchable dropdown list of Resellers to partner under (`/companies/public/list?type=reseller`). Requires inputs for `companyName`.
  - **Reseller Selection:** Standard agency onboarding requiring `companyName`.
- **OTP Verification Flow:** Registration is a secure 2-step process. 
  - **Step 1:** Creates the user in Supabase Auth and generates a 6-digit OTP stored in the database.
  - **Step 2:** User inputs the OTP sent via email to verify the account (`/auth/register-verify`). Only upon successful verification is the user granted a session.

### 2.2 Security & Authorization Layer
- **Supabase Auth Identity:** Core user authentication is handled by Supabase, generating secure JWTs.
- **Custom Guards (NestJS):** 
  - `SupabaseAuthGuard`: Intercepts every request, extracts the JWT from the `Authorization` header, and verifies it against the Supabase secret.
  - `RolesGuard`: Works in tandem with a custom `@Roles(UserRole.SUPER_ADMIN, UserRole.PROVIDER)` decorator to restrict endpoint access based strictly on the user's hierarchy tier.
- **Context Injection:** The `@CurrentUser()` decorator injects the authenticated user's ID, Role, and `CompanyId` directly into the controller for secure tenant isolation.

---

## 3. White-Labeling & Dynamic Brand Management

Moovon is a true White-Label platform. Resellers and Businesses can completely customize the look and feel of their slice of the application.

### 3.1 Customization Capabilities
- **Visual Assets:** Upload custom Logos, Favicons, and Mobile App Icons (stored securely).
- **Theming & Colors:** Define `primaryColor` and `accentColor` via Hex codes. The frontend dynamically injects these into CSS Variables (e.g., `--color-primary`).
- **Typography:** Select custom Google Fonts (`fontFamily`). The platform dynamically loads the selected font stylesheet on the fly.
- **Text & Copy:** Customize the App Name, Tagline, and Footer Text.
- **Legal & Support:** Add custom Privacy Policy URLs, Terms of Service URLs, Support Email, and Support Phone numbers.

### 3.2 Automatic Brand Inheritance (Waterfall Logic)
The backend executes a fallback mechanism when serving brand settings:
1. If a **Business** has not explicitly configured their brand settings, the API checks their `resellerId`.
2. It then serves the branding of the parent **Reseller**.
3. If the Reseller hasn't configured branding (or doesn't exist), it falls back to the **Super Admin's** global Moovon branding.
4. The frontend React app consumes this via a centralized `BrandingProvider` Context, ensuring the entire UI reflects the correct brand instantly upon page load or login.

---

## 4. Operational Features (For Businesses & Resellers)

### 4.1 Service & Category Management
- **Services:** Create customizable services with `name`, `description`, `price`, and `duration` (in minutes).
- **Categories:** Organize services hierarchically. Services belong to categories for easier navigation on the customer booking front.
- **Packages:** Bundle multiple services together into a single "Package" at a discounted rate for upselling.

### 4.2 Subscriptions & Billing Engine
- **Subscription Tiers:** Businesses can create recurring Subscription plans (e.g., Weekly, Monthly, Yearly).
- **Lifecycle Management:** Built-in backend logic for managing `ACTIVE`, `PAUSED`, `CANCELED`, and `PAST_DUE` subscription states.
- **Mock Payment Gateway Integration:** The system is currently wired with a sophisticated Mock Payment simulator. It mimics real-world webhook callbacks, payment intent creation, and success/failure scenarios, perfectly paving the way for a drop-in replacement with Stripe or Razorpay.

### 4.3 Coupon & Promotion System
- **Discount Engine:** Generate promotional codes.
- **Flexibility:** Supports both `PERCENTAGE` and `FIXED_AMOUNT` discount types.
- **Constraints:** Configure strict usage limits (`maxUses`), minimum purchase requirements, and `expiryDate` tracking. The backend automatically invalidates expired or exhausted coupons.

### 4.4 CRM: Customer & Staff Management
- **Customer Directory:** Complete CRM view for Businesses to see their linked Customers.
- **Deep Profiles:** Ability to view detailed Customer profiles, their booking history, aggregate spend, and current active subscription status.
- **Staff (Future-Proofed):** The database schema supports linking multiple staff profiles to a single `Company` for role-based permissions within a business.

---

## 5. Asynchronous Engine (Notifications & Jobs)

Moovon features a highly scalable, asynchronous background job engine designed to never block the main API execution thread.

### 5.1 Infrastructure
- **Redis & BullMQ:** All heavy lifting (like sending emails) is offloaded to Redis-backed queues using BullMQ.
- **Fault Tolerance:** Built-in retry mechanisms, exponential backoff, and dead-letter queues for failed email deliveries.

### 5.2 Notification Triggers
- **Transactional:** OTP delivery, Welcome Emails, Password Reset links.
- **Event-Driven:** New booking confirmations, subscription renewal reminders, payment receipt generation.
- **Custom HTML Templates:** Super Admins can design custom email templates for different notification triggers within the dashboard, supporting dynamic variable interpolation (e.g., `{{userName}}`, `{{companyName}}`).

---

## 6. Mobile Application (`moovon-notification`)

A dedicated, native-feeling mobile app built with **Expo & React Native** for on-the-go access for both Customers and Business owners.

### 6.1 Core Mobile Stack
- **Framework:** React Native managed by Expo (compiles to iOS & Android).
- **Routing:** Expo Router (File-based navigation mimicking the web).
- **State Management:** Zustand with `AsyncStorage` persistence for lightning-fast, offline-capable authentication state.
- **UI Toolkit:** `react-native-paper` for highly polished, accessible Material Design components.

### 6.2 Mobile-Specific Implementations
- **Native Unified Signup:** Translates the complex web dropdowns into native Bottom Sheet Modals containing highly performant `FlatList` components with live search.
- **Keyboard Handling:** Implements `KeyboardAvoidingView` and `ScrollView` insets to ensure forms are never obscured by the mobile keyboard.

---

## 7. Complete Technical Stack & Database Schema

### 7.1 Backend (Node.js)
- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL (Hosted on Supabase)
- **ORM:** TypeORM
- **Queues:** BullMQ + Redis (ioredis)
- **Email:** Nodemailer (SMTP configuration)

### 7.2 Frontend Web (React)
- **Framework:** React 18 + Vite (TypeScript)
- **Routing:** React Router v6
- **UI Library:** Ant Design (antd) + Custom CSS Variables
- **Data Fetching:** Axios (with centralized interceptors for automatic token injection)

### 7.3 Core Database Entities (TypeORM)
- **Profile:** Extends Supabase Auth. Stores `id`, `email`, `role`, `companyId`, `phone`, `name`.
- **Company:** Stores `name`, `code`, `isReseller`, `resellerId` (Self-referencing foreign key), and all Branding settings (`logo`, `primaryColor`, `fontFamily`, etc.).
- **Service & Category:** Relational tables linked to `Company`.
- **Subscription & Payment:** Tracks recurring billing cycles, `amount`, `status`, `nextBillingDate`, and `transactionId`.
- **Coupon:** Tracks `code`, `discountType`, `discountValue`, `maxUses`, `currentUses`, and `expiryDate`.

---
*This document serves as the absolute source of truth for the capabilities, architecture, and structural decisions of the Moovon Platform.*

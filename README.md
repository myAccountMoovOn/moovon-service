# Moovon Service Subscription Platform
A production-ready full-stack subscription management platform built with NestJS, React, and Supabase.

## Architecture

- **Backend Context:** NestJS (Node.js) handling REST APIs, BullMQ for queued jobs, Cron scheduling, and Razorpay integrations.
- **Frontend Context:** React 18 with Vite, Ant Design component library, and React Router v6.
- **Database / Auth:** Supabase PostgreSQL & Auth.
- **Queue/Redis:** Redis running locally or via fully managed cloud instance.

## Installation

1. Copy `.env.example` to `.env` in both `/backend` and `/frontend`. Fill out your environment variables.
2. In the `backend` directory, run `npm install`, then `npm run start:dev` (Make sure your local Redis instance is running).
3. In the `frontend` directory, run `npm install`, then `npm run dev`.

## Phases Completed

- **Phase 1:** Core setup, Supabase configuration, Global Error Handlers, and 8 TypeORM Entities.
- **Phase 2:** Customers and Services CRUD, including Bulk Excel (`xlsx`) import.
- **Phase 3:** Subscriptions module, Razorpay links, webhooks, and PDFKit invoices pushed to Supabase storage.
- **Phase 4:** Dedicated Notifications module with Templates, running entirely on background BullMQ tasks. Advanced Scheduler chron jobs for triggering renewals 5, 29, 30 days away. 
- **Phase 5:** React global theme Setup (`index.css`), Axios auth interceptors, and strict Supabase Auth context.
- **Phase 6:** Backend multi-faceted Reports module, React-router layout shells (Admin & Customer interfaces).

🚀 Deployed via AWS EC2 (Backend) and Cloudflare Pages (Frontend).

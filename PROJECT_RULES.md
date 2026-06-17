# 🚛 DriveLink AI - Project Rules

## Project Overview

Project Name: DriveLink AI

DriveLink AI is an AI-powered Driver Exchange & Logistics Marketplace that connects transport organizations with professional drivers.

Organizations create delivery requests, AI automatically matches the best drivers, the first qualified driver accepts the request, and the entire delivery is tracked until completion.

---

# Tech Stack

## Frontend

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Framer Motion

## Backend

- Python 3.12+
- FastAPI
- Pydantic
- SQLAlchemy
- Supabase PostgreSQL

## AI

- Gemini API

## Maps

- Google Maps API

## Notifications

- Firebase Cloud Messaging

---

# Folder Rules

Frontend code MUST remain inside:

frontend/

Backend code MUST remain inside:

backend/

Database scripts MUST remain inside:

database/

Documentation MUST remain inside:

docs/

Assets MUST remain inside:

assets/

Never mix frontend and backend files.

---

# Coding Rules

Always generate:

- Production-ready code
- Reusable components
- Clean architecture
- Feature-based structure
- Responsive UI
- TypeScript strict mode
- Proper comments
- Proper typings
- Proper error handling
- Proper loading states

Never generate placeholder code.

Never generate duplicate files.

Never overwrite working code.

Always explain generated files.

---

# Frontend Rules

Use:

- Server Components whenever possible
- Client Components only when necessary
- Functional Components
- Hooks
- Tailwind
- Shadcn UI

Structure:

frontend/  app/ components/ features/ hooks/ services/ providers/ lib/ types/ utils/ constants/ styles/ public/

Keep components small and reusable.

---

# Backend Rules

Use:

FastAPI

Structure:

backend/  api/ controllers/ services/ models/ schemas/ matching/ tracking/ notifications/ database/ middleware/ config/ utils/ ai/

Business logic must remain inside services.

Routes should only call services.

Never place business logic inside API routes.

---

# Database Rules

Use Supabase PostgreSQL.

Tables:

drivers

organizations

delivery_requests

live_tracking

proof_of_delivery

driver_ratings

organization_ratings

notifications

Always create relationships and indexes.

---

# UI Design Rules

Design inspiration:

- Stripe
- Linear
- Uber Freight
- Vercel

Theme:

Primary:

Blue

Secondary:

Green

Background:

White

Cards:

Rounded

Minimal

Professional

Animations:

Framer Motion

Responsive:

Desktop

Tablet

Mobile

---

# Driver Module

Pages:

Dashboard

Available Deliveries

Active Delivery

Completed Deliveries

Ratings

AI Assistant

Profile

Settings

---

# Organization Module

Pages:

Dashboard

Create Delivery

Active Deliveries

Completed Deliveries

Tracking

Drivers

AI Assistant

Settings

---

# AI Matching Logic

Ranking Formula:

40% Rating

30% Distance

20% Experience

10% Completed Deliveries

Sort descending.

Notify top ranked drivers.

First driver accepting gets assigned automatically.

No manual approval.

---

# Tracking Rules

Google Maps Live Tracking.

Track:

Latitude

Longitude

Speed

Timestamp

ETA

Distance Remaining

---

# Offline Rules

If internet disconnects:

Store

GPS

Status

Delivery progress

Images

locally.

When internet returns:

Automatically sync everything.

---

# Device OFF Rules

If phone is switched off:

Show

Device Offline

Last Known Location

Last Updated Time

Resume tracking automatically when device turns on.

---

# Delivery Evidence Rules

Driver uploads only:

Delivery Photo

Automatically capture:

GPS

Latitude

Longitude

Timestamp

No OTP.

No Digital Signature.

---

# AI Assistant Rules

Create two completely separate assistants.

Driver AI:

Access only:

Driver profile

Driver deliveries

Driver ratings

Completed deliveries

Organization AI:

Access only:

Organization deliveries

Driver list

Reports

Tracking

Never share data between assistants.

No shared memory.

---

# Authentication

Authentication will be implemented only after MVP completion.

Current phase:

No JWT

No Login

No Registration APIs

Use mock users until authentication phase.

---

# Development Workflow

Always follow:

Planning

↓

Frontend UI

↓

Mock Data

↓

Delivery Module

↓

AI Matching

↓

Maps

↓

Offline Sync

↓

Delivery Evidence

↓

Ratings

↓

Supabase

↓

Gemini

↓

Authentication

↓

Testing

↓

Deployment

Never skip phases.

---

# Git Rules

Commit after every completed feature.

Commit format:

feat: landing page

feat: driver dashboard

feat: organization dashboard

feat: delivery module

feat: ai matching

fix: tracking bug

refactor: reusable cards

---

# Cursor Instructions

Always analyze existing files before generating code.

Never create duplicate files.

Never delete existing code.

Always extend existing architecture.

Always maintain separation of frontend and backend.

Generate enterprise-quality production code.

Think like a Senior Software Architect before generating any code.
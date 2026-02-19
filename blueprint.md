# Project Blueprint

## Overview
Next.js application for Bella Studios (PenguinDev) with Admin and Tester dashboards, using Firebase and Genkit.

## Current State
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Authentication**: Firebase (setup, but logic not fully implemented in UI)
- **Structure**:
  - `src/app/page.jsx`: Landing/Login page
  - `src/app/admin/page.jsx`: Admin Dashboard
  - `src/app/tester/page.jsx`: Tester Dashboard
  - `src/components/ZeroUI.jsx`: Shared UI Components

## Recent Changes
- Installed `firebase`, `firebase-admin`, `@firebase/auth`, `genkit`.
- Reorganized project structure:
  - Moved `ZeroUI.jsx` to `src/components`.
  - Moved `Admin.jsx` (content) to `src/app/admin/page.jsx`.
  - Moved `Tester.jsx` (content) to `src/app/tester/page.jsx`.
  - Created `src/app/page.jsx` as Landing Page.
- Installed `lucide-react`, `eslint`.
- Added `lint` script.

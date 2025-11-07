# E-commerce Vite + React (Minimal scaffold)

This repository is a minimal, self-contained scaffold for a demo e-commerce platform using React + Vite.

Features implemented:
- Landing page with product list and add-to-cart
- Cart with coupon application and order placement
- Login with test users (mock)
- Profile, Orders pages
- Vendor & Admin dashboards (basic)
- In-memory "API" backed by localStorage (src/lib/mockApi.js) providing inventory management and preventing oversell

How to run:
1. unzip or clone the project
2. run `npm install`
3. run `npm run dev`
4. Open the site at the address printed by Vite (usually http://localhost:5173)

Notes:
- This is a front-end-only demo using localStorage as a mock backend.
- For production you'd replace the mockApi with real API calls and add real auth, payments, and security.

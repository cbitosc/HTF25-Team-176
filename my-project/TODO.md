# SpookyMart Backend and Animations Enhancement TODO

## Backend Setup
- [x] Create package.json with Node.js dependencies (express, sqlite3, bcryptjs, jsonwebtoken, cors, body-parser)
- [x] Install Node.js dependencies via npm
- [x] Create database.js for SQLite database setup and schema (tables: users, products, carts, orders)
- [x] Create server.js as the main Express server file
- [x] Implement API routes: routes/auth.js (login/signup), routes/cart.js, routes/orders.js

## Frontend Updates
- [x] Modify app.js to use fetch() for API calls instead of simulation, add loading states and error handling
- [ ] Update index.html to include loading spinners and dynamic content from backend
- [ ] Update other HTML files (cart.html, order.html, profile.html, admin_dashboard.html, vendor.html) for backend integration

## Animations Enhancements
- [x] Enhance style.css with new animations: page transitions (fade/slide), loading spinners, button hover effects, product card animations
- [x] Add skeleton loaders for content loading

## Testing and Integration
- [x] Run the server and test API endpoints
- [x] Test full integration (login, cart, orders with persistence)

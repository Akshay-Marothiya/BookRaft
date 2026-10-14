# 📚 BookRaft – Online Bookstore

BookRaft is a full-stack online bookstore built using the MERN stack. Users can browse books, search and filter titles, add books to their cart, and place orders.

## Features
- Browse, search, and filter books
- Shopping cart and checkout
- User registration and login
- Admin dashboard to manage books and orders
- Responsive user interface

## Tech Stack
- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT, bcryptjs
- **Deployment:** Render

## Run Locally

Install dependencies:

```bash
npm install --prefix server
npm install --prefix client
```

Start the backend:

```bash
npm start --prefix server
```

Start the frontend in another terminal:

```bash
npm run dev --prefix client
```

Configure your environment variables in `server/.env` before starting the backend.

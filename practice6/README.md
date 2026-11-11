
# React Shop — Homework 6

A React e-commerce application with Firebase Authentication,
React Router, and TanStack Query caching.

## Technologies

- React + Vite
- React Router
- Tailwind CSS
- Firebase Authentication
- TanStack Query
- DummyJSON API

## Features

- Product listing and product details
- Product search and category filtering
- Price filtering and sorting
- Pagination
- Dashboard with product statistics
- Email and password authentication
- Google authentication
- User registration and logout
- Protected profile page
- Persistent authentication sessions
- API data caching
- Cache invalidation after product updates
- Loading, error, and empty states

## Installation

```bash
git clone https://github.com/Arginbekuly/React
cd practice6
npm install 
```

Create a `.env.local` file using `.env.example`.

Add your Firebase Web App configuration.

Start the application:

```bash
npm run dev
```

## Environment Variables

The application uses Firebase configuration through Vite
environment variables.

See `.env.example` for the required variable names.

## Authentication

Firebase Authentication supports Email/Password and Google
sign-in.

Authentication state is managed through AuthContext and
onAuthStateChanged.

ProtectedRoute redirects unauthenticated users to Login.

Firebase restores authentication sessions after page refresh.

## Caching Strategy

TanStack Query manages server data caching.

Products list query key:

`["products", "all"]`

Product details query key:

`["products", "detail", productId]`

Cache settings:

- staleTime: 2 minutes
- gcTime: 10 minutes
- retry: 1

Fresh cached data is reused when navigating between pages.

AbortSignal prevents outdated requests from overwriting
newer results.

## Cache Invalidation

Product update operations use useMutation.

After a successful update, invalidateQueries invalidates
the products list and the corresponding product detail query.

Active queries are refetched to obtain fresh data.

DummyJSON simulates product updates and does not persist
changes on the server.

## Routes

| Route | Description |
|---|---|
| / | Home |
| /products | Products listing |
| /products/:id | Product details |
| /dashboard | Product statistics |
| /about | About |
| /login | User login |
| /signup | User registration |
| /profile | Protected user profile |

## Deployment

Deployment URL: 

## Author

React Routing Homework 6

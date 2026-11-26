# React Shop — Practice 8

React Shop is a small e-commerce app built with React, Vite, Firebase Authentication and Redux Toolkit. Product data comes from DummyJSON.

## Main features

- Product catalog with search, category and price filters, sorting and pagination
- Product details and a demo product title update
- Shopping cart with a live item count
- Dashboard with product statistics
- Email and password sign in, Google sign in, signup and protected profile
- Offline page, cached app assets and images, and service worker update prompt

## Redux Toolkit

`src/app/store.js` creates the Redux store with `configureStore`. `src/main.jsx` provides it to the app with React Redux's `Provider`.

The three feature slices are:

- `products`: the shared product list, list loading state, and product update state
- `productDetails`: product detail records indexed by product ID, with individual loading and error states
- `cart`: cart items and quantities, with add, remove, quantity change, and clear actions

The async operations use `createAsyncThunk`:

- `fetchProducts` loads the catalog and avoids refetching a successful or in-progress request
- `fetchProductDetails` loads one product and avoids duplicate requests for the same product
- `saveProductTitle` sends the demo update request and updates the matching product in both Redux features

Each request tracks pending, fulfilled, and rejected states in `extraReducers`. Failed catalog and detail requests can be retried in the UI. Aborted requests return to an idle state, so navigation or React Strict Mode does not leave a request stuck as loading.

The catalog uses `selectAllProducts`, `selectProductsStatus`, `selectProductsError`, `selectProductCategories`, `selectFilteredProducts`, and `selectProductsCount`. `selectProductCategories`, `selectFilteredProducts`, and `selectProductsCount` use `createSelector` for memoized results. The cart selectors memoize its item count and total.

Product API calls live in `src/services/productsCacheApi.js`. The catalog and Dashboard share the same Redux list. The product page uses the details slice, and product cards dispatch cart actions. Search, filters, sorting and page selection remain in the URL; search input updates the URL after a short debounce.

## TanStack Query

TanStack Query was used for the catalog, product details and update mutation in the previous version. Those server data operations now use Redux Toolkit so the same product data is not stored in two caches. The old hooks and dependency have been removed. Firebase authentication remains in `AuthContext`.

## Setup

```bash
npm install
```

Copy `.env.example` to `.env.local` and add the Firebase web app values. Then run:

```bash
npm run dev
```

Create a Firebase project and enable Email/Password and Google sign in to use authentication.

## Build and GitHub Pages

Build locally with:

```bash
npm run build
npm run preview
```

Vite uses `/React/practice8/` as its base path. The app uses `HashRouter`, so product and profile routes can be opened directly on GitHub Pages. The manifest is referenced through the Vite base path, and the service worker precaches the built assets and offline page. Runtime caches cover public DummyJSON GET requests and product images; Firebase data is not cached by the service worker.

The deploy script publishes the `dist` build to the `practice8` directory on the configured `gh-pages` branch. It keeps the temporary Git clone outside the repository so the deploy cache is not published with the site:

```bash
npm run deploy
```

The repository needs to be connected to GitHub with a remote before deployment. The configured project URL is `https://arginbekuly.github.io/React/practice8/`; confirm that the GitHub repository and Pages settings match this path before publishing.

## Routes

| Route | Description |
|---|---|
| `/` | Home |
| `/products` | Catalog |
| `/products/:id` | Product details |
| `/dashboard` | Catalog statistics |
| `/profile` | Protected user profile |
| `/login` and `/signup` | Authentication |
| `/about` | Project information |

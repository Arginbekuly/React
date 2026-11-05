import { lazy } from 'react';
import { Routes, Route } from 'react-router';
import RootLayout from './layouts/RootLayout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';

// Four lazy-loaded pages: meets the homework's 3+ page requirement.
const Products = lazy(() => import('./pages/Products.jsx'));
const ProductDetails = lazy(() => import('./pages/ProductDetails.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<RootLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetails />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

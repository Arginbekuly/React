import { Suspense } from 'react'
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Signup from "./pages/SignUp.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import OfflinePage from "./pages/OfflinePage";
import RouteFallback from "./components/RouteFallback.jsx";

const Products = lazy(() => import('./pages/Products.jsx'));
const ProductDetails = lazy(() => import('./pages/ProductDetails.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-[50vh] text-blue-500 font-medium">
            Загрузка страницы...
        </div>
    );
}

export default function App() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path="/" element={<RootLayout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="products" element={<Products />} />
                    <Route path="products/:id" element={<ProductDetails />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="offline" element={<OfflinePage />} />
                    <Route
                        path="profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<RouteFallback />} />
                </Route>
            </Routes>
        </Suspense>
    );
}

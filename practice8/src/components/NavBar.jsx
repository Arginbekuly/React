
import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSelector } from 'react-redux';
import { selectCartCount } from '../features/cart/cartSelectors.js';

const links = [
    ["/", "Home"],
    ["/products", "Products"],
    ["/dashboard", "Dashboard"],
    ["/about", "About"],
];

export default function NavBar() {
    const { user, loading, logout, busy } = useAuth();
    const cartCount = useSelector(selectCartCount);

    const navigate = useNavigate();
    const location = useLocation();

    const [error, setError] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    function toggleMenu() {
        setMenuOpen(prev => !prev);
    }

    function closeMenu() {
        setMenuOpen(false);
    }

    async function handleLogout() {
        setError("");

        try {
            await logout();
            closeMenu();
            navigate("/login", { replace: true });
        } catch {
            setError("Logout failed.");
        }
    }

    const linkClass = ({ isActive }) =>
        `block rounded-lg px-3 py-3 text-base transition
        hover:bg-slate-100 md:px-0 md:py-0 md:hover:bg-transparent
        ${
            isActive
                ? "font-semibold text-blue-600"
                : "text-slate-600 hover:text-blue-600"
        }`;

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:flex-nowrap md:px-5 md:py-4">

                <NavLink
                    to="/"
                    onClick={closeMenu}
                    className="text-xl font-bold text-slate-900"
                >
                    React Shop
                </NavLink>

                <button
                    type="button"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                    aria-controls="shop-navigation"
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-2xl text-slate-700 hover:bg-slate-100 md:hidden"
                >
                    {menuOpen ? "✕" : "☰"}
                </button>

                <div
                    id="shop-navigation"
                    className={`
                        ${menuOpen ? "flex" : "hidden"}
                        w-full flex-col items-stretch gap-2
                        border-t border-slate-200 pt-3
                        md:flex md:w-auto md:flex-row
                        md:items-center md:gap-5
                        md:border-0 md:pt-0
                    `}
                >
                    {links.map(([path, label]) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={path === "/"}
                            className={linkClass}
                            onClick={closeMenu}
                        >
                            {label}
                        </NavLink>
                    ))}
                    <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700" aria-live="polite">Cart: {cartCount}</span>

                    {!loading && (
                        user ? (
                            <>
                                <NavLink
                                    to="/profile"
                                    className={linkClass}
                                    onClick={closeMenu}
                                >
                                    Profile
                                </NavLink>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={busy}
                                    className="min-h-11 rounded-lg bg-red-50 px-4 py-2 text-left font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 md:text-center"
                                >
                                    {busy ? "Logging out..." : "Logout"}
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    className={linkClass}
                                    onClick={closeMenu}
                                >
                                    Login
                                </NavLink>

                                <NavLink
                                    to="/signup"
                                    className={linkClass}
                                    onClick={closeMenu}
                                >
                                    Signup
                                </NavLink>
                            </>
                        )
                    )}
                </div>
            </nav>

            {error && (
                <p
                    role="alert"
                    className="px-4 pb-3 text-center text-sm text-red-600"
                >
                    {error}
                </p>
            )}
        </header>
    );
}

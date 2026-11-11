
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
    ["/", "Home"],
    ["/products", "Products"],
    ["/dashboard", "Dashboard"],
    ["/about", "About"],
];

export default function NavBar() {
    const { user, loading, logout, busy } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    async function handleLogout() {
        setError("");

        try {
            await logout();
            navigate("/login", { replace: true });
        } catch {
            setError("Logout failed.");
        }
    }

    const linkClass = ({ isActive }) =>
        isActive
            ? "font-semibold text-blue-600"
            : "text-slate-600 hover:text-blue-600";

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">

                <NavLink to="/" className="text-xl font-bold">
                    React Shop
                </NavLink>

                <div className="flex flex-wrap items-center gap-5">
                    {links.map(([path, label]) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={path === "/"}
                            className={linkClass}
                        >
                            {label}
                        </NavLink>
                    ))}

                    {!loading && (
                        user ? (
                            <>
                                <NavLink to="/profile" className={linkClass}>
                                    Profile
                                </NavLink>

                                <button
                                    onClick={handleLogout}
                                    disabled={busy}
                                    className="rounded-lg bg-red-50 px-4 py-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" className={linkClass}>
                                    Login
                                </NavLink>

                                <NavLink to="/signup" className={linkClass}>
                                    Signup
                                </NavLink>
                            </>
                        )
                    )}
                </div>
            </nav>

            {error && (
                <p role="alert" className="text-center text-sm text-red-600">
                    {error}
                </p>
            )}
        </header>
    );
}

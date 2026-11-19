
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
    const navigate = useNavigate();
    const { signup, busy } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        // Validate password length
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        // Validate matching passwords
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await signup(email.trim(), password);
            navigate("/", { replace: true });
        } catch (err) {
            if (err.code === "auth/email-already-in-use") {
                setError("This email is already registered.");
            } else if (err.code === "auth/invalid-email") {
                setError("Invalid email address.");
            } else if (err.code === "auth/weak-password") {
                setError("Password is too weak.");
            } else {
                setError("Registration failed. Please try again.");
            }
        }
    }

    return (
        <div className="mx-auto max-w-md px-5 py-16">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

                <h1 className="mb-2 text-center text-3xl font-bold">
                    Create Account
                </h1>

                <p className="mb-8 text-center text-slate-500">
                    Sign up to start shopping
                </p>

                {error && (
                    <p
                        role="alert"
                        className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600"
                    >
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label htmlFor="email" className="mb-1 block font-medium">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@gmail.com"
                            className="w-full rounded-lg border border-slate-300 p-3"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1 block font-medium">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            required
                            minLength={6}
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            className="w-full rounded-lg border border-slate-300 p-3"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="mb-1 block font-medium">
                            Confirm Password
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            required
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat password"
                            className="w-full rounded-lg border border-slate-300 p-3"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={busy}
                        className="w-full rounded-lg bg-slate-900 p-3 font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                    >
                        {busy ? "Creating account..." : "Create Account"}
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-blue-600">
                        Sign In
                    </Link>
                </p>

            </div>
        </div>
    );
}

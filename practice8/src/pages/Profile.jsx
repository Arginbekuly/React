
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const { user, logout, busy } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    async function handleLogout() {
        setError("");

        try {
            await logout();
            navigate("/login", { replace: true });
        } catch {
            setError("Failed to log out. Please try again.");
        }
    }

    return (
        <div className="mx-auto max-w-xl px-5 py-16">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

                <h1 className="mb-6 text-3xl font-bold">
                    My Profile
                </h1>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-slate-500">
                            Email
                        </p>
                        <p className="font-medium">
                            {user?.email ?? "Not provided"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">
                            User ID (UID)
                        </p>
                        <p className="break-all font-mono text-sm">
                            {user?.uid}
                        </p>
                    </div>
                </div>

                {error && (
                    <p role="alert" className="mt-4 text-red-600">
                        {error}
                    </p>
                )}

                <button
                    onClick={handleLogout}
                    disabled={busy}
                    className="mt-8 w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                    {busy ? "Logging out..." : "Logout"}
                </button>

            </div>
        </div>
    );
}

import { useState } from 'react'
import { Navigate, useNavigate , useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'


function getErrorMessage(error) {
    switch (error.code) {
        case "auth/invalid-credential":
            return "Incorrect email or password.";
        case "auth/too-many-requests":
            return "Too many attempts. Try again later.";
        case "auth/popup-closed-by-user":
            return "Google sign-in was cancelled.";
        case "auth/unauthorized-domain":
            return "This domain is not authorized in Firebase.";
        default:
            return "Authentication failed. Please try again.";
    }
}

export default function Login() {
    const navigate  = useNavigate();
    const {
        user,
        loading,
        login,
        loginWithGoogle,
        busy
    } = useAuth();
    const [email , setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');

    const location = useLocation();
    const destination = location.state?.from || "/profile";

    async function handleSubmit(e) {
        e.preventDefault();
        setFormError('');

        try {
            await login(email.trim(), password);
            navigate(destination, {replace: true});
        } catch (error) {
            setFormError(getErrorMessage(error));
        }
    }

    async function handleGoogleLogin() {
        setFormError('');

    try {
        await loginWithGoogle();
        navigate(destination, {replace: true});
    }
    catch (error) {
        setFormError(getErrorMessage(error));
    }}
    if (loading) {
        return <p>Checking authentication...</p>;
    }

    if (user) {
        return <Navigate to="/profile" replace />;
    }

    return (
        <div className="mx-auto max-w-md px-5 py-16">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="mb-2 text-center text-3xl font-bold">
                    Welcome Back
                </h1>

                <p className="mb-8 text-center text-slate-500">
                    Sign in to your account
                </p>

                {formError && (
                    <p
                        role="alert"
                        className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600"
                    >
                        {formError}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email" className="mb-1 block font-medium">Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 p-3"
                            placeholder="example@gmail.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password" className="mb-1 block font-medium">Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 p-3"
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={busy}
                        className="w-full rounded-lg bg-slate-900 p-3 font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                    >
                        {busy ? "Please wait..." : "Sign In"}
                    </button>
                </form>

                <div className="my-6 text-center text-slate-400">
                    OR
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={busy}
                    className="w-full rounded-lg border border-slate-300 p-3 font-semibold hover:bg-slate-50 disabled:opacity-50">
                    Continue with Google
                </button>
            </div>
        </div>
    );

}
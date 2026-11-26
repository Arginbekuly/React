import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar.jsx';
import useOnlineStatus from "../hooks/useOnlineStatus";
import PWAUpdatePrompt from "../components/PWAUpdatePrompt.jsx";
export default function RootLayout() {
    const isOnline = useOnlineStatus();


    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
            <NavBar />
            <div
                role="status"
                className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium ${
                    isOnline
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                }`}
            >
            <span className={`h-2.5 w-2.5 rounded-full ${ isOnline ? "bg-green-500" : "bg-red-500"}`}/>

                {isOnline ? "You are Online" : "You are Offline"}
            </div>
            <main className="flex-1">
                <Suspense fallback={<p className="py-20 text-center text-blue-600">Loading page...</p>}>
                    <Outlet />
                </Suspense>
            </main>
            <footer className="border-t border-slate-200 bg-white px-5 py-6 text-center text-sm text-slate-500">
                © 2026 NOVA — React Routing Homework · Data from DummyJSON
            </footer>
            <PWAUpdatePrompt />
        </div>
    );
}

import { Suspense } from 'react';
import { Outlet } from 'react-router';
import NavBar from '../components/NavBar.jsx';

export default function RootLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
            <NavBar />
            <main className="flex-1">
                <Suspense fallback={<p className="py-20 text-center text-blue-600">Loading page...</p>}>
                    <Outlet />
                </Suspense>
            </main>
            <footer className="border-t border-slate-200 bg-white px-5 py-6 text-center text-sm text-slate-500">
                © 2026 NOVA — React Routing Homework · Data from DummyJSON
            </footer>
        </div>
    );
}

import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 text-center">
            <p className="text-8xl font-black tracking-tight text-blue-600">404</p>
            <h1 className="mt-3 text-3xl font-bold">Page not found</h1>
            <p className="mt-3 text-slate-500">This page doesn't exist, but plenty of great products do.</p>
            <Link to="/" className="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">← Go Home</Link>
        </section>
    );
}

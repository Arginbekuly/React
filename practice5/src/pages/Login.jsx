export default function Login() {
    return (
        <section className="flex min-h-[72vh] items-center justify-center px-5 py-12">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
                <div className="mb-7 text-center"><p className="text-sm font-bold uppercase tracking-widest text-blue-600">NOVA</p><h1 className="mt-2 text-3xl font-black">Welcome back</h1><p className="mt-2 text-sm text-slate-500">Login page preview for future authentication.</p></div>
                <label className="mb-2 block text-sm font-semibold">Email</label>
                <input type="email" placeholder="you@example.com" className="mb-5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" />
                <label className="mb-2 block text-sm font-semibold">Password</label>
                <input type="password" placeholder="••••••••" className="mb-5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" />
                <button type="button" disabled className="w-full cursor-not-allowed rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white opacity-70">Sign in (coming soon)</button>
                <p className="mt-4 text-center text-xs text-slate-400">Authentication is not enabled in this homework.</p>
            </div>
        </section>
    );
}

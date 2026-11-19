import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <section className="mx-auto grid min-h-[75vh] max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2">
            <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-blue-600">Discover better</p>
                <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl">Find products that <span className="text-blue-600">inspire.</span></h1>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-500">Explore hundreds of products, discover your favorites, and make shopping simple.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Link to="/products" className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">Explore Products →</Link>
                    <Link to="/about" className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100">About Project</Link>
                </div>
            </div>
            <div className="overflow-hidden rounded-3xl bg-blue-100 shadow-xl">
                <img className="h-[400px] w-full object-cover" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1100&q=85" alt="Red athletic sneakers on a vivid red background" />
            </div>
        </section>
    );
}

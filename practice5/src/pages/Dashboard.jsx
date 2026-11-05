import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getProducts } from '../services/services.js';

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        async function loadData() {
            try {
                const data = await getProducts('', controller.signal);
                if (!controller.signal.aborted) setProducts(data.products || []);
            } catch (err) {
                if (!controller.signal.aborted) setError(err.message);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        loadData();
        return () => controller.abort();
    }, []);

    const categories = [...new Set(products.map((p) => p.category))].sort();
    const selected = category === 'all' ? products : products.filter((p) => p.category === category);
    const count = selected.length;
    const average = (key) => count ? (selected.reduce((sum, p) => sum + (Number(p[key]) || 0), 0) / count).toFixed(2) : '0.00';
    const stock = selected.reduce((sum, p) => sum + (p.stock || 0), 0);

    // Breakdown 1: number of products in each category.
    const byCategory = Object.entries(selected.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxCategory = Math.max(1, ...byCategory.map(([, n]) => n));

    // Breakdown 2: stock level distribution.
    const byStock = [
        ['Out of stock', selected.filter((p) => p.stock === 0).length],
        ['Low stock (1–20)', selected.filter((p) => p.stock > 0 && p.stock <= 20).length],
        ['In stock (21+)', selected.filter((p) => p.stock > 20).length],
    ];
    const topRated = [...selected].sort((a, b) => b.rating - a.rating).slice(0, 3);

    return (
        <section className="mx-auto max-w-6xl px-5 py-10">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Store overview</p>
                    <h1 className="text-4xl font-black tracking-tight">Dashboard<span className="text-blue-600">.</span></h1>
                    <p className="mt-2 text-slate-500">Live insights calculated from the products API.</p>
                </div>
                <label className="text-sm font-medium text-slate-600">Filter category
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2 block rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200">
                        <option value="all">All categories</option>
                        {categories.map((c) => <option key={c} value={c}>{c.replaceAll('-', ' ')}</option>)}
                    </select>
                </label>
            </div>

            {loading ? <p className="py-16 text-center text-blue-600">Loading statistics...</p> : error ? <p role="alert" className="rounded-xl bg-red-50 p-6 text-red-600">{error}</p> : (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            ['Products', count],
                            ['Average price', `$${average('price')}`],
                            ['Average rating', `★ ${average('rating')}`],
                            ['Total stock', stock.toLocaleString()],
                        ].map(([label, value]) => (
                            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-sm font-medium text-slate-500">{label}</p>
                                <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-7 grid gap-6 lg:grid-cols-2">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 text-xl font-bold">Category breakdown</h2>
                            <div className="space-y-4">
                                {byCategory.map(([name, amount]) => (
                                    <div key={name}>
                                        <div className="mb-1 flex justify-between text-sm"><span className="capitalize text-slate-600">{name.replaceAll('-', ' ')}</span><b>{amount}</b></div>
                                        <div className="h-2.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${amount / maxCategory * 100}%` }} /></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 text-xl font-bold">Stock breakdown</h2>
                            <div className="space-y-4">
                                {byStock.map(([name, amount]) => (
                                    <div key={name}>
                                        <div className="mb-1 flex justify-between text-sm"><span className="text-slate-600">{name}</span><b>{amount}</b></div>
                                        <div className="h-2.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-500" style={{ width: `${count ? amount / count * 100 : 0}%` }} /></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <h2 className="text-xl font-bold">Top-rated products</h2>
                            <Link to="/products" className="text-sm font-semibold text-blue-600 hover:underline">Browse all →</Link>
                        </div>
                        <div className="grid gap-3 md:grid-cols-3">
                            {topRated.map((p) => (
                                <Link key={p.id} to={`/products/${p.id}`} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 hover:bg-blue-50">
                                    <img src={p.thumbnail} alt="" className="h-16 w-16 rounded-lg object-contain" />
                                    <div><p className="text-sm font-semibold text-slate-900">{p.title}</p><p className="text-xs text-amber-600">★ {p.rating} · ${p.price}</p></div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { getProducts } from '../services/services.js';
import ProductCard from '../components/ProductCard.jsx';

const PAGE_SIZE = 9;
const inputStyle = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [params, setParams] = useSearchParams();

    const search = params.get('search') || '';
    const category = params.get('category') || 'all';
    const price = params.get('price') || 'all';
    const sort = params.get('sort') || 'default';
    const requestedPage = Math.max(1, Number(params.get('page')) || 1);

    function changeParam(key, value) {
        const next = new URLSearchParams(params);
        if (!value || value === 'all' || value === 'default') next.delete(key);
        else next.set(key, value);
        next.delete('page'); // New filters start from page 1.
        setParams(next, { replace: key === 'search' });
    }

    function changePage(newPage) {
        const next = new URLSearchParams(params);
        if (newPage === 1) next.delete('page');
        else next.set('page', String(newPage));
        setParams(next);
    }

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError('');

        async function loadProducts() {
            try {
                const data = await getProducts(search, controller.signal);
                if (!controller.signal.aborted) setProducts(data.products || []);
            } catch (err) {
                if (!controller.signal.aborted) setError(err.message);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        loadProducts();
        return () => controller.abort();
    }, [search]);

    const categories = [...new Set(products.map((p) => p.category))].sort();
    const filtered = products.filter((p) => {
        const matchesCategory = category === 'all' || p.category === category;
        const matchesPrice = price === 'all' ||
            (price === 'under50' && p.price < 50) ||
            (price === '50to200' && p.price >= 50 && p.price <= 200) ||
            (price === 'over200' && p.price > 200);
        return matchesCategory && matchesPrice;
    });

    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    if (sort === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title));

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const page = Math.min(requestedPage, totalPages);
    const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <section className="mx-auto max-w-6xl px-5 py-10">
            <div className="mb-8">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Curated collection</p>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">Discover products<span className="text-blue-600">.</span></h1>
                <p className="mt-3 text-slate-500">Explore, filter and find exactly what you need.</p>
            </div>

            <div className="mb-8 grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-4">
                <label className="block xl:col-span-1">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Search</span>
                    <input type="search" value={search} onChange={(e) => changeParam('search', e.target.value)} placeholder="Search products..." className={inputStyle} />
                </label>
                <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Category</span>
                    <select value={category} onChange={(e) => changeParam('category', e.target.value)} className={inputStyle}>
                        <option value="all">All categories</option>
                        {categories.map((c) => <option key={c} value={c}>{c.replaceAll('-', ' ')}</option>)}
                        {category !== 'all' && !categories.includes(category) && <option value={category}>{category.replaceAll('-', ' ')}</option>}
                    </select>
                </label>
                <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Price</span>
                    <select value={price} onChange={(e) => changeParam('price', e.target.value)} className={inputStyle}>
                        <option value="all">All prices</option><option value="under50">Under $50</option>
                        <option value="50to200">$50 – $200</option><option value="over200">Over $200</option>
                    </select>
                </label>
                <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Sort by</span>
                    <select value={sort} onChange={(e) => changeParam('sort', e.target.value)} className={inputStyle}>
                        <option value="default">Featured</option><option value="price-asc">Price: low to high</option>
                        <option value="price-desc">Price: high to low</option><option value="rating">Top rating</option>
                        <option value="title">Name: A–Z</option>
                    </select>
                </label>
            </div>

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500">{loading ? 'Finding products…' : `${filtered.length} products found`}</p>
                <button onClick={() => setParams({})} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Clear filters</button>
            </div>

            {loading ? <p className="py-16 text-center text-blue-600">Loading products...</p> :
                error ? <p role="alert" className="rounded-2xl bg-red-50 p-6 text-center text-red-600">{error}</p> :
                    visible.length === 0 ? <p className="rounded-2xl bg-white p-12 text-center text-slate-500">No products found. Try different filters.</p> :
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {visible.map((product) => <ProductCard key={product.id} product={product} />)}
                        </div>
            }

            {!loading && !error && totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-4">
                    <button onClick={() => changePage(page - 1)} disabled={page === 1} className="rounded-xl bg-white px-5 py-3 text-sm font-semibold shadow-sm disabled:opacity-40">← Previous</button>
                    <span className="text-sm font-medium text-slate-600">Page {page} of {totalPages}</span>
                    <button onClick={() => changePage(page + 1)} disabled={page === totalPages} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">Next →</button>
                </div>
            )}
        </section>
    );
}

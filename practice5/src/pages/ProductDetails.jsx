import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../services/services.js';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError('');
        setProduct(null);

        if (!/^\d+$/.test(id || '') || Number(id) <= 0) {
            setError('Invalid product ID');
            setLoading(false);
            return () => controller.abort();
        }

        async function loadProduct() {
            try {
                const data = await getProductById(id, controller.signal);
                if (!controller.signal.aborted) setProduct(data);
            } catch (err) {
                if (!controller.signal.aborted) setError(err.message);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        loadProduct();
        return () => controller.abort();
    }, [id]);

    if (loading) return <p className="py-20 text-center text-blue-600">Loading product...</p>;
    if (error || !product) return <div className="mx-auto max-w-6xl p-10 text-center"><h1 className="text-3xl font-bold">Product not found</h1><p className="my-5 text-slate-500">{error || 'This item is unavailable.'}</p><Link className="text-blue-600 underline" to="/products">All Products</Link></div>;

    return (
        <section className="mx-auto max-w-6xl px-5 py-10">
            <div className="mb-6 flex gap-3">
                <button onClick={() => navigate(-1)} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">← Back</button>
                <Link to="/products" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">All Products →</Link>
            </div>
            <div className="grid gap-9 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
                <div className="flex min-h-80 items-center justify-center rounded-2xl bg-slate-100 p-8">
                    <img src={product.thumbnail} alt={product.title} className="h-80 w-full object-contain" />
                </div>
                <div className="space-y-4">
                    <p className="text-sm font-bold uppercase tracking-wider text-blue-600">{product.category?.replaceAll('-', ' ')}</p>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">{product.title}</h1>
                    <p className="font-semibold text-amber-600">★ {product.rating} rating</p>
                    <p className="text-4xl font-black text-blue-600">${product.price}</p>
                    <p className="leading-relaxed text-slate-600">{product.description}</p>
                    <div className="grid grid-cols-2 gap-3 pt-3 text-sm">
                        {[
                            ['Brand', product.brand ?? 'Not specified'],
                            ['Stock', product.stock],
                            ['Discount', `${product.discountPercentage}%`],
                            ['SKU', product.sku ?? '—'],
                            ['Warranty', product.warrantyInformation ?? '—'],
                            ['Shipping', product.shippingInformation ?? '—'],
                        ].map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-semibold text-slate-900">{value}</p></div>)}
                    </div>
                </div>
            </div>
        </section>
    );
}

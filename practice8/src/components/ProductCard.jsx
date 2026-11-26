import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice.js';

export default function ProductCard({ product }) {
    const dispatch = useDispatch();
    if (!product) return null;

    return (
        <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <Link to={`/products/${product.id}`} className="block">
            <div className="flex h-56 items-center justify-center bg-slate-100 p-5">
                <img src={product.thumbnail} alt={product.title} loading="lazy" className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="space-y-2 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{product.category?.replaceAll('-', ' ')}</p>
                <h2 className="min-h-12 text-lg font-semibold leading-snug text-slate-900">{product.title}</h2>
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xl font-bold text-slate-900">${product.price}</span>
                    <span className="text-sm text-amber-600">★ {product.rating}</span>
                </div>
            </div>
        </Link>
        <button type="button" onClick={() => dispatch(addToCart(product))} className="m-4 mt-0 w-[calc(100%-2rem)] rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700">Add to cart</button>
        </article>
    );
}

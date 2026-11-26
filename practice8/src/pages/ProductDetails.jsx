
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails } from '../features/productDetails/productDetailsThunks.js';
import { selectProductDetails, selectProductDetailsError, selectProductDetailsStatus } from '../features/productDetails/productDetailsSelectors.js';
import { saveProductTitle } from '../features/products/productsThunks.js';
import { resetProductUpdate } from '../features/products/productsSlice.js';
import { addToCart } from '../features/cart/cartSlice.js';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const productId = Number(id);
    const validId = Number.isSafeInteger(productId) && productId > 0;

    const product = useSelector((state) => selectProductDetails(state, productId));
    const detailStatus = useSelector((state) => selectProductDetailsStatus(state, productId));
    const detailError = useSelector((state) => selectProductDetailsError(state, productId));
    const updateStatus = useSelector((state) => state.products.updateStatus);
    const updateError = useSelector((state) => state.products.updateError);

    useEffect(() => {
        if (validId && detailStatus === 'idle') dispatch(fetchProductDetails(productId));
    }, [dispatch, productId, validId, detailStatus]);

    const isPending = detailStatus === 'idle' || detailStatus === 'loading';
    const isError = detailStatus === 'failed';
    const [newTitle, setNewTitle] = useState("");

    function handleUpdate(e) {
        e.preventDefault();

        const title = newTitle.trim();

        if (!title || !validId) return;

        dispatch(resetProductUpdate());
        dispatch(saveProductTitle({
            id: productId,
            title,
        }));
    }

    if (!validId) {
        return (
            <div className="mx-auto max-w-6xl px-5 py-16">
                <p className="text-center text-red-600">
                    Invalid product ID.
                </p>
            </div>
        );
    }

    if (isPending) {
        return (
            <div className="py-20 text-center text-blue-600">
                Loading product...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-6xl px-5 py-16 text-center">
                <p className="mb-6 text-red-600">{detailError}</p>
                <button onClick={() => dispatch(fetchProductDetails(productId))} className="mb-5 rounded-xl bg-blue-600 px-5 py-3 text-white">Retry</button>

                <button
                    onClick={() => navigate("/products")}
                    className="rounded-xl bg-slate-900 px-6 py-3 text-white"
                >
                    Back to Products
                </button>
            </div>
        );
    }

    if (!product) {
        return (
            <p className="py-20 text-center">
                Product not found.
            </p>
        );
    }

    return (
        <section className="mx-auto max-w-6xl px-5 py-10">
            <button
                onClick={() => navigate("/products")}
                className="mb-8 text-sm font-semibold text-blue-600 hover:underline"
            >
                ← Back to Products
            </button>

            <div className="grid gap-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
                <div className="flex items-center justify-center rounded-2xl bg-slate-50 p-8">
                    <img

                        src={product.thumbnail || product.images?.[0]}
                        alt={product.title}
                        className="max-h-96 w-full object-contain"

                    />
                </div>

                <div className="space-y-5">
                    <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                        {product.category}
                    </p>

                    <h1 className="text-3xl font-black tracking-tight text-slate-900">
                        {product.title}
                    </h1>

                    <p className="text-3xl font-bold text-blue-600">
                        ${product.price}
                    </p>

                    <p className="leading-7 text-slate-600">
                        {product.description}
                    </p>

                    <div className="space-y-2 border-t border-slate-100 pt-5 text-sm">
                        <p>
                            <strong>Brand:</strong> {product.brand || "N/A"}
                        </p>

                        <p>
                            <strong>Rating:</strong> ⭐ {product.rating}
                        </p>

                        <p>
                            <strong>Stock:</strong> {product.stock}
                        </p>

                        <p>
                            <strong>Availability:</strong>{" "}
                            {product.availabilityStatus ||
                                (product.stock > 0 ? "In Stock" : "Out of Stock")}
                        </p>
                    </div>

                    <button type="button" onClick={() => dispatch(addToCart(product))} className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">Add to cart</button>
                </div>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-2 text-xl font-bold text-slate-900">
                    Update Product (Demo)
                </h2>

                <p className="mb-5 text-sm text-slate-500">
                    Test the update request.
                </p>

                <form onSubmit={handleUpdate} className="flex flex-col gap-3 sm:flex-row">
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => {
                            setNewTitle(e.target.value);
                            dispatch(resetProductUpdate());
                        }}
                        required
                        placeholder="Enter new product title"
                        className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />

                    <button
                        type="submit"
                        disabled={updateStatus === 'loading'}
                        className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {updateStatus === 'loading' ? "Updating..." : "Update Product"}
                    </button>
                </form>

                {updateStatus === 'succeeded' && (
                    <p className="mt-4 text-sm text-green-600">
                        Update request succeeded: {product?.title}.
                    </p>
                )}

                {updateStatus === 'failed' && (
                    <p role="alert" className="mt-4 text-sm text-red-600">
                        {updateError}
                    </p>
                )}
            </div>
        </section>
    );
}

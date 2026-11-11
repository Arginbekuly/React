
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductsQuery } from "../hooks/useProductsQuery.js";
import { useUpdateProduct } from "../hooks/useUpdateProduct";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const productId = Number(id);
    const validId = Number.isSafeInteger(productId) && productId > 0;

    const {
        data: product,
        isPending,
        isError,
        error,
        isFetching,
    } = useProductsQuery(id);

    const updateMutation = useUpdateProduct();
    const [newTitle, setNewTitle] = useState("");

    function handleUpdate(e) {
        e.preventDefault();

        const title = newTitle.trim();

        if (!title || !validId) return;

        updateMutation.mutate({
            id: productId,
            title,
        });
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
                <p className="mb-6 text-red-600">{error.message}</p>

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

                    {isFetching && (
                        <p className="text-sm text-blue-500">
                            Updating cached data...
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-2 text-xl font-bold text-slate-900">
                    Update Product (Demo)
                </h2>

                <p className="mb-5 text-sm text-slate-500">
                    Test the update request and cache invalidation.
                </p>

                <form onSubmit={handleUpdate} className="flex flex-col gap-3 sm:flex-row">
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => {
                            setNewTitle(e.target.value);
                            updateMutation.reset();
                        }}
                        required
                        placeholder="Enter new product title"
                        className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />

                    <button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {updateMutation.isPending ? "Updating..." : "Update Product"}
                    </button>
                </form>

                {updateMutation.isSuccess && (
                    <p className="mt-4 text-sm text-green-600">
                        Update request succeeded: {updateMutation.data.title}.
                        Cache invalidated successfully.
                    </p>
                )}

                {updateMutation.isError && (
                    <p role="alert" className="mt-4 text-sm text-red-600">
                        {updateMutation.error.message}
                    </p>
                )}
            </div>
        </section>
    );
}

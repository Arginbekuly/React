
import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from "../components/ProductCard.jsx";
import { fetchProducts } from '../features/products/productsThunks.js';
import { selectFilteredProducts, selectProductCategories, selectProductsError, selectProductsStatus } from '../features/products/productsSelectors.js';

const PAGE_SIZE = 9;

const inputStyle =
    "w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-sm";

export default function Products() {
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const status = useSelector(selectProductsStatus);
    const error = useSelector(selectProductsError);
    const categories = useSelector(selectProductCategories);
    const search = params.get("search") || "";
    const [searchInput, setSearchInput] = useState(search);
    const filters = useMemo(() => ({
        search,
        category: params.get('category') || 'all',
        price: params.get('price') || 'all',
        sort: params.get('sort') || 'default',
    }), [search, params]);
    const filtered = useSelector((state) => selectFilteredProducts(state, filters));

    useEffect(() => {
        if (status === 'idle') dispatch(fetchProducts());
    }, [dispatch, status]);

    useEffect(() => setSearchInput(search), [search]);
    useEffect(() => {
        if (searchInput === search) return;
        const timeout = setTimeout(() => changeParam('search', searchInput), 300);
        return () => clearTimeout(timeout);
    }, [searchInput]);

    const loading = status === 'idle' || status === 'loading';
    const isError = status === 'failed';

    const category = params.get("category") || "all";
    const price = params.get("price") || "all";
    const sort = params.get("sort") || "default";

    const requestedPage = Math.max(
        1,
        Number(params.get("page")) || 1
    );

    function changeParam(key, value) {
        setParams((current) => {
            const next = new URLSearchParams(current);
            if (!value || value === "all" || value === "default") next.delete(key);
            else next.set(key, value);
            next.delete("page");
            return next;
        }, {
            replace: key === "search"
        });
    }

    function changePage(newPage) {
        const next = new URLSearchParams(params);

        if (newPage === 1) {
            next.delete("page");
        } else {
            next.set("page", String(newPage));
        }

        setParams(next);
    }

    const products = useSelector((state) => state.products.items);

    const totalPages = Math.max(
        1,
        Math.ceil(filtered.length / PAGE_SIZE)
    );

    const page = Math.min(requestedPage, totalPages);

    const visible = filtered.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    return (
        <section className="mx-auto w-full min-w-0 max-w-6xl px-4 py-7 sm:px-5 sm:py-10">

            <div className="mb-6 sm:mb-8">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                    Curated collection
                </p>

                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                    Discover products
                    <span className="text-blue-600">.</span>
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
                    Explore, filter and find exactly what you need.
                </p>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-8 sm:rounded-3xl sm:p-5 md:grid-cols-2 xl:grid-cols-4">

                <label className="block min-w-0">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        Search
                    </span>

                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search products..."
                        className={inputStyle}
                    />
                </label>

                <label className="block min-w-0">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        Category
                    </span>

                    <select
                        value={category}
                        onChange={(e) =>
                            changeParam("category", e.target.value)
                        }
                        className={inputStyle}
                    >
                        <option value="all">
                            All categories
                        </option>

                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c.replaceAll("-", " ")}
                            </option>
                        ))}

                        {category !== "all" &&
                            !categories.includes(category) && (
                                <option value={category}>
                                    {category.replaceAll("-", " ")}
                                </option>
                            )}
                    </select>
                </label>

                <label className="block min-w-0">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        Price
                    </span>

                    <select
                        value={price}
                        onChange={(e) =>
                            changeParam("price", e.target.value)
                        }
                        className={inputStyle}
                    >
                        <option value="all">All prices</option>
                        <option value="under50">Under $50</option>
                        <option value="50to200">$50 – $200</option>
                        <option value="over200">Over $200</option>
                    </select>
                </label>

                <label className="block min-w-0">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        Sort by
                    </span>

                    <select
                        value={sort}
                        onChange={(e) =>
                            changeParam("sort", e.target.value)
                        }
                        className={inputStyle}
                    >
                        <option value="default">Featured</option>
                        <option value="price-asc">
                            Price: low to high
                        </option>
                        <option value="price-desc">
                            Price: high to low
                        </option>
                        <option value="rating">Top rating</option>
                        <option value="title">Name: A–Z</option>
                    </select>
                </label>
            </div>

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                    {loading
                        ? "Finding products..."
                        : isError
                            ? "Unable to load products"
                            : `${filtered.length} products found`}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setParams({})}
                        className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-95"
                    >
                        Clear filters
                    </button>
                </div>
            </div>

            {loading ? (
                <p className="py-16 text-center text-blue-600">
                    Loading products...
                </p>
            ) : isError ? (
                <div className="text-center">
                    <p role="alert" className="rounded-2xl bg-red-50 p-6 text-red-600">
                        {error || "Failed to load products."}
                    </p>
                    <button type="button" onClick={() => dispatch(fetchProducts())} className="mt-4 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white">Retry</button>
                </div>
            ) : visible.length === 0 ? (
                <p className="rounded-2xl bg-white p-8 text-center text-slate-500 sm:p-12">
                    No products found. Try different filters.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                    {visible.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            )}

            {!loading && !isError && totalPages > 1 && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">

                    <button
                        type="button"
                        onClick={() => changePage(page - 1)}
                        disabled={page === 1}
                        className="min-h-11 rounded-xl bg-white px-3 py-3 text-sm font-semibold shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
                    >
                        ← Previous
                    </button>

                    <span className="text-center text-sm font-medium text-slate-600">
                        Page {page} of {totalPages}
                    </span>

                    <button
                        type="button"
                        onClick={() => changePage(page + 1)}
                        disabled={page === totalPages}
                        className="min-h-11 rounded-xl bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
                    >
                        Next →
                    </button>

                </div>
            )}
        </section>
    );
}

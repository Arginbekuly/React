import { Link } from 'react-router-dom';

export default function About() {
    return (
        <section className="mx-auto max-w-5xl px-5 py-14">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-blue-600">Our story</p>
            <h1 className="text-4xl font-black text-slate-900 md:text-5xl">About NOVA<span className="text-blue-600">.</span></h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">NOVA is a product discovery application built with React, React Router and Tailwind CSS. Products are fetched from the DummyJSON API.</p>
            <div className="mt-9 grid gap-5 md:grid-cols-3">
                {[
                    ['01', 'Discover', 'Search and explore products from an API.'],
                    ['02', 'Compare', 'Filter, sort and inspect product details.'],
                    ['03', 'Learn', 'Explore app architecture, routing and reusable components.'],
                ].map(([n, title, description]) => <div key={n} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-bold text-blue-600">{n}</p><h2 className="mt-4 text-xl font-bold">{title}</h2><p className="mt-2 text-slate-500">{description}</p></div>)}
            </div>
            <Link to="/products" className="mt-9 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">Explore Products →</Link>
        </section>
    );
}

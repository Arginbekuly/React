import { NavLink } from 'react-router-dom';

const links = [
    ['/', 'Home'],
    ['/products', 'Products'],
    ['/dashboard', 'Dashboard'],
    ['/about', 'About'],
    ['/login', 'Login'],
];

export default function NavBar() {
    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
                <NavLink to="/" className="text-xl font-black tracking-tight text-slate-900">NOVA<span className="text-blue-600">.</span></NavLink>
                <div className="flex flex-wrap gap-2">
                    {links.map(([to, text]) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) => `rounded-xl px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                        >
                            {text}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </header>
    );
}

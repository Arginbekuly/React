export function Footer({ onNavigate }) {
  return (
    <footer className="mt-16 bg-navy py-9 text-paper">
      <div className="container-page flex flex-wrap justify-between gap-6">
        <div>
          <p className="text-[22px] font-extrabold">SKYLINE AIR</p>
          <p className="mt-1 text-sm text-[#e8e1cf]">Касса и управление парком · Est. 1962</p>
        </div>
        <nav
          aria-label="Нижнее меню"
          className="flex flex-wrap items-center gap-5 text-sm text-gold"
        >
          {[
            ['catalog', 'Каталог'],
            ['build', 'Конструктор'],
            ['fleet', 'Мой парк'],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => onNavigate('home')}
              className="inline-flex min-h-11 items-center hover:underline"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

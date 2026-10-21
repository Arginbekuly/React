export function Pagination({ page, total, perPage, onChange }) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  return (
    <nav
      aria-label="Пагинация каталога"
      className="mt-6 flex flex-wrap items-center justify-between gap-4"
    >
      <p className="eyebrow font-semibold">
        Найдено {total} моделей · страница {page} из {pages}
      </p>
      <div className="flex flex-wrap gap-2">
        <button className="chip" disabled={page === 1} onClick={() => onChange(page - 1)}>
          Назад
        </button>
        {Array.from({ length: pages }, (_, index) => index + 1)
          .filter((item) => item === 1 || item === pages || Math.abs(page - item) <= 1)
          .map((item, index, items) => (
            <span key={item} className="flex items-center gap-2">
              {index > 0 && item - items[index - 1] > 1 && <span>…</span>}
              <button
                aria-label={`Страница ${item}`}
                aria-current={page === item ? 'page' : undefined}
                className={`chip px-3.5 ${page === item ? 'chip-active' : ''}`}
                onClick={() => onChange(item)}
              >
                {item}
              </button>
            </span>
          ))}
        <button className="chip" disabled={page === pages} onClick={() => onChange(page + 1)}>
          Вперёд
        </button>
      </div>
    </nav>
  );
}

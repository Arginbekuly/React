const filters = [
  ['all', 'Все'],
  ['ready', 'Готовые к вылету'],
  ['in_flight', 'В рейсе'],
  ['repair', 'На ремонте / ТО'],
  ['rented', 'Арендованные'],
];
export function FilterChips({ active, counts, onChange }) {
  return (
    <div className="flex flex-wrap gap-2.5" role="group" aria-label="Фильтр по статусу">
      {filters.map(([id, label]) => (
        <button
          key={id}
          className={`chip ${active === id ? 'chip-active' : ''}`}
          aria-pressed={active === id}
          onClick={() => onChange(id)}
        >
          {label}
          <span
            className={`rounded-full px-2 py-0.5 font-mono text-xs text-navy ${active === id ? 'bg-gold' : 'bg-paper'}`}
          >
            {counts[id] || 0}
          </span>
        </button>
      ))}
    </div>
  );
}

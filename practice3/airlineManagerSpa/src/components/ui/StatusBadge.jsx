export function StatusBadge({ plane }) {
  const [label, color] =
    plane.status === 'in_flight'
      ? ['В рейсе', 'bg-blue/10 text-blue']
      : plane.status === 'repair'
        ? ['На обслуживании', 'bg-red/10 text-red']
        : plane.wear >= 90
          ? ['Нужен ремонт', 'bg-red/10 text-red']
          : plane.wear >= 60
            ? ['Скоро ТО', 'bg-gold/50 text-muted']
            : ['В строю', 'bg-green/10 text-green'];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide ${color}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

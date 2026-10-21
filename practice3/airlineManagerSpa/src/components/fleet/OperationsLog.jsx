export function OperationsLog({ entries }) {
  return (
    <aside className="paper p-6">
      <h3 className="eyebrow mb-2 font-semibold">Журнал операций</h3>
      <ul className="max-h-[360px] overflow-auto">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="flex gap-3 border-b border-dotted border-line py-3 text-sm leading-relaxed last:border-0"
          >
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-green" />
            {entry.text}
          </li>
        ))}
      </ul>
    </aside>
  );
}

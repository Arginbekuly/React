export function LoadingState({ label = 'Загружаем данные…', cards = 1 }) {
  return (
    <div role="status" aria-live="polite" className="py-4">
      <p className="eyebrow mb-4">{label}</p>
      <div className={`grid gap-5 ${cards > 1 ? 'sm:grid-cols-2 xl:grid-cols-4' : ''}`}>
        {Array.from({ length: cards }, (_, index) => (
          <div key={index} className="paper h-52 animate-pulse p-5 motion-reduce:animate-none">
            <div className="mb-5 h-20 rounded-lg bg-line/40" />
            <div className="mb-3 h-4 w-3/4 rounded bg-line/40" />
            <div className="h-4 w-1/2 rounded bg-line/40" />
          </div>
        ))}
      </div>
    </div>
  );
}

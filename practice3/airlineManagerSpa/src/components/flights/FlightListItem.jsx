export function FlightListItem({ flight, selected, onSelect }) {
  return (
    <button
      className={`w-full rounded-[14px] border p-4 text-left transition-colors ${selected ? 'border-navy bg-navy text-paper' : 'border-line bg-ticket hover:bg-paper'}`}
      onClick={onSelect}
    >
      <div className="flex justify-between gap-2">
        <b className="font-mono text-sm">{flight.code}</b>
        <span className={`text-[10px] font-semibold ${selected ? 'text-gold' : 'text-green'}`}>
          {flight.complete ? 'ПРИБЫЛ' : 'В ВОЗДУХЕ'}
        </span>
      </div>
      <p className="mt-3 text-sm font-semibold">Хаб → {flight.destination.name}</p>
      <p className={`mt-1 text-xs ${selected ? 'text-paper/70' : 'text-muted'}`}>
        {flight.planeName}
      </p>
    </button>
  );
}

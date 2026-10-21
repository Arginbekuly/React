import { destinations } from '../data';

export function DepartureBoard({ flights, freeSlots, onNavigate }) {
  return (
    <div className="rounded-[18px] bg-navy px-5 py-5 font-mono text-gold shadow-[0_22px_40px_-24px_rgba(20,25,50,.8)] sm:px-6">
      <div className="mb-3 flex flex-wrap justify-between gap-2 text-[11px] tracking-wider">
        <span>ТАБЛО ВЫЛЕТОВ</span>
        <span className="text-[#b8c4d8]">Мест в парке: {freeSlots}</span>
      </div>
      <div className="grid grid-cols-[60px_1fr_86px] gap-2 border-b border-gold/25 py-3 text-[10px] tracking-widest text-[#b8c4d8]">
        <span>РЕЙС</span>
        <span>КУДА</span>
        <span>СТАТУС</span>
      </div>
      {flights.length
        ? flights.slice(0, 4).map((flight) => (
            <div
              key={flight.id}
              className="grid grid-cols-[60px_1fr_86px] items-center gap-2 border-b border-gold/20 py-3.5 text-xs last:border-0"
            >
              <span>{flight.code}</span>
              <span className="text-paper">{flight.destination.name}</span>
              <span className={flight.complete ? 'text-[#8bcca8]' : 'text-gold'}>
                ● {flight.complete ? 'Прибыл' : 'В воздухе'}
              </span>
            </div>
          ))
        : destinations.slice(0, 4).map((destination, index) => (
            <div
              key={destination.id}
              className="grid grid-cols-[60px_1fr_86px] items-center gap-2 border-b border-gold/20 py-3.5 text-xs last:border-0"
            >
              <span>SL {101 + index * 107}</span>
              <span className="text-paper">{destination.name}</span>
              <span className="text-[#b8c4d8]">○ Ожидает</span>
            </div>
          ))}
      <button
        onClick={() => onNavigate('flights')}
        className="mt-3 min-h-11 text-[11px] underline decoration-gold/40 underline-offset-4"
      >
        Открыть табло рейсов →
      </button>
    </div>
  );
}

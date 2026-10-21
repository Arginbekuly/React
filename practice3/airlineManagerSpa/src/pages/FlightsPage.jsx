import { useState } from 'react';
import { money, number } from '../data';
import { StatTicket } from '../components/StatTicket';
import { SectionHeading } from '../components/ui/SectionHeading';
import { EmptyState } from '../components/ui/EmptyState';
import { RouteMap } from '../components/flights/RouteMap';
import { FlightListItem } from '../components/flights/FlightListItem';

export function FlightsPage({ game, onComplete, onNavigate }) {
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const visible = game.flights.filter(
    (flight) => filter === 'all' || (filter === 'air' ? !flight.complete : flight.complete),
  );
  const selected = visible.find((flight) => flight.id === selectedId) || visible[0];
  const active = game.flights.filter((flight) => !flight.complete);
  return (
    <div className="container-page pt-8">
      <section className="rounded-[20px] bg-navy p-6 text-paper sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow text-gold">Диспетчерская · SkyLine Air</p>
          <span className="rounded-full border border-[#8bcca8]/40 px-3 py-1 font-mono text-xs text-[#8bcca8]">
            ● УЧЕБНАЯ СИМУЛЯЦИЯ
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-bold sm:text-[42px]">Табло рейсов</h1>
        <p className="mt-4 text-sm text-[#c5cede]">
          От первого вылета до мягкой посадки — весь ваш флот на одном экране.
        </p>
        <div className="mt-7 grid gap-3 text-navy sm:grid-cols-3">
          <StatTicket label="В воздухе" value={active.length} />
          <StatTicket
            label="На земле"
            value={game.fleet.filter((plane) => plane.status !== 'in_flight').length}
          />
          <StatTicket
            label="Доход в пути"
            value={`+${money(active.reduce((sum, flight) => sum + flight.income, 0))}`}
            green
          />
        </div>
      </section>
      <section className="section-space grid items-start gap-6 lg:grid-cols-[320px_1fr]">
        <div>
          <SectionHeading label="Диспетчерская" title="Рейсы" />
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              ['all', 'Все'],
              ['air', 'В воздухе'],
              ['ground', 'Прибыли'],
            ].map(([id, label]) => (
              <button
                key={id}
                className={`chip px-3 text-xs ${filter === id ? 'chip-active' : ''}`}
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid max-h-[640px] gap-3 overflow-auto">
            {visible.map((flight) => (
              <FlightListItem
                key={flight.id}
                flight={flight}
                selected={selected?.id === flight.id}
                onSelect={() => setSelectedId(flight.id)}
              />
            ))}
            {!visible.length && (
              <EmptyState
                title="Всё спокойно"
                description="Назначьте борт на маршрут в разделе «Мой парк»."
              >
                <a
                  href="#fleet"
                  className="btn btn-primary text-sm"
                  onClick={() => onNavigate('home')}
                >
                  В мой парк
                </a>
              </EmptyState>
            )}
          </div>
        </div>
        <div>
          <SectionHeading label="Карта маршрутов" title="Где сейчас самолёты" />
          <div className="paper p-4 sm:p-6">
            <RouteMap flight={selected} />
            <p className="mt-3 text-xs text-muted">
              Пунктир — назначенный маршрут, сплошная линия — завершённый рейс.
            </p>
          </div>
          {selected && (
            <div className="paper mt-5 p-6">
              <p className="eyebrow text-red">Выбранный рейс</p>
              <h3 className="mt-3 text-xl font-bold">
                {selected.code} · Хаб → {selected.destination.name}
              </h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[
                  ['Борт', selected.planeName],
                  ['Дистанция', `${number(selected.destination.distance)} км`],
                  ['Доход по прибытии', `+${money(selected.income)}`],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="eyebrow">{label}</p>
                    <p className="mt-2 text-sm font-bold">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3 text-xs font-semibold">
                <span className="text-green">● Вылет</span>
                <span className="h-px flex-1 bg-line" />
                <span className={selected.complete ? 'text-green' : 'text-blue'}>● В пути</span>
                <span className="h-px flex-1 bg-line" />
                <span className={selected.complete ? 'text-green' : 'text-muted'}>● Посадка</span>
              </div>
              <p className="mt-5 mb-3 text-xs leading-relaxed text-muted">
                Ручное завершение учебного рейса начисляет доход в кассу и добавляет 15 % износа
                борту.
              </p>
              <button
                className="btn btn-primary w-full"
                disabled={selected.complete}
                onClick={() => onComplete(selected)}
              >
                {selected.complete ? 'Рейс завершён · доход зачислен' : 'Завершить рейс'}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

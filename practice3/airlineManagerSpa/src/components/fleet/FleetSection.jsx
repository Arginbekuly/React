import { useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { EmptyState } from '../ui/EmptyState';
import { OperationsLog } from './OperationsLog';
import { FleetCard } from '../FleetCard';

export function FleetSection({ fleet, log, onFlight, onSell, onRepair, onFinishRepair, discount }) {
  const [filter, setFilter] = useState('all');
  const [reverse, setReverse] = useState(false);
  const [resets, setResets] = useState({});
  const visible = fleet.filter(
    (plane) => filter === 'all' || (filter === 'rented' ? plane.isRented : plane.status === filter),
  );
  const ordered = reverse ? [...visible].reverse() : visible;
  return (
    <section id="fleet" className="section-space">
      <SectionHeading label="Мой парк" title="Ваши воздушные суда" />
      {fleet.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <select
            aria-label="Фильтр флота"
            className="field w-auto"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">Все борты ({fleet.length})</option>
            <option value="ready">На земле</option>
            <option value="in_flight">В рейсе</option>
            <option value="repair">На ТО</option>
            <option value="rented">Арендованные</option>
          </select>
          <button className="chip" onClick={() => setReverse(!reverse)}>
            Порядок {reverse ? '↑' : '↓'}
          </button>
        </div>
      )}
      <div className="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          {!fleet.length ? (
            <EmptyState>
              <a href="#catalog" className="btn btn-primary">
                К каталогу
              </a>
            </EmptyState>
          ) : (
            <>
              <p className="mb-4 text-xs leading-relaxed text-muted">
                Учебная симуляция: назначьте маршрут, затем завершите рейс на табло. Аренда
                действует 10 рейсов.
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                {ordered.map((plane) => (
                  <FleetCard
                    key={`${plane.id}-${resets[plane.id] || 0}`}
                    airplane={plane}
                    onFlight={onFlight}
                    onSell={onSell}
                    onRepair={onRepair}
                    onFinishRepair={onFinishRepair}
                    discount={discount}
                    onReset={() =>
                      setResets({ ...resets, [plane.id]: (resets[plane.id] || 0) + 1 })
                    }
                  />
                ))}
              </div>
              {!ordered.length && (
                <EmptyState
                  title="Бортов с таким статусом нет"
                  description="Выберите другой фильтр."
                />
              )}
            </>
          )}
        </div>
        <OperationsLog entries={log} />
      </div>
    </section>
  );
}

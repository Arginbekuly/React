import { useState } from 'react';
import { destinations, money } from '../data';
import { PlaneIllustration } from './ui/PlaneIllustration';
import { AircraftPhoto } from './ui/AircraftPhoto';
import { StatusBadge } from './ui/StatusBadge';
import { WearGauge } from './ui/WearGauge';
export function FleetCard({
  airplane: plane,
  onFlight,
  onSell,
  onRepair,
  onFinishRepair,
  onReset,
  discount = 0,
}) {
  const [destination, setDestination] = useState(
    destinations.find((item) => item.distance <= plane.distance)?.id || '',
  );
  const [note, setNote] = useState('');
  return (
    <article className="ticket">
      <div
        className="relative flex h-28 items-center justify-center"
        style={{ background: `linear-gradient(180deg,${plane.color},#eaf2f4)` }}
      >
        {plane.photo ? <AircraftPhoto model={plane} /> : <PlaneIllustration color={plane.livery} />}
        <span className="absolute top-3 left-3 rounded-md bg-paper px-2 py-1 font-mono text-[10px]">
          {plane.tailNumber}
        </span>
      </div>
      <div className="grid gap-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold">{plane.name}</h3>
          <StatusBadge plane={plane} />
        </div>
        <p className="text-xs text-muted">
          {plane.isRented
            ? `Аренда · ${10 - plane.flightCount} рейсов осталось`
            : 'В собственности'}{' '}
          · +{money(plane.profit)} / рейс
        </p>
        <WearGauge wear={plane.wear} />
        <label className="grid gap-2">
          <span className="eyebrow">Направление</span>
          <select
            className="field"
            value={destination}
            disabled={plane.status !== 'ready'}
            onChange={(event) => setDestination(event.target.value)}
          >
            {destinations.map((item) => (
              <option key={item.id} value={item.id} disabled={item.distance > plane.distance}>
                {item.name} · {item.distance} км
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="eyebrow">Заметка диспетчера</span>
          <input
            className="field"
            value={note}
            maxLength={100}
            placeholder="Например, утренний вылет"
            onChange={(event) => setNote(event.target.value)}
          />
        </label>
        <button
          className="btn btn-primary"
          disabled={plane.status !== 'ready' || plane.wear >= 90 || !destination}
          onClick={() => onFlight(plane, destination)}
        >
          Отправить в рейс
        </button>
        {plane.status === 'repair' ? (
          <button className="btn btn-gold" onClick={() => onFinishRepair(plane)}>
            Завершить ТО
          </button>
        ) : (
          <button
            className="btn btn-secondary text-sm"
            disabled={plane.status !== 'ready' || plane.wear === 0}
            onClick={() => onRepair(plane)}
          >
            Плановое ТО · {money(Math.round(plane.price * 0.1 * (1 - discount / 100)))}
          </button>
        )}
        <div className="flex flex-wrap justify-between gap-2">
          <button
            className="min-h-11 text-xs font-semibold text-red underline"
            disabled={plane.status !== 'ready'}
            onClick={() => onSell(plane)}
          >
            {plane.isRented ? 'Вернуть борт' : `Продать за ${money(Math.round(plane.price * 0.7))}`}
          </button>
          <button className="min-h-11 text-xs text-muted underline" onClick={onReset}>
            Сбросить карточку
          </button>
        </div>
      </div>
    </article>
  );
}

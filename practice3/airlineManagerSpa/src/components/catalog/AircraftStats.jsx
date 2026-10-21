import { money, number } from '../../data';
export function AircraftStats({ plane }) {
  return (
    <dl>
      <div className="data-row">
        <dt className="text-muted">Вместимость</dt>
        <dd className="font-semibold">{number(plane.capacity)} мест</dd>
      </div>
      <div className="data-row">
        <dt className="text-muted">Дальность</dt>
        <dd className="font-semibold">{number(plane.distance)} км</dd>
      </div>
      <div className="data-row">
        <dt className="text-muted">Доход за рейс</dt>
        <dd className="font-bold text-green">+ {money(plane.profit)}</dd>
      </div>
    </dl>
  );
}

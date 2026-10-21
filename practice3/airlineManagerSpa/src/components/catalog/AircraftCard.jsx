import { money } from '../../data';
import { AircraftPhoto } from '../ui/AircraftPhoto';
import { AircraftStats } from './AircraftStats';

export function AircraftCard({ plane, balance, onBuy, onRent, onDetails }) {
  return (
    <article className="ticket">
      <div className="relative h-[160px] overflow-hidden bg-line">
        <AircraftPhoto model={plane} />
        <span className="eyebrow absolute top-3 left-3 max-w-[85%] truncate rounded-md bg-paper px-2 py-1">
          Борт № {plane.aircraftNumber ?? plane.id}
        </span>
      </div>
      <div className="flex-1 px-[18px] pt-4 pb-2">
        <h3 className="mb-3 min-h-14 text-[19px] leading-snug font-bold">
          <button
            onClick={() => onDetails(plane.id)}
            className="text-left underline decoration-navy/30 underline-offset-4 hover:text-red"
          >
            {plane.name}
          </button>
        </h3>
        <AircraftStats plane={plane} />
      </div>
      <div className="mx-3.5 mt-2.5 border-t-2 border-dashed border-line" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 px-[18px] pt-3.5 pb-[18px]">
        <div>
          <p className="eyebrow">Покупка</p>
          <p className="mt-1 font-display text-[19px] font-bold">{money(plane.price)}</p>
        </div>
        <div>
          <p className="eyebrow">Аренда</p>
          <p className="mt-1 font-display text-[19px] font-bold">{money(plane.rentPrice)}</p>
        </div>
        <button
          className="btn btn-primary col-span-2 mt-1"
          disabled={balance < plane.price}
          onClick={() => onBuy(plane)}
        >
          Купить борт
        </button>
        <button
          className="btn btn-secondary col-span-2"
          disabled={balance < plane.rentPrice}
          onClick={() => onRent(plane)}
        >
          Взять в аренду
        </button>
      </div>
    </article>
  );
}

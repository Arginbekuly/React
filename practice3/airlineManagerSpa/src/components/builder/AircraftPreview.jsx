import { PlaneIllustration } from '../ui/PlaneIllustration';
import { AircraftStats } from '../catalog/AircraftStats';
import { money } from '../../data';
import { AircraftPhoto } from '../ui/AircraftPhoto';

export function AircraftPreview({ model }) {
  return (
    <article className="ticket">
      <div className="blueprint relative flex h-[190px] items-center justify-center">
        {model.photo ? (
          <AircraftPhoto model={model} />
        ) : (
          <PlaneIllustration className="w-full max-w-[410px] px-6" color={model.livery} />
        )}
        <span className="eyebrow absolute top-3 left-3 rounded-md bg-paper px-2 py-1">
          Новая модель
        </span>
      </div>
      <div className="p-5">
        <h3 className="mb-3 truncate text-xl font-bold">{model.name || 'Ваша модель'}</h3>
        <AircraftStats plane={model} />
      </div>
      <div className="mx-4 border-t-2 border-dashed border-line" />
      <div className="grid grid-cols-2 gap-4 p-5">
        <div>
          <p className="eyebrow">Расчётная цена</p>
          <p className="mt-2 font-display text-xl font-bold">{money(model.price)}</p>
        </div>
        <div>
          <p className="eyebrow">Окупаемость</p>
          <p className="mt-2 font-display text-xl font-bold">
            {Math.ceil(model.price / model.profit) || '—'} рейса
          </p>
        </div>
        <p className="col-span-2 text-xs leading-relaxed text-muted">
          Создание модели бесплатно. Покупка или аренда оформляется отдельно в каталоге.
        </p>
      </div>
    </article>
  );
}

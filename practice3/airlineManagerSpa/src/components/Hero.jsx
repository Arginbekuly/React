import { DepartureBoard } from './DepartureBoard';
export function Hero({ flights, freeSlots, onNavigate }) {
  return (
    <section className="grid items-center gap-9 pt-10 lg:grid-cols-2">
      <div>
        <p className="eyebrow font-semibold text-red">Касса № 1 · открыта · Est. 1962</p>
        <h1 className="mt-3 mb-4 text-[34px] leading-[1.15] font-extrabold sm:text-[46px] xl:text-[50px]">
          Соберите свой
          <br />
          флот мечты
        </h1>
        <p className="mb-6 max-w-[520px] text-base leading-relaxed text-[#3a3f52] sm:text-lg">
          Покупайте самолёты, берите их в аренду и проектируйте собственные модели. Каждый борт
          приносит доход с каждого рейса.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="#catalog" className="btn btn-primary px-6">
            Выбрать борт
          </a>
          <a href="#build" className="btn btn-gold px-6">
            Создать модель
          </a>
        </div>
      </div>
      <DepartureBoard flights={flights} freeSlots={freeSlots} onNavigate={onNavigate} />
    </section>
  );
}

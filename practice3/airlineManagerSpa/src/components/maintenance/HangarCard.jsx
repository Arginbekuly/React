import { money } from '../../data';
export function HangarCard({ hangar, balance, onBuy }) {
  return (
    <article
      className={`paper relative flex flex-col bg-ticket p-6 ${hangar.id === 'medium' ? 'border-2 border-navy' : ''}`}
    >
      <p className="eyebrow mb-4 text-red">
        {hangar.id === 'medium' ? 'Выбор игроков' : 'Инфраструктура'}
      </p>
      <svg viewBox="0 0 140 80" className="mb-5 h-20 w-full text-navy" aria-hidden="true">
        <path d="M15 70V28L70 6L125 28V70Z" fill="#e6d4af" stroke="currentColor" strokeWidth="3" />
        <path
          d="M32 70V36H108V70M32 47H108M32 58H108"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      <h3 className="mb-3 text-lg font-bold">{hangar.name}</h3>
      <p className="text-sm text-muted">+{hangar.slots} места обслуживания</p>
      <p className="mt-2 mb-6 text-sm text-green">−{hangar.discount} % к стоимости ТО</p>
      <p className="mt-auto mb-4 font-display text-2xl font-bold">{money(hangar.price)}</p>
      <button
        className="btn btn-primary text-sm"
        disabled={balance < hangar.price}
        onClick={() => onBuy(hangar)}
      >
        {balance < hangar.price ? `Не хватает ${money(hangar.price - balance)}` : 'Купить ангар'}
      </button>
    </article>
  );
}

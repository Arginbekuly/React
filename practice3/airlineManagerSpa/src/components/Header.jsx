import { StatTicket } from './StatTicket';
import { money } from '../data';
export function Header({ balance, fleet, page, onNavigate }) {
  const income = fleet.reduce((sum, plane) => sum + plane.profit, 0);
  return (
    <header className="container-page pt-5">
      <div className="paper flex flex-wrap items-center justify-between gap-x-6 gap-y-5 px-5 py-4 sm:px-6">
        <a
          href="#"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3.5"
          aria-label="SkyLine Air — главная"
        >
          <span className="flex size-[50px] shrink-0 items-center justify-center rounded-full border-2 border-red text-lg font-extrabold text-red">
            SL
          </span>
          <span>
            <span className="block text-xl leading-none font-extrabold sm:text-[25px]">
              SKYLINE AIR
            </span>
            <span className="mt-1 block text-[11px] text-muted sm:text-[13px]">
              Касса и управление парком
            </span>
          </span>
        </a>
        <nav
          aria-label="Основное меню"
          className="flex flex-wrap items-center gap-1 text-sm font-semibold"
        >
          {[
            ['catalog', 'Каталог'],
            ['build', 'Конструктор'],
            ['fleet', 'Мой парк'],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => onNavigate('home')}
              className="flex min-h-11 items-center rounded-full px-3 hover:bg-gold"
            >
              {label}
            </a>
          ))}
          {[
            ['maintenance', 'ТО'],
            ['flights', 'Рейсы'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`min-h-11 rounded-full px-3 hover:bg-gold ${page === id ? 'bg-gold' : ''}`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="flex w-full flex-wrap gap-2.5 xl:w-auto">
          <StatTicket label="Баланс" value={money(balance)} />
          <StatTicket label="Доход за рейс" value={`+${money(income)}`} green />
          <StatTicket label="Борты" value={fleet.length} />
        </div>
      </div>
    </header>
  );
}

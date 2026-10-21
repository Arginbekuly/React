import { useState } from 'react';
import { hangarTypes, money } from '../data';
import { StatTicket } from '../components/StatTicket';
import { SectionHeading } from '../components/ui/SectionHeading';
import { EmptyState } from '../components/ui/EmptyState';
import { MaintenanceRow } from '../components/maintenance/MaintenanceRow';
import { HangarCard } from '../components/maintenance/HangarCard';

export function MaintenancePage({
  game,
  slots,
  discount,
  onRepair,
  onFinish,
  onBuyHangar,
  onNavigate,
}) {
  const [filter, setFilter] = useState('all');
  const [descending, setDescending] = useState(true);
  const inService = game.fleet.filter((plane) => plane.status === 'repair').length;
  const planes = game.fleet
    .filter(
      (plane) =>
        filter === 'all' || (filter === 'soon' ? plane.wear >= 60 : plane.status === 'repair'),
    )
    .sort((a, b) => (descending ? b.wear - a.wear : a.wear - b.wear));
  return (
    <div className="container-page pt-8">
      <section className="rounded-[20px] bg-navy p-6 text-paper sm:p-9">
        <p className="eyebrow text-gold">Техническая служба · SkyLine Air</p>
        <h1 className="mt-3 text-3xl leading-tight font-bold sm:text-[42px]">
          Держите флот
          <br />в хорошей форме
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#c5cede]">
          Следите за износом, обслуживайте воздушные суда и расширяйте ангары. Надёжный борт —
          начало хорошего рейса.
        </p>
        <div className="mt-7 grid gap-3 text-navy sm:grid-cols-2 lg:grid-cols-4">
          <StatTicket label="Бортов на ТО" value={inService} />
          <StatTicket
            label="Скоро ТО"
            value={game.fleet.filter((plane) => plane.wear >= 60).length}
          />
          <StatTicket label="Свободных мест" value={slots - inService} />
          <StatTicket
            label="Расходы на ТО"
            value={money(game.maintenanceLog.reduce((sum, entry) => sum + entry.cost, 0))}
          />
        </div>
      </section>
      <section className="section-space">
        <SectionHeading label="Контроль состояния" title="Борты и износ" />
        <div className="paper p-5 sm:px-7">
          <div className="mb-2 flex flex-wrap justify-between gap-3">
            <select
              className="field w-auto"
              aria-label="Фильтр обслуживания"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">Все борты</option>
              <option value="soon">Скоро ТО / нужен ремонт</option>
              <option value="service">На обслуживании</option>
            </select>
            <button className="chip" onClick={() => setDescending(!descending)}>
              По износу {descending ? '↓' : '↑'}
            </button>
          </div>
          {planes.length ? (
            planes.map((plane) => (
              <MaintenanceRow
                key={plane.id}
                plane={plane}
                balance={game.balance}
                discount={discount}
                onRepair={onRepair}
                onFinish={onFinish}
              />
            ))
          ) : (
            <EmptyState
              title="Бортов для обслуживания нет"
              description="Приобретите борт в каталоге или измените фильтр."
            >
              <a href="#catalog" className="btn btn-primary" onClick={() => onNavigate('home')}>
                К каталогу
              </a>
            </EmptyState>
          )}
          <p className="mt-4 text-xs text-muted">
            В учебной симуляции обслуживание завершается кнопкой «Завершить ТО».
          </p>
        </div>
      </section>
      <section className="section-space">
        <SectionHeading label="Ваши ангары" title="Места обслуживания" />
        <div className="paper p-6">
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: slots }, (_, i) => (
              <div
                key={`slot-${i}`}
                className={`flex h-20 w-24 flex-col items-center justify-center rounded-xl border-2 border-dashed ${i < inService ? 'border-red/40 bg-red/10' : 'border-green/40 bg-green/5'}`}
              >
                <span className="eyebrow">Место {i + 1}</span>
                <span
                  className={`mt-2 text-xs font-semibold ${i < inService ? 'text-red' : 'text-green'}`}
                >
                  {i < inService ? 'Занято' : 'Свободно'}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-muted">
            Всего мест: <b>{slots}</b> · Скидка на обслуживание: <b>{discount} %</b>
          </p>
        </div>
      </section>
      <section className="section-space">
        <SectionHeading label="Памятка технику" title="Как работает износ" />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [
              'Износ растёт с каждым рейсом',
              'Каждый завершённый рейс добавляет 15 % к износу борта.',
            ],
            [
              'ТО снижает износ',
              'Плановое обслуживание убирает 50 % износа и стоит 10 % цены борта со скидкой ангара.',
            ],
            [
              'При 90 % нужен ремонт',
              'Борт с износом 90 % и выше недоступен для новых вылетов до прохождения ТО.',
            ],
          ].map(([title, text], index) => (
            <article key={title} className="paper bg-ticket p-6">
              <p className="eyebrow text-red">0{index + 1}</p>
              <h3 className="my-3 text-base font-bold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section-space">
        <SectionHeading label="История" title="Журнал обслуживания" />
        <div className="paper p-6">
          {game.maintenanceLog.length ? (
            <ul>
              {game.maintenanceLog.map((entry) => (
                <li key={entry.id} className="data-row flex-wrap">
                  <span>{entry.date}</span>
                  <b>{entry.name}</b>
                  <span>Плановое ТО</span>
                  <b className="text-red">−{money(entry.cost)}</b>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-muted">
              Пока записей нет. Здесь появится история обслуживания.
            </p>
          )}
        </div>
      </section>
      <section className="section-space">
        <SectionHeading
          label="Расширение инфраструктуры"
          title="Купить ангар для ТО"
          description={`Баланс: ${money(game.balance)} · Мест ТО: ${slots} · Скидка: ${discount} % (максимум 40 %)`}
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {hangarTypes.map((hangar) => (
            <HangarCard
              key={hangar.id}
              hangar={hangar}
              balance={game.balance}
              onBuy={onBuyHangar}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

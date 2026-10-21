import { SectionHeading } from './ui/SectionHeading';
const steps = [
  ['Выберите модель', 'Сравните вместимость, дальность и доход за рейс у каждого борта каталога.'],
  [
    'Купите или арендуйте',
    'Покупка делает самолёт вашим, аренда запускает его в рейс с малым бюджетом.',
  ],
  [
    'Отправьте в рейс',
    'Борт приносит доход за каждый вылет, а касса растёт вместе с вашим парком.',
  ],
];
export function HowItWorks() {
  return (
    <section className="section-space">
      <SectionHeading label="Как это работает" title="Три шага до первого рейса" />
      <div className="grid gap-5 md:grid-cols-3">
        {steps.map(([title, text], index) => (
          <article key={title} className="rounded-2xl border border-line bg-ticket p-6">
            <b className="font-display text-[40px] leading-none text-red">{index + 1}</b>
            <h3 className="mt-4 mb-2 text-lg font-bold">{title}</h3>
            <p className="text-[15px] leading-relaxed text-[#3a3f52]">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

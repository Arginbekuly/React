import { money, number } from '../data';
import { PlaneIllustration } from '../components/ui/PlaneIllustration';
import { SectionHeading } from '../components/ui/SectionHeading';
import { AircraftCard } from '../components/catalog/AircraftCard';
import { useEffect, useState } from 'react';
import { fakeApi } from '../api/fakeApi';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { EmptyState } from '../components/ui/EmptyState';
import { AircraftPhoto } from '../components/ui/AircraftPhoto';

export function AircraftPage({ id, revision, showDemo, ...props }) {
  const [retryKey, setRetryKey] = useState(0);
  const [simulateError, setSimulateError] = useState(false);
  const [response, setResponse] = useState({ key: '', data: null, error: '' });
  const requestKey = JSON.stringify([id, revision, retryKey, simulateError]);
  useEffect(() => {
    const controller = new AbortController();
    const [modelId, , , fail] = JSON.parse(requestKey);
    fakeApi
      .getAircraftById(modelId, { signal: controller.signal, simulateError: fail })
      .then((data) => {
        if (!controller.signal.aborted) setResponse({ key: requestKey, data, error: '' });
      })
      .catch((error) => {
        if (error.name !== 'AbortError' && !controller.signal.aborted)
          setResponse({ key: requestKey, data: null, error: error.message });
      });
    return () => controller.abort();
  }, [requestKey]);
  const retry = () => {
    setSimulateError(false);
    setRetryKey((value) => value + 1);
  };
  return (
    <>
      {showDemo && (
        <div className="container-page pt-6">
          <button
            className="btn btn-secondary text-xs"
            onClick={() => {
              setSimulateError(true);
              setRetryKey((value) => value + 1);
            }}
          >
            Сымитировать ошибку деталей
          </button>
        </div>
      )}
      {response.key !== requestKey ? (
        <div className="container-page pt-8">
          <LoadingState label="Загружаем паспорт борта…" />
        </div>
      ) : response.error ? (
        <div className="container-page pt-8">
          <ErrorMessage message={response.error} onRetry={retry} />
        </div>
      ) : !response.data.model ? (
        <div className="container-page pt-8">
          <EmptyState
            title="Борт не найден"
            description="Такой модели нет в каталоге. Вернитесь к списку и выберите другую."
          >
            <a href="#catalog" className="btn btn-primary" onClick={() => props.onNavigate('home')}>
              К каталогу
            </a>
          </EmptyState>
        </div>
      ) : (
        <AircraftDetails {...props} model={response.data.model} models={response.data.similar} />
      )}
    </>
  );
}

function AircraftDetails({ model, models, balance, onBuy, onRent, onDetails, onNavigate }) {
  return (
    <div className="container-page pt-8">
      <a
        href="#catalog"
        className="mb-5 inline-flex min-h-11 items-center text-sm font-semibold text-muted hover:text-red"
        onClick={() => onNavigate('home')}
      >
        ← Вернуться к каталогу
      </a>
      <section className="paper overflow-hidden">
        <div
          className="relative grid items-center gap-6 p-6 sm:p-10 md:grid-cols-2"
          style={{ background: `linear-gradient(135deg,#f7e3c4,${model.color})` }}
        >
          <div>
            <p className="eyebrow font-semibold text-red">Паспорт воздушного судна · SkyLine Air</p>
            <h1 className="mt-4 text-3xl leading-tight font-bold sm:text-[42px]">{model.name}</h1>
            <span className="mt-5 inline-block rounded-full bg-paper px-3 py-1.5 font-mono text-xs">
              Доступен к покупке и аренде
            </span>
          </div>
          {model.photo ? (
            <AircraftPhoto
              model={model}
              className="mx-auto aspect-[2/1] w-full max-w-[480px] rounded-xl object-cover"
            />
          ) : (
            <PlaneIllustration color={model.livery} className="mx-auto w-full max-w-[480px] py-8" />
          )}
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-4">
          {[
            ['Вместимость', `${number(model.capacity)} мест`],
            ['Дальность', `${number(model.distance)} км`],
            ['Доход за рейс', `+${money(model.profit)}`],
            ['Окупаемость', `${Math.ceil(model.price / model.profit)} рейса`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-line bg-ticket p-4">
              <p className="eyebrow">{label}</p>
              <p className="mt-2 font-display text-lg font-bold">{value}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="section-space grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid gap-6">
          <section className="paper p-6">
            <h2 className="mb-4 text-xl font-bold">Паспорт борта</h2>
            <dl>
              {[
                ['Модель', model.modelTag],
                ['Пассажировместимость', `${number(model.capacity)} мест`],
                ['Максимальная дальность', `${number(model.distance)} км`],
                ['Двигатели', model.engines || 'Два турбовентиляторных'],
                ['Класс салона', model.cabin || 'Эконом'],
                ['Срок аренды', '10 рейсов'],
              ].map(([label, value]) => (
                <div key={label} className="data-row">
                  <dt className="text-muted">{label}</dt>
                  <dd className="text-right font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="paper p-6">
            <h2 className="mb-3 text-xl font-bold">Схема посадочных мест</h2>
            <p className="mb-5 text-sm text-muted">
              Условная схема салона · {model.capacity} мест · {model.cabin || 'Эконом'}
            </p>
            <div className="mx-auto max-w-[300px] rounded-[80px_80px_30px_30px] border-2 border-line bg-ticket px-8 pt-16 pb-8">
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 56 }, (_, index) => (
                  <span
                    key={`seat-${index}`}
                    className={
                      index % 7 === 3
                        ? ''
                        : `aspect-square rounded-t-md ${index < 14 ? 'bg-gold' : 'bg-blue'}`
                    }
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-muted">
              Схематичный фрагмент салона, не полный план борта.
            </p>
          </section>
        </div>
        <aside className="paper p-6">
          <p className="eyebrow text-red">Оформление в кассе</p>
          <h2 className="mt-3 mb-5 text-xl font-bold">Ваш следующий борт</h2>
          <div className="data-row">
            <span className="text-muted">Покупка</span>
            <b>{money(model.price)}</b>
          </div>
          <div className="data-row">
            <span className="text-muted">Аренда</span>
            <b>{money(model.rentPrice)}</b>
          </div>
          <div className="data-row">
            <span className="text-muted">Баланс</span>
            <b>{money(balance)}</b>
          </div>
          <div className="data-row">
            <span className="text-muted">После покупки</span>
            <b className={balance < model.price ? 'text-red' : 'text-green'}>
              {money(balance - model.price)}
            </b>
          </div>
          <button
            className="btn btn-primary mt-6 w-full"
            disabled={balance < model.price}
            onClick={() => onBuy(model)}
          >
            Купить за {money(model.price)}
          </button>
          <button
            className="btn btn-secondary mt-3 w-full"
            disabled={balance < model.rentPrice}
            onClick={() => onRent(model)}
          >
            Аренда за {money(model.rentPrice)}
          </button>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            После оформления борт появится в вашем парке. Там можно выбрать маршрут, отправить
            самолёт в рейс или на ТО.
          </p>
          <a
            href="#fleet"
            className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-red underline"
            onClick={() => onNavigate('home')}
          >
            Перейти в мой парк →
          </a>
        </aside>
      </div>
      <section className="section-space">
        <SectionHeading label="Другие модели" title="Похожие борты" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {models
            .filter((plane) => plane.id !== model.id)
            .slice(0, 3)
            .map((plane) => (
              <AircraftCard
                key={plane.id}
                plane={plane}
                balance={balance}
                onBuy={onBuy}
                onRent={onRent}
                onDetails={onDetails}
              />
            ))}
        </div>
      </section>
    </div>
  );
}

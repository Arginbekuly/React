import { useEffect, useState } from 'react';
import { fakeApi } from '../../api/fakeApi';
import { useDebounce } from '../../hooks/useDebounce';
import { LoadingState } from '../ui/LoadingState';
import { ErrorMessage } from '../ui/ErrorMessage';
import { SectionHeading } from '../ui/SectionHeading';
import { EmptyState } from '../ui/EmptyState';
import { AircraftCard } from './AircraftCard';
import { FilterChips } from './FilterChips';
import { Pagination } from './Pagination';

export function Catalog({ revision, balance, onBuy, onRent, onDetails, showDemo }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(4);
  const [retryKey, setRetryKey] = useState(0);
  const [simulateError, setSimulateError] = useState(false);
  const [response, setResponse] = useState({ key: '', data: null, error: '' });
  const debouncedSearch = useDebounce(search);
  const requestKey = JSON.stringify({
    search: debouncedSearch,
    status,
    sort,
    page,
    perPage,
    revision,
    retryKey,
    simulateError,
  });

  useEffect(() => {
    const controller = new AbortController();
    const params = JSON.parse(requestKey);
    fakeApi
      .getAircraft({ ...params, signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setResponse({ key: requestKey, data, error: '' });
      })
      .catch((error) => {
        if (error.name !== 'AbortError' && !controller.signal.aborted)
          setResponse({ key: requestKey, data: null, error: error.message });
      });
    return () => controller.abort();
  }, [requestKey]);

  const loading = response.key !== requestKey;
  const counts = response.data?.counts || {};
  const retry = () => {
    setSimulateError(false);
    setRetryKey((value) => value + 1);
  };
  const reset = () => {
    setSearch('');
    setStatus('all');
    setSort('default');
    setPage(1);
  };

  return (
    <section id="catalog" className="section-space">
      <SectionHeading label="Каталог бортов" title="Выберите воздушное судно" />
      {showDemo && (
        <aside className="paper mb-4 flex flex-wrap items-center gap-3 p-4">
          <p className="eyebrow">Режим защиты · API</p>
          <button className="btn btn-secondary text-xs" onClick={retry}>
            Показать загрузку
          </button>
          <button
            className="btn btn-secondary text-xs"
            onClick={() => {
              setSimulateError(true);
              setRetryKey((value) => value + 1);
            }}
          >
            Сымитировать ошибку каталога
          </button>
        </aside>
      )}
      <div className="paper mb-[22px] flex flex-wrap items-center justify-between gap-4 p-4 sm:px-5">
        <FilterChips
          active={status}
          counts={counts}
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        />
        <div className="flex w-full flex-wrap items-center gap-3">
          <label htmlFor="catalog-search" className="eyebrow">
            Поиск
          </label>
          <input
            id="catalog-search"
            className="field flex-1 basis-48 sm:max-w-72"
            placeholder="Имя или номер борта"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          <select
            className="field w-auto grow sm:grow-0"
            aria-label="Сортировка каталога"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setPage(1);
            }}
          >
            <option value="default">По номеру борта</option>
            <option value="profit">По доходности ↓</option>
            <option value="capacity">По вместимости ↓</option>
            <option value="distance">По дальности ↓</option>
            <option value="price">По цене ↑</option>
          </select>
          <select
            className="field w-auto"
            aria-label="Моделей на странице"
            value={perPage}
            onChange={(event) => {
              setPerPage(Number(event.target.value));
              setPage(1);
            }}
          >
            <option value="4">4 на странице</option>
            <option value="8">8 на странице</option>
            <option value="12">12 на странице</option>
          </select>
          {(search || status !== 'all' || sort !== 'default') && (
            <button className="min-h-11 text-sm font-semibold text-red underline" onClick={reset}>
              Сбросить
            </button>
          )}
        </div>
      </div>
      {loading ? (
        <LoadingState label="Загружаем каталог…" cards={4} />
      ) : response.error ? (
        <ErrorMessage message={response.error} onRetry={retry} />
      ) : response.data.items.length ? (
        <div className="grid items-stretch gap-[22px] sm:grid-cols-2 xl:grid-cols-4">
          {response.data.items.map((plane) => (
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
      ) : (
        <EmptyState
          title="Бортов не найдено"
          description="Измените запрос или сбросьте фильтры, чтобы увидеть весь каталог."
        >
          <button className="btn btn-primary" onClick={reset}>
            Сбросить фильтры
          </button>
        </EmptyState>
      )}
      {!loading && !response.error && (
        <Pagination
          page={response.data.page}
          total={response.data.total}
          perPage={perPage}
          onChange={setPage}
        />
      )}
    </section>
  );
}

import { destinations, hangarTypes, money } from '../data.js';
import { createInitialState, migrateState } from './seed.js';

export const STORAGE_KEY = 'skyline-air-redesign-v1';
const browserStorage = {
  getItem: (key) => globalThis.localStorage.getItem(key),
  setItem: (key, value) => globalThis.localStorage.setItem(key, value),
};
const clone = (value) => JSON.parse(JSON.stringify(value));

export function createFakeApi({
  storage = browserStorage,
  delay = () => 300 + Math.random() * 300,
} = {}) {
  function read() {
    const raw = storage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const state = raw ? migrateState(parsed) : createInitialState();
    if (!raw || parsed.schemaVersion !== 2) storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
  }

  function request(work, { signal, simulateError = false } = {}) {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) return reject(new DOMException('Запрос отменён', 'AbortError'));
      const abort = () => {
        clearTimeout(timer);
        signal.removeEventListener('abort', abort);
        reject(new DOMException('Запрос отменён', 'AbortError'));
      };
      const timer = setTimeout(
        () => {
          signal?.removeEventListener('abort', abort);
          if (signal?.aborted) return reject(new DOMException('Запрос отменён', 'AbortError'));
          try {
            if (simulateError) throw new Error('Не удалось загрузить данные. Повторите запрос.');
            resolve(clone(work()));
          } catch (error) {
            reject(error);
          }
        },
        typeof delay === 'function' ? delay() : delay,
      );
      signal?.addEventListener('abort', abort, { once: true });
    });
  }

  const snapshot = (state) =>
    Object.fromEntries(Object.entries(state).filter(([key]) => key !== 'models'));
  function mutate(change, options) {
    return request(() => {
      // Читаем актуальные данные внутри операции, а не снимок из React-обработчика.
      const state = read();
      const result = change(state);
      if (result.unchanged) return { game: snapshot(state), message: result.message };
      const next = {
        ...result.state,
        revision: state.revision + 1,
        log: [
          { id: crypto.randomUUID(), text: result.message, type: 'success' },
          ...state.log,
        ].slice(0, 50),
      };
      storage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { game: snapshot(next), message: result.message, model: result.model };
    }, options);
  }
  const findModel = (state, id) => {
    const model = state.models.find((item) => item.id === String(id));
    if (!model) throw new Error('Модель не найдена.');
    return model;
  };
  const findPlane = (state, id) => {
    const plane = state.fleet.find((item) => item.id === id);
    if (!plane) throw new Error('Борт не найден в вашем парке.');
    return plane;
  };
  const requireReady = (plane) => {
    if (plane.status !== 'ready') throw new Error('Дождитесь завершения рейса или ТО.');
  };
  const requireBalance = (state, cost) => {
    if (state.balance < cost) throw new Error('Недостаточно средств в кассе.');
  };

  return {
    getGame: (options) => request(() => snapshot(read()), options),
    getAircraft({
      search = '',
      status = 'all',
      sort = 'default',
      page = 1,
      perPage = 4,
      ...options
    } = {}) {
      return request(() => {
        const state = read();
        const matches = (model, filter) =>
          filter === 'all' ||
          state.fleet.some(
            (plane) =>
              plane.modelId === model.id &&
              (filter === 'rented'
                ? plane.isRented
                : filter === 'repair'
                  ? plane.status === 'repair' || plane.wear >= 90
                  : plane.status === filter && (filter !== 'ready' || plane.wear < 90)),
          );
        const counts = Object.fromEntries(
          ['all', 'ready', 'in_flight', 'repair', 'rented'].map((filter) => [
            filter,
            state.models.filter((model) => matches(model, filter)).length,
          ]),
        );
        const query = search.trim().toLowerCase();
        const items = state.models.filter(
          (model) =>
            matches(model, status) &&
            `${model.name} ${model.aircraftNumber}`.toLowerCase().includes(query),
        );
        items.sort((a, b) =>
          sort === 'profit'
            ? b.profit - a.profit
            : sort === 'capacity'
              ? b.capacity - a.capacity
              : sort === 'distance'
                ? b.distance - a.distance
                : sort === 'price'
                  ? a.price - b.price
                  : a.aircraftNumber - b.aircraftNumber,
        );
        const size = [4, 8, 12].includes(Number(perPage)) ? Number(perPage) : 4;
        const currentPage = Math.min(
          Math.max(1, Number(page) || 1),
          Math.max(1, Math.ceil(items.length / size)),
        );
        return {
          items: items.slice((currentPage - 1) * size, currentPage * size),
          total: items.length,
          counts,
          page: currentPage,
          perPage: size,
        };
      }, options);
    },
    getAircraftById(id, options) {
      return request(() => {
        const state = read();
        const model = state.models.find((item) => item.id === String(id)) || null;
        return {
          model,
          similar: model ? state.models.filter((item) => item.id !== model.id).slice(0, 3) : [],
        };
      }, options);
    },
    createAircraft(data, options) {
      return mutate((state) => {
        const name = String(data.name || '').trim();
        const capacity = Number(data.capacity),
          distance = Number(data.distance);
        if (name.length < 3 || name.length > 30)
          throw new Error('Название должно содержать от 3 до 30 символов.');
        if (!Number.isInteger(capacity) || capacity < 20 || capacity > 850)
          throw new Error('Вместимость: от 20 до 850 мест.');
        if (!Number.isInteger(distance) || distance < 500 || distance > 15000)
          throw new Error('Дальность: от 500 до 15 000 км.');
        const model = {
          id: crypto.randomUUID(),
          aircraftNumber: Math.max(...state.models.map((item) => item.aircraftNumber)) + 1,
          name,
          capacity,
          distance,
          engines: data.engines,
          cabin: data.cabin,
          livery: data.livery,
          profit: Math.round(capacity * 5 + distance * 0.055),
          price: Math.round(capacity * 20 + distance * 0.25),
          rentPrice: Math.round(capacity * 7 + distance * 0.12),
          modelTag: 'Авторская модель',
          color: '#86a8bb',
        };
        return {
          state: { ...state, models: [...state.models, model] },
          model,
          message: `${name}: модель добавлена в каталог.`,
        };
      }, options);
    },
    acquire(id, rented = false, options) {
      return mutate((state) => {
        const model = findModel(state, id);
        const cost = rented ? model.rentPrice : model.price;
        requireBalance(state, cost);
        if (state.fleet.length >= 60) throw new Error('Все 60 мест в парке заняты.');
        const planeId = crypto.randomUUID();
        const plane = {
          ...model,
          id: planeId,
          modelId: model.id,
          isRented: rented,
          status: 'ready',
          wear: 0,
          flightCount: 0,
          tailNumber: `SL-${planeId.slice(0, 5).toUpperCase()}`,
        };
        return {
          state: { ...state, balance: state.balance - cost, fleet: [...state.fleet, plane] },
          message: `${model.name}: ${rented ? 'аренда оформлена' : 'борт куплен'} за ${money(cost)}.`,
        };
      }, options);
    },
    startFlight(id, destinationId, options) {
      return mutate((state) => {
        const plane = findPlane(state, id);
        requireReady(plane);
        if (plane.wear >= 90) throw new Error('Борту требуется обслуживание перед вылетом.');
        const destination = destinations.find((item) => item.id === destinationId);
        if (!destination || destination.distance > plane.distance)
          throw new Error('Маршрут недоступен для этого борта.');
        const flight = {
          id: crypto.randomUUID(),
          code: `SL ${101 + state.flights.length * 7}`,
          planeId: id,
          planeName: plane.name,
          destination,
          income: plane.profit,
          complete: false,
        };
        return {
          state: {
            ...state,
            fleet: state.fleet.map((item) =>
              item.id === id ? { ...item, status: 'in_flight' } : item,
            ),
            flights: [flight, ...state.flights],
          },
          message: `${plane.name}: вылет в ${destination.name}.`,
        };
      }, options);
    },
    completeFlight(id, options) {
      return mutate((state) => {
        const flight = state.flights.find((item) => item.id === id);
        if (!flight) throw new Error('Рейс не найден.');
        if (flight.complete)
          return { unchanged: true, message: 'Рейс уже завершён, доход был зачислен.' };
        const plane = findPlane(state, flight.planeId);
        const expired = plane.isRented && plane.flightCount + 1 >= 10;
        const fleet = expired
          ? state.fleet.filter((item) => item.id !== plane.id)
          : state.fleet.map((item) =>
              item.id === plane.id
                ? {
                    ...item,
                    status: 'ready',
                    wear: Math.min(100, item.wear + 15),
                    flightCount: item.flightCount + 1,
                  }
                : item,
            );
        return {
          state: {
            ...state,
            balance: state.balance + flight.income,
            fleet,
            flights: state.flights.map((item) =>
              item.id === id ? { ...item, complete: true } : item,
            ),
          },
          message: `${flight.code}: рейс завершён, доход +${money(flight.income)}.${expired ? ' Срок аренды завершён.' : ''}`,
        };
      }, options);
    },
    sell(id, options) {
      return mutate((state) => {
        const plane = findPlane(state, id);
        requireReady(plane);
        const value = plane.isRented ? 0 : Math.round(plane.price * 0.7);
        return {
          state: {
            ...state,
            balance: state.balance + value,
            fleet: state.fleet.filter((item) => item.id !== id),
          },
          message: `${plane.name}: ${plane.isRented ? 'аренда завершена' : `борт продан за ${money(value)}`}.`,
        };
      }, options);
    },
    repair(id, options) {
      return mutate((state) => {
        const plane = findPlane(state, id);
        requireReady(plane);
        if (!plane.wear) throw new Error('Новому борту обслуживание пока не требуется.');
        const slots = 4 + state.hangars.reduce((sum, item) => sum + item.slots, 0);
        if (state.fleet.filter((item) => item.status === 'repair').length >= slots)
          throw new Error('Места ТО заняты. Завершите обслуживание или купите ангар.');
        const discount = Math.min(
          40,
          state.hangars.reduce((sum, item) => sum + item.discount, 0),
        );
        const cost = Math.round(plane.price * 0.1 * (1 - discount / 100));
        requireBalance(state, cost);
        return {
          state: {
            ...state,
            balance: state.balance - cost,
            fleet: state.fleet.map((item) =>
              item.id === id ? { ...item, status: 'repair' } : item,
            ),
            maintenanceLog: [
              {
                id: crypto.randomUUID(),
                name: plane.name,
                cost,
                date: new Date().toLocaleDateString('ru-RU'),
              },
              ...state.maintenanceLog,
            ],
          },
          message: `${plane.name}: плановое ТО за ${money(cost)}.`,
        };
      }, options);
    },
    finishRepair(id, options) {
      return mutate((state) => {
        const plane = findPlane(state, id);
        if (plane.status !== 'repair') throw new Error('Борт сейчас не на обслуживании.');
        return {
          state: {
            ...state,
            fleet: state.fleet.map((item) =>
              item.id === id
                ? { ...item, status: 'ready', wear: Math.max(0, item.wear - 50) }
                : item,
            ),
          },
          message: `${plane.name}: обслуживание завершено.`,
        };
      }, options);
    },
    buyHangar(tier, options) {
      return mutate((state) => {
        const hangar = hangarTypes.find((item) => item.id === tier);
        if (!hangar) throw new Error('Тип ангара не найден.');
        requireBalance(state, hangar.price);
        return {
          state: {
            ...state,
            balance: state.balance - hangar.price,
            hangars: [...state.hangars, { ...hangar, instanceId: crypto.randomUUID() }],
          },
          message: `${hangar.name} куплен. Добавлено мест ТО: ${hangar.slots}.`,
        };
      }, options);
    },
  };
}

export const fakeApi = createFakeApi();

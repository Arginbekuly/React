import test from 'node:test';
import assert from 'node:assert/strict';
import { createFakeApi, STORAGE_KEY } from '../src/api/fakeApi.js';
import { createInitialState } from '../src/api/seed.js';
import { airplanes } from '../src/data.js';

function setup(state) {
  const values = new Map(state ? [[STORAGE_KEY, JSON.stringify(state)]] : []);
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  return { api: createFakeApi({ storage, delay: 1 }), storage };
}

test('чистый запуск создаёт 120 уникальных исходных моделей и сохраняет их', async () => {
  const { api, storage } = setup();
  const result = await api.getAircraft();
  assert.equal(result.total, 120);
  const saved = JSON.parse(storage.getItem(STORAGE_KEY));
  assert.equal(new Set(saved.models.map((model) => model.id)).size, 120);
  assert.equal(new Set(saved.models.map((model) => model.aircraftNumber)).size, 120);
  assert.equal((await api.getGame()).balance, 22500);
  assert.equal(saved.schemaVersion, 2);
});

test('миграция сохраняет баланс, пользовательскую модель, её ID и купленный борт', async () => {
  const custom = { ...airplanes[0], id: 'my-model', name: 'Личный чартер', aircraftNumber: 7 };
  const legacy = {
    ...createInitialState(),
    balance: 12345,
    models: [...airplanes, custom],
    fleet: [{ ...custom, id: 'my-plane', modelId: custom.id, wear: 30 }],
  };
  delete legacy.schemaVersion;
  const { api } = setup(legacy);
  const game = await api.getGame();
  const { model } = await api.getAircraftById(custom.id);
  assert.equal(game.balance, 12345);
  assert.equal(game.fleet[0].id, 'my-plane');
  assert.equal(game.fleet[0].wear, 30);
  assert.equal(model.aircraftNumber, 121);
  assert.equal(game.fleet[0].aircraftNumber, 121);
  assert.equal((await api.getAircraft()).total, 121);
  assert.equal((await api.getAircraft()).total, 121);
});

test('поиск, сортировка и пагинация выполняются в API', async () => {
  const { api } = setup();
  const search = await api.getAircraft({ search: 'СОКОЛ' });
  assert.equal(search.total, 1);
  assert.equal(search.items[0].name, 'Сокол');
  const first = await api.getAircraft({ sort: 'price', perPage: 12 });
  const second = await api.getAircraft({ sort: 'price', perPage: 12, page: 2 });
  assert.ok(
    first.items.every((item, index) => !index || first.items[index - 1].price <= item.price),
  );
  assert.ok(second.items[0].price >= first.items.at(-1).price);
  assert.equal(first.items.length, 12);
  assert.equal((await api.getAircraft({ page: 999 })).page, 30);
  assert.equal((await api.getAircraft({ search: 'несуществующая-модель' })).total, 0);
});

test('получение деталей различает найденную и отсутствующую модель', async () => {
  const { api } = setup();
  assert.equal((await api.getAircraftById('1')).model.name, 'Небесный стрелец');
  assert.equal((await api.getAircraftById('no-such-id')).model, null);
});

test('покупка и аренда меняют баланс и фильтры общего источника данных', async () => {
  const { api } = setup();
  await api.acquire('1');
  const { game } = await api.acquire('2', true);
  assert.equal(game.balance, 15500);
  assert.equal(game.fleet.length, 2);
  assert.equal((await api.getAircraft({ status: 'ready' })).total, 2);
  assert.equal((await api.getAircraft({ status: 'rented' })).items[0].id, '2');
});

test('параллельные покупки проверяют актуальный баланс', async () => {
  const { api } = setup({ ...createInitialState(), balance: 5000 });
  const results = await Promise.allSettled([api.acquire('1'), api.acquire('1')]);
  assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
  const game = await api.getGame();
  assert.equal(game.balance, 0);
  assert.equal(game.fleet.length, 1);
});

test('отменённая операция не изменяет сохранение', async () => {
  const { storage } = setup(createInitialState());
  const api = createFakeApi({ storage, delay: 30 });
  const before = storage.getItem(STORAGE_KEY);
  const controller = new AbortController();
  const operation = api.acquire('1', false, { signal: controller.signal });
  controller.abort();
  await assert.rejects(operation, { name: 'AbortError' });
  await new Promise((resolve) => setTimeout(resolve, 40));
  assert.equal(storage.getItem(STORAGE_KEY), before);
  await assert.rejects(api.getGame({ signal: controller.signal }), { name: 'AbortError' });
});

test('ошибка запроса воспроизводится и следующий обычный запрос успешен', async () => {
  const { api } = setup();
  await assert.rejects(api.getAircraft({ simulateError: true }), /Повторите запрос/);
  assert.equal((await api.getAircraft()).total, 120);
});

test('API валидирует форму и рассчитывает цены, не доверяя присланной цене', async () => {
  const { api } = setup();
  await assert.rejects(api.createAircraft({ name: 'А', capacity: 180, distance: 5600 }));
  await assert.rejects(api.createAircraft({ name: 'Чартер', capacity: 1, distance: 5600 }));
  const { model } = await api.createAircraft({
    name: 'Чартер',
    capacity: 20,
    distance: 500,
    price: 1,
  });
  assert.equal(model.aircraftNumber, 121);
  assert.equal(model.price, 525);
  assert.equal((await api.getAircraft()).total, 121);
  assert.equal((await api.getAircraft({ search: '121' })).items[0].id, model.id);
});

test('рейс допускает короткую модель, начисляет доход один раз и увеличивает износ', async () => {
  const { api } = setup();
  const { model } = await api.createAircraft({
    name: 'Короткий маршрут',
    capacity: 20,
    distance: 500,
  });
  const purchase = await api.acquire(model.id);
  const plane = purchase.game.fleet[0];
  await assert.rejects(api.startFlight(plane.id, 'tokyo'), /Маршрут недоступен/);
  const { game } = await api.startFlight(plane.id, 'taldykorgan');
  await assert.rejects(api.startFlight(plane.id, 'taldykorgan'));
  const id = game.flights[0].id;
  await Promise.all([api.completeFlight(id), api.completeFlight(id)]);
  const completed = await api.getGame();
  assert.equal(completed.balance, purchase.game.balance + model.profit);
  assert.equal(completed.fleet[0].wear, 15);
  assert.equal(completed.fleet[0].flightCount, 1);
  assert.equal(completed.fleet[0].status, 'ready');
});

test('ТО списывает стоимость, применяет скидку ангара и снижает износ', async () => {
  const { api, storage } = setup();
  await api.acquire('1');
  const saved = JSON.parse(storage.getItem(STORAGE_KEY));
  saved.fleet[0].wear = 75;
  storage.setItem(STORAGE_KEY, JSON.stringify(saved));
  await api.buyHangar('small');
  const before = await api.getGame();
  await api.repair(before.fleet[0].id);
  const serviced = await api.finishRepair(before.fleet[0].id);
  assert.equal(serviced.game.balance, before.balance - 475);
  assert.equal(serviced.game.fleet[0].wear, 25);
  assert.equal(serviced.game.maintenanceLog.length, 1);
});

test('истёкшая аренда удаляет борт после десятого рейса', async () => {
  const initial = createInitialState();
  initial.fleet = [
    {
      ...initial.models[0],
      id: 'rented-plane',
      modelId: '1',
      status: 'in_flight',
      wear: 0,
      flightCount: 9,
      isRented: true,
    },
  ];
  initial.flights = [{ id: 'last-flight', planeId: 'rented-plane', income: 1200, complete: false }];
  const { api } = setup(initial);
  const { game } = await api.completeFlight('last-flight');
  assert.equal(game.fleet.length, 0);
  assert.equal(game.balance, 23700);
});

test('продажа возвращает 70%, а возврат аренды не возвращает её стоимость', async () => {
  const { api } = setup();
  const owned = await api.acquire('1');
  const sold = await api.sell(owned.game.fleet[0].id);
  assert.equal(sold.game.balance, 21000);
  const rented = await api.acquire('1', true);
  const returned = await api.sell(rented.game.fleet[0].id);
  assert.equal(returned.game.balance, 19000);
  assert.equal(returned.game.fleet.length, 0);
});

test('ответы API являются JSON-копиями и не изменяют внутренние данные', async () => {
  const { api } = setup();
  const response = await api.getAircraft();
  response.items[0].name = 'Изменено снаружи';
  assert.equal((await api.getAircraftById('1')).model.name, 'Небесный стрелец');
});

test('ошибка записи не выдаётся за успех и не меняет баланс', async () => {
  const { api, storage } = setup(createInitialState());
  storage.setItem = () => {
    throw new Error('Хранилище переполнено');
  };
  await assert.rejects(api.acquire('1'), /Хранилище переполнено/);
  assert.equal((await api.getGame()).balance, 22500);
});

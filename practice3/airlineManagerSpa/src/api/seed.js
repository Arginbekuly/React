import { airplanes } from '../data.js';

// Детерминированные ID нужны, чтобы миграции не создавали дубликаты моделей.
export function createInitialModels() {
  const names = ['Аврора', 'Орион', 'Альтаир', 'Полярная звезда', 'Горизонт', 'Пегас'];
  return Array.from({ length: 120 }, (_, index) => {
    const aircraftNumber = index + 1;
    if (index < airplanes.length) return { ...airplanes[index], aircraftNumber };
    const capacity = 40 + ((index * 37) % 360);
    const distance = 1500 + ((index * 419) % 12000);
    return {
      id: String(aircraftNumber),
      aircraftNumber,
      name: `${names[index % names.length]} ${aircraftNumber}`,
      capacity,
      distance,
      profit: Math.round(capacity * 5 + distance * 0.055),
      price: Math.round(capacity * 20 + distance * 0.25),
      rentPrice: Math.round(capacity * 7 + distance * 0.12),
      modelTag: `SkyLine ${capacity}`,
      color: airplanes[index % airplanes.length].color,
    };
  });
}

export function createInitialState() {
  return {
    schemaVersion: 2,
    revision: 0,
    balance: 22500,
    models: createInitialModels(),
    fleet: [],
    hangars: [],
    flights: [],
    maintenanceLog: [],
    log: [{ id: 'opening', text: 'Касса открыта. В каталоге 120 моделей.', type: 'success' }],
  };
}

export function migrateState(saved) {
  if (
    !saved ||
    !Number.isFinite(saved.balance) ||
    !['models', 'fleet', 'hangars', 'flights', 'maintenanceLog', 'log'].every((key) =>
      Array.isArray(saved[key]),
    )
  ) {
    throw new Error('Не удалось прочитать сохранение. Исходные данные не были изменены.');
  }
  if (saved.schemaVersion === 2) return saved;

  const seeds = createInitialModels();
  const seedIds = new Set(seeds.map((model) => model.id));
  const existing = new Map(saved.models.map((model) => [model.id, model]));
  const models = seeds.map((model) => ({
    ...model,
    ...existing.get(model.id),
    aircraftNumber: model.aircraftNumber,
  }));
  let nextNumber = Math.max(120, ...saved.models.map((model) => Number(model.aircraftNumber) || 0));
  for (const model of saved.models) {
    if (!seedIds.has(model.id)) models.push({ ...model, aircraftNumber: ++nextNumber });
  }
  const numbers = new Map(models.map((model) => [model.id, model.aircraftNumber]));
  return {
    ...saved,
    schemaVersion: 2,
    revision: (saved.revision || 0) + 1,
    models,
    fleet: saved.fleet.map((plane) => ({
      ...plane,
      aircraftNumber: numbers.get(plane.modelId) ?? plane.aircraftNumber,
    })),
  };
}

import { API_CONFIG, DATA_KEY } from './settings.js'
import { initialTasks } from './seed.js'

function readTasks() {
  const saved = localStorage.getItem(DATA_KEY)
  if (saved === null) {
    localStorage.setItem(DATA_KEY, JSON.stringify(initialTasks))
    return structuredClone(initialTasks)
  }
  const tasks = JSON.parse(saved)
  if (!Array.isArray(tasks))
    throw new Error('Не удалось прочитать сохранённые задачи.')
  return tasks
}

function request(action, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted)
      return reject(new DOMException('Запрос отменён', 'AbortError'))
    const delay =
      API_CONFIG.minDelay +
      Math.random() * (API_CONFIG.maxDelay - API_CONFIG.minDelay)
    const abort = () => {
      clearTimeout(timer)
      reject(new DOMException('Запрос отменён', 'AbortError'))
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort)
      try {
        if (Math.random() < API_CONFIG.errorChance)
          throw new Error('Сервер временно недоступен. Попробуйте ещё раз.')
        resolve(structuredClone(action()))
      } catch (error) {
        reject(
          error instanceof SyntaxError
            ? new Error('Сохранённые данные повреждены.')
            : error,
        )
      }
    }, delay)
    signal?.addEventListener('abort', abort, { once: true })
  })
}

function validate(data) {
  if (!data.name?.trim() || data.name.trim().length > 100)
    throw new Error('Название должно содержать от 1 до 100 символов.')
  if (!data.description?.trim() || data.description.length > 2000)
    throw new Error('Добавьте описание до 2000 символов.')
  if (!data.assignee?.trim() || data.assignee.trim().length > 60)
    throw new Error('Укажите исполнителя до 60 символов.')
  if (!['В планах', 'В работе', 'Готово'].includes(data.status))
    throw new Error('Неизвестный статус.')
  if (!['Низкий', 'Средний', 'Высокий'].includes(data.priority))
    throw new Error('Неизвестный приоритет.')
  if (
    !['Дизайн', 'Разработка', 'Учёба', 'Тестирование', 'Личное'].includes(
      data.category,
    )
  )
    throw new Error('Неизвестная категория.')
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(data.dueDate) ||
    Number.isNaN(Date.parse(data.dueDate))
  )
    throw new Error('Укажите срок задачи.')
  if (
    !Number.isFinite(data.estimate) ||
    data.estimate < 0.5 ||
    data.estimate > 1000
  )
    throw new Error('Оценка времени: от 0,5 до 1000 часов.')
  return {
    name: data.name.trim(),
    description: data.description.trim(),
    assignee: data.assignee.trim(),
    status: data.status,
    priority: data.priority,
    category: data.category,
    dueDate: data.dueDate,
    estimate: data.estimate,
  }
}

export function getItemsList(signal) {
  return request(
    () =>
      readTasks().map(
        ({ id, name, description, status, priority, category, assignee }) => ({
          id,
          name,
          description,
          status,
          priority,
          category,
          assignee,
        }),
      ),
    signal,
  )
}
export function getItem(id, signal) {
  return request(() => {
    const task = readTasks().find((item) => item.id === id)
    if (!task) throw new Error('Задача не найдена. Обновите список.')
    return task
  }, signal)
}
export function createItem(data, signal) {
  return request(() => {
    const tasks = readTasks()
    const task = {
      ...validate(data),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(DATA_KEY, JSON.stringify([task, ...tasks]))
    return task
  }, signal)
}
export function updateItem(id, changes, signal) {
  return request(() => {
    const tasks = readTasks()
    const current = tasks.find((item) => item.id === id)
    if (!current) throw new Error('Задача не найдена. Обновите список.')
    const task = {
      ...validate({ ...current, ...changes }),
      id: current.id,
      createdAt: current.createdAt,
    }
    localStorage.setItem(
      DATA_KEY,
      JSON.stringify(tasks.map((item) => (item.id === id ? task : item))),
    )
    return task
  }, signal)
}
export function deleteItem(id, signal) {
  return request(() => {
    const tasks = readTasks()
    if (!tasks.some((item) => item.id === id))
      throw new Error('Задача уже удалена. Обновите список.')
    localStorage.setItem(
      DATA_KEY,
      JSON.stringify(tasks.filter((item) => item.id !== id)),
    )
    return { id }
  }, signal)
}

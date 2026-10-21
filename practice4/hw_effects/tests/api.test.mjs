import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  createItem,
  deleteItem,
  getItem,
  getItemsList,
  updateItem,
} from '../src/api/fakeApi.js'
import { API_CONFIG, DATA_KEY } from '../src/api/settings.js'

const originalConfig = { ...API_CONFIG }
const values = new Map()
const originalStorage = Object.getOwnPropertyDescriptor(
  globalThis,
  'localStorage',
)
beforeEach(() => {
  values.clear()
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
  })
  Object.assign(API_CONFIG, { minDelay: 1, maxDelay: 1, errorChance: 0 })
})
afterEach(() => {
  Object.assign(API_CONFIG, originalConfig)
  if (originalStorage)
    Object.defineProperty(globalThis, 'localStorage', originalStorage)
  else delete globalThis.localStorage
})

test('list is a summary; details add deadline, estimate and creation date', async () => {
  const list = await getItemsList()
  assert.equal(list.length, 6)
  assert.equal(list[0].dueDate, undefined)
  const detail = await getItem(list[0].id)
  assert.ok(Object.keys(detail).length >= 7)
  assert.ok(detail.dueDate && detail.estimate && detail.createdAt)
})

test('create, edit, complete and remove persist through fresh API reads', async () => {
  const template = await getItem('task-1')
  const created = await createItem({ ...template, name: 'Новая задача' })
  assert.notEqual(created.id, template.id)
  await updateItem(created.id, { name: 'Обновлённая задача', status: 'Готово' })
  assert.equal((await getItem(created.id)).name, 'Обновлённая задача')
  assert.equal((await getItem(created.id)).status, 'Готово')
  await deleteItem(created.id)
  assert.equal((await getItemsList()).length, 6)
  await assert.rejects(getItem(created.id), /не найдена/)
})

test('aborting a delayed write does not change storage', async () => {
  const task = await getItem('task-1')
  API_CONFIG.minDelay = API_CONFIG.maxDelay = 40
  const controller = new AbortController()
  const pending = updateItem(task.id, { status: 'Готово' }, controller.signal)
  controller.abort()
  await assert.rejects(pending, { name: 'AbortError' })
  assert.equal((await getItem(task.id)).status, task.status)
})

test('simulated errors leave persisted data unchanged', async () => {
  await getItemsList()
  const saved = values.get(DATA_KEY)
  API_CONFIG.errorChance = 1
  await assert.rejects(deleteItem('task-1'), /временно недоступен/)
  assert.equal(values.get(DATA_KEY), saved)
})

test('concurrent updates target their captured IDs and retain both changes', async () => {
  await Promise.all([
    updateItem('task-1', { status: 'Готово' }),
    updateItem('task-2', { name: 'Вторая задача' }),
  ])
  assert.equal((await getItem('task-1')).status, 'Готово')
  assert.equal((await getItem('task-2')).name, 'Вторая задача')
})

test('validation and storage errors reject instead of reporting success', async () => {
  const task = await getItem('task-1')
  await assert.rejects(createItem({ ...task, name: '   ' }), /Название/)
  globalThis.localStorage.setItem = () => {
    throw new Error('Storage is full')
  }
  await assert.rejects(
    updateItem(task.id, { status: 'Готово' }),
    /Storage is full/,
  )
})

test('an empty database remains empty and corrupt data is not overwritten', async () => {
  values.set(DATA_KEY, '[]')
  assert.deepEqual(await getItemsList(), [])
  values.set(DATA_KEY, '{broken')
  await assert.rejects(getItemsList(), /повреждены/)
  assert.equal(values.get(DATA_KEY), '{broken')
})

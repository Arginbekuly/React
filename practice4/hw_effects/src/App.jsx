import { useEffect, useState } from 'react'
import { createItem, deleteItem, getItemsList, updateItem } from './api/fakeApi'
import TaskDetails from './components/TaskDetails'
import TaskForm from './components/TaskForm'
import './App.css'

export default function App() {
  const [list, setList] = useState({ status: 'loading', data: [], error: '' })
  const [reload, setReload] = useState(0)
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Все')
  const [editor, setEditor] = useState(null)
  const [removing, setRemoving] = useState(null)
  const [operation, setOperation] = useState(null)
  const [notice, setNotice] = useState(null)
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    getItemsList(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        setList({ status: 'success', data, error: '' })
        setSelectedId((id) =>
          data.some((item) => item.id === id) ? id : (data[0]?.id ?? null),
        )
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setList((previous) => ({
            ...previous,
            status: 'error',
            error: error.message,
          }))
      })
    return () => controller.abort()
  }, [reload])

  useEffect(() => {
    if (!operation) return
    const controller = new AbortController()
    const { type, id, data } = operation
    const request =
      type === 'create'
        ? createItem(data, controller.signal)
        : type === 'remove'
          ? deleteItem(id, controller.signal)
          : updateItem(id, data, controller.signal)
    request
      .then((result) => {
        if (controller.signal.aborted) return
        setList((previous) => ({
          ...previous,
          data:
            type === 'remove'
              ? previous.data.filter((item) => item.id !== id)
              : type === 'create'
                ? [result, ...previous.data]
                : previous.data.map((item) => (item.id === id ? result : item)),
        }))
        if (type === 'create') {
          setSelectedId(result.id)
          setSearch('')
          setFilter('Все')
        }
        if (type === 'remove')
          setSelectedId((current) => (current === id ? null : current))
        setRevision((value) => value + 1)
        setEditor(null)
        setRemoving(null)
        setNotice({
          type: 'success',
          text:
            type === 'create'
              ? 'Задача добавлена.'
              : type === 'remove'
                ? 'Задача удалена.'
                : 'Изменения сохранены.',
        })
        setOperation(null)
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setNotice({ type: 'error', text: error.message })
          setOperation(null)
        }
      })
    return () => controller.abort()
  }, [operation])

  useEffect(() => {
    if (!notice || notice.type === 'error') return
    const timer = setTimeout(() => setNotice(null), 4500)
    return () => clearTimeout(timer)
  }, [notice])

  const busy = operation !== null
  const completed = list.data.filter((item) => item.status === 'Готово').length
  const visible = list.data.filter(
    (item) =>
      (filter === 'Все' || item.status === filter) &&
      `${item.name} ${item.description} ${item.assignee}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  )

  function startOperation(next) {
    if (busy) return
    setNotice(null)
    setOperation(next)
  }

  function refresh() {
    setList((previous) => ({ ...previous, status: 'loading', error: '' }))
    setReload((value) => value + 1)
  }

  return (
    <main className="workspace">
      <header className="topbar">
        <a className="brand" href="./">
          <span className="brand-icon">✓</span> taskroom
          <span className="brand-dot">.</span>
        </a>
        <span className="workspace-label">Личное пространство</span>
        <span className="avatar" aria-label="Мой профиль">
          Я
        </span>
      </header>
      <section className="page-heading">
        <div>
          <p className="eyebrow">ПОРЯДОК В ДЕЛАХ</p>
          <h1>Мои задачи</h1>
          <p className="muted">Меньше суеты. Больше сделанного.</p>
        </div>
        <button
          className="primary"
          disabled={busy || list.status !== 'success'}
          onClick={() => {
            setNotice(null)
            setEditor({})
          }}
        >
          <span aria-hidden="true">＋</span> Новая задача
        </button>
      </section>
      <section className="stats" aria-label="Обзор задач">
        <div>
          <span className="stat-symbol purple">▦</span>
          <div>
            <span className="muted">Всего задач</span>
            <strong>{list.data.length}</strong>
          </div>
        </div>
        <div>
          <span className="stat-symbol amber">◷</span>
          <div>
            <span className="muted">В работе</span>
            <strong>
              {list.data.filter((item) => item.status === 'В работе').length}
            </strong>
          </div>
        </div>
        <div>
          <span className="stat-symbol green">✓</span>
          <div>
            <span className="muted">Завершено</span>
            <strong>
              {completed}
              <small> / {list.data.length}</small>
            </strong>
          </div>
        </div>
      </section>
      {notice && (
        <div
          className={`notice ${notice.type}`}
          role={notice.type === 'error' ? 'alert' : 'status'}
        >
          <span>{notice.text}</span>
          <button
            className="text-button"
            aria-label="Закрыть уведомление"
            onClick={() => setNotice(null)}
          >
            ×
          </button>
        </div>
      )}
      <div className="board">
        <section className="task-panel" aria-label="Список задач">
          <div className="list-toolbar">
            <h2>
              Список задач <span className="count">{visible.length}</span>
            </h2>
            <button
              className="text-button reload"
              disabled={busy || list.status === 'loading'}
              onClick={refresh}
            >
              <span aria-hidden="true">↻</span> Обновить
            </button>
          </div>
          <label className="search">
            <span aria-hidden="true">⌕</span>
            <input
              aria-label="Поиск задач"
              placeholder="Найти задачу…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <div className="filters" aria-label="Фильтр по статусу">
            {['Все', 'В планах', 'В работе', 'Готово'].map((status) => (
              <button
                key={status}
                className={filter === status ? 'active' : ''}
                aria-pressed={filter === status}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="task-list">
            {list.status === 'loading' ? (
              <div className="empty" role="status">
                <span className="spinner" />
                Загружаем задачи…
              </div>
            ) : list.status === 'error' ? (
              <div className="empty" role="alert">
                <h3>Не удалось загрузить список</h3>
                <p>{list.error}</p>
                <button onClick={refresh}>Повторить</button>
              </div>
            ) : visible.length === 0 ? (
              <div className="empty">
                <span className="empty-icon">☷</span>
                <h3>
                  {list.data.length === 0
                    ? 'Пока нет задач'
                    : 'Ничего не найдено'}
                </h3>
                <p>
                  {list.data.length === 0
                    ? 'Добавьте первую задачу — начните с малого.'
                    : 'Попробуйте другой запрос или фильтр.'}
                </p>
              </div>
            ) : (
              visible.map((item) => (
                <button
                  className={`task-row ${selectedId === item.id ? 'selected' : ''}`}
                  key={item.id}
                  aria-pressed={selectedId === item.id}
                  onClick={() => setSelectedId(item.id)}
                >
                  <span
                    className={`task-check ${item.status === 'Готово' ? 'checked' : ''}`}
                  >
                    {item.status === 'Готово' ? '✓' : ''}
                  </span>
                  <span className="task-content">
                    <strong className={item.status === 'Готово' ? 'done' : ''}>
                      {item.name}
                    </strong>
                    <span className="task-meta">
                      <span className={`priority-dot ${item.priority}`} />
                      <span>{item.priority}</span>
                      <span>·</span>
                      <span>{item.category}</span>
                    </span>
                  </span>
                  <span
                    className={`badge ${item.status === 'Готово' ? 'complete' : item.status === 'В работе' ? 'progress' : 'planned'}`}
                  >
                    {item.status}
                  </span>
                  <span className="row-arrow" aria-hidden="true">
                    ›
                  </span>
                </button>
              ))
            )}
          </div>
          <div className="list-footer">
            {visible.length} из {list.data.length} задач
            <span>Всё начинается с одного шага</span>
          </div>
        </section>
        <TaskDetails
          key={`${selectedId}:${revision}`}
          id={selectedId}
          busy={busy || list.status !== 'success'}
          operation={operation}
          onEdit={(item) => {
            setNotice(null)
            setEditor(item)
          }}
          onRemove={(item) => {
            setNotice(null)
            setRemoving(item)
          }}
          onComplete={(item) =>
            startOperation({
              type: 'update',
              id: item.id,
              data: {
                status: item.status === 'Готово' ? 'В работе' : 'Готово',
              },
            })
          }
        />
      </div>
      <footer className="page-footer">
        <span className="save-dot" /> Изменения сохраняются в этом браузере
      </footer>
      {editor && (
        <TaskForm
          key={editor.id ?? 'new'}
          item={editor}
          busy={busy}
          error={notice?.type === 'error' ? notice.text : ''}
          onClose={() => setEditor(null)}
          onSave={(data) =>
            startOperation({
              type: editor.id ? 'update' : 'create',
              id: editor.id,
              data,
            })
          }
        />
      )}
      {removing && (
        <div className="modal-backdrop">
          <section
            className="modal confirm"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="remove-title"
          >
            <span className="eyebrow">УДАЛЕНИЕ ЗАДАЧИ</span>
            <h2 id="remove-title">Удалить «{removing.name}»?</h2>
            <p className="muted">
              Восстановить задачу после удаления не получится.
            </p>
            {notice?.type === 'error' && (
              <p className="form-error" role="alert">
                {notice.text}
              </p>
            )}
            <div className="form-actions">
              <button
                autoFocus
                disabled={busy}
                onClick={() => setRemoving(null)}
              >
                Отмена
              </button>
              <button
                className="danger"
                disabled={busy}
                onClick={() =>
                  startOperation({ type: 'remove', id: removing.id })
                }
              >
                {busy ? 'Удаляем…' : 'Удалить'}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

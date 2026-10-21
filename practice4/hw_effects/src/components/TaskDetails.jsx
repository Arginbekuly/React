import { useEffect, useState } from 'react'
import { getItem } from '../api/fakeApi'

function date(value) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export default function TaskDetails({
  id,
  busy,
  operation,
  onEdit,
  onRemove,
  onComplete,
}) {
  const [resource, setResource] = useState({
    status: 'loading',
    data: null,
    error: '',
  })
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    if (!id) return
    const controller = new AbortController()
    getItem(id, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted)
          setResource({ status: 'success', data, error: '' })
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setResource({ status: 'error', data: null, error: error.message })
      })
    return () => controller.abort()
  }, [id, retry])
  const item = resource.data
  return (
    <aside className="detail-panel" aria-label="Подробности задачи">
      <div className="detail-heading">
        <h2>Подробности</h2>
        <span aria-hidden="true">↗</span>
      </div>
      {!id ? (
        <div className="empty">
          <span className="empty-icon">☑</span>
          <h3>Выберите задачу</h3>
          <p>Здесь будут описание и детали.</p>
        </div>
      ) : resource.status === 'loading' ? (
        <div className="empty" role="status">
          <span className="spinner" />
          Загружаем подробности…
        </div>
      ) : resource.status === 'error' ? (
        <div className="empty" role="alert">
          <h3>Не удалось загрузить задачу</h3>
          <p>{resource.error}</p>
          <button
            onClick={() => {
              setResource({ status: 'loading', data: null, error: '' })
              setRetry((value) => value + 1)
            }}
          >
            Повторить
          </button>
        </div>
      ) : (
        <div className="detail-body">
          <span
            className={`badge ${item.status === 'Готово' ? 'complete' : item.status === 'В работе' ? 'progress' : 'planned'}`}
          >
            {item.status}
          </span>
          <h2 className="task-title">{item.name}</h2>
          <p className="description">{item.description}</p>
          <dl className="properties">
            <div>
              <dt>Приоритет</dt>
              <dd>
                <span className={`priority-dot ${item.priority}`} />
                {item.priority}
              </dd>
            </div>
            <div>
              <dt>Категория</dt>
              <dd>{item.category}</dd>
            </div>
            <div>
              <dt>Исполнитель</dt>
              <dd>
                <span className="mini-avatar">{item.assignee[0]}</span>
                {item.assignee}
              </dd>
            </div>
            <div>
              <dt>Срок</dt>
              <dd>{date(`${item.dueDate}T12:00:00`)}</dd>
            </div>
            <div>
              <dt>Оценка времени</dt>
              <dd>{item.estimate} ч</dd>
            </div>
            <div>
              <dt>Создана</dt>
              <dd>{date(item.createdAt)}</dd>
            </div>
          </dl>
          <button
            className="primary complete-button"
            disabled={busy}
            onClick={() => onComplete(item)}
          >
            {operation?.id === id
              ? 'Сохраняем…'
              : item.status === 'Готово'
                ? '↶ Вернуть в работу'
                : '✓ Завершить задачу'}
          </button>
          <div className="detail-actions">
            <button disabled={busy} onClick={() => onEdit(item)}>
              Редактировать
            </button>
            <button
              className="delete-button"
              disabled={busy}
              onClick={() => onRemove(item)}
            >
              Удалить
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}

import { useEffect, useState } from 'react'

export default function TaskForm({ item, busy, error, onClose, onSave }) {
  const [form, setForm] = useState({
    name: item.name ?? '',
    description: item.description ?? '',
    assignee: item.assignee ?? 'Аргын',
    status: item.status ?? 'В планах',
    priority: item.priority ?? 'Средний',
    category: item.category ?? 'Личное',
    dueDate: item.dueDate ?? '',
    estimate: item.estimate ?? 1,
  })
  useEffect(() => {
    const previous = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function handleKey(event) {
      if (event.key === 'Escape' && !busy) onClose()
      if (event.key === 'Tab') {
        const elements = [
          ...document.querySelectorAll(
            '.modal button:not(:disabled), .modal input:not(:disabled), .modal textarea:not(:disabled), .modal select:not(:disabled)',
          ),
        ]
        const first = elements[0]
        const last = elements[elements.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKey)
      previous?.focus()
    }
  }, [busy, onClose])
  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }
  return (
    <div className="modal-backdrop">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">МОИ ЗАДАЧИ</p>
            <h2 id="form-title">
              {item.id ? 'Редактировать задачу' : 'Новая задача'}
            </h2>
          </div>
          <button
            className="text-button"
            aria-label="Закрыть форму"
            disabled={busy}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!busy) onSave({ ...form, estimate: Number(form.estimate) })
          }}
        >
          <fieldset disabled={busy}>
            <label>
              Название
              <input
                autoFocus
                name="name"
                required
                maxLength={100}
                value={form.name}
                onChange={change}
                placeholder="Что нужно сделать?"
              />
            </label>
            <label>
              Описание
              <textarea
                name="description"
                required
                maxLength={2000}
                rows={3}
                value={form.description}
                onChange={change}
                placeholder="Добавьте немного подробностей"
              />
            </label>
            <div className="form-grid">
              <label>
                Статус
                <select name="status" value={form.status} onChange={change}>
                  {['В планах', 'В работе', 'Готово'].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                Приоритет
                <select name="priority" value={form.priority} onChange={change}>
                  {['Низкий', 'Средний', 'Высокий'].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                Категория
                <select name="category" value={form.category} onChange={change}>
                  {[
                    'Дизайн',
                    'Разработка',
                    'Учёба',
                    'Тестирование',
                    'Личное',
                  ].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                Исполнитель
                <input
                  name="assignee"
                  required
                  maxLength={60}
                  value={form.assignee}
                  onChange={change}
                />
              </label>
              <label>
                Срок
                <input
                  type="date"
                  name="dueDate"
                  required
                  min="2000-01-01"
                  max="2100-12-31"
                  value={form.dueDate}
                  onChange={change}
                />
              </label>
              <label>
                Оценка, часов
                <input
                  type="number"
                  name="estimate"
                  required
                  min="0.5"
                  max="1000"
                  step="0.5"
                  value={form.estimate}
                  onChange={change}
                />
              </label>
            </div>
          </fieldset>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="form-actions">
            <button type="button" disabled={busy} onClick={onClose}>
              Отмена
            </button>
            <button className="primary" disabled={busy} type="submit">
              {busy ? 'Сохраняем…' : item.id ? 'Сохранить' : 'Добавить задачу'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

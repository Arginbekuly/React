import { useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { AircraftPreview } from './AircraftPreview';
import { AircraftPhotoPicker } from './AircraftPhotoPicker';

const defaults = {
  name: '',
  capacity: '180',
  distance: '5600',
  engines: 'Два турбовентиляторных',
  cabin: 'Эконом',
  livery: '#b23a2a',
  photo: null,
};
const liveries = [
  ['#b23a2a', 'Красная'],
  ['#2f6fb0', 'Синяя'],
  ['#d9a441', 'Горчичная'],
  ['#1f6b47', 'Зелёная'],
  ['#fffbf0', 'Белая'],
];

export function AircraftForm({ onCreate, showDemo }) {
  const [form, setForm] = useState(defaults);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [simulateError, setSimulateError] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoReset, setPhotoReset] = useState(0);
  const capacity = Number(form.capacity);
  const distance = Number(form.distance);
  const errors = {
    name: form.name.trim().length < 3 || form.name.trim().length > 30 ? 'От 3 до 30 символов.' : '',
    capacity:
      !Number.isInteger(capacity) || capacity < 20 || capacity > 850 ? 'От 20 до 850 мест.' : '',
    distance:
      !Number.isInteger(distance) || distance < 500 || distance > 15000
        ? 'От 500 до 15 000 км.'
        : '',
  };
  const model = {
    ...form,
    name: form.name.trim(),
    capacity,
    distance,
    profit: Math.round(capacity * 5 + distance * 0.055),
    price: Math.round(capacity * 20 + distance * 0.25),
    rentPrice: Math.round(capacity * 7 + distance * 0.12),
  };
  const change = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setSubmitted(false);
  };
  const field = (key, label, type = 'text') => (
    <div className="grid gap-2">
      <label htmlFor={`model-${key}`} className="eyebrow">
        {label}
      </label>
      <input
        id={`model-${key}`}
        className="field"
        type={type}
        value={form[key]}
        placeholder={key === 'name' ? 'Например, Полярная звезда' : undefined}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] && (key !== 'name' || form.name) ? `error-${key}` : undefined}
        onChange={(event) => change(key, event.target.value)}
      />
      {errors[key] && (key !== 'name' || form.name) && (
        <p id={`error-${key}`} className="text-xs text-red">
          {errors[key]}
        </p>
      )}
    </div>
  );
  return (
    <section id="build" className="section-space">
      <SectionHeading
        label="Конструкторское бюро"
        title="Создать свою модель самолёта"
        description="Задайте характеристики и ливрею, и новая модель появится в каталоге."
      />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <form
          className="paper grid gap-5 p-5 sm:p-7"
          aria-busy={sending}
          onSubmit={async (event) => {
            event.preventDefault();
            if (sending || photoBusy || Object.values(errors).some(Boolean)) return;
            setSending(true);
            setSubmitError('');
            setSubmitted(false);
            const result = await onCreate(model, simulateError);
            setSending(false);
            if (result.ok) {
              setForm(defaults);
              setSubmitted(true);
              setPhotoReset((version) => version + 1);
            } else
              setSubmitError(result.error || 'Не удалось сохранить модель. Повторите отправку.');
          }}
        >
          {field('name', 'Название модели')}
          <div className="grid grid-cols-2 gap-3.5">
            {field('capacity', 'Вместимость, мест', 'number')}
            {field('distance', 'Дальность, км', 'number')}
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2">
            {[
              [
                'engines',
                'Двигатели',
                ['Два турбовентиляторных', 'Четыре турбовентиляторных', 'Турбовинтовые'],
              ],
              ['cabin', 'Класс салона', ['Эконом', 'Эконом + бизнес', 'Полный комфорт']],
            ].map(([key, label, options]) => (
              <div key={key} className="grid gap-2">
                <label htmlFor={`model-${key}`} className="eyebrow">
                  {label}
                </label>
                <select
                  id={`model-${key}`}
                  className="field text-sm"
                  value={form[key]}
                  onChange={(event) => change(key, event.target.value)}
                >
                  {options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <fieldset>
            <legend className="eyebrow mb-3">Ливрея</legend>
            <div className="flex flex-wrap gap-3">
              {liveries.map(([color, name]) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`${name} ливрея`}
                  aria-pressed={form.livery === color}
                  onClick={() => change('livery', color)}
                  className={`flex size-11 items-center justify-center rounded-full border-2 border-navy ${form.livery === color ? 'ring-2 ring-navy ring-offset-2 ring-offset-paper' : ''}`}
                  style={{ backgroundColor: color }}
                >
                  {form.livery === color && (
                    <span
                      className={
                        color === '#fffbf0' || color === '#d9a441' ? 'text-navy' : 'text-white'
                      }
                    >
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </fieldset>
          <AircraftPhotoPicker
            key={photoReset}
            value={form.photo}
            onChange={(photo) => change('photo', photo)}
            onBusyChange={setPhotoBusy}
            disabled={sending}
          />
          <button
            className="btn btn-primary"
            disabled={sending || photoBusy || Object.values(errors).some(Boolean)}
            type="submit"
          >
            {sending ? 'Сохраняем модель…' : 'Отправить в разработку'}
          </button>
          {showDemo && (
            <label className="flex items-center gap-2 text-xs text-muted">
              <input
                type="checkbox"
                checked={simulateError}
                onChange={(event) => setSimulateError(event.target.checked)}
              />
              Сымитировать ошибку сохранения
            </label>
          )}
          {submitError && (
            <p role="alert" className="text-sm text-red">
              {submitError} Данные формы сохранены — можно попробовать ещё раз.
            </p>
          )}
          {submitted && (
            <p role="status" className="text-sm font-semibold text-green">
              Модель создана. Найдите её в каталоге по названию.
            </p>
          )}
        </form>
        <AircraftPreview model={model} />
      </div>
    </section>
  );
}

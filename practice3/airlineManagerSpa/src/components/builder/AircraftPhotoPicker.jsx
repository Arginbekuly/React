import { useEffect, useRef, useState } from 'react';
import { aircraftPhotos } from '../../data';
import { prepareAircraftPhoto } from '../../utils/prepareAircraftPhoto';

export function AircraftPhotoPicker({ value, onChange, onBusyChange, disabled }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputVersion, setInputVersion] = useState(0);
  const requestId = useRef(0);
  useEffect(
    () => () => {
      requestId.current += 1;
    },
    [],
  );

  function select(photo) {
    requestId.current += 1;
    setError('');
    setLoading(false);
    onBusyChange(false);
    setInputVersion((version) => version + 1);
    onChange(photo);
  }

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const current = ++requestId.current;
    setError('');
    setLoading(true);
    onBusyChange(true);
    try {
      const photo = await prepareAircraftPhoto(file);
      if (current === requestId.current) onChange(photo);
    } catch (failure) {
      if (current === requestId.current) setError(failure.message);
    } finally {
      if (current === requestId.current) {
        setLoading(false);
        onBusyChange(false);
      }
    }
  }

  return (
    <fieldset disabled={disabled} className="grid gap-3">
      <legend className="eyebrow mb-3">Фото самолёта</legend>
      <div
        className="grid grid-cols-4 gap-2"
        role="group"
        aria-label="Готовые фотографии самолётов"
      >
        {aircraftPhotos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            aria-label={`Выбрать фото ${index + 1}: ${photo.alt}`}
            aria-pressed={value?.src === photo.src}
            onClick={() => select(photo)}
            className={`relative h-16 overflow-hidden rounded-lg border-2 transition-colors sm:h-20 ${value?.src === photo.src ? 'border-navy ring-2 ring-gold' : 'border-line hover:border-navy'}`}
          >
            <img
              src={photo.src}
              alt=""
              className="h-full w-full object-cover"
              style={{ objectPosition: photo.position }}
            />
            {value?.src === photo.src && (
              <span
                aria-hidden="true"
                className="absolute right-1 bottom-1 rounded bg-navy px-1 text-xs text-paper"
              >
                ✓
              </span>
            )}
          </button>
        ))}
      </div>
      <label htmlFor="model-photo" className="text-sm font-semibold">
        Или загрузите своё фото
      </label>
      <input
        key={inputVersion}
        id="model-photo"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="field text-xs file:mr-3 file:rounded-md file:border-0 file:bg-navy file:px-3 file:py-2 file:text-xs file:text-paper"
        aria-describedby="photo-help photo-error"
        onChange={upload}
      />
      <p id="photo-help" className="text-xs leading-relaxed text-muted">
        JPG, PNG или WebP до 5 МБ. Уменьшим фото автоматически и сохраним вместе с моделью в этом
        браузере. Без выбора назначим фото из подборки.
      </p>
      {loading && (
        <p role="status" className="text-xs text-blue">
          Подготавливаем фотографию…
        </p>
      )}
      <p id="photo-error" role={error ? 'alert' : undefined} className="text-xs text-red">
        {error}
      </p>
      {value && (
        <button
          type="button"
          className="min-h-11 justify-self-start text-xs font-semibold text-red underline"
          onClick={() => select(null)}
        >
          Сбросить выбранное фото
        </button>
      )}
    </fieldset>
  );
}

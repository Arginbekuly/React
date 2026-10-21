import { aircraftPhotos, getAircraftPhoto } from '../data.js';

export const MAX_PHOTO_LENGTH = 400_000;

export function normalizeAircraftPhoto(photo) {
  if (photo == null) return null;
  if (typeof photo !== 'object' || typeof photo.src !== 'string') {
    throw new Error('Выберите фотографию из подборки или загрузите файл.');
  }
  const preset = aircraftPhotos.find((item) => item.src === photo.src);
  if (preset) return { ...preset };
  if (photo.src.length > MAX_PHOTO_LENGTH)
    throw new Error('Фотография слишком большая для сохранения.');
  if (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(photo.src)) {
    throw new Error('Поддерживаются только фотографии JPG, PNG и WebP.');
  }
  return { src: photo.src, alt: 'Загруженное фото самолёта', position: '50% 50%' };
}

export function getModelPhoto(model) {
  return model.photo || getAircraftPhoto(model.aircraftNumber ?? model.id);
}

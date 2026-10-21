import { normalizeAircraftPhoto } from './aircraftPhoto.js';

function readDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () =>
      reject(new Error('Не удалось прочитать фотографию. Попробуйте другой файл.'));
    reader.readAsDataURL(blob);
  });
}

// Уменьшаем файл в памяти, не добавляя canvas или другие узлы в DOM.
export async function prepareAircraftPhoto(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Выберите файл JPG, PNG или WebP.');
  }
  if (file.size > 5 * 1024 * 1024) throw new Error('Размер исходного файла — не больше 5 МБ.');
  if (typeof createImageBitmap !== 'function' || typeof OffscreenCanvas === 'undefined') {
    throw new Error(
      'Этот браузер не поддерживает подготовку фото. Выберите готовое фото из подборки.',
    );
  }

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
    if (bitmap.width * bitmap.height > 40_000_000)
      throw new Error('Разрешение фото слишком большое. Выберите уменьшенную копию.');
    for (const [maxSide, quality] of [
      [960, 0.8],
      [640, 0.6],
    ]) {
      const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
      const canvas = new OffscreenCanvas(
        Math.max(1, Math.round(bitmap.width * scale)),
        Math.max(1, Math.round(bitmap.height * scale)),
      );
      const context = canvas.getContext('2d');
      context.fillStyle = '#fffbf0';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
      if (blob.size <= 240 * 1024) return normalizeAircraftPhoto({ src: await readDataUrl(blob) });
    }
    throw new Error('Не удалось уменьшить фотографию. Попробуйте другой файл.');
  } catch (error) {
    if (error instanceof DOMException || error instanceof TypeError)
      throw new Error('Не удалось открыть фотографию. Попробуйте другой JPG, PNG или WebP.', {
        cause: error,
      });
    throw error;
  } finally {
    bitmap?.close();
  }
}

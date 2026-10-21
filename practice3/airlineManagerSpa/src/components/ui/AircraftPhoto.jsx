import { getModelPhoto } from '../../utils/aircraftPhoto';

export function AircraftPhoto({ model, className = 'h-full w-full object-cover' }) {
  const photo = getModelPhoto(model);
  return (
    <img
      src={photo.src}
      alt={photo.alt}
      style={{ objectPosition: photo.position }}
      className={className}
      loading="lazy"
    />
  );
}

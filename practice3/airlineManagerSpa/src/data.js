export const PLANE_STATUS = {
  READY: 'ready',
  IN_FLIGHT: 'in_flight',
  REPAIR: 'repair',
  RENTED: 'rented',
};

export const aircraftPhotos = [
  { src: '/images/aircraft.jpg', alt: 'Самолёт у терминала аэропорта', position: '50% 50%' },
  {
    src: '/images/aircraft-2.jpg',
    alt: 'Пассажирский самолёт в голубом небе',
    position: '50% 45%',
  },
  { src: '/images/aircraft-4.jpg', alt: 'Самолёт над облаками, вид снизу', position: '50% 50%' },
  {
    src: '/images/aircraft-6.jpg',
    alt: 'Самолёт заходит на посадку на фоне гор',
    position: '50% 25%',
  },
  { src: '/images/aircraft-7.jpg', alt: 'Самолёт у телетрапа на закате', position: '50% 50%' },
  { src: '/images/aircraft-3.jpg', alt: 'Крыло самолёта над облаками', position: '50% 50%' },
  {
    src: '/images/aircraft-5.jpg',
    alt: 'Частный самолёт на взлётной полосе на закате',
    position: '50% 55%',
  },
];

// Номер модели сохраняет за ней фотографию при поиске, сортировке и перезагрузке.
export function getAircraftPhoto(aircraftNumber) {
  const index = Math.max(0, (Number(aircraftNumber) || 1) - 1) % aircraftPhotos.length;
  return aircraftPhotos[index];
}

export const airplanes = [
  {
    id: '1',
    name: 'Небесный стрелец',
    capacity: 180,
    distance: 5600,
    profit: 1200,
    price: 5000,
    rentPrice: 2000,
    modelTag: 'SkyLine 180',
    color: '#6fa8d2',
  },
  {
    id: '2',
    name: 'Сокол',
    capacity: 190,
    distance: 6100,
    profit: 1500,
    price: 6000,
    rentPrice: 2000,
    modelTag: 'SkyLine 190',
    color: '#e7a074',
  },
  {
    id: '3',
    name: 'Властелин небес',
    capacity: 396,
    distance: 13600,
    profit: 3200,
    price: 12000,
    rentPrice: 5000,
    modelTag: 'SkyLine 396',
    color: '#3f7fa8',
  },
  {
    id: '4',
    name: 'Экспресс',
    capacity: 220,
    distance: 6500,
    profit: 1800,
    price: 7500,
    rentPrice: 2500,
    modelTag: 'SkyLine 220',
    color: '#2f6fb0',
  },
  {
    id: '5',
    name: 'Буревестник',
    capacity: 156,
    distance: 4800,
    profit: 1100,
    price: 4500,
    rentPrice: 1500,
    modelTag: 'SkyLine 156',
    color: '#79a7a1',
  },
  {
    id: '6',
    name: 'Грозовой альбатрос',
    capacity: 114,
    distance: 3800,
    profit: 900,
    price: 3800,
    rentPrice: 1200,
    modelTag: 'SkyLine 114',
    color: '#a59ab5',
  },
];
export const destinations = [
  { id: 'taldykorgan', name: 'Талдыкорган', distance: 250, code: 'TDK', x: 455, y: 125 },
  { id: 'london', name: 'Лондон', distance: 4100, code: 'LHR', x: 145, y: 105 },
  { id: 'dubai', name: 'Дубай', distance: 2800, code: 'DXB', x: 355, y: 290 },
  { id: 'tokyo', name: 'Токио', distance: 6200, code: 'HND', x: 650, y: 155 },
  { id: 'istanbul', name: 'Стамбул', distance: 3100, code: 'IST', x: 190, y: 245 },
];
export const hangarTypes = [
  { id: 'small', name: 'Малый ангар', price: 4000, slots: 1, discount: 5 },
  { id: 'medium', name: 'Средний ангар', price: 7500, slots: 2, discount: 10 },
  { id: 'large', name: 'Большой ангар', price: 14000, slots: 4, discount: 15 },
  { id: 'center', name: 'Технический центр', price: 30000, slots: 8, discount: 25 },
];
export const money = (value) => `$${Number(value).toLocaleString('ru-RU')}`;
export const number = (value) => Number(value).toLocaleString('ru-RU');

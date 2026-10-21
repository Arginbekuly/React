import { destinations } from '../../data';
export function RouteMap({ flight }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-[#eee4c9]">
      <svg
        viewBox="0 0 760 380"
        className="w-full"
        role="img"
        aria-label={
          flight
            ? `Маршрут: хаб — ${flight.destination.name}`
            : 'Схематичная карта доступных направлений'
        }
      >
        <defs>
          <pattern id="map-grid" width="38" height="38" patternUnits="userSpaceOnUse">
            <path d="M38 0H0V38" fill="none" stroke="#cdb88a" strokeWidth=".6" />
          </pattern>
        </defs>
        <rect width="760" height="380" fill="url(#map-grid)" />
        <path
          d="M70 120 115 55 195 45 230 87 300 50 345 77 380 40 460 56 490 34 550 62 600 48 685 100 706 163 650 184 632 224 580 205 542 257 484 239 460 306 417 278 382 317 340 280 308 312 257 255 214 264 192 205 129 196Z"
          fill="#d8d2ad"
          fillOpacity=".6"
          stroke="#b9b18b"
          strokeWidth="1.5"
        />
        {destinations.map((destination) => {
          const selected = flight?.destination.id === destination.id;
          return (
            <g key={destination.id}>
              <path
                d={`M400 175Q${(400 + destination.x) / 2} ${Math.min(175, destination.y) - 90} ${destination.x} ${destination.y}`}
                fill="none"
                stroke={selected ? '#b23a2a' : '#938363'}
                strokeWidth={selected ? 3 : 1.5}
                strokeDasharray={selected && flight.complete ? undefined : '7 5'}
              />
              <circle
                cx={destination.x}
                cy={destination.y}
                r="6"
                fill={selected ? '#b23a2a' : '#1b2a49'}
              />
              <text
                x={destination.x}
                y={destination.y + 25}
                textAnchor="middle"
                fontFamily="Manrope"
                fontSize="14"
                fontWeight="700"
                fill="#1b2a49"
              >
                {destination.name}
              </text>
              <text
                x={destination.x}
                y={destination.y + 42}
                textAnchor="middle"
                fontFamily="monospace"
                fontSize="10"
                fill="#5c4d33"
              >
                {destination.code}
              </text>
            </g>
          );
        })}
        <circle cx="400" cy="175" r="13" fill="#fbf4e2" stroke="#1b2a49" strokeWidth="2" />
        <text x="400" y="180" textAnchor="middle" fontSize="14" fill="#b23a2a">
          ✈
        </text>
        <text
          x="400"
          y="207"
          textAnchor="middle"
          fontFamily="Manrope"
          fontSize="13"
          fontWeight="700"
          fill="#1b2a49"
        >
          ХАБ · АЛМАТЫ
        </text>
        <text x="20" y="360" fontFamily="monospace" fontSize="10" fill="#5c4d33">
          СХЕМА МАРШРУТОВ · НЕ ГЕОГРАФИЧЕСКАЯ КАРТА
        </text>
      </svg>
    </div>
  );
}

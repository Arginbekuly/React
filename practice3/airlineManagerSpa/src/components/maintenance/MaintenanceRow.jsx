import { money } from '../../data';
import { StatusBadge } from '../ui/StatusBadge';
import { WearGauge } from '../ui/WearGauge';
export function MaintenanceRow({ plane, balance, discount, onRepair, onFinish }) {
  const cost = Math.round(plane.price * 0.1 * (1 - discount / 100));
  return (
    <div className="grid items-center gap-4 border-b border-dotted border-line py-5 last:border-0 sm:grid-cols-2 xl:grid-cols-[1.2fr_1fr_150px_190px]">
      <div>
        <h3 className="text-sm font-bold">{plane.name}</h3>
        <p className="eyebrow mt-1">{plane.tailNumber}</p>
      </div>
      <WearGauge wear={plane.wear} />
      <div>
        <StatusBadge plane={plane} />
      </div>
      <button
        className={`btn text-sm ${plane.status === 'repair' ? 'btn-gold' : 'btn-secondary'}`}
        disabled={
          plane.status !== 'repair' &&
          (plane.status !== 'ready' || plane.wear === 0 || balance < cost)
        }
        onClick={() => (plane.status === 'repair' ? onFinish(plane) : onRepair(plane))}
      >
        {plane.status === 'repair' ? 'Завершить ТО' : `На ТО · ${money(cost)}`}
      </button>
    </div>
  );
}

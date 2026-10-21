export function WearGauge({ wear = 0 }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs text-muted">
        <span>Износ борта</span>
        <b>{wear} %</b>
      </div>
      <div
        role="meter"
        aria-label="Износ борта"
        aria-valuenow={wear}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2.5 overflow-hidden rounded-full bg-line/50"
      >
        <div
          className={`h-full rounded-full ${wear >= 90 ? 'bg-red' : wear >= 60 ? 'bg-[#b58018]' : 'bg-green'}`}
          style={{ width: `${wear}%` }}
        />
      </div>
    </div>
  );
}

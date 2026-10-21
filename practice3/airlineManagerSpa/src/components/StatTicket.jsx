export function StatTicket({ label, value, green }) {
  return (
    <div className="min-w-[120px] flex-1 rounded-[10px] border-[1.5px] border-dashed border-[#a8916a] bg-ticket px-4 py-2.5">
      <p className="eyebrow whitespace-nowrap">{label}</p>
      <p className={`mt-1 font-display text-xl font-bold ${green ? 'text-green' : ''}`}>{value}</p>
    </div>
  );
}

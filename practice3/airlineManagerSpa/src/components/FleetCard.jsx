export function FleetCard({ airplane, id , onFlight, onSell}) {
    if (!airplane) return null;

    const formatMoney = (val) => Number(val || 0).toLocaleString("ru-RU");


    return (
        <div id = {id} className="w-full max-w-[320px] bg-[#0c1424] border border-white/10 border-t-2 border-t-cyan-500 rounded-3xl p-4 flex flex-col justify-between text-xs text-slate-300 shadow-2xl transition-all duration-300 hover:border-white/20">

            <div>
                <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-cyan-400 tracking-wide">
                    #{airplane.tailNumber || `RA-7389${airplane.id}`}
                </span>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Готов</span>
                    </div>
                </div>

                <h3 className="text-base font-extrabold text-white tracking-wide">
                    {airplane.name}
                </h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block" />
                    {airplane.model || "Boeing 737-800"}
                </p>

                <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-4 border border-white/5 bg-slate-900">
                    <img
                        src={airplane.imgUrl}
                        alt={airplane.name}
                        className="w-full h-full object-cover"/>
                        <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[10px] text-slate-200 border border-white/10 font-medium">
                        {airplane.modelTag || "Boeing 737-800"}
                        </span>
                        <span className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[10px] text-cyan-400 border border-white/10 font-medium">
                        Эконом + Бизнес
                        </span>
                </div>

                <div className="space-y-2.5 mb-5">
                    <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400">Рейсов до ТО:</span>
                        <span className="text-amber-400 font-bold">{airplane.repairRemains ?? 5} / 5{" "}
                        <span className="text-amber-400/80 font-normal">(Скоро ТО)</span>
                        </span>
                    </div>

                    <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-amber-400 h-full rounded-full transition-all duration-300"
                            style={{
                                width: `${Math.min(100, ((airplane.repairRemains ?? 5) / 5) * 100)}%`,
                            }}/>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <span className="text-slate-400 flex items-center gap-1.5">
                        <span className="text-emerald-400 text-xs">💲</span> Доход за рейс:
                         </span>
                        <span className="text-emerald-400 font-bold text-sm tracking-tight">
                        ${formatMoney(airplane.profit)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="text-amber-400 text-xs">🔧</span> Стоимость ремонта:
                    </span>
                    <span className="text-slate-100 font-bold">
                    ${formatMoney(airplane.repairPrice)}
                    </span>
                    </div>


            </div>
        </div>

            <div className="space-y-2 mt-auto">
                <button
                    type="button"
                    onClick = {() => onFlight(airplane)}
                    className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-cyan-950/40 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                    <span>✈</span> Отправить в рейс
                </button>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => onSell && onSell(airplane)}
                        className="py-2 px-1 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 hover:bg-red-900/40 text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                        <span>💰</span> Продать (${formatMoney(airplane.sellPrice)})
                    </button>

                    <button
                        type="button"
                        className="py-2 rounded-xl bg-[#111c30] border border-white/10 text-slate-300 hover:border-white/30 text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                        <span>⚙</span> Быстрое ТО
                    </button>
                </div>
            </div>

        </div>
    );
}
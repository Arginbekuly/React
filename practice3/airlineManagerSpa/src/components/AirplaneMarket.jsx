import { useRef } from "react";
import { GrCatalog } from "react-icons/gr";
import { AirplaneCard } from "./AirplaneCard.jsx";

export function AirplaneMarket({
                                   airplanes = [],
                                   onBuy,
                                   onRent,
                                   fleet,
                                   maxPlanes = 6,
                               }) {
    const sliderRef = useRef(null);


    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -320 * 2, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 320 * 2, behavior: "smooth" });
        }
    };

    return (
        <main className="AirplaneMarket px-7 py-12 rounded-2xl bg-surface mx-24 mt-12 mb-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-extrabold text-white">
                        Пополнить флот авиакомпании
                    </h1>
                    <h4 className="text-xs text-muted">
                        Приобретите новый борт в собственность компании или оформите выгодный договор аренды
                    </h4>
                </div>

                <div className="text-muted rounded-2xl px-5 py-2 border border-white/5">
                    <h5 className="text-xs text-white">
                        Свободных ангаров: {fleet.length}/{maxPlanes}
                    </h5>
                </div>
            </div>

            <hr className="border-white/5 my-6" />

            <div className="mb-8">
                <label className="block text-xs font-bold text-muted mb-2">
                    ИМЯ СУДНА ИЛИ БОРТОВОЙ НОМЕР
                </label>
                <div className="border border-white/10 rounded-2xl px-5 py-2.5 max-w-md flex items-center">
                    <GrCatalog size={14} className="text-white/40 mr-3 shrink-0" />
                    <input
                        type="text"
                        className="w-full bg-transparent border-none outline-none text-sm p-0 text-white placeholder-white/40"
                        placeholder="Борт №2 — Сокол"
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                        Выберите тип воздушного судна
                    </h2>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={scrollLeft}
                            className="w-9 h-9 rounded-xl bg-[#131d2e] border border-white/10 text-white flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all cursor-pointer"
                        >
                            ←
                        </button>
                        <button
                            type="button"
                            onClick={scrollRight}
                            className="w-9 h-9 rounded-xl bg-[#131d2e] border border-white/10 text-white flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all cursor-pointer"
                        >
                            →
                        </button>
                    </div>
                </div>

                <div
                    ref={sliderRef}
                    className="flex flex-row gap-4 overflow-x-auto scroll-smooth pb-4 no-scrollbar"
                >
                    {airplanes.map(airplane => (
                        <div key={airplane.id || airplane.name} className="w-[calc(25%-12px)] min-w-[260px] shrink-0">
                            <AirplaneCard
                                airplane={airplane}
                                onBuy={onBuy}
                                onRent={onRent}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
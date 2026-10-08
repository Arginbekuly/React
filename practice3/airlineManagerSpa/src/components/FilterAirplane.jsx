import { useState } from "react";
import {PLANE_STATUS, PLANE_STATUS as STATUS} from "../data.js";
import {FleetCard} from "./FleetCard.jsx";

export function FilterAirplane({fleet , onFilterSelect, onFlight , onSell}) {
    const [activeFilter, setActiveFilter] = useState("all");

    const handleFilterClick = (filterKey) => {
        setActiveFilter(filterKey);
        if (onFilterSelect) onFilterSelect(filterKey);
    };

            // const sortType = [
            //     {
            //         id: "default" ,
            //         sortingFunc :
            //     }
            // ]
    // const sortedFleet = () => {
    //
    // }

    const filterType = [
        {
            id: "all",
            filterFunc: () => true,
        },
        {
            id: "ready",
            filterFunc: (airplane) => airplane.status.includes(PLANE_STATUS.READY),
        },
        {
            id: "in_flight",
            filterFunc: (airplane) => airplane.status.includes(PLANE_STATUS.IN_FLIGHT),
        },
        {
            id: "repair",
            filterFunc: (airplane) => airplane.status.includes(PLANE_STATUS.REPAIR),
        },
        {
            id: "rented",
            filterFunc: (airplane) => airplane.status.includes(PLANE_STATUS.RENTED),
        },
    ];


    const chosenFilter = filterType.find(f => f.id === activeFilter);

    const currentFunc = chosenFilter.filterFunc;

    const filteredFleet = fleet.filter(currentFunc);



    const rentedFleet = fleet.filter(fleet => fleet.status.includes(PLANE_STATUS.RENTED));
    const readyFleet = fleet.filter(fleet => fleet.status.includes(PLANE_STATUS.READY));
    const inFlightFleet = fleet.filter(fleet => fleet.status.includes(PLANE_STATUS.IN_FLIGHT));
    const repairFleet = fleet.filter(fleet => fleet.status.includes(PLANE_STATUS.REPAIR));


    return (
        <div className="flex flex-col items-start space-y-7 gap-4 py-3 mx-24">
            <div className={"flex flex-row justify-between w-full"}>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Фильтр флота:
                    </span>

                    <button
                        onClick={() => handleFilterClick("all")}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            activeFilter === "all"
                                ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]" : "bg-[#131d2e] border border-white/10 text-slate-300 hover:border-white/30"}`}>
                        <span>Все</span>
                        <span
                            className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${
                                activeFilter === "all"
                                    ? "bg-black/20 text-slate-950" : "bg-black/40 text-slate-400"}`}>
                            {fleet.length}
                        </span>
                    </button>

                    <button
                        onClick={() => handleFilterClick("ready")}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            activeFilter === "ready" 
                                ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]" : "bg-[#131d2e] border border-white/10 text-slate-300 hover:border-white/30"}`}>
                        <span>Готовые к вылету</span>
                        <span
                            className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${
                                activeFilter === "ready"
                                    ? "bg-black/20 text-slate-950" : "bg-emerald-500/20 text-emerald-400"}`}>{readyFleet.length}
                        </span>
                    </button>

                    <button
                        onClick={() => handleFilterClick("in_flight")}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            activeFilter === "in_flight"
                                ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]" : "bg-[#131d2e] border border-white/10 text-slate-300 hover:border-white/30"}`}>
                        <span>В рейсе</span>
                        <span
                            className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${
                                activeFilter === "in_flight"
                                    ? "bg-black/20 text-slate-950" : "bg-sky-500/20 text-sky-400"}`}>{inFlightFleet.length}
                        </span>
                    </button>

                    <button
                        onClick={() => handleFilterClick("repair")}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            activeFilter === "repair"
                                ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]" : "bg-[#131d2e] border border-white/10 text-slate-300 hover:border-white/30"}`}>
                        <span>На ремонте / ТО</span>
                        <span
                            className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${
                                activeFilter === "repair"
                                    ? "bg-black/20 text-slate-950" : "bg-amber-500/20 text-amber-400"}`}>{repairFleet.length}
                        </span>
                    </button>

                    <button
                        onClick={() => handleFilterClick("rented")}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            activeFilter === "rented"
                                ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]" : "bg-[#131d2e] border border-white/10 text-slate-300 hover:border-white/30"}`}>
                        <span>Арендованные</span>
                        <span
                            className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${
                                activeFilter === "rented"
                                    ? "bg-black/20 text-slate-950" : "bg-purple-500/20 text-purple-400"}`}>
                            {rentedFleet.length}
                        </span>
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131d2e] border border-white/10 focus-within:border-cyan-500 transition-colors">
                        <span className="text-slate-500 text-sm">🔍</span>
                        <input
                            type="text"
                            placeholder="Поиск по борту..."
                            className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-36"/>
                    </div>

                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#131d2e] border border-white/10 text-xs text-slate-300 hover:border-white/30 transition-colors cursor-pointer">
                        По доходности ↓
                    </button>
                </div>
            </div>
            <div className={"flex flex-row gap-10 "}>
                {filteredFleet.map((item, index) => (
                    <FleetCard airplane={item} id = {index}  onFlight = {onFlight} onSell={onSell} />
                ))}
            </div>

        </div>
    );

}
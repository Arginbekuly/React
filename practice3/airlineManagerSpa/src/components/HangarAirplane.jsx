// import { useState } from "react";
// import { FleetCard } from "./FleetCard.jsx";
//
// export function HangarAirplane({ fleetList = [], onAction }) {
//     const [activeFilter, setActiveFilter] = useState("all");
//     const [search, setSearch] = useState("");
//
//     // Счётчики для кнопок фильтров
//     const counts = {
//         all: fleetList.length,
//         ready: fleetList.filter((p) => p.status === "ready").length,
//         in_flight: fleetList.filter((p) => p.status === "in_flight").length,
//         repair: fleetList.filter((p) => p.status === "repair").length,
//         rented: fleetList.filter((p) => p.status === "rented").length,
//     };
//
//     // Фильтрация списка самолётов
//     const displayedPlanes = fleetList.filter((plane) => {
//         const matchesFilter =
//             activeFilter === "all" ? true : plane.status === activeFilter;
//         const matchesSearch =
//             plane.name.toLowerCase().includes(search.toLowerCase()) ||
//             plane.tailNumber?.toLowerCase().includes(search.toLowerCase());
//         return matchesFilter && matchesSearch;
//     });
//
//     const getBtnClass = (filterKey) =>
//         activeFilter === filterKey
//             ? "flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all cursor-pointer"
//             : "flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#131d2e] border border-white/10 text-slate-300 hover:border-white/30 transition-all cursor-pointer";
//
//     return (
//         <div className="mx-24 my-8">
//             {/* Вывод карточек через .map() */}
//             {displayedPlanes.length === 0 ? (
//                 <div className="text-center py-12 text-slate-500 text-sm bg-[#0c1424] rounded-2xl border border-white/5">
//                     Самолёты не найдены
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//                     {displayedPlanes.map((plane) => (
//                         <FleetCard
//                             key={plane.id || plane.tailNumber}
//                             plane={plane}
//                             onAction={onAction}
//                         />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }
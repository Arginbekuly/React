export function AirplaneCard(props) {
    if (!props.airplane) return null;
    // def NN
    const price = Number(props.airplane.price) || 0;
    return (

        <div className="w-81 bg-[#0b131e] border border-white/10 hover:border-cyan-500/50 transition-all rounded-2xl p-4 flex flex-col justify-between ">
            <div className="bg-cyan-950/60 text-cyan-400 text-[10px] font-bold px-3 py-1 rounded-md w-max mb-3 uppercase tracking-wider">
                {props.airplane.name}
            </div>

            <img src = {props.airplane.imgUrl} alt = {props.airplane.name} className="w-full h-36 object-cover rounded-xl mb-4"/>

            <div className="font-extrabold  mb-3">
                <div>
                    {props.airplane.name}
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Борт:</span>
                    <span className="text-white font-bold">№ {props.airplane.id}</span>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Вместимость:</span>
                    <span className="text-white font-bold">{props.airplane.capacity} мест</span>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Дальность:</span>
                    <span className="text-white font-bold">{props.airplane.distance} km</span>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Доход за рейс:</span>
                    <span className="text-emerald-400 font-light text-sm">+ {props.airplane.profit} $</span>
                </div>
            </div>


            <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs text-slate-400">Покупка:</span>
                <span className="text-emerald-400 font-extrabold text-sm">
                    ${props.airplane.price ? props.airplane.price.toLocaleString() : 0}
                </span>
            </div>

            <div className="pt-3 flex justify-between items-center">
                <span className="text-xs text-slate-400">Аренда:</span>
                <span className="text-yellow-500 font-extrabold text-sm">
                    ${props.airplane.rentPrice ? props.airplane.rentPrice.toLocaleString() : 0}
                </span>
            </div>

            <div className="flex flex-col justify-between items-center mx-3 mt-6 ">
                <button
                    className="w-full py-2 rounded-xl text-md font-extrabold bg-blue-600 text-white"
                    onClick={() => props.onBuy(props.airplane)}
                >
                    🛒Купить
                </button>
                <button
                    className="w-full py-2 mt-5 rounded-xl text-md font-extrabold bg-green-800 hover:bg-green-400 transition-colors duration-200 cursor-pointer text-white"
                    onClick={() => props.onRent(props.airplane)}
                >
                    🔑Взять в аренду
                </button>
            </div>
        </div>

    )
}
import React, { useState } from 'react';
import AirplaneCard from './AirplaneCard';
import BuyAirplaneForm from './BuyAirplaneForm';

const INITIAL_FLEET = [
    {
        id: 1,
        name: 'Небесный Ястреб',
        model: 'Boeing 737',
        price: 5000,
        incomePerFlight: 1200,
        repairCost: 800,
        capacity: 180,
        range: 5600,
        flightsCount: 4, // Остался 1 рейс до ТО!
        status: 'Готов',
        isRented: false
    }
];

function AirlineDashboard() {
    const [balance, setBalance] = useState(20000); // Начальный капитал
    const [fleet, setFleet] = useState(INITIAL_FLEET);
    const [filter, setFilter] = useState('all');

    // 1. Покупка самолета
    const handleBuy = (newPlane) => {
        setBalance(prev => prev - newPlane.price);
        setFleet(prev => [newPlane, ...prev]);
    };

    // 2. Взять в аренду
    const handleRent = (newPlane) => {
        setBalance(prev => prev - newPlane.rentCost);
        setFleet(prev => [newPlane, ...prev]);
    };

    // 3. Продажа самолета (70% от стоимости)
    const handleSell = (id, price) => {
        const sellPrice = Math.floor(price * 0.7);
        setBalance(prev => prev + sellPrice);
        setFleet(prev => prev.filter(p => p.id !== id));
    };

    // 4. Возврат из аренды
    const handleReturnRent = (id) => {
        setFleet(prev => prev.filter(p => p.id !== id));
    };

    // 5. Отправить в рейс (увеличиваем счетчик рейсов и приносим доход)
    const handleSendToFlight = (id) => {
        setFleet(prev => prev.map(plane => {
            if (plane.id === id) {
                const updatedFlights = plane.flightsCount + 1;
                const needsRepairNext = updatedFlights % 5 === 0;

                // Начисляем деньги за рейс
                setBalance(b => b + plane.incomePerFlight);

                return {
                    ...plane,
                    flightsCount: updatedFlights,
                    status: needsRepairNext ? 'Требует ремонт' : 'Готов'
                };
            }
            return plane;
        }));
    };

    // 6. Ремонт самолета
    const handleRepair = (id) => {
        const plane = fleet.find(p => p.id === id);
        if (balance < plane.repairCost) {
            alert('Недостаточно денег на ремонт!');
            return;
        }

        setBalance(b => b - plane.repairCost);
        setFleet(prev => prev.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    status: 'Готов',
                    flightsCount: 0 // Сбрасываем счетчик рейсов после ТО!
                };
            }
            return p;
        }));
    };

    // Фильтрация флота
    const filteredFleet = fleet.filter(plane => {
        if (filter === 'ready') return plane.status === 'Готов' && plane.flightsCount % 5 !== 0;
        if (filter === 'broken') return plane.flightsCount > 0 && plane.flightsCount % 5 === 0;
        if (filter === 'rented') return plane.isRented;
        return true;
    });

    return (
        <div className="airline-dashboard">
            <header className="dashboard-header">
                <h1>✈️ Авиакомпания "SkyManager"</h1>
                <div className="balance-card">
                    <span>Баланс компании:</span>
                    <h2>${balance.toLocaleString()}</h2>
                </div>
            </header>

            <BuyAirplaneForm onBuy={handleBuy} onRent={handleRent} balance={balance} />

            {/* Панель фильтрации */}
            <div className="filter-bar">
                <span>Фильтр флота:</span>
                <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Все ({fleet.length})</button>
                <button className={filter === 'ready' ? 'active' : ''} onClick={() => setFilter('ready')}>Готовые к вылету</button>
                <button className={filter === 'broken' ? 'active' : ''} onClick={() => setFilter('broken')}>На ремонте / ТO</button>
                <button className={filter === 'rented' ? 'active' : ''} onClick={() => setFilter('rented')}>Арендованные</button>
            </div>

            {/* Список самолетов */}
            <div className="fleet-grid">
                {filteredFleet.length === 0 ? (
                    <p className="no-planes">Нет самолетов по выбранному фильтру.</p>
                ) : (
                    filteredFleet.map(plane => (
                        <AirplaneCard
                            key={plane.id}
                            plane={plane}
                            onSendToFlight={handleSendToFlight}
                            onRepair={handleRepair}
                            onSell={handleSell}
                            onReturnRent={handleReturnRent}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default AirlineDashboard;
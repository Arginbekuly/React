import React, { useState } from 'react';

function BuyAirplaneForm({ onBuy, onRent, balance }) {
    const [name, setName] = useState('');
    const [model, setModel] = useState('Boeing 737');

    const modelsData = {
        'Boeing 737': { price: 5000, rentPrice: 1000, income: 1200, repairCost: 800, capacity: 180, range: 5600 },
        'Airbus A320': { price: 6000, rentPrice: 1200, income: 1500, repairCost: 900, capacity: 190, range: 6100 },
        'Boeing 777': { price: 12000, rentPrice: 2500, income: 3200, repairCost: 2000, capacity: 396, range: 13600 }
    };

    const currentSpecs = modelsData[model];

    const handleBuy = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        if (balance < currentSpecs.price) {
            alert('Недостаточно средств для покупки!');
            return;
        }

        onBuy({
            id: Date.now(),
            name,
            model,
            price: currentSpecs.price,
            incomePerFlight: currentSpecs.income,
            repairCost: currentSpecs.repairCost,
            capacity: currentSpecs.capacity,
            range: currentSpecs.range,
            flightsCount: 0,
            status: 'Готов',
            isRented: false
        });

        setName('');
    };

    const handleRent = () => {
        if (!name.trim()) return;
        if (balance < currentSpecs.rentPrice) {
            alert('Недостаточно средств для аренды!');
            return;
        }

        onRent({
            id: Date.now(),
            name: `${name} (Аренда)`,
            model,
            price: currentSpecs.price,
            incomePerFlight: currentSpecs.income,
            repairCost: currentSpecs.repairCost,
            capacity: currentSpecs.capacity,
            range: currentSpecs.range,
            flightsCount: 0,
            status: 'Готов',
            isRented: true,
            rentCost: currentSpecs.rentPrice
        });

        setName('');
    };

    return (
        <form className="buy-form" onSubmit={handleBuy}>
            <h3>➕ Пополнить флот авиакомпании</h3>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Название самолета (напр. 'Борт №1')"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <select value={model} onChange={(e) => setModel(e.target.value)}>
                    <option value="Boeing 737">Boeing 737 ($5,000)</option>
                    <option value="Airbus A320">Airbus A320 ($6,000)</option>
                    <option value="Boeing 777">Boeing 777 ($12,000)</option>
                </select>
            </div>

            <div className="form-buttons">
                <button type="submit" className="btn-buy">
                    🛒 Купить (${currentSpecs.price})
                </button>
                <button type="button" className="btn-rent-action" onClick={handleRent}>
                    🔑 Взять в аренду (${currentSpecs.rentPrice})
                </button>
            </div>
        </form>
    );
}

export default BuyAirplaneForm;
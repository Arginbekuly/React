import React, { useState } from 'react';

function AirplaneCard({ plane, onSendToFlight, onRepair, onSell, onReturnRent }) {
    // Локальный state карточки (например, развернуть подробные характеристики)
    const [showDetails, setShowDetails] = useState(false);

    // Проверяем, сломан ли самолет (каждые 5 рейсов)
    const needsRepair = plane.flightsCount > 0 && plane.flightsCount % 5 === 0;

    return (
        <div className={`plane-card ${plane.status} ${needsRepair ? 'broken' : ''}`}>
            <div className="plane-header">
                <h3>{plane.name} {plane.isRented && <span className="badge-rent">(Аренда)</span>}</h3>
                <span className={`status-badge ${plane.status}`}>
          {needsRepair ? '⚠️ Требует ремонта!' : plane.status}
        </span>
            </div>

            <div className="plane-info">
                <p><strong>Модель:</strong> {plane.model}</p>
                <p><strong>Совершенно рейсов:</strong> {plane.flightsCount} / 5 до ТО</p>
                <p><strong>Доход за рейс:</strong> ${plane.incomePerFlight}</p>
            </div>

            {/* Локальное состояние: раскрытие деталей */}
            <button className="btn-details" onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? 'Скрыть ТТХ' : 'Показать ТТХ'}
            </button>

            {showDetails && (
                <div className="plane-details">
                    <p>Вместимость: {plane.capacity} пасс.</p>
                    <p>Дальность полета: {plane.range} км</p>
                </div>
            )}

            {/* Кнопки действий */}
            <div className="plane-actions">
                {needsRepair ? (
                    <button className="btn-repair" onClick={() => onRepair(plane.id)}>
                        🔧 Починить (${plane.repairCost})
                    </button>
                ) : (
                    <button
                        className="btn-flight"
                        disabled={plane.status === 'В полете'}
                        onClick={() => onSendToFlight(plane.id)}
                    >
                        🛫 Отправить в рейс
                    </button>
                )}

                {plane.isRented ? (
                    <button className="btn-return" onClick={() => onReturnRent(plane.id)}>
                        ↪️ Вернуть из аренды
                    </button>
                ) : (
                    <button className="btn-sell" onClick={() => onSell(plane.id, plane.price)}>
                        💰 Продать (${Math.floor(plane.price * 0.7)})
                    </button>
                )}
            </div>
        </div>
    );
}

export default AirplaneCard;
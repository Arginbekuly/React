import { useEffect, useState } from 'react';
import { useAirline } from './hooks/useAirline';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Catalog } from './components/catalog/Catalog';
import { HowItWorks } from './components/HowItWorks';
import { AircraftForm } from './components/builder/AircraftForm';
import { FleetSection } from './components/fleet/FleetSection';
import { Footer } from './components/Footer';
import { ConfirmModal } from './components/ui/ConfirmModal';
import { AircraftPage } from './pages/AircraftPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { FlightsPage } from './pages/FlightsPage';
import { money } from './data';
import { Toast } from './components/Toast';
import { LoadingState } from './components/ui/LoadingState';
import { ErrorMessage } from './components/ui/ErrorMessage';

function readRoute() {
  const hash = window.location.hash.slice(1);
  if (hash.startsWith('aircraft/')) return { page: 'aircraft', id: hash.slice(9) };
  return { page: ['maintenance', 'flights'].includes(hash) ? hash : 'home', id: null };
}

function App() {
  const airline = useAirline();
  const { game, notice, setNotice, slots, discount, pending, loadError } = airline;
  const [route, setRoute] = useState(readRoute);
  const [showDemo] = useState(
    () => new URLSearchParams(window.location.search).get('demo') === '1',
  );
  const { page, id: selectedModel } = route;
  useEffect(() => {
    const handleRoute = () => setRoute(readRoute());
    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, []);
  const [confirmation, setConfirmation] = useState(null);
  const buy = (plane) => airline.acquire(plane);
  const rent = (plane) => airline.acquire(plane, true);
  const navigate = (nextPage) => {
    setRoute({ page: nextPage, id: null });
    if (nextPage !== 'home') window.location.hash = nextPage;
    else if (page !== 'home') window.location.hash = 'catalog';
    if (nextPage !== page) window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const details = (id) => {
    setRoute({ page: 'aircraft', id });
    window.location.hash = `aircraft/${id}`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const sell = (plane) =>
    setConfirmation({
      title: plane.isRented ? 'Вернуть арендованный борт?' : 'Продать борт?',
      description: `${plane.name}. ${plane.isRented ? 'Стоимость аренды не возвращается.' : `В кассу поступит ${money(Math.round(plane.price * 0.7))}.`}`,
      action: () => airline.sell(plane),
    });
  const buyHangar = (hangar) =>
    setConfirmation({
      title: `Купить ${hangar.name.toLowerCase()}?`,
      description: `Стоимость: ${money(hangar.price)}. Добавится ${hangar.slots} места обслуживания, скидка на ТО увеличится на ${hangar.discount} % (суммарно до 40 %).`,
      action: () => airline.buyHangar(hangar),
    });

  if (!game)
    return (
      <div className="min-h-screen">
        <div className="airmail-stripe" />
        <main className="container-page py-10">
          <h1 className="mb-6 text-2xl font-bold">SKYLINE AIR</h1>
          {loadError ? (
            <ErrorMessage message={loadError} onRetry={airline.retryLoad} />
          ) : (
            <LoadingState label="Открываем кассу…" />
          )}
        </main>
      </div>
    );

  return (
    <div className="min-h-screen">
      <div className="airmail-stripe" />
      <Header balance={game.balance} fleet={game.fleet} page={page} onNavigate={navigate} />
      <main>
        <fieldset disabled={pending} aria-busy={pending} className="min-w-0">
          <div className="container-page" hidden={page !== 'home'}>
            <Hero flights={game.flights} freeSlots={60 - game.fleet.length} onNavigate={navigate} />
            <Catalog
              revision={game.revision}
              showDemo={showDemo}
              balance={game.balance}
              onBuy={buy}
              onRent={rent}
              onDetails={details}
            />
            <HowItWorks />
            <AircraftForm onCreate={airline.createModel} showDemo={showDemo} />
            <FleetSection
              fleet={game.fleet}
              log={game.log}
              onFlight={airline.startFlight}
              onSell={sell}
              onRepair={airline.repair}
              onFinishRepair={airline.finishRepair}
              discount={discount}
            />
          </div>
          {page === 'aircraft' && (
            <AircraftPage
              key={selectedModel}
              id={selectedModel}
              revision={game.revision}
              showDemo={showDemo}
              balance={game.balance}
              onBuy={buy}
              onRent={rent}
              onDetails={details}
              onNavigate={navigate}
            />
          )}
          {page === 'maintenance' && (
            <MaintenancePage
              game={game}
              slots={slots}
              discount={discount}
              onRepair={airline.repair}
              onFinish={airline.finishRepair}
              onBuyHangar={buyHangar}
              onNavigate={navigate}
            />
          )}
          {page === 'flights' && (
            <FlightsPage game={game} onComplete={airline.completeFlight} onNavigate={navigate} />
          )}
        </fieldset>
        {pending && (
          <p role="status" className="container-page mt-4 text-sm text-muted">
            Сохраняем изменения…
          </p>
        )}
      </main>
      <Footer onNavigate={navigate} />
      {notice && <Toast notice={notice} onClose={setNotice} />}
      {confirmation && (
        <ConfirmModal
          title={confirmation.title}
          description={confirmation.description}
          onClose={() => setConfirmation(null)}
          onConfirm={() => {
            const action = confirmation.action;
            setConfirmation(null);
            action();
          }}
        />
      )}
    </div>
  );
}
export default App;

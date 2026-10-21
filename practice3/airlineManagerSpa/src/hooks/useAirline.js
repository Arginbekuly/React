import { useEffect, useRef, useState } from 'react';
import { fakeApi } from '../api/fakeApi';

export function useAirline() {
  const [game, setGame] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const [notice, setNotice] = useState(null);
  const [pending, setPending] = useState(false);
  const actionRef = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();
    fakeApi
      .getGame({ signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          setGame(data);
          setLoadError('');
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError' && !controller.signal.aborted) setLoadError(error.message);
      });
    return () => {
      mounted.current = false;
      controller.abort();
      actionRef.current?.abort();
    };
  }, [retryKey]);

  async function run(action) {
    // Ref блокирует второй клик сразу, ещё до следующего render.
    if (actionRef.current) return { ok: false, error: 'Дождитесь завершения операции.' };
    const controller = new AbortController();
    actionRef.current = controller;
    setPending(true);
    try {
      const result = await action(controller.signal);
      if (!mounted.current || controller.signal.aborted) return { ok: false };
      setGame(result.game);
      setNotice({ text: result.message, error: false });
      return { ok: true, model: result.model };
    } catch (error) {
      if (mounted.current && error.name !== 'AbortError')
        setNotice({ text: error.message, error: true });
      return { ok: false, error: error.message };
    } finally {
      if (actionRef.current === controller) actionRef.current = null;
      if (mounted.current) setPending(false);
    }
  }

  const slots = 4 + (game?.hangars || []).reduce((sum, item) => sum + item.slots, 0);
  const discount = Math.min(
    40,
    (game?.hangars || []).reduce((sum, item) => sum + item.discount, 0),
  );
  return {
    game,
    loadError,
    pending,
    notice,
    setNotice,
    slots,
    discount,
    retryLoad: () => {
      setLoadError('');
      setRetryKey((value) => value + 1);
    },
    acquire: (model, rented = false) =>
      run((signal) => fakeApi.acquire(model.id, rented, { signal })),
    createModel: (model, simulateError = false) =>
      run((signal) => fakeApi.createAircraft(model, { signal, simulateError })),
    startFlight: (plane, destination) =>
      run((signal) => fakeApi.startFlight(plane.id, destination, { signal })),
    completeFlight: (flight) => run((signal) => fakeApi.completeFlight(flight.id, { signal })),
    sell: (plane) => run((signal) => fakeApi.sell(plane.id, { signal })),
    repair: (plane) => run((signal) => fakeApi.repair(plane.id, { signal })),
    finishRepair: (plane) => run((signal) => fakeApi.finishRepair(plane.id, { signal })),
    buyHangar: (hangar) => run((signal) => fakeApi.buyHangar(hangar.id, { signal })),
  };
}

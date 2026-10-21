import { useEffect } from 'react';

export function Toast({ notice, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(null), 5000);
    return () => clearTimeout(timer);
  }, [notice, onClose]);
  return (
    <div
      role={notice.error ? 'alert' : 'status'}
      className={`fixed right-5 bottom-5 left-5 z-40 flex items-start gap-5 rounded-xl border bg-ticket px-5 py-4 shadow-xl sm:left-auto sm:max-w-md ${notice.error ? 'border-red text-red' : 'border-green text-green'}`}
    >
      <p className="text-sm font-semibold leading-relaxed">{notice.text}</p>
      <button
        aria-label="Закрыть уведомление"
        className="-my-2 -mr-2 flex size-11 shrink-0 items-center justify-center text-xl"
        onClick={() => onClose(null)}
      >
        ×
      </button>
    </div>
  );
}

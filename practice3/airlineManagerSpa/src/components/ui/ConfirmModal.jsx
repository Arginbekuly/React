import { useRef } from 'react';

export function ConfirmModal({ title, description, onConfirm, onClose }) {
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);
  function handleKeyDown(event) {
    if (event.key === 'Escape') onClose();
    if (event.key !== 'Tab') return;
    if (event.shiftKey && event.target === cancelRef.current) {
      event.preventDefault();
      confirmRef.current?.focus();
    } else if (!event.shiftKey && event.target === confirmRef.current) {
      event.preventDefault();
      cancelRef.current?.focus();
    }
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        className="paper w-full max-w-md p-7"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <h2 id="confirm-title" className="text-xl font-bold">
          {title}
        </h2>
        <p id="confirm-description" className="mt-3 mb-6 leading-relaxed text-muted">
          {description}
        </p>
        <div className="flex flex-wrap gap-3 [&>button]:flex-1">
          <button autoFocus ref={cancelRef} className="btn btn-secondary" onClick={onClose}>
            Отмена
          </button>
          <button ref={confirmRef} className="btn btn-primary" onClick={onConfirm}>
            Подтвердить
          </button>
        </div>
      </section>
    </div>
  );
}

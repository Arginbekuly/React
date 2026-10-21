export function ErrorMessage({ message, onRetry }) {
  return (
    <div role="alert" className="paper border-red/50 p-6">
      <h2 className="text-lg font-bold text-red">Не удалось получить данные</h2>
      <p className="mt-3 mb-5 text-sm leading-relaxed text-muted">{message}</p>
      <button className="btn btn-primary" onClick={onRetry}>
        Повторить
      </button>
    </div>
  );
}

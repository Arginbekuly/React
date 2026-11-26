
export default function OfflinePage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">

                <div className="mb-6 text-6xl">
                    📡
                </div>

                <h1 className="mb-3 text-3xl font-bold text-slate-900">
                    You're Offline
                </h1>

                <p className="mb-8 text-base leading-relaxed text-slate-500">
                    Please check your internet connection and try again.
                </p>

                <button
                    onClick={handleRetry}
                    type="button"
                    className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-95"
                >
                    Retry Connection
                </button>

            </div>
        </div>
    );
}

function handleRetry(){
    window.location.reload();
}

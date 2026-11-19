
import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

const CHECK_INTERVAL = 5 * 60 * 1000;

export default function PWAUpdatePrompt() {
    const [registration, setRegistration] = useState(null);
    const [updating, setUpdating] = useState(false);

    const {
        needRefresh: [needRefresh, setNeedRefresh],
        offlineReady: [offlineReady, setOfflineReady],
        updateServiceWorker,
    } = useRegisterSW({
        immediate: true,

        onRegisteredSW(swUrl, registration) {
            if (registration) {
                setRegistration(registration);
            }
        },

        onRegisterError(error) {
            console.error("PWA registration error:", error);
        },
    });

    useEffect(() => {
        if (!registration) return;

        function checkForUpdate() {
            if (!navigator.onLine || registration.installing) {
                return;
            }

            registration.update().catch((error) => {
                console.warn("PWA update check failed:", error);
            });
        }

        const interval = setInterval(
            checkForUpdate,
            CHECK_INTERVAL
        );

        window.addEventListener("focus", checkForUpdate);

        return () => {
            clearInterval(interval);
            window.removeEventListener("focus", checkForUpdate);
        };
    }, [registration]);

    async function handleUpdate() {
        setUpdating(true);

        try {
            await updateServiceWorker(true);
        } catch (error) {
            console.error("PWA update failed:", error);
            setUpdating(false);
        }
    }

    function handleClose() {
        setNeedRefresh(false);
        setOfflineReady(false);
    }

    if (!needRefresh && !offlineReady) {
        return null;
    }

    return (
        <div
            role="alert"
            className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:left-auto sm:right-6 sm:w-full"
        >
            <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900">
                    {needRefresh
                        ? "🔄 Update Available"
                        : "✅ Ready for Offline"}
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                    {needRefresh
                        ? "A new version of React Shop is ready. Update to get the latest features."
                        : "React Shop is ready to work offline."}
                </p>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
                <button
                    type="button"
                    onClick={handleClose}
                    className="min-h-11 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                    {needRefresh ? "Later" : "OK"}
                </button>

                {needRefresh && (
                    <button
                        type="button"
                        onClick={handleUpdate}
                        disabled={updating}
                        className="min-h-11 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {updating ? "Updating..." : "Update"}
                    </button>
                )}
            </div>
        </div>
    );
}

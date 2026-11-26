
import { precacheAndRoute, matchPrecache,cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute, setCatchHandler } from "workbox-routing";
import { CacheFirst, NetworkFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";


const BASE_PATH = new URL(self.registration.scope).pathname;

const OFFLINE_URL = new URL(
    "offline.html",
    self.registration.scope
).pathname;

registerRoute(
    ({ request, url }) =>
        request.mode === "navigate" &&
        url.origin === self.location.origin &&
        url.pathname.startsWith(BASE_PATH),

    new NetworkFirst({
        cacheName: "reactshop-pages-v1",
        networkTimeoutSeconds: 3,

        plugins: [
            new ExpirationPlugin({
                maxEntries: 10
            })
        ]
    })
);

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

registerRoute(
    ({ request, url }) =>
        request.destination === "image" &&
        (
            url.origin === self.location.origin ||
            url.hostname === "cdn.dummyjson.com"
        ),

    new CacheFirst({
        cacheName: "reactshop-images-v1",

        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200]
            }),

            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60
            })
        ]
    })
);

registerRoute(
    ({ url, request }) =>
        url.hostname === "dummyjson.com" &&
        url.pathname.startsWith("/products") &&
        request.method === "GET",

    new NetworkFirst({
        cacheName: "reactshop-api-v1",
        networkTimeoutSeconds: 3,

        plugins: [
            new ExpirationPlugin({
                maxEntries: 30,
                maxAgeSeconds: 24 * 60 * 60
            })
        ]
    })
);

setCatchHandler(async ({ request }) => {
    if (request.mode === "navigate") {
        const offlinePage = await matchPrecache(OFFLINE_URL);

        return offlinePage || Response.error();
    }

    return Response.error();
});

self.addEventListener("install", () => {
    console.log("Service Worker installed!");
});


const CURRENT_RUNTIME_CACHES = new Set([
    "reactshop-images-v1",
    "reactshop-api-v1",
    "reactshop-pages-v1"
]);

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();

            const oldCaches = cacheNames.filter((name) => {
                const isOldRuntimeCache =
                    /^reactshop-(images|api|pages)-v\d+$/.test(name);

                return (
                    isOldRuntimeCache &&
                    !CURRENT_RUNTIME_CACHES.has(name)
                );
            });

            await Promise.all(
                oldCaches.map((name) => caches.delete(name))
            );

            await self.clients.claim();

            console.log("Service Worker activated!");
        })()
    );
});

self.addEventListener("message", (event) => {
    if (event.data?.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

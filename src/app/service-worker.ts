/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

// Precache all assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache GET API requests
registerRoute(
  ({ url, request }) => {
    // Only match /api/ paths that are not auth-related
    return url.pathname.startsWith('/api/') && 
           !url.pathname.startsWith('/.auth/') && 
           request.method === 'GET';
  },
  new StaleWhileRevalidate({
    cacheName: 'api-get-cache'
  })
);

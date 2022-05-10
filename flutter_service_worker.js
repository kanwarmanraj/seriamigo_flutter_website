'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "ddfc5fdfd34ad55285182aaebbff3853",
"index.html": "e6d1a0cff708333d8644863bc6fd66bc",
"/": "e6d1a0cff708333d8644863bc6fd66bc",
"main.dart.js": "f444ac98723bd67789f5ae06b6200a9c",
"icons/favicon-16x16.png": "a0334109981c9d1c3dbb1abbed7f471d",
"icons/favicon.ico": "852155f12143b60aaad6d0b05243b5f3",
"icons/apple-icon.png": "23e24ed61167c1e291197a81a9887c4f",
"icons/apple-icon-144x144.png": "dd3aa621d5ca2371749e95be76e93f0c",
"icons/android-icon-192x192.png": "2f4c8f8ca8318c0ec599460dab0310ee",
"icons/apple-icon-precomposed.png": "23e24ed61167c1e291197a81a9887c4f",
"icons/apple-icon-114x114.png": "5f6ec20e5c406f5cf91258f34386614d",
"icons/ms-icon-310x310.png": "9b9e0ccae42c2148c688e33266252d8a",
"icons/ms-icon-144x144.png": "dd3aa621d5ca2371749e95be76e93f0c",
"icons/apple-icon-57x57.png": "d785fe39987408b308a1a999d46a1784",
"icons/apple-icon-152x152.png": "baac316443c03b7eb48eeb7f9b17e4af",
"icons/ms-icon-150x150.png": "a6dfa645a466b9289d8108ea5485c064",
"icons/android-icon-72x72.png": "4f64d927bc0f0fb5395de6cff842d4b1",
"icons/android-icon-96x96.png": "f57f85e7a2ad9f02c34fbb3e885df000",
"icons/android-icon-36x36.png": "804284a7667f9a2952d564a706b128eb",
"icons/apple-icon-180x180.png": "dc5e53f9683705e6667e11f832cea5f3",
"icons/favicon-96x96.png": "f57f85e7a2ad9f02c34fbb3e885df000",
"icons/manifest.json": "b58fcfa7628c9205cb11a1b2c3e8f99a",
"icons/android-icon-48x48.png": "f7924bee10a81dd8b197012756c7e46c",
"icons/apple-icon-76x76.png": "5cbd05a6dc90d962462c381a3f7275ec",
"icons/apple-icon-60x60.png": "67c4acd390242b6722ddf6e08e943bbc",
"icons/browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"icons/android-icon-144x144.png": "dd3aa621d5ca2371749e95be76e93f0c",
"icons/apple-icon-72x72.png": "4f64d927bc0f0fb5395de6cff842d4b1",
"icons/apple-icon-120x120.png": "24d808b9063783f9ba33b3da83c090a4",
"icons/favicon-32x32.png": "698aef96309d8d8f70595f5d70a2cbc6",
"icons/ms-icon-70x70.png": "5b2e4e0b52128f475626974f54b180c1",
"manifest.json": "2d328defbc063aa669dc22524832e7f7",
"assets/images/logo.png": "cd34e4b0138daa6759a2b86e9e395780",
"assets/AssetManifest.json": "a5f42772ef221e38ca06f519bcf72ea5",
"assets/NOTICES": "03961d5a3cb78c044cd28f536b68381a",
"assets/FontManifest.json": "fddb31b61ec5c4c5b9c4e1a638ca8a84",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "dd3c4233029270506ecc994d67785a37",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "613e4cc1af0eb5148b8ce409ad35446d",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "d1722d5cf2c7855862f68edb85e31f88",
"assets/fonts/BonaNova-Regular.ttf": "f18f6c748b0d9126e921b5d4b7fd9b76",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}

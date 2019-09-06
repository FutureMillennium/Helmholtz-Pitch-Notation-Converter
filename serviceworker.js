var CACHE = 'helmholtz';

self.addEventListener('install', function(e) {
	e.waitUntil(
		caches.open(CACHE).then(function(cache) {
			var path = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1);
			
			return cache.addAll([path]);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request).then(function (response) {
				return caches.open(CACHE).then(function (cache) {
					return cache.put(event.request, response);
				});
			});
		}));

	event.waitUntil(fetch(event.request).then(function (response) {
		return caches.open(CACHE).then(function (cache) {
			return cache.put(event.request, response);
		});
	}));
});

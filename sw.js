const staticCacheName = "site-static-v2";
const dynamicCacheName = "site-dynamic-v1";
// Assets will take the URL to the assets
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/manifest.json',
    '/images/favicon.ico',
    '/images/header-wave.svg',
    '/images/mouse-scroll.svg',
    '/images/about/kowsik.jpeg',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
    '/css/style.css',
    'https://cdn.jsdelivr.net/gh/StephanWagner/jBox@v1.3.2/dist/jBox.all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/gh/StephanWagner/jBox@v1.3.2/dist/jBox.all.min.js',
    '/js/dist/typeit.min.js',
    '/js/script.js',
    '/fallback.html'
];

// Limit Cache Size function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        });
    });
}


// install event 
// self in sw refers to itself
self.addEventListener('install', e => {
    console.log("Service worker installed");

    /** 
     * One important thing to note here is that, install event may be stopped by browser 
     * in-order to prevent that we have to pass the caching function through a waitUntill
     * this is because caches are async and takes networking time
    */

    e.waitUntil(
        // Its better to add caches in install event handler.
        // Caches.add will get things from server one by one. While .addAll will get things in list
        caches.open(staticCacheName).then(cache => {
            cache.addAll(assets);
        }).catch(err => {
            console.error("Cache failed", err);
        })
    );

});

// activate event
self.addEventListener('activate', e => {
    console.log("Service worker activated");
    /**
     * Cycle through the cache keys and delete all those which does not 
     * have the value of staticCacheName
     * 
     */
    e.waitUntil(
        caches.keys().then(keys => {
            // console.log(keys); 

            // Delete several old caches
            return Promise.all(
                keys.filter(key => key !== staticCacheName)
                    .map(key => caches.delete(key))
            );
        })
    );


});

// fetch event
self.addEventListener('fetch', e => {
    // console.log("Service worker fetch", e);
    /**
     * We have to check the cache for whether that is available locally.
     * respondWith will intercept the event and allows us to add our own function
     * cacheResponse will be empty if cache is not found
     */

    /**
     * We add .then method to the fetch method to cache new item to the 
     * dynamic cache
     */

    e.respondWith(
        caches.match(e.request).then(cacheResponse => {
            return cacheResponse || fetch(e.request).then(fetchResponse => {
                caches.open(dynamicCacheName).then(cache => {
                    // Put eont do to server to get details as add and addAll do.
                    /** 
                     * e.request.url is the key
                     * We clone (copy) fetchResponse because after we pass it to the promice caches
                     * we cannot use that again
                    */
                    cache.put(e.request.url, fetchResponse.clone());
                    // Limiting Size - Here maximum of 30 items
                    limitCacheSize(dynamicCacheName, 30);
                    return fetchResponse
                })
            });
        }).catch(()=> {
            if (e.request.url.indexOf('.html') > -1)
                return caches.match('/fallback.html');
            /**
             * We can add dummy for other resources like - dummy png if image not found
            */
        })
    );

});

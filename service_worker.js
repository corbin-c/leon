self.addEventListener("install", async (event) => {
  event.waitUntil(caches.open("leon")
    .then((e) => e.addAll(["colortools.js","ther.js","index.html","favicon.ico",
      "style.css","icons/32.png","icons/192.png","icons/512.png"])));
  console.info("Service Worker initialized");
});
self.addEventListener("activate", (event) => {
  console.info("Service Worker active");
});
self.addEventListener("fetch", function(event) {
  event.respondWith(caches.match(event.request)
    .then(function(response) {
    if (typeof response !== "undefined") {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        return response; })
    }
  }));
});
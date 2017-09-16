// 缓存 更新 版本号
var cacheStorageKey = 'minimal-pwa-1'
// 那些文件需要缓存， 离线访问(无信号， 最近浏览的文件不需要流量)
var cacheList = [
    '/',
    'index.html',
    'main.css',
    'logo.png'
]
// self 表示Service Worker  (html5 worker)
// 处理静态缓存
self.addEventListener('install', function(e){
    e.waitUntil(
        caches.open(cacheStorageKey).then(function(cache){
            return cache.addAll(cacheList)
        }).then(function() {
            // 强制当前处于 waiting 状态的脚本进入
            // active状态
            return self.skipWaiting()
        })
    )
})
//动态缓存
self.addEventListener('fetch', function(e) {
    e.responseWith(
        cache.match(e.request).then(function(response){
            if(response != null) {
                return response
            }
            return fetch(e.request.url)
        })
    )
})
self.addEventListener('active', function(e) {
    e.waitUtil(
        Promise.all(
            caches.keys().then(cacheNames => {
                return cacheNames.map(name => {
                    if (name !== cacheStorageKey) {
                        return caches.delete(name)
                    }
                })
            })
        ).then(() => {
            return self.clients.claim()
        })
    )
})

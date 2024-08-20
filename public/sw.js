console.log('Service Worker')

self.addEventListener('push', e => {
    const data = e.data.json();
    console.log(data)
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTnKvQE0xOyMLhnfmhBRZbUXkmQWmlTTMGPUABNn7bNs9XYRi1W'
    })
})
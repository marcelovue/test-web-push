self.addEventListener('push', (event) => {
  console.warn('push data', event)
  let data = event.data.json()
  console.log('message',data)
  event.waitUntil(self.registration.showNotification(data.from, {
    body: data.message
  }))
})

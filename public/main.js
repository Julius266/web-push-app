const PUBLIC_VAPID_KEY = 'BJHMAExOhPj3AwQtYYK1Sh5ZxBFKpRNOYml6iFUc3DPVSwUCLWGhGISiLYl7x0Ibr7_QaDfUqdOpaOfJ4BK4tk8';


async function subscribeUser() {
  const register = await navigator.serviceWorker.register('/sw.js');
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
  });

  await fetch('/api/notifications/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

subscribeUser();

// navigator.serviceWorker.ready.then(function(registration) {
//   registration.showNotification('Bienvenido', {
//       body: 'Gracias por suscribirte a las notificaciones.',
//       icon: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTnKvQE0xOyMLhnfmhBRZbUXkmQWmlTTMGPUABNn7bNs9XYRi1W'
//   });
// });

document.getElementById('notify-btn').addEventListener('click', function() {
  navigator.serviceWorker.ready.then(function(registration) {
      registration.showNotification('Notificación Manual', {
          body: 'Has presionado el botón para enviar esta notificación.',
          icon: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTnKvQE0xOyMLhnfmhBRZbUXkmQWmlTTMGPUABNn7bNs9XYRi1W'
      });
  });
});


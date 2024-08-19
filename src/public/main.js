const PUBLIC_VAPID_KEY = 'BJHMAExOhPj3AwQtYYK1Sh5ZxBFKpRNOYml6iFUc3DPVSwUCLWGhGISiLYl7x0Ibr7_QaDfUqdOpaOfJ4BK4tk8'

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  

const subscription = async () => {

    // Service Worker
    const register = await navigator.serviceWorker.register('/worker.js', {
        scope: '/'
    });
    console.log('New Service Worker');

    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
    });

    await fetch('/subscription', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            "content-Type": "application/json"
        }
    });
    console.log('Suscribed')
}

subscription();
const PUBLIC_VAPID_KEY = 'BJHMAExOhPj3AwQtYYK1Sh5ZxBFKpRNOYml6iFUc3DPVSwUCLWGhGISiLYl7x0Ibr7_QaDfUqdOpaOfJ4BK4tk8';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker registrado con éxito:', registration);
            return navigator.serviceWorker.ready; // Asegura que el SW esté listo
        })
        .then(() => requestPermissions()) // Llama a la función que solicita permisos
        .catch(error => {
            console.error('Error al registrar el Service Worker:', error);
        });
} else {
    console.warn('Service Workers no están soportados en este navegador.');
}

async function requestPermissions() {
    try {
        const notificationPermission = await Notification.requestPermission();
        if (notificationPermission !== 'granted') {
            throw new Error('Permiso de notificación no concedido');
        }

        // Solicitar la ubicación
        requestLocationPermission();
    } catch (error) {
        console.error('Error solicitando permisos:', error);
    }
}

function requestLocationPermission() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Ubicación obtenida:', position);
                subscribeUserWithLocation(position); // Llama a la función con la ubicación
            },
            (error) => {
                console.error('Error al obtener la ubicación:', error);
            },
            {
                enableHighAccuracy: false, // Reducir la precisión si no es necesario
                timeout: 10000, // Aumentar el tiempo de espera
                maximumAge: 0
            }
        );
    } else {
        console.warn('La geolocalización no está soportada en este navegador.');
    }
}


async function subscribeUserWithLocation(position) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(async (registration) => {
            const existingSubscription = await registration.pushManager.getSubscription();

            if (!existingSubscription) {
                try {
                    const subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
                    });

                    console.log(subscription);  // Verifica que tenga endpoint, keys, etc.

                    const locationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };

                    const dataToSend = {
                        endpoint: subscription.endpoint,
                        keys: {
                            p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),
                            auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth'))))
                        },
                        location: locationData
                    };
                    
                    console.log('Datos enviados:', dataToSend);


                    await fetch('https://bs19l2t0-5000.use2.devtunnels.ms/api/notifications/subscribe', {
                        method: 'POST',
                        body: JSON.stringify(dataToSend),
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        }
                    });

                    console.log('Usuario suscrito con éxito con ubicación.');
                } catch (error) {
                    console.error('Error al suscribir el usuario:', error);
                }
            } else {
                console.log('El usuario ya está suscrito.');
            }
        });
    } else {
        console.warn('Service Workers no están soportados en este navegador.');
    }
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

document.getElementById('notify-btn').addEventListener('click', function () {
    const url = 'http://localhost:5000/'; // Reemplaza con la URL que desees
    navigator.serviceWorker.ready.then(function (registration) {
        registration.showNotification('Notificación Manual', {
            body: 'Has presionado el botón para enviar esta notificación.',
            icon: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTnKvQE0xOyMLhnfmhBRZbUXkmQWmlTTMGPUABNn7bNs9XYRi1W',
            data: {
                url: url
            }
        });
    });
});

async function loadSubscriptions() {
    try {
        const response = await fetch('https://bs19l2t0-5000.use2.devtunnels.ms/api/notifications/subscriptions');
        const subscriptions = await response.json();
        const tableBody = document.querySelector('#subscriptions-table tbody');

        subscriptions.forEach(sub => {
            const row = document.createElement('tr');

            const endpointCell = document.createElement('td');
            endpointCell.textContent = sub.endpoint;

            const domainCell = document.createElement('td');
            domainCell.textContent = sub.domain;

            const latitudeCell = document.createElement('td');
            latitudeCell.textContent = sub.location?.latitude || 'N/A';

            const longitudeCell = document.createElement('td');
            longitudeCell.textContent = sub.location?.longitude || 'N/A';

            const userAgentCell = document.createElement('td');
            userAgentCell.textContent = sub.userAgent || 'N/A';

            const actionCell = document.createElement('td');
            const button = document.createElement('button');
            button.textContent = 'Enviar Notificación';
            button.addEventListener('click', () => sendNotification(sub.endpoint));

            actionCell.appendChild(button);
            row.appendChild(endpointCell);
            row.appendChild(domainCell);
            row.appendChild(latitudeCell);
            row.appendChild(longitudeCell);
            row.appendChild(userAgentCell);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar suscripciones:', error);
    }
}


async function sendNotification(endpoint) {
    try {
        await fetch('https://bs19l2t0-5000.use2.devtunnels.ms/api/notifications/send', {
            method: 'POST',
            body: JSON.stringify({
                endpoint: endpoint,
                title: 'Notificación Personalizada',
                body: 'Esta es una notificación enviada solo a este usuario.'
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
        console.log('Notificación enviada con éxito.');
    } catch (error) {
        console.error('Error al enviar notificación:', error);
    }
}

loadSubscriptions();




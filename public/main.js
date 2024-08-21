const PUBLIC_VAPID_KEY = 'BJHMAExOhPj3AwQtYYK1Sh5ZxBFKpRNOYml6iFUc3DPVSwUCLWGhGISiLYl7x0Ibr7_QaDfUqdOpaOfJ4BK4tk8';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker registrado con éxito:', registration);
            return navigator.serviceWorker.ready; // Asegura que el SW esté listo
        })
        .then(registration => requestNotificationPermission().then(() => subscribeUser(registration)))
        .catch(error => {
            console.error('Error al registrar el Service Worker:', error);
        });
} else {
    console.warn('Service Workers no están soportados en este navegador.');
}

async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        throw new Error('Permiso de notificación no concedido');
    }
}

async function subscribeUser(registration) {
    const existingSubscription = await registration.pushManager.getSubscription();

    if (!existingSubscription) {
        try {
            const subscription = await registration.pushManager.subscribe({
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
            console.log('Usuario suscrito con éxito.');
        } catch (error) {
            console.error('Error al suscribir el usuario:', error);
        }
    } else {
        console.log('El usuario ya está suscrito.');
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
        const response = await fetch('http://localhost:5000/api/notifications/subscriptions');
        const subscriptions = await response.json();
        const tableBody = document.querySelector('#subscriptions-table tbody');

        subscriptions.forEach(sub => {
            const row = document.createElement('tr');

            const endpointCell = document.createElement('td');
            endpointCell.textContent = sub.endpoint;

            const domainCell = document.createElement('td');
            domainCell.textContent = sub.domain;

            const actionCell = document.createElement('td');
            const button = document.createElement('button');
            button.textContent = 'Enviar Notificación';
            button.addEventListener('click', () => sendNotification(sub.endpoint));

            actionCell.appendChild(button);
            row.appendChild(endpointCell);
            row.appendChild(domainCell);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar suscripciones:', error);
    }
}

async function sendNotification(endpoint) {
    try {
        await fetch('http://localhost:5000/api/notifications/send', {
            method: 'POST',
            body: JSON.stringify({
                endpoint: endpoint,
                title: 'Notificación Personalizada',
                body: 'Esta es una notificación enviada solo a este usuario.'
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Notificación enviada con éxito.');
    } catch (error) {
        console.error('Error al enviar notificación:', error);
    }
}

loadSubscriptions();

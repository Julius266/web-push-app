self.addEventListener("push", (e) => {
  const data = e.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon || "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTnKvQE0xOyMLhnfmhBRZbUXkmQWmlTTMGPUABNn7bNs9XYRi1W",
    badge: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTnKvQE0xOyMLhnfmhBRZbUXkmQWmlTTMGPUABNn7bNs9XYRi1W",
    data: {
      url: data.url || "https://sistemasgenesis.com.ec/", // URL por defecto a tu página principal
    },
    actions: [
      {
        action: "aceptar",
        title: "Aceptar",
        icon: "ruta/a/tu/imagen.png", // Reemplaza con la URL correcta del icono
      },
    ],
  });
});

console.log("Service Worker registrado");

self.addEventListener("notificationclick", function (event) {
  console.log("Acción seleccionada:", event.action); // Verifica qué acción se está seleccionando
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === event.notification.data.url && "focus" in client) {
          return client.focus();
        }
      }
      if (event.action === "aceptar") {
        return clients.openWindow(event.notification.data.url); // Redirige a la URL dinámica
      } else {
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      }
    })
  );
});

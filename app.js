if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        const registration = await navigator.serviceWorker.register('service-worker.js');
        if (registration)
            console.log('Service Worker registered with scope:',
                registration.scope);
        else
            console.log('Service Worker registration failed:', error);
    });
}
if ('serviceWorker' in navigator) {
    // Here we are giving /sw.js because we need a global scope for that file
    // navigator.serviceWorker.register('/sw.js')
    //     .then((reg) => {
    //         console.log("Service Register Registered", reg);
    //     })
    //     .catch((err) => {
    //         console.error("Service worker failed to register", err);
    //     });

    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
        } 
    });
}

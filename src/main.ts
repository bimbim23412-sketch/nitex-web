import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

// 🚀 NITEX FINAL BUILD - SIN ANIMATIONS (PRODUCCIÓN)
console.log("NITEX FINAL STABLE BUILD - DEPLOY READY");

bootstrapApplication(App, appConfig)
    .then(() => {
        console.log("NITEX iniciada correctamente");
    })
    .catch((err) => {
        console.error("Error crítico en inicio:", err);
    });
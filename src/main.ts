import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

// 🚀 NITEX BUILD V2 - SIN SSR (LIMPIEZA TOTAL PARA RENDER)
console.log("NITEX STABLE BUILD V2 - READY");

bootstrapApplication(App, appConfig)
    .then(() => {
        console.log("NITEX iniciada correctamente");
    })
    .catch((err) => {
        console.error("Error crítico en inicio:", err);
    });
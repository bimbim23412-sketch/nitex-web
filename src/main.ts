import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

// 🔥 FORZAR NUEVA VERSION (esto ayuda a que Render regenere el build)
console.log("NITEX NUEVA VERSION ACTUALIZADA - BUILD NUEVO");

bootstrapApplication(App, appConfig)
    .then(() => {
        console.log("Aplicación iniciada correctamente");
    })
    .catch((err) => console.error("Error al iniciar la app:", err));
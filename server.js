const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const port = process.env.PORT || 10000;

// Intentar encontrar la ruta de build correcta
let distPath = path.join(__dirname, 'dist/app/browser');
if (!fs.existsSync(distPath)) {
    distPath = path.join(__dirname, 'dist/app');
}

console.log(`Sirviendo archivos estáticos desde: ${distPath}`);

app.use(express.static(distPath));

app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('index.html no encontrado en ' + distPath);
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor estático corriendo en puerto ${port}`);
});

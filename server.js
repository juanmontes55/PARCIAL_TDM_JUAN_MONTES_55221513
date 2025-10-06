const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

// 🧠 Como los archivos están al mismo nivel que server.js
const PUBLIC_PATH = __dirname;

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let filePath = parsedUrl.pathname === "/" ? "/index.html" : parsedUrl.pathname;
    filePath = filePath.replace(/\.\./g, ""); // seguridad

    const mimeTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".ico": "image/x-icon"
    };

    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || "application/octet-stream";
    const fullPath = path.join(PUBLIC_PATH, filePath);

    fs.readFile(fullPath, (err, content) => {
        if (err) {
            if (err.code === "ENOENT") {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("<h1>404 - Página no encontrada</h1>");
            } else {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end(`Error del servidor: ${err.code}`);
            }
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf-8");
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
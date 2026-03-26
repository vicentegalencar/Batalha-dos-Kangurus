import { createReadStream, existsSync, statSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const rootDir = process.cwd();
const port = Number(process.env.PORT || 8080);

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.css': 'text/css; charset=utf-8'
};

function resolvePath(requestUrl) {
    const pathname = new URL(requestUrl, 'http://localhost').pathname;
    const relativePath = pathname === '/' ? '/index.html' : decodeURIComponent(pathname);
    const filePath = path.normalize(path.join(rootDir, relativePath));

    if (!filePath.startsWith(rootDir)) {
        return null;
    }

    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
        return path.join(filePath, 'index.html');
    }

    return filePath;
}

const server = http.createServer((request, response) => {
    const filePath = resolvePath(request.url || '/');

    if (!filePath || !existsSync(filePath)) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Arquivo nao encontrado.');
        return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extension] || 'application/octet-stream';

    response.writeHead(200, { 'Content-Type': contentType });
    createReadStream(filePath).pipe(response);
});

server.listen(port, () => {
    console.log(`Servidor local em http://localhost:${port}`);
});

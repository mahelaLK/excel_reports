import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

// Check if dist folder exists
console.log('Dist path:', distPath);
console.log('Dist exists:', fs.existsSync(distPath));
console.log('Index.html exists:', fs.existsSync(indexPath));

// Serve static files from dist folder
app.use(express.static(distPath));

// Handle SPA routing - send all requests to index.html
// Use a more specific pattern instead of '*'
app.use((req, res) => {
  console.log('Request received for:', req.url);
  res.sendFile(indexPath);
});

const PORT = 3000;
const HOST = '192.168.1.191';

app.listen(PORT, HOST, () => {
  console.log(`Frontend server running on http://${HOST}:${PORT}`);
  console.log(`Server is listening on all interfaces at port ${PORT}`);
});
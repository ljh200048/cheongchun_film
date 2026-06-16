const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'dist', 'index.html');
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // If index.html isn't ready or doesn't exist, we fallback on a redirect page
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<html><head><script>window.location.href="https://cheongchun.cloud";</script></head><body>Redirecting to Cheongchun Film...</body></html>');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

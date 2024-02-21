const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Define API routes and corresponding backend services
const routes = {
  '/': 'http://localhost:4000',
  '/user': 'http://localhost:4000',
};

// Create proxy middleware
const proxies = Object.keys(routes).map(route => {
  return createProxyMiddleware(route, {
    target: routes[route],
    changeOrigin: true,
    xfwd: true,
  });
});

// Create API gateway server
const server = http.createServer((req, res) => {
  for (const proxy of proxies) {
    proxy(req, res, () => { });
  }
});

const port = 5000;
server.listen(port, () => {
  console.log(`API gateway running on port ${port}`);
});
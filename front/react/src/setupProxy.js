const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // WebSocket
  app.use(
    '/stomp',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      ws: true
    })
  );

  // REST
  app.use(
    '/api',       // ← /cust를 /api로 옮겼다면 '/api' 한 줄만
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true
    })
  );
};

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/stage',
    createProxyMiddleware({
      target: 'https://xjoexzabe3.execute-api.ap-south-1.amazonaws.com',
      changeOrigin: true,
      secure: true,
    })
  );
};

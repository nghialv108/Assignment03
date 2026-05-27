const app = require('express')();
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const authMiddleware = require('./authmiddlware');
app.use(cors());
app.use(authMiddleware); // Apply authentication middleware to all routes
// Proxy configuration
const serviceProxy = createProxyMiddleware({
    target: 'http://localhost:4000', // Target microservice URL
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // Remove /api prefix when forwarding to microservice
    },
    onProxyReq: (proxyReq, req, res) => {
        // Forward the Authorization header to the microservice
        if (req.headers['x-user-id']) {
            proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
        }
        if (req.headers['x-user-role']) {
            proxyReq.setHeader('x-user-role', req.headers['x-user-role']);
        }

    }
});

// Use the proxy middleware for API routes
app.use('/api', serviceProxy);



// Start the server
app.listen(3000, () => {
    console.log('API Gateway running on http://localhost:3000');
});





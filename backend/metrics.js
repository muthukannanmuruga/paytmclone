// metrics.js
const client = require('prom-client');

const collectDefaultMetrics = client.collectDefaultMetrics;

// Enable default metrics collection
collectDefaultMetrics({ timeout: 5000 });

// Create metrics
const metrics = {
   apiResponseTime: new client.Histogram({
      name: 'api_response_time_seconds',
      help: 'API Response time in seconds',
      labelNames: ['method', 'route', 'status', 'user'],
   }),
   
   apiRequestCount: new client.Counter({
      name: 'api_request_count',
      help: 'Total number of requests received',
      labelNames: ['method', 'route', 'status', 'user'],
   }),
};

// Export the client and metrics
module.exports = { client, metrics };
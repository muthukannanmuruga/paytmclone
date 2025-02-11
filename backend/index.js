const express = require("express");
const rootRouter = require("./routes/index")
const cors= require("cors")
const { client, metrics } = require('./metrics');

//backend port 3000

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const logs = []

// Splunk logging configuration
// const config = {
//   token: "YOUR_HEC_TOKEN", // Replace with your HEC token
//   url: "https://your-splunk-instance:8088", // Replace with your Splunk HEC URL
// };

// const Logger = new SplunkLogger(config);


// Middleware to log requests to Splunk
app.use((req, res, next) => {
  
  userid = req.headers['x-user-id'] || "unauthenticated"
  // Log the request details
  const logEntry = {
    method: req.method,
    route: req.originalUrl,
    timestamp: new Date().toISOString(),
    user: userid,
    message: "API request received",
  };

  // Logger.send(logEntry, (err, resp, body) => {
  //   if (err) {
  //     console.error("Error sending log to Splunk:", err);
  //   }
  // });

  // Store the log entry in the logs array
  logs.push(logEntry);

  next();
});

app.use((req, res, next) => {
  userid = req.headers['x-user-id'] || "unauthenticated"
  const end = res.end;

  res.end = (chunk, encoding) => {
    const logEntry = {
      method: req.method,
      route: req.originalUrl,
      statusCode: res.statusCode,
      timestamp: new Date().toISOString(),
      user: userid,
      message: "API response sent",
      responseBody: chunk ? chunk.toString() : null,
    };

    // Logger.send(logEntry, (err, resp, body) => {
    //   if (err) {
    //     console.error("Error sending log to Splunk:", err);
    //   }
    // });

    // Store the log entry in the logs array
    logs.push(logEntry);

    end.call(res, chunk, encoding);
  };

  next(); // Call the next middleware or route handler
});

// Utility function to censor sensitive information
const censorSensitiveInfo = (log) => {
  return {
    method: log.method,
    route: log.route,
    statusCode: log.statusCode,
    timestamp: log.timestamp,
    message: log.message,
    // Censor user info and response body when relevant
    user: log.user || undefined, 
    responseBody: log.responseBody ? log.responseBody.replace(/"?(usertoken)"?:"[^"]*"/g, '"$1":"****"') : undefined
  };
};





// Middleware to start tracking API requests
app.use((req, res, next) => {

  // console.log(res)
  // Default user to "unauthenticated" if no user is logged in

  userid = req.headers['x-user-id'] || "unauthenticated"
  

  // Increment the request count for the specific route
  metrics.apiRequestCount.inc({ method: req.method, route: req.originalUrl, status: res.statusCode, user: userid });

  // Start the timer
  const end = metrics.apiResponseTime.startTimer();

  // Listen to the finish event to stop the timer
  res.on('finish', () => {
     // Stop the timer and log the time taken
     end({ method: req.method, route: req.originalUrl, status: res.statusCode, user: userid});
  });

  next(); // Pass to the next middleware or route handler
});

app.use("/api/v1", rootRouter);

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Route to get all logs with the latest log first
app.get('/logs', (req, res) => {
  if (logs.length > 0) {
    const censoredLogs = logs.reverse().map(censorSensitiveInfo); // Censor sensitive info in reverse order
    res.status(200).json(censoredLogs); // Respond with all log entries in reverse order
  } else {
    res.status(404).json({ message: 'No logs available' }); // No logs generated yet
  }
});

// Example route to generate logs
app.get('/generate-log', (req, res) => {
  // Simulating a response to log
  res.status(200).json({ message: 'Logging test successful!' });
});

app.use((err, req, res, next) => {

  userid = req.headers['x-user-id'] || "unauthenticated"
  // Log the error to Splunk
  const logEntry = {
    level: "error",
    user: userid,
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  };

  // Logger.send(logEntry, (err, resp, body) => {
  //   if (err) {
  //     console.error("Error sending error log to Splunk:", err);
  //   }
  // });

  // Store the log entry in the logs array
  logs.push(logEntry);

  // Send a generic error response to the client
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
  // Event listener for handling errors during app startup
  app.on('error', (err) => {
    console.error(`Error starting the server: ${err.message}`);
  });




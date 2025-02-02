const express = require("express");
const util = require('./utils')
const client = require('prom-client')
const { createLogger, transports, format } = require("winston");
const LokiTransport = require("winston-loki");

const options = {
  format: format.json(),
  transports: [
    new LokiTransport({
      host: "http://192.168.1.2:3100"
    })
  ],
};


const app = express();
const PORT = 8000;

const collectMetrics = client.collectDefaultMetrics;
// const logger = createLogger(options);

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...meta }) => {
            return JSON.stringify({
                timestamp,
                level,
                message,
                params: meta[0] // Adjust the structure to include params
            });
        })
    ),
    transports: [
        new transports.File({ filename: "../logs/app-log.json" }), // Log to JSON file
        new transports.Console() // Log to console
    ],
    exceptionHandlers: [
        new transports.File({ filename: "../logs/exceptions.log" }) // Capture uncaught exceptions
    ]
});

collectMetrics({
    register: client.register
})
// Middleware to parse JSON request bodies
app.use(express.json());

// Health Check Route
app.get("/", (req, res) => {
    logger.info('Healthcheck called', [{ status: "ok", message: "Server is running" }]);
    res.json({ status: "ok", message: "Server is running" });
});

// GET Route: Fetch Data
app.get("/data", (req, res) => {
    logger.info('/data called', [{ status: "ok", message: "Data route called" }]);
    const startTime = Date.now();
    util.mockLatencyAndErrors().then(
        () => {
            const endTime = Date.now();
            const executionTime = endTime - startTime;
            res.json({ message: "Here is some data", data: { success: true, executionTime: `${executionTime}ms` }});
        }
    ).catch(error => {
        logger.error('/data called, some error occured', [{ status: "failed", message: error.message}]);
        res.status(500).json({
            error: error.message
        });
    });
});

// POST Route: Submit Data
app.post("/submit", (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }
    res.json({ message: "Data received", received: { name, email } });
});


app.get("/metrics", async (req, res) => {
    res.setHeader('Content-Type', client.register.contentType),
    res.send(await client.register.metrics());
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
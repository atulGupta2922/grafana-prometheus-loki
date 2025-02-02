# Grafana-Prometheus-Loki Setup

This project provides a complete setup for monitoring and logging using Grafana, Prometheus, Loki, and Promtail, all running in Docker containers.

## Prerequisites

- Docker
- Docker Compose

## Project Structure

```
.
├── docker-compose.yml
├── dockerfile
├── express-app
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── utils.js
├── logs
├── prometheus-config.yml
├── loki-config.yml
└── promtail-config.yml
```

## Services

- **Prometheus**: Monitoring system and time series database.
- **Grafana**: Analytics and monitoring platform.
- **Loki**: Log aggregation system.
- **Promtail**: Agent for collecting logs and sending them to Loki.
- **Express App**: Sample Node.js application for generating metrics and logs.

## Setup Instructions

### 1. Clone the Repository


### 2. Build and Run the Docker Containers

```sh
docker-compose up --build
```

This command will build the Docker images and start all the services defined in the `docker-compose.yml` file.

### 3. Access the Services

- **Grafana**: [http://localhost:3000](http://localhost:3000)
- **Prometheus**: [http://localhost:9090](http://localhost:9090)
- **Loki**: [http://localhost:3100](http://localhost:3100)
- **Express App**: [http://localhost:8000](http://localhost:8000)

### 4. Configure Grafana

1. Open Grafana in your browser.
2. Add Prometheus as a data source:
   - URL: `http://prometheus:9090`
3. Add Loki as a data source:
   - URL: `http://loki:3100`

### 5. Prometheus Configuration

The Prometheus configuration file (`prometheus-config.yml`) is mounted into the Prometheus container. It includes a scrape configuration to fetch metrics from the Express app.

```yaml
scrape_configs:
  - job_name: 'my-service'
    static_configs:
      - targets: ['host.docker.internal:8000']
```

### 6. Loki Configuration

The Loki configuration file (`loki-config.yml`) is mounted into the Loki container. It defines the Loki server settings.

### 7. Promtail Configuration

The Promtail configuration file (`promtail-config.yml`) is mounted into the Promtail container. It defines the log collection settings.

### 8. Express App

The Express app is a sample Node.js application that exposes metrics and logs. It includes routes for health checks, data fetching, and data submission.

### 9. Logs Directory

The `logs` directory is used by Promtail to collect logs and send them to Loki.

## Useful Commands

### Stop the Containers

```sh
docker-compose down
```

### Rebuild the Containers

```sh
docker-compose up --build
```

### View Logs

```sh
docker-compose logs -f
```

## Conclusion

This setup provides a complete monitoring and logging solution using Grafana, Prometheus, Loki, and Promtail. You can extend this setup by adding more services and configurations as needed.

Feel free to contribute to this project by opening issues or submitting pull requests.

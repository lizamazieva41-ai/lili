module.exports = {
  apps: [
    {
      name: 'telegram-platform-api',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        APP_MODE: 'api',
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
        APP_MODE: 'api',
      },
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/api-err.log',
      out_file: './logs/api-out.log',
      log_file: './logs/api-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
      // Health check for API
      health_check_grace_period: 3000,
      health_check_url: 'http://localhost:3000/api/health',
    },
    {
      name: 'telegram-platform-worker',
      script: 'dist/worker.js',
      instances: 1, // Single instance for workers (BullMQ handles concurrency)
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        APP_MODE: 'worker',
      },
      env_development: {
        NODE_ENV: 'development',
        APP_MODE: 'worker',
      },
      watch: false,
      max_memory_restart: '2G', // Workers may need more memory
      error_file: './logs/worker-err.log',
      out_file: './logs/worker-out.log',
      log_file: './logs/worker-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
      // Health check for worker (if worker has HTTP server)
      // Note: Workers typically don't have HTTP endpoints
      // Health is checked via queue metrics instead
    },
  ],
};
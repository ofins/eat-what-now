export const apps = [
  {
    name: 'ewn-backend',
    script: './dist/src/index.js',
    cwd: '/var/www/eat-what-now/server',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
  },
];

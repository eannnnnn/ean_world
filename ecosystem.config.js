module.exports = {
  apps: [
    {
      name: 'ean-world',
      script: './dist/main.js',
      instances: -1,
      wait_ready: true,
      listen_timeout: 50000,
      kill_timeout: 5000,
      exec_mode: 'cluster',
    },
  ],
};

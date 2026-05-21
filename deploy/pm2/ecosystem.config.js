// =============================================================================
// PM2 ecosystem — BUILDEX only.
// =============================================================================
// This file is intentionally scoped to BUILDEX so it CANNOT touch any other
// PM2 process. Use it like this on the server:
//
//   cd /root/buildex
//   pm2 start deploy/pm2/ecosystem.config.js
//   pm2 save
//
// To restart only BUILDEX (without affecting milaknight-os or anything else):
//
//   pm2 restart buildex
//
// =============================================================================

module.exports = {
  apps: [
    {
      name: 'buildex',                       // distinct from "milaknight-os"
      cwd: '/root/buildex',
      script: 'npm',
      args: 'run start',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3010                           // distinct internal port
      },
      out_file: '/root/buildex/.logs/out.log',
      error_file: '/root/buildex/.logs/err.log',
      merge_logs: true,
      time: true
    }
  ]
};

#!/usr/bin/env node
'use strict';

/* =============================================================================
 * BUILDEX — ongoing deploy script
 * =============================================================================
 * Mirrors the milaknight-os pattern (pull -> build -> pm2 restart) but ONLY
 * touches BUILDEX paths and the "buildex" PM2 process. It cannot affect any
 * other site, subdomain, or PM2 app on the server.
 *
 * USAGE:
 *   npm install ssh2          # one-time, on your local machine
 *   SSH_HOST=72.61.162.106 \
 *   SSH_USER=root \
 *   SSH_PASSWORD='your-root-password' \
 *     node scripts/deploy.js
 *
 * SSH_KEY (path to a private key) is supported instead of SSH_PASSWORD.
 *
 * NEVER commit credentials. This script reads everything from environment
 * variables and falls back to safe defaults for the non-secret values.
 * ===========================================================================*/

const fs = require('fs');
const path = require('path');

let Client;
try {
  ({ Client } = require('ssh2'));
} catch {
  console.error(
    '\n[deploy] Missing dependency "ssh2".\n' +
      '         Run:  npm install --no-save ssh2\n' +
      '         (or)  npm install -D ssh2\n'
  );
  process.exit(1);
}

const SSH_CONFIG = {
  host: process.env.SSH_HOST || '72.61.162.106',
  port: Number(process.env.SSH_PORT || 22),
  username: process.env.SSH_USER || 'root',
  readyTimeout: 30_000
};

if (process.env.SSH_KEY) {
  SSH_CONFIG.privateKey = fs.readFileSync(path.resolve(process.env.SSH_KEY));
} else if (process.env.SSH_PASSWORD) {
  SSH_CONFIG.password = process.env.SSH_PASSWORD;
} else {
  console.error(
    '\n[deploy] No credentials provided.\n' +
      '         Set SSH_PASSWORD=...  or  SSH_KEY=/path/to/key\n'
  );
  process.exit(1);
}

const APP_DIR = process.env.APP_DIR || '/root/buildex';
const PM2_NAME = process.env.PM2_NAME || 'buildex';
const BRANCH = process.env.BRANCH || 'main';

const COMMANDS = [
  {
    label: 'git pull',
    cmd: `cd ${APP_DIR} && git fetch --all && git reset --hard origin/${BRANCH} 2>&1`,
    timeoutMs: 60_000
  },
  {
    label: 'npm install',
    cmd: `cd ${APP_DIR} && npm ci --omit=dev=false 2>&1 || npm install 2>&1`,
    timeoutMs: 300_000
  },
  {
    label: 'npm run build',
    cmd: `cd ${APP_DIR} && npm run build 2>&1`,
    timeoutMs: 300_000
  },
  {
    label: 'pm2 restart',
    cmd: `pm2 restart ${PM2_NAME} --update-env 2>&1`,
    timeoutMs: 30_000
  }
];

function timestamp() {
  return new Date().toISOString();
}

function log(prefix, msg) {
  for (const line of msg.split('\n')) {
    if (line.trim()) process.stdout.write(`[${timestamp()}] [${prefix}] ${line}\n`);
  }
}

function runCommand(conn, label, cmd, timeoutMs) {
  return new Promise((resolve, reject) => {
    let output = '';
    let timer;
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(new Error(`[${label}] exec error: ${err.message}`));
      timer = setTimeout(() => {
        stream.destroy();
        reject(new Error(`[${label}] timed out after ${timeoutMs / 1000}s`));
      }, timeoutMs);
      stream.on('data', (data) => {
        const chunk = data.toString('utf8');
        output += chunk;
        log(label, chunk);
      });
      stream.stderr.on('data', (data) => {
        const chunk = data.toString('utf8');
        output += chunk;
        log(label + '/stderr', chunk);
      });
      stream.on('close', (code) => {
        clearTimeout(timer);
        if (code === 0 || code === null) {
          resolve({ code, output });
        } else {
          reject(new Error(`[${label}] exited with code ${code}`));
        }
      });
      stream.on('error', (e) => {
        clearTimeout(timer);
        reject(new Error(`[${label}] stream error: ${e.message}`));
      });
    });
  });
}

async function deploy() {
  const conn = new Client();
  await new Promise((resolve, reject) => {
    conn.on('ready', resolve);
    conn.on('error', (err) =>
      reject(new Error(`SSH connection error: ${err.message}`))
    );
    conn.connect(SSH_CONFIG);
  });
  log(
    'deploy',
    `Connected ${SSH_CONFIG.username}@${SSH_CONFIG.host} — target dir: ${APP_DIR} (pm2: ${PM2_NAME}, branch: ${BRANCH})`
  );
  try {
    for (const { label, cmd, timeoutMs } of COMMANDS) {
      log('deploy', `--- Starting: ${label} ---`);
      const { code } = await runCommand(conn, label, cmd, timeoutMs);
      log('deploy', `--- Finished: ${label} (exit code: ${code}) ---`);
    }
    log('deploy', 'All steps completed successfully.');
  } finally {
    conn.end();
    log('deploy', 'SSH connection closed.');
  }
}

deploy().catch((err) => {
  process.stderr.write(`\nFATAL: ${err.message}\n`);
  process.exit(1);
});

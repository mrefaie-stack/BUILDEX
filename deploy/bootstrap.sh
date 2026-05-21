#!/usr/bin/env bash
# =============================================================================
# BUILDEX — first-time bootstrap on the production server.
# =============================================================================
# Run this ONCE on the server (as root) AFTER the DNS A record for
# buildex.mila-knight.com is already pointing here.
#
#   ssh root@72.61.162.106
#   curl -fsSL https://raw.githubusercontent.com/mrefaie-stack/BUILDEX/main/deploy/bootstrap.sh -o /tmp/buildex-bootstrap.sh
#   bash /tmp/buildex-bootstrap.sh
#
# OR (if you cloned the repo locally first):
#   cd /root/buildex && bash deploy/bootstrap.sh
#
# It is idempotent: safe to re-run.
#
# It will NOT touch /root/milaknight-os, its PM2 process, or any other nginx
# site. It only ever touches resources prefixed with "buildex" / port 3010.
# =============================================================================

set -euo pipefail

# ---- Config ----------------------------------------------------------------
APP_DIR="/root/buildex"
APP_NAME="buildex"
PORT="3010"
DOMAIN="buildex.mila-knight.com"
REPO="https://github.com/mrefaie-stack/BUILDEX.git"
BRANCH="main"
NGINX_SITE="/etc/nginx/sites-available/${DOMAIN}.conf"
NGINX_LINK="/etc/nginx/sites-enabled/${DOMAIN}.conf"

# ---- Helpers ---------------------------------------------------------------
log() { printf "\n\033[1;36m[bootstrap]\033[0m %s\n" "$*"; }
die() { printf "\n\033[1;31m[bootstrap ERROR]\033[0m %s\n" "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "Run as root."

# ---- 1. Required tools -----------------------------------------------------
log "Checking required tools..."
need() { command -v "$1" >/dev/null 2>&1 || die "Missing: $1"; }
need git
need node
need npm
need nginx
command -v pm2 >/dev/null 2>&1 || {
  log "pm2 not found — installing globally"
  npm install -g pm2
}

# ---- 2. Clone or update repo ----------------------------------------------
if [ ! -d "${APP_DIR}/.git" ]; then
  log "Cloning ${REPO} -> ${APP_DIR}"
  git clone "${REPO}" "${APP_DIR}"
else
  log "Repo already present, fast-forwarding to origin/${BRANCH}"
  git -C "${APP_DIR}" fetch --all
  git -C "${APP_DIR}" reset --hard "origin/${BRANCH}"
fi

# ---- 3. .env (DO NOT OVERWRITE if it exists) -------------------------------
if [ ! -f "${APP_DIR}/.env" ]; then
  log "Creating ${APP_DIR}/.env from .env.example — FILL IT IN BEFORE BUILDING."
  cp "${APP_DIR}/.env.example" "${APP_DIR}/.env"
  log "Edit it now:   nano ${APP_DIR}/.env"
  log "Then re-run this bootstrap script."
  exit 0
else
  log ".env already exists — leaving untouched."
fi

# ---- 4. Install + build ----------------------------------------------------
log "Installing dependencies"
cd "${APP_DIR}"
npm ci || npm install

log "Building Next.js production bundle"
npm run build

mkdir -p "${APP_DIR}/.logs"

# ---- 5. PM2 process --------------------------------------------------------
if pm2 describe "${APP_NAME}" >/dev/null 2>&1; then
  log "PM2 process '${APP_NAME}' exists — restarting"
  pm2 restart "${APP_NAME}" --update-env
else
  log "Starting new PM2 process '${APP_NAME}' on port ${PORT}"
  pm2 start "${APP_DIR}/deploy/pm2/ecosystem.config.js"
fi
pm2 save

# Make sure pm2 resurrects on reboot (idempotent — safe to re-run)
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true

# ---- 6. Nginx site (isolated file) ----------------------------------------
log "Installing nginx site config for ${DOMAIN}"
install -m 0644 "${APP_DIR}/deploy/nginx/${DOMAIN}.conf" "${NGINX_SITE}"
if [ ! -L "${NGINX_LINK}" ]; then
  ln -s "${NGINX_SITE}" "${NGINX_LINK}"
fi

# ACME challenge dir (used later by certbot)
mkdir -p /var/www/certbot

log "Testing nginx config (this checks ALL sites, not just buildex)"
nginx -t

log "Reloading nginx"
systemctl reload nginx

# ---- 7. Smoke test ---------------------------------------------------------
log "Smoke-testing http://127.0.0.1:${PORT}"
sleep 2
if curl -fsS --max-time 10 "http://127.0.0.1:${PORT}" >/dev/null; then
  log "OK — buildex is responding on port ${PORT}"
else
  log "WARN — could not reach port ${PORT}. Check:  pm2 logs ${APP_NAME}"
fi

cat <<'NEXT'

=============================================================================
  BUILDEX bootstrap complete.

  Next steps:

  1. Issue SSL certificate (one-time):

       sudo certbot --nginx -d buildex.mila-knight.com

  2. Verify in browser:

       https://buildex.mila-knight.com

  3. For future deploys, from your local machine:

       SSH_PASSWORD='...' node scripts/deploy.js

  Useful commands on server:

       pm2 status                     # all processes
       pm2 logs buildex --lines 100   # buildex logs only
       pm2 restart buildex            # restart only buildex
       nginx -t && systemctl reload nginx

=============================================================================
NEXT

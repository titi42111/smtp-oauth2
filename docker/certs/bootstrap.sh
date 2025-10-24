#!/bin/sh
set -eu
# BusyBox ash does not support pipefail, so ignore errors when enabling it.
set -o pipefail 2>/dev/null || true

CERT_PATH="${TLS_CERT_FILE:-/certs/server.crt}"
KEY_PATH="${TLS_KEY_FILE:-/certs/server.key}"
CA_PATH="${CA_BUNDLE:-/certs/ca.pem}"
SUBJECT="${TLS_SELF_SIGNED_SUBJECT:-/CN=smtp-oauth2.local}"
DAYS="${TLS_SELF_SIGNED_DAYS:-365}"

CERT_DIR=$(dirname "$CERT_PATH")
KEY_DIR=$(dirname "$KEY_PATH")
CA_DIR=$(dirname "$CA_PATH")

log() {
  printf '%s\n' "$1"
}

log "Installing openssl runtime..."
apk add --no-cache openssl >/dev/null

mkdir -p "$CERT_DIR" "$KEY_DIR" "$CA_DIR"

if [ ! -s "$CERT_PATH" ] || [ ! -s "$KEY_PATH" ]; then
  log "Generating self-signed certificate ($SUBJECT, $DAYS days)."
  openssl req -x509 -nodes -newkey rsa:4096 \
    -keyout "$KEY_PATH" \
    -out "$CERT_PATH" \
    -days "$DAYS" \
    -subj "$SUBJECT"
else
  log "Existing certificate material detected, skipping generation."
fi

if [ ! -s "$CA_PATH" ]; then
  log "Populating CA bundle at $CA_PATH."
  cp "$CERT_PATH" "$CA_PATH"
fi

log "Certificate bootstrap complete."

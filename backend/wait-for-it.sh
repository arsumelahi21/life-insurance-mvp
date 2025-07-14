#!/usr/bin/env bash
# Usage: ./wait-for-it.sh host:port -- command args
set -e
hostport="$1"
shift
host="${hostport%%:*}"
port="${hostport##*:}"
until nc -z "$host" "$port"; do
  echo "Waiting for $host:$port..."
  sleep 1
done
exec "$@"

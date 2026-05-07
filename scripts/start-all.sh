#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_DIR="$ROOT_DIR/.dev-run"
SERVER_DIR="$ROOT_DIR/server"
WEB_DIR="$ROOT_DIR/web"
ADMIN_DIR="$ROOT_DIR/admin-web"

SERVER_PID_FILE="$RUN_DIR/server.pid"
WEB_PID_FILE="$RUN_DIR/web.pid"
ADMIN_PID_FILE="$RUN_DIR/admin-web.pid"
DB_URL_FILE="$RUN_DIR/database.url"

mkdir -p "$RUN_DIR"

log() {
  printf '[start-all] %s\n' "$1"
}

is_pid_running() {
  local pid="$1"
  kill -0 "$pid" >/dev/null 2>&1
}

start_process() {
  local name="$1"
  local workdir="$2"
  local pid_file="$3"
  local log_file="$4"
  local check_url="$5"
  local port="$6"
  shift 6

  local health_code
  health_code="$(curl -s -o /dev/null -w '%{http_code}' "$check_url" || true)"
  if [[ "$health_code" == "200" ]]; then
    log "$name 已在运行 (url=$check_url)"
    return
  fi

  if [[ -f "$pid_file" ]]; then
    local existing_pid
    existing_pid="$(cat "$pid_file")"
    if [[ -n "$existing_pid" ]] && is_pid_running "$existing_pid"; then
      log "$name 已在运行 (pid=$existing_pid)"
      return
    fi
  fi

  if lsof -ti "tcp:$port" >/dev/null 2>&1; then
    log "$name 启动前检查失败：端口 $port 已被占用，但 $check_url 不可用"
    log "请先运行 scripts/stop-all.sh 或手动释放端口。"
    exit 1
  fi

  (cd "$workdir" && nohup "$@" >"$log_file" 2>&1 & echo $! >"$pid_file")
  sleep 1

  local new_pid
  new_pid="$(cat "$pid_file")"
  if [[ -z "$new_pid" ]] || ! is_pid_running "$new_pid"; then
    log "$name 启动失败，请检查日志: $log_file"
    exit 1
  fi

  log "$name 启动成功 (pid=$new_pid)"
}

log '准备 Prisma 开发数据库...'
PRISMA_DEV_OUTPUT="$(cd "$SERVER_DIR" && npx prisma dev -d -n company-website -P 5432 -p 51213 --shadow-db-port 5433 2>&1)"
PRISMA_DB_URL="$(printf '%s\n' "$PRISMA_DEV_OUTPUT" | grep -Eo 'postgres://[^[:space:]]+' | head -n 1 || true)"
if [[ -z "$PRISMA_DB_URL" ]]; then
  log "$PRISMA_DEV_OUTPUT"
  log '无法获取 Prisma 数据库连接串，启动中止。'
  exit 1
fi

if [[ "$PRISMA_DB_URL" == *"?"* ]]; then
  SERVER_DB_URL="${PRISMA_DB_URL}&pgbouncer=true"
else
  SERVER_DB_URL="${PRISMA_DB_URL}?pgbouncer=true"
fi

printf '%s\n' "$SERVER_DB_URL" > "$DB_URL_FILE"
log "数据库连接已就绪: $SERVER_DB_URL"

log '同步数据库结构...'
(cd "$SERVER_DIR" && DATABASE_URL="$SERVER_DB_URL" npx prisma db push >/dev/null)

log '构建 server...'
(cd "$SERVER_DIR" && npm run build >/dev/null)

start_process "server" "$SERVER_DIR" "$SERVER_PID_FILE" "$RUN_DIR/server.log" "http://localhost:3001/api/health" "3001" env DATABASE_URL="$SERVER_DB_URL" npm run start:prod
start_process "web" "$WEB_DIR" "$WEB_PID_FILE" "$RUN_DIR/web.log" "http://localhost:3000" "3000" npm run dev
start_process "admin-web" "$ADMIN_DIR" "$ADMIN_PID_FILE" "$RUN_DIR/admin-web.log" "http://localhost:5173" "5173" npm run dev -- --host 0.0.0.0

sleep 2

SERVER_HTTP="$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/api/health || true)"
WEB_HTTP="$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000 || true)"
ADMIN_HTTP="$(curl -s -o /dev/null -w '%{http_code}' http://localhost:5173 || true)"

log "server health: ${SERVER_HTTP} (http://localhost:3001/api/health)"
log "web: ${WEB_HTTP} (http://localhost:3000)"
log "admin-web: ${ADMIN_HTTP} (http://localhost:5173)"
log "日志目录: $RUN_DIR"

#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_DIR="$ROOT_DIR/.dev-run"

stop_by_pid_file() {
  local name="$1"
  local pid_file="$2"

  if [[ ! -f "$pid_file" ]]; then
    printf '[stop-all] %s 未发现 pid 文件\n' "$name"
    return
  fi

  local pid
  pid="$(cat "$pid_file")"

  if [[ -z "$pid" ]]; then
    printf '[stop-all] %s pid 文件为空\n' "$name"
    rm -f "$pid_file"
    return
  fi

  if kill -0 "$pid" >/dev/null 2>&1; then
    kill "$pid" >/dev/null 2>&1 || true
    sleep 1
    if kill -0 "$pid" >/dev/null 2>&1; then
      kill -9 "$pid" >/dev/null 2>&1 || true
    fi
    printf '[stop-all] %s 已停止 (pid=%s)\n' "$name" "$pid"
  else
    printf '[stop-all] %s 进程不存在 (pid=%s)\n' "$name" "$pid"
  fi

  rm -f "$pid_file"
}

stop_by_pid_file "server" "$RUN_DIR/server.pid"
stop_by_pid_file "web" "$RUN_DIR/web.pid"
stop_by_pid_file "admin-web" "$RUN_DIR/admin-web.pid"

for port in 3000 3001 5173; do
  pids="$(lsof -ti "tcp:$port" 2>/dev/null || true)"
  if [[ -n "$pids" ]]; then
    kill $pids >/dev/null 2>&1 || true
    printf '[stop-all] 已释放端口 %s\n' "$port"
  fi
done

pkill -f "/CompanyWebsite/server/node_modules/.bin/nest" >/dev/null 2>&1 || true
pkill -f "/CompanyWebsite/web/node_modules/.bin/next" >/dev/null 2>&1 || true
pkill -f "/CompanyWebsite/admin-web/node_modules/.bin/vite" >/dev/null 2>&1 || true

printf '[stop-all] 完成\n'

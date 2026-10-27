#!/bin/bash
# Uploads release builds (Release/<env>/<Name>, built by ./release.sh <env>) to a server over SFTP (SSH key)
# or FTP / FTPS. The releases are listed in releases.conf; add a line there to deploy another one.
#
#   ./release.sh production && ./ftp.sh production            # build, then upload every release
#   ./ftp.sh production --app Frontend                         # only the named release
#   ./ftp.sh production --dry-run                              # list what would be uploaded
#   ./ftp.sh production --app-offline                          # IIS: take the apps offline while files are replaced
#
# The server comes from .env.deploy.<env> in this folder (git-ignored; copy .env.deploy.example):
#   FTP_PROTOCOL           sftp | ftp (default: sftp when FTP_KEY is set, else ftp)
#   FTP_HOST, FTP_PORT, FTP_USER
#   FTP_<NAME>_DIR         server folder of each release, e.g. FTP_FRONTEND_DIR for Frontend
#   SFTP:  FTP_KEY (private key, e.g. ~/.ssh/iisdeploy_ed25519), FTP_KEY_FINGERPRINT (SHA256:… of that key),
#          FTP_HOST_FINGERPRINT (SHA256:… of the server's ed25519 host key; verified before connecting)
#   FTP:   FTP_PASSWORD, FTP_SECURE (explicit | implicit | none), FTP_PASSIVE (true | false), FTP_INSECURE_TLS
# It is a separate file from .env.<env> on purpose: that one is uploaded with the app, the server login must not be.
#
# Options:
#   --app <Name>|all       release to upload (repeatable; default all releases in releases.conf)
#   --all-files            upload every file; by default only files changed since the last upload to this server
#                          (tracked in Release/<env>/.ftp-uploaded-<app>-<host>.txt)
#   --skip-env             do not upload the .env.<env> file
#   --app-offline          upload app_offline.htm to each release folder first and remove it at the end (IIS)
#   --dry-run              show what would be uploaded; change nothing
#   --yes                  no confirmation prompt
#
# Everything is reported in the terminal only (no log file): each file's result, the error and its likely cause for
# anything that failed, and any unexpected stop. Passwords and keys are never printed.
set -Eeuo pipefail

cd "$(dirname "$0")"
ORIG_ARGS="$*"
log() { echo "$(date '+%H:%M:%S') $*"; }
die() { echo "$(date '+%H:%M:%S') ❌ $*" >&2; exit 1; }

ENV_NAME="production"
APPS=""
ALL_FILES=false
SKIP_ENV=false
APP_OFFLINE=false
DRY_RUN=false
ASSUME_YES=false
while [ $# -gt 0 ]; do
  case "$1" in
    --app) [ -n "${2:-}" ] || die "--app takes a release name from releases.conf or all."
           [ "$2" = "all" ] && APPS="" || APPS="${APPS:+$APPS }$2"; shift 2 ;;
    --all-files) ALL_FILES=true; shift ;;
    --skip-env) SKIP_ENV=true; shift ;;
    --app-offline) APP_OFFLINE=true; shift ;;
    --dry-run) DRY_RUN=true; shift ;;
    --yes|-y) ASSUME_YES=true; shift ;;
    -h|--help) sed -n '2,31p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    -*) die "Unknown option $1" ;;
    *) ENV_NAME="$1"; shift ;;
  esac
done
ENV_NAME="$(echo "${ENV_NAME:-production}" | tr '[:upper:]' '[:lower:]')"
[ "$ENV_NAME" = "prod" ] && ENV_NAME=production
[[ "$ENV_NAME" =~ ^[a-z0-9-]+$ ]] || die "Invalid environment '$ENV_NAME'."

# ---------- Releases (releases.conf: <Name> <project>) ----------
[ -f releases.conf ] || die "releases.conf not found."
KNOWN_APPS="$(awk '!/^[[:space:]]*(#|$)/ {print $1}' releases.conf | tr '\n' ' ' | sed 's/ $//')"
[ -n "$KNOWN_APPS" ] || die "releases.conf lists no releases."
[ -n "$APPS" ] || APPS="$KNOWN_APPS"
for APP in $APPS; do
  case " $KNOWN_APPS " in *" $APP "*) ;; *) die "Unknown release '$APP'. Known: $KNOWN_APPS" ;; esac
done
# FTP_<NAME>_DIR setting of a release, e.g. IdentityServer -> FTP_IDENTITYSERVER_DIR
dir_key() { echo "FTP_$(echo "$1" | tr '[:lower:]' '[:upper:]' | sed 's/[^A-Z0-9]/_/g')_DIR"; }

log "ftp.sh ${ORIG_ARGS} — $(date '+%Y-%m-%d'), by $(whoami) on $(hostname -s), commit $(git rev-parse --short HEAD 2>/dev/null || echo '?')"
trap 'echo "$(date "+%H:%M:%S") ❌ unexpected stop at line $LINENO: $BASH_COMMAND (exit $?)" >&2' ERR

ERR_OUT="$(mktemp -t deploy-err.XXXXXX)"
TMP_FILES=("$ERR_OUT")
cleanup() { rm -f "${TMP_FILES[@]}"; }
trap cleanup EXIT

# ---------- Server settings ----------
DEPLOY_FILE=".env.deploy.${ENV_NAME}"
[ -f "$DEPLOY_FILE" ] || die "$DEPLOY_FILE not found. Copy .env.deploy.example to $DEPLOY_FILE and fill in the server."
setting() {
  { grep -E "^[[:space:]]*(export[[:space:]]+)?$1[[:space:]]*=" "$DEPLOY_FILE" || true; } | tail -n1 \
    | sed -E 's/^[^=]*=[[:space:]]*//; s/[[:space:]]+$//; s/^"(.*)"$/\1/; s/^'"'"'(.*)'"'"'$/\1/'
}
FTP_HOST="$(setting FTP_HOST)"; FTP_USER="$(setting FTP_USER)"
app_dir() { local d; d="$(setting "$(dir_key "$1")")"; echo "${d%/}"; }
FTP_KEY="$(setting FTP_KEY)"; FTP_KEY="${FTP_KEY/#\~/$HOME}"
FTP_PROTOCOL="$(setting FTP_PROTOCOL | tr '[:upper:]' '[:lower:]')"
[ -n "$FTP_PROTOCOL" ] || { [ -n "$FTP_KEY" ] && FTP_PROTOCOL=sftp || FTP_PROTOCOL=ftp; }
FTP_PORT="$(setting FTP_PORT)"
[ -n "$FTP_HOST" ] && [ -n "$FTP_USER" ] || die "$DEPLOY_FILE needs FTP_HOST and FTP_USER."
if grep -q "CHANGE_ME" "$DEPLOY_FILE"; then die "$DEPLOY_FILE still has CHANGE_ME values."; fi

# ---------- What to upload ----------
RELEASE="Release/${ENV_NAME}"
PLAN="$(mktemp -t deploy-plan.XXXXXX)"; TMP_FILES+=("$PLAN")
for APP in $APPS; do
  LOCAL="$RELEASE/$APP"; REMOTE="$(app_dir "$APP")"
  [ -d "$LOCAL" ] || die "$LOCAL not found. Build it first: ./release.sh ${ENV_NAME}"
  [ -n "$REMOTE" ] || die "$DEPLOY_FILE needs $(dir_key "$APP")=<server folder> for release $APP."
  MANIFEST="$RELEASE/.ftp-uploaded-${APP}-${FTP_HOST}.txt"
  # web.config and index.html go last: index.html references the new hashed bundles, so it must not reach the
  # server before them (users loading the page mid-upload would get missing files)
  (cd "$LOCAL" && find . -type f ! -name '.DS_Store' | sed 's|^\./||' | sort \
    | awk '$0 == "web.config" {wc = 1; next} $0 == "index.html" {ix = 1; next} {print} END {if (wc) print "web.config"; if (ix) print "index.html"}') \
    | while IFS= read -r REL; do
    if $SKIP_ENV && [ "$REL" = ".env.${ENV_NAME}" ]; then continue; fi
    SUM="$(shasum -a 256 "$LOCAL/$REL" | awk '{print $1}')"
    if ! $ALL_FILES && [ -f "$MANIFEST" ] && grep -qxF "$SUM  $REL" "$MANIFEST"; then continue; fi
    printf '%s\t%s\t%s\t%s\t%s\n' "$APP" "$LOCAL" "${REMOTE%/}" "$REL" "$SUM"
  done >> "$PLAN"
done
TOTAL_FILES="$(wc -l < "$PLAN" | tr -d ' ')"
P_APP=(); P_LOCAL=(); P_REMOTE=(); P_REL=(); P_SUM=(); TOTAL_BYTES=0
while IFS=$'\t' read -r APP LOCAL REMOTE REL SUM; do
  P_APP+=("$APP"); P_LOCAL+=("$LOCAL"); P_REMOTE+=("$REMOTE"); P_REL+=("$REL"); P_SUM+=("$SUM")
  TOTAL_BYTES=$((TOTAL_BYTES + $(wc -c < "$LOCAL/$REL")))
done < "$PLAN"

# A file is on the server: remember it so the next run skips it while unchanged.
mark_uploaded() {
  local i="$1" manifest="$RELEASE/.ftp-uploaded-${P_APP[$1]}-${FTP_HOST}.txt"
  touch "$manifest"
  awk -v r="${P_REL[$i]}" 'substr($0, index($0, "  ") + 2) != r' "$manifest" > "$manifest.tmp"
  echo "${P_SUM[$i]}  ${P_REL[$i]}" >> "$manifest.tmp"; mv "$manifest.tmp" "$manifest"
}
size_kb() { echo $(( $(wc -c < "$1") / 1024 )); }

# ======================================================================================================================
# SFTP (SSH key)
# ======================================================================================================================
if [ "$FTP_PROTOCOL" = "sftp" ]; then
  FTP_PORT="${FTP_PORT:-22}"
  KEY_FP_EXPECTED="$(setting FTP_KEY_FINGERPRINT)"; HOST_FP_EXPECTED="$(setting FTP_HOST_FINGERPRINT)"
  command -v sftp >/dev/null 2>&1 || die "sftp not found (OpenSSH client)."
  [ -n "$FTP_KEY" ] || die "$DEPLOY_FILE needs FTP_KEY (the private key, e.g. ~/.ssh/iisdeploy_ed25519) for SFTP."
  SCHEME_LABEL="sftp://${FTP_USER}@${FTP_HOST}:${FTP_PORT}  (key $(basename "$FTP_KEY"))"

  # Why an sftp/ssh error happened, from its message.
  sftp_reason() {
    if grep -qiE "timed out|Operation timed out" "$1"; then echo "the server did not answer on port ${FTP_PORT}: a firewall, VPN or IP allow-list blocks this machine, or SSH is down"
    elif grep -qi "Connection refused" "$1"; then echo "nothing listens on port ${FTP_PORT} (SSH/SFTP service down or another port)"
    elif grep -qi "Could not resolve hostname" "$1"; then echo "host name not found (FTP_HOST)"
    elif grep -qi "Host key verification failed\|REMOTE HOST IDENTIFICATION HAS CHANGED" "$1"; then echo "the server's host key is not trusted or changed (check FTP_HOST_FINGERPRINT / ~/.ssh/known_hosts)"
    elif grep -qi "Permission denied (publickey" "$1"; then echo "the server refused the key (wrong key for ${FTP_USER}, or a passphrase-protected key not added to ssh-agent)"
    elif grep -qi "No such file\|not found" "$1"; then echo "remote folder or file not found (FTP_<NAME>_DIR)"
    elif grep -qi "Permission denied" "$1"; then echo "no write permission on the server folder"
    elif grep -qiE "Failure|being used by another process" "$1"; then echo "the server refused the file: usually locked by the running app (try --app-offline / stop the service) or disk full"
    elif grep -qi "Connection closed\|Broken pipe\|Connection reset" "$1"; then echo "the connection dropped"
    else echo "see the message below"; fi
  }
  show_error() {  # <what> <exit code>
    echo "$(date '+%H:%M:%S') ❌ $1: exit $2 — $(sftp_reason "$ERR_OUT")" >&2
    grep -v "Couldn't create directory" "$ERR_OUT" | sort -u | sed 's/^/      /' >&2 || true
  }
  q() { local s="${1//\\/\\\\}"; s="${s//\"/\\\"}"; printf '"%s"' "$s"; }   # quote a path for an sftp batch

  # --- Pre-flight: the key ---
  if [ ! -f "$FTP_KEY" ] && [ -f "$HOME/Downloads/$(basename "$FTP_KEY")" ]; then
    mkdir -p "$(dirname "$FTP_KEY")"; chmod 700 "$(dirname "$FTP_KEY")"
    cp "$HOME/Downloads/$(basename "$FTP_KEY")" "$FTP_KEY"
    log "Installed the key from ~/Downloads to ${FTP_KEY}"
  fi
  [ -f "$FTP_KEY" ] || die "SSH key ${FTP_KEY} not found (or put $(basename "$FTP_KEY") in ~/Downloads)."
  [ "$(stat -f '%Lp' "$FTP_KEY" 2>/dev/null || stat -c '%a' "$FTP_KEY")" = "600" ] || { chmod 600 "$FTP_KEY"; log "Set ${FTP_KEY} to 600 (ssh requires it)"; }
  KEY_FP="$(ssh-keygen -lf "$FTP_KEY" -E sha256 2>/dev/null | awk '{print $2}' || true)"
  if [ -z "$KEY_FP" ]; then
    TMP_PUB="$(mktemp -t deploy-pub.XXXXXX)"; TMP_FILES+=("$TMP_PUB")
    echo "Enter the key's passphrase if asked."
    ssh-keygen -y -f "$FTP_KEY" > "$TMP_PUB" || die "Cannot read the private key ${FTP_KEY}."
    KEY_FP="$(ssh-keygen -lf "$TMP_PUB" -E sha256 | awk '{print $2}')"
  fi
  if [ -n "$KEY_FP_EXPECTED" ] && [ "$KEY_FP" != "$KEY_FP_EXPECTED" ]; then
    die "Wrong SSH key: ${FTP_KEY} is ${KEY_FP}, expected ${KEY_FP_EXPECTED}."
  fi
fi

echo "🎯 Server:  $( [ "$FTP_PROTOCOL" = "sftp" ] && echo "$SCHEME_LABEL" || echo "${FTP_PROTOCOL}://${FTP_USER}@${FTP_HOST}" )"
for APP in $APPS; do
  echo "   ${APP} → $(app_dir "$APP")"
done
echo "📦 ${TOTAL_FILES} file(s), $((TOTAL_BYTES / 1048576)) MB $($ALL_FILES && echo '(all files)' || echo '(changed since the last upload)')"
if [ "$TOTAL_FILES" -eq 0 ]; then echo "✅ Nothing to upload; the server has this build (use --all-files to upload everything again)."; exit 0; fi
if $DRY_RUN; then cut -f1,4 "$PLAN" | sed 's/\t/  /' | sed 's/^/   /'; echo "🔎 Dry run: nothing uploaded."; exit 0; fi

if ! $ASSUME_YES; then
  read -r -p "Upload to ${FTP_HOST} ($ENV_NAME)? (yes/no): " CONFIRM
  [ "$CONFIRM" = "yes" ] || die "Cancelled."
fi

FAILED=0; FAILED_LIST=""; START=$(date +%s)
OFFLINE_FILE=""
OFFLINE_DIRS=()
if $APP_OFFLINE; then
  for APP in $APPS; do OFFLINE_DIRS+=("$(app_dir "$APP")"); done
  OFFLINE_FILE="$(mktemp -t app_offline.XXXXXX)"; TMP_FILES+=("$OFFLINE_FILE")
  echo '<!doctype html><title>Updating</title><p>The application is being updated. Please try again in a minute.</p>' > "$OFFLINE_FILE"
fi

if [ "$FTP_PROTOCOL" = "sftp" ]; then
  # --- Pre-flight: reach the server, verify who it is ---
  log "Checking ${FTP_HOST}:${FTP_PORT}…"
  nc -z -G 10 "$FTP_HOST" "$FTP_PORT" >/dev/null 2>&1 \
    || die "Cannot reach ${FTP_HOST} on port ${FTP_PORT}: a firewall, VPN or IP allow-list blocks this machine, or SSH is down."
  KNOWN_HOSTS="$HOME/.ssh/known_hosts"; touch "$KNOWN_HOSTS"; chmod 600 "$KNOWN_HOSTS"
  HOST_ENTRY="$FTP_HOST"; [ "$FTP_PORT" = "22" ] || HOST_ENTRY="[$FTP_HOST]:$FTP_PORT"
  if [ -n "$HOST_FP_EXPECTED" ]; then
    SCAN="$(mktemp -t deploy-hostkey.XXXXXX)"; TMP_FILES+=("$SCAN")
    ssh-keyscan -T 10 -p "$FTP_PORT" -t ed25519 "$FTP_HOST" 2>/dev/null > "$SCAN" || true
    [ -s "$SCAN" ] || die "Cannot read the server's host key from ${FTP_HOST}:${FTP_PORT}."
    HOST_FP="$(ssh-keygen -lf "$SCAN" -E sha256 | awk '{print $2}')"
    [ "$HOST_FP" = "$HOST_FP_EXPECTED" ] || die "Server identity mismatch: ${FTP_HOST} presents ${HOST_FP}, expected ${HOST_FP_EXPECTED}. Not connecting."
    if ! ssh-keygen -F "$HOST_ENTRY" -f "$KNOWN_HOSTS" >/dev/null 2>&1; then cat "$SCAN" >> "$KNOWN_HOSTS"; log "Added the verified host key to ~/.ssh/known_hosts"; fi
    log "Server identity verified (${HOST_FP})"
  else
    ssh-keygen -F "$HOST_ENTRY" -f "$KNOWN_HOSTS" >/dev/null 2>&1 \
      || die "${FTP_HOST} is not in ~/.ssh/known_hosts. Set FTP_HOST_FINGERPRINT in $DEPLOY_FILE so its host key can be verified."
  fi

  # A passphrase-protected key must be in ssh-agent (sftp runs in batch mode and cannot ask).
  if ! ssh-keygen -y -P "" -f "$FTP_KEY" >/dev/null 2>&1; then
    if ! ssh-add -l -E sha256 2>/dev/null | grep -qF "$KEY_FP"; then
      echo "The key has a passphrase; adding it to ssh-agent once (enter the passphrase):"
      ssh-add --apple-use-keychain "$FTP_KEY" 2>/dev/null || ssh-add "$FTP_KEY" || die "Could not add ${FTP_KEY} to ssh-agent."
    fi
  fi

  SFTP=(sftp -q -P "$FTP_PORT" -i "$FTP_KEY" -o IdentitiesOnly=yes -o PreferredAuthentications=publickey
        -o PasswordAuthentication=no -o StrictHostKeyChecking=yes -o BatchMode=yes -o ConnectTimeout=20
        -o ServerAliveInterval=15 -o ServerAliveCountMax=4)
  sftp_batch() { "${SFTP[@]}" -b "$1" "${FTP_USER}@${FTP_HOST}" 2> "$ERR_OUT"; }
  BATCH="$(mktemp -t deploy-batch.XXXXXX)"; TMP_FILES+=("$BATCH")
  # -mkdir for every folder from the root down to <dir> not created in this session yet (errors ignored).
  MADE="|"
  mkdirs() {
    local path="" part rest="${1#/}"
    while [ -n "$rest" ]; do
      part="${rest%%/*}"; [ "$part" = "$rest" ] && rest="" || rest="${rest#*/}"
      path="$path/$part"
      case "$MADE" in *"|$path|"*) ;; *) echo "-mkdir $(q "$path")"; MADE="$MADE$path|" ;; esac
    done
  }

  log "Logging in…"
  { echo "pwd"; } > "$BATCH"
  sftp_batch "$BATCH" > /dev/null || { code=$?; show_error "login" "$code"; die "Cannot log in to ${FTP_HOST}:${FTP_PORT} as ${FTP_USER}."; }

  if [ -n "$OFFLINE_FILE" ]; then
    echo "🚧 Taking ${APPS} offline (app_offline.htm)…"
    MADE="|"
    for DIR in "${OFFLINE_DIRS[@]}"; do mkdirs "$DIR"; echo "put $(q "$OFFLINE_FILE") $(q "$DIR/app_offline.htm")"; done > "$BATCH"
    sftp_batch "$BATCH" > /dev/null || { code=$?; show_error "upload app_offline.htm" "$code"; die "Could not upload app_offline.htm."; }
    log "Offline (app_offline.htm uploaded)"; sleep 3
  fi
  bring_online() {
    [ -n "$OFFLINE_FILE" ] || return 0
    echo "🟢 Bringing ${APPS} back (removing app_offline.htm)…"
    for DIR in "${OFFLINE_DIRS[@]}"; do echo "-rm $(q "$DIR/app_offline.htm")"; done > "$BATCH"
    if sftp_batch "$BATCH" > /dev/null; then log "Online (app_offline.htm removed)"
    else show_error "remove app_offline.htm" "$?"; echo "⚠️  Delete app_offline.htm in ${OFFLINE_DIRS[*]} on the server to bring the apps back." >&2; fi
    OFFLINE_FILE=""
  }
  trap 'bring_online; cleanup' EXIT

  # --- Upload: one session for the remaining files; a failure ends the session, is reported and retried, and the
  #     next session continues after it ---
  log "Uploading ${TOTAL_FILES} file(s), $((TOTAL_BYTES / 1048576)) MB"
  RETRIES=(); SESSION_FAILS=0; i=0
  COUNT="$(mktemp -t deploy-count.XXXXXX)"; STATUS_FILE="$(mktemp -t deploy-status.XXXXXX)"; TMP_FILES+=("$COUNT" "$STATUS_FILE")
  while [ "$i" -lt "$TOTAL_FILES" ]; do
    MADE="|"
    for ((j = i; j < TOTAL_FILES; j++)); do
      DEST="${P_REMOTE[$j]}/${P_REL[$j]}"
      mkdirs "${DEST%/*}"
      echo "put $(q "${P_LOCAL[$j]}/${P_REL[$j]}") $(q "$DEST")"
    done > "$BATCH"
    echo 0 > "$COUNT"
    # sftp echoes each command as it starts it: a new "put" means the one before it finished.
    { STATUS=0; sftp_batch "$BATCH" || STATUS=$?; echo "$STATUS" > "$STATUS_FILE"; } | {
      k=0
      while IFS= read -r line; do
        case "$line" in
          "sftp> put "*)
            if [ "$k" -gt 0 ]; then f=$((i + k - 1)); mark_uploaded "$f"
              log "[$((f + 1))/${TOTAL_FILES}] ✔ ${P_APP[$f]}/${P_REL[$f]} ($(size_kb "${P_LOCAL[$f]}/${P_REL[$f]}") KB)"; fi
            k=$((k + 1)); echo "$k" > "$COUNT" ;;
        esac
      done
    }
    STATUS="$(cat "$STATUS_FILE")"; K="$(cat "$COUNT")"
    if [ "$STATUS" -eq 0 ]; then
      if [ "$K" -gt 0 ]; then f=$((i + K - 1)); mark_uploaded "$f"
        log "[$((f + 1))/${TOTAL_FILES}] ✔ ${P_APP[$f]}/${P_REL[$f]} ($(size_kb "${P_LOCAL[$f]}/${P_REL[$f]}") KB)"; fi
      i="$TOTAL_FILES"; continue
    fi
    if [ "$K" -eq 0 ]; then   # the session itself failed (connection, login)
      SESSION_FAILS=$((SESSION_FAILS + 1))
      show_error "SFTP session" "$STATUS"
      [ "$SESSION_FAILS" -lt 3 ] || die "The SFTP session failed ${SESSION_FAILS} times. Run ./ftp.sh ${ENV_NAME} again to upload the rest (finished files are skipped)."
      log "Reconnecting (attempt $((SESSION_FAILS + 1)) of 3)…"; sleep $((SESSION_FAILS * 5)); continue
    fi
    f=$((i + K - 1)); RETRIES[$f]=$(( ${RETRIES[$f]:-0} + 1 ))
    show_error "[$((f + 1))/${TOTAL_FILES}] ${P_APP[$f]}/${P_REL[$f]} → ${P_REMOTE[$f]}/${P_REL[$f]}" "$STATUS"
    if [ "${RETRIES[$f]}" -lt 3 ]; then
      log "Retrying ${P_REL[$f]} (attempt $((RETRIES[$f] + 1)) of 3)…"; sleep 2; i="$f"
    else
      FAILED=$((FAILED + 1)); FAILED_LIST="${FAILED_LIST}    ${P_APP[$f]}/${P_REL[$f]}"$'\n'; i=$((f + 1))
    fi
  done
  bring_online

# ======================================================================================================================
# FTP / FTPS (curl)
# ======================================================================================================================
else
  [ "$FTP_PROTOCOL" = "ftp" ] || die "FTP_PROTOCOL must be sftp or ftp."
  command -v curl >/dev/null 2>&1 || die "curl not found."
  FTP_PASSWORD="$(setting FTP_PASSWORD)"
  FTP_SECURE="$(setting FTP_SECURE | tr '[:upper:]' '[:lower:]')"; FTP_SECURE="${FTP_SECURE:-explicit}"
  [ -n "$FTP_PORT" ] || { [ "$FTP_SECURE" = "implicit" ] && FTP_PORT=990 || FTP_PORT=21; }
  FTP_PASSIVE="$(setting FTP_PASSIVE | tr '[:upper:]' '[:lower:]')"; FTP_PASSIVE="${FTP_PASSIVE:-true}"
  FTP_INSECURE_TLS="$(setting FTP_INSECURE_TLS | tr '[:upper:]' '[:lower:]')"
  case "$FTP_SECURE" in
    explicit) SCHEME="ftp"; TLS_ARGS=(--ssl-reqd) ;;
    implicit) SCHEME="ftps"; TLS_ARGS=() ;;
    none) SCHEME="ftp"; TLS_ARGS=(); echo "⚠️  FTP_SECURE=none: the login and files travel unencrypted." ;;
    *) die "FTP_SECURE must be explicit, implicit or none." ;;
  esac
  [ "$FTP_INSECURE_TLS" = "true" ] && TLS_ARGS+=(--insecure)
  [ "$FTP_PASSIVE" = "false" ] && MODE_ARGS=(--ftp-port -) || MODE_ARGS=(--ftp-pasv)

  # The login goes through a private netrc file, never on a command line.
  NETRC="$(mktemp -t ftp-netrc.XXXXXX)"; chmod 600 "$NETRC"; TMP_FILES+=("$NETRC")
  esc() { printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'; }
  printf 'machine %s login "%s" password "%s"\n' "$FTP_HOST" "$(esc "$FTP_USER")" "$(esc "$FTP_PASSWORD")" > "$NETRC"
  CURL=(curl -sS --fail --retry 3 --retry-delay 2 --connect-timeout 20 --netrc-file "$NETRC" ${TLS_ARGS[@]+"${TLS_ARGS[@]}"} "${MODE_ARGS[@]}")
  urlpath() { printf '%s' "$1" | sed 's/%/%25/g; s/ /%20/g; s/#/%23/g; s/?/%3F/g'; }
  remote_url() { echo "${SCHEME}://${FTP_HOST}:${FTP_PORT}/$(urlpath "${1#/}")"; }

  # What a curl exit code most likely means for an FTP upload.
  curl_reason() {
    case "$1" in
      6) echo "host name not found (FTP_HOST)" ;;
      7) echo "could not connect: server down, wrong FTP_PORT or a firewall" ;;
      8|13) echo "unexpected server reply; passive mode may be blocked (try FTP_PASSIVE=false)" ;;
      9) echo "access to the remote folder denied (check the folder and the user's rights)" ;;
      25) echo "upload refused: no write permission, disk full, or the file is locked by the running app (try --app-offline / stop the service)" ;;
      28) echo "timed out (slow or unstable connection)" ;;
      30) echo "active mode failed (try FTP_PASSIVE=true)" ;;
      35) echo "TLS handshake failed (FTP_SECURE explicit vs implicit?)" ;;
      55|56) echo "connection dropped while sending" ;;
      60) echo "server certificate not trusted (FTP_INSECURE_TLS=true for a self-signed certificate)" ;;
      64) echo "the server does not support TLS (FTP_SECURE=none, or implicit on port 990)" ;;
      67) echo "login refused (FTP_USER / FTP_PASSWORD)" ;;
      78) echo "remote file or folder not found" ;;
      *) echo "curl error $1 (see 'man curl', EXIT CODES)" ;;
    esac
  }
  run_curl() {  # <what> <curl args…>: prints the cause and curl's message on failure
    local what="$1"; shift
    local code=0
    "${CURL[@]}" "$@" 2> "$ERR_OUT" || code=$?
    if [ "$code" -ne 0 ]; then
      local reason; reason="$(curl_reason "$code")"
      if [ "$code" -eq 28 ] && grep -q "Failed to connect" "$ERR_OUT"; then
        reason="the server did not answer on port ${FTP_PORT}: a firewall, VPN or IP allow-list blocks this machine, or the FTP service is down"
      fi
      echo "$(date '+%H:%M:%S') ❌ ${what}: curl exit ${code} — ${reason}" >&2
      sort -u "$ERR_OUT" | sed 's/^/      /' >&2
    fi
    return "$code"
  }

  log "Logging in to ${SCHEME}://${FTP_HOST}:${FTP_PORT}…"
  run_curl "login check" --list-only "$(remote_url "/")" > /dev/null || die "Cannot log in to ${FTP_HOST}:${FTP_PORT} as ${FTP_USER}."
  if [ -n "$OFFLINE_FILE" ]; then
    echo "🚧 Taking ${APPS} offline (app_offline.htm)…"
    for DIR in "${OFFLINE_DIRS[@]}"; do
      run_curl "upload app_offline.htm to $DIR" --ftp-create-dirs -T "$OFFLINE_FILE" "$(remote_url "$DIR/app_offline.htm")" || die "Could not upload app_offline.htm."
    done
    log "Offline (app_offline.htm uploaded)"; sleep 3
  fi
  bring_online() {
    [ -n "$OFFLINE_FILE" ] || return 0
    echo "🟢 Bringing ${APPS} back (removing app_offline.htm)…"
    for DIR in "${OFFLINE_DIRS[@]}"; do
      if run_curl "remove app_offline.htm from $DIR" -Q "DELE $DIR/app_offline.htm" --list-only "$(remote_url "$DIR/")" > /dev/null; then
        log "Online: $DIR (app_offline.htm removed)"
      else
        echo "⚠️  Could not remove app_offline.htm; delete it in $DIR on the server to bring the app back." >&2
      fi
    done
    OFFLINE_FILE=""
  }
  trap 'bring_online; cleanup' EXIT

  log "Uploading ${TOTAL_FILES} file(s), $((TOTAL_BYTES / 1048576)) MB"
  for ((f = 0; f < TOTAL_FILES; f++)); do
    T0=$(date +%s)
    if run_curl "[$((f + 1))/${TOTAL_FILES}] ${P_APP[$f]}/${P_REL[$f]} → ${P_REMOTE[$f]}/${P_REL[$f]}" --ftp-create-dirs \
         -T "${P_LOCAL[$f]}/${P_REL[$f]}" "$(remote_url "${P_REMOTE[$f]}/${P_REL[$f]}")" < /dev/null; then
      mark_uploaded "$f"
      log "[$((f + 1))/${TOTAL_FILES}] ✔ ${P_APP[$f]}/${P_REL[$f]} ($(size_kb "${P_LOCAL[$f]}/${P_REL[$f]}") KB, $(( $(date +%s) - T0 ))s)"
    else
      FAILED=$((FAILED + 1)); FAILED_LIST="${FAILED_LIST}    ${P_APP[$f]}/${P_REL[$f]}"$'\n'
    fi
  done
  bring_online
fi

SECS=$(( $(date +%s) - START ))
if [ "$FAILED" -gt 0 ]; then
  echo "$(date '+%H:%M:%S') Failed files:"$'\n'"${FAILED_LIST%$'\n'}" >&2
  die "${FAILED} of ${TOTAL_FILES} file(s) failed after retries. Run ./ftp.sh ${ENV_NAME} again to upload the rest (finished files are skipped)."
fi
echo "✅ Uploaded ${TOTAL_FILES} file(s) to ${FTP_HOST} in ${SECS}s. ${APPS} serves the new build right away (index.html is not cached)."

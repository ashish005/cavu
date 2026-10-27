#!/bin/bash
# Builds the Angular releases listed in releases.conf into Release/<env>/<Name>, ready for ./ftp.sh <env>.
#
#   ./release.sh production             # every release, Angular configuration "production"
#   ./release.sh production Frontend    # only the named release(s)
#
# <env> selects the Angular build configuration of the same name (angular.json); Angular bakes the
# environment into the bundle, so a build is per environment.
set -Eeuo pipefail

cd "$(dirname "$0")"
log() { echo "$(date '+%H:%M:%S') $*"; }
die() { echo "$(date '+%H:%M:%S') ❌ $*" >&2; exit 1; }
trap 'echo "$(date "+%H:%M:%S") ❌ unexpected stop at line $LINENO: $BASH_COMMAND (exit $?)" >&2' ERR

ENV_NAME="$(echo "${1:-production}" | tr '[:upper:]' '[:lower:]')"; shift || true
[ "$ENV_NAME" = "prod" ] && ENV_NAME=production
[[ "$ENV_NAME" =~ ^[a-z0-9-]+$ ]] || die "Invalid environment '$ENV_NAME'."

# ---------- Releases ----------
[ -f releases.conf ] || die "releases.conf not found."
NAMES=(); PROJECTS=()
while read -r NAME PROJECT _; do
  [ -z "${NAME:-}" ] || [[ "$NAME" == \#* ]] && continue
  NAMES+=("$NAME"); PROJECTS+=("$PROJECT")
done < releases.conf
[ "${#NAMES[@]}" -gt 0 ] || die "releases.conf lists no releases."
SELECTED=("$@")
for S in ${SELECTED[@]+"${SELECTED[@]}"}; do
  printf '%s\n' "${NAMES[@]}" | grep -qxF "$S" || die "Unknown release '$S'. Known: ${NAMES[*]}"
done

# project -> output folder and available configurations, from angular.json
ng_info() {  # <project> <field: output|configs>
  node -e '
    const a = require("./angular.json"); const p = a.projects[process.argv[1]];
    if (!p) process.exit(2);
    const b = p.architect.build;
    if (process.argv[2] === "configs") console.log(Object.keys(b.configurations || {}).join(" "));
    else { const o = b.options.outputPath; console.log(typeof o === "string" ? o : o.base); }
  ' "$1" "$2"
}

command -v node >/dev/null 2>&1 || die "node not found."
[ -d node_modules ] || { log "Installing dependencies (npm ci)…"; npm ci; }

COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo '?')"
DIRTY="$(git status --porcelain 2>/dev/null | grep -q . && echo ' (uncommitted changes)' || true)"
log "release.sh ${ENV_NAME} — commit ${COMMIT}${DIRTY}"

for i in "${!NAMES[@]}"; do
  NAME="${NAMES[$i]}"; PROJECT="${PROJECTS[$i]}"
  if [ "${#SELECTED[@]}" -gt 0 ] && ! printf '%s\n' "${SELECTED[@]}" | grep -qxF "$NAME"; then continue; fi
  OUTPUT="$(ng_info "$PROJECT" output)" || die "releases.conf: Angular project '$PROJECT' not found in angular.json."
  case " $(ng_info "$PROJECT" configs) " in *" $ENV_NAME "*) ;; *) die "angular.json has no '$ENV_NAME' build configuration for $PROJECT." ;; esac

  log "📦 ${NAME}: ng build ${PROJECT} -c ${ENV_NAME}"
  rm -rf "$OUTPUT"
  npx ng build "$PROJECT" -c "$ENV_NAME"
  # @angular/build:application writes the site to <outputPath>/browser
  SITE="$OUTPUT/browser"; [ -d "$SITE" ] || SITE="$OUTPUT"
  [ -f "$SITE/index.html" ] || die "Build produced no index.html in $SITE."

  OUT="Release/${ENV_NAME}/${NAME}"
  rm -rf "$OUT"; mkdir -p "$OUT"
  cp -R "$SITE"/. "$OUT"/
  [ -f "$OUT/web.config" ] || log "⚠️  ${NAME}: no web.config in the build (IIS deep links will 404)"
  printf 'release=%s\nenvironment=%s\ncommit=%s%s\nbuilt=%s\n' "$NAME" "$ENV_NAME" "$COMMIT" "$DIRTY" "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" > "$OUT/release-info.txt"
  log "✅ ${NAME}: $(find "$OUT" -type f | wc -l | tr -d ' ') files, $(du -sh "$OUT" | cut -f1)"
done
log "Upload with: ./ftp.sh ${ENV_NAME}"

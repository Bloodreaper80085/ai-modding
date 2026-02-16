#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "==> Building web assets"
npm run build

if ! npx --yes @capacitor/cli --version >/dev/null 2>&1; then
  cat <<'MSG'

Capacitor CLI is not available in this environment.
To generate an APK locally, install:
  npm install @capacitor/core @capacitor/cli @capacitor/android --save-dev
Then run:
  npx cap add android
  npx cap sync android
  cd android && ./gradlew assembleDebug

Your APK will be created at:
  android/app/build/outputs/apk/debug/app-debug.apk
MSG
  exit 1
fi

echo "==> Syncing Android project"
npx cap sync android

echo "==> Building APK"
(cd android && ./gradlew assembleDebug)

echo "==> Done"
echo "APK path: android/app/build/outputs/apk/debug/app-debug.apk"

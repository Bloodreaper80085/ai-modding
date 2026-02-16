# ai-modding

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/Bloodreaper80085/ai-modding)

## Building an APK (Android)

This project is a Vite + React app. To package it as an Android APK, use Capacitor.

1. Install Android prerequisites:
   - Android Studio + Android SDK
   - Java (JDK 17+)

2. Install Capacitor dependencies:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android --save-dev
```

3. Initialize/add Android platform (first time only):

```bash
npx cap add android
```

4. Build APK:

```bash
./build-apk.sh
```

The generated debug APK will be at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

If you need a release-signed APK for publishing, open the Android project in Android Studio and configure signing in `Build > Generate Signed Bundle / APK`.

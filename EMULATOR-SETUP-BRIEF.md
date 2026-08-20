# Brief: Run crossword-helper on the Pixel_8_API_34 emulator

Context for picking this up in Claude Code — written after getting the emulator working via Cowork (which can't drive a terminal directly, so this is a relay handoff).

## Goal
Build and launch the Capacitor Android app from this repo onto the `Pixel_8_API_34` AVD.

## Environment (already confirmed working)
- Machine: Windows 11 Home, no Hyper-V — uses WHPX/HypervisorPlatform instead (already enabled).
- SDK root: `C:\Android\Sdk` (matches `ANDROID_HOME` / `ANDROID_SDK_ROOT`, already set system-wide).
- Emulator binary: `C:\Android\Sdk\emulator\emulator.exe`
- adb: `C:\Android\Sdk\platform-tools\adb.exe`
- AVD `Pixel_8_API_34` exists and boots successfully (headless smoke test passed, cold boot ~53s).
- Bundled JDK (from Android Studio): `C:\Program Files\Android\Android Studio\jbr`

## Repo state (already done, don't redo)
- `node_modules/` installed.
- Capacitor Android platform already added: `android/app/build.gradle`, `android/gradlew.bat`, etc. all present.
- `www/` web assets are static files (no bundler, no build step — `www/app.js` is checked in directly).
- `capacitor.config.json` present at repo root and already synced into `android/app/src/main/assets/`.

## Known gaps to check/fix
1. **`android/local.properties` does not exist.** This normally holds `sdk.dir=C:\\Android\\Sdk`. Gradle may fall back to `ANDROID_HOME`, but if the build can't find the SDK, create this file first.
2. **`JAVA_HOME` may not be set in Claude Code's shell.** The setup script only set it inside its own one-off PowerShell session. Point it at `C:\Program Files\Android\Android Studio\jbr` (or any JDK 17+) before running Gradle, or `gradlew.bat` will fail with a Java-not-found error.

## Steps
1. Start the emulator and leave it running (separate terminal/process):
   ```
   & "C:\Android\Sdk\emulator\emulator.exe" -avd Pixel_8_API_34
   ```
   (drop `-no-window -no-audio -no-boot-anim` if you want to see it; keep them if headless is fine.)
2. Confirm it's visible to adb: `adb devices` should list an `emulator-####` entry as `device` (not `offline`).
3. From the repo root: `npx cap sync android` (picks up any web asset changes into the native project).
4. Build and install: either `npx cap run android` (interactive target picker) or directly `cd android && .\gradlew.bat installDebug`, then launch with `adb shell am start -n com.emil3663.crosswordhelper/.MainActivity` (check the actual launch activity name in `android/app/src/main/AndroidManifest.xml` if that fails).
5. Watch for Gradle/Java errors first — see "Known gaps" above before debugging further.

## Not yet done
No app build/install/launch has been attempted yet — this brief exists purely to save re-discovery time. Everything past step 1 above is untested.

# PROJECT ASCEND — MOBILE APPLICATION BUILD & DEPLOYMENT GUIDE

Comprehensive guide for building, testing, and releasing production-ready **Android** and **iOS** applications for Project Ascend using Windows and macOS environments.

---

## 1. REQUIRED SOFTWARE & TOOLCHAINS

### Windows Development Environment (Android Builds)
1. **Operating System**: Windows 10/11 (64-bit)
2. **Node.js**: v20+ or v24+ LTS
3. **Java Development Kit**: **OpenJDK 21 LTS** (Required by Capacitor 8 & Android Gradle Plugin 8.14)
   - Installed location on this machine: `C:\Users\ADMIN\AppData\Local\Programs\jdk-21\jdk-21.0.13+9`
4. **Android SDK**:
   - Installed location: `C:\Users\ADMIN\AppData\Local\Android\Sdk`
   - Platform: `android-36` (Android 16 API level 36)
   - Build-Tools: `35.0.0` / `36.0.0`
   - Platform-Tools: `adb.exe`, `fastboot.exe`
5. **Git**: Installed (MinGit / Git for Windows)

### macOS Environment (iOS Builds)
1. **macOS**: Sonoma (14.x) or Sequoia (15.x)
2. **Xcode**: Xcode 15 or 16
3. **CocoaPods / Swift Package Manager**: Pre-configured with Capacitor SPM (`CapApp-SPM`)

---

## 2. ENVIRONMENT CONFIGURATION (WINDOWS)

Add the following environment variables to your user profile:

```powershell
# Set JAVA_HOME and ANDROID_HOME
$env:JAVA_HOME = "C:\Users\ADMIN\AppData\Local\Programs\jdk-21\jdk-21.0.13+9"
$env:ANDROID_HOME = "C:\Users\ADMIN\AppData\Local\Android\Sdk"

# Add tools to PATH
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:Path"
```

To persist permanently in Windows:
```powershell
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Users\ADMIN\AppData\Local\Programs\jdk-21\jdk-21.0.13+9", "User")
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\ADMIN\AppData\Local\Android\Sdk", "User")
```

---

## 3. PROJECT SYNCHRONIZATION COMMANDS

Whenever web components, styles, or logic are modified in `src/`:

```bash
# 1. Build production web bundle
npm run build

# 2. Synchronize web assets to native Android and iOS folders
npx cap sync

# Or use the combined shortcut:
npm run build:mobile
```

---

## 4. ANDROID BUILD COMMANDS

### A. Development / Debug APK (Testing on Devices & Emulators)
```bash
# Navigate to Android directory
cd android

# Compile Debug APK
gradlew.bat assembleDebug
```
- **Generated Output File**:
  `android/app/build/outputs/apk/debug/app-debug.apk` (~6.17 MB)

### B. Production Release AAB (Google Play Store Submission)
```bash
cd android

# Compile Production App Bundle
gradlew.bat bundleRelease
```
- **Generated Output File**:
  `android/app/build/outputs/bundle/release/app-release.aab` (~4.57 MB)

---

## 5. EMULATOR & PHYSICAL DEVICE TESTING

### Testing on a Physical Android Phone via USB
1. Enable **Developer Options** on your Android device:
   - Go to `Settings` -> `About phone` -> Tap `Build number` 7 times.
2. Enable **USB Debugging** under `Developer Options`.
3. Connect phone via USB cable and run:
   ```bash
   adb devices
   ```
4. Install the debug APK directly:
   ```bash
   adb install -r android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Testing on Android Emulator
```bash
# List available emulators
C:\Users\ADMIN\AppData\Local\Android\Sdk\emulator\emulator.exe -list-avds

# Launch emulator
C:\Users\ADMIN\AppData\Local\Android\Sdk\emulator\emulator.exe -avd <emulator_name>

# Install APK to active emulator
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 6. RELEASE SIGNING CONFIGURATION

Google Play requires signed AABs for store publication.

### Step 1: Generate a Keystore (Run Once)
```bash
keytool -genkeypair -v -keystore project-ascend-release.jks -alias ascend-key -keyalg RSA -keysize 2048 -validity 10000
```

### Step 2: Configure Environment Variables
Set the keystore variables before running `gradlew.bat bundleRelease`:
```powershell
$env:KEYSTORE_PATH = "C:\path\to\project-ascend-release.jks"
$env:KEYSTORE_PASSWORD = "your-keystore-password"
$env:KEY_ALIAS = "ascend-key"
$env:KEY_PASSWORD = "your-key-password"
```

*Security Warning: Never commit `.jks` keystores, private keys, or passwords to git.*

---

## 7. iOS BUILD INSTRUCTIONS (macOS)

Because iOS compilation requires Apple's proprietary build tools (Clang & Xcode), iOS builds must run on a macOS machine or macOS CI runner (e.g. GitHub Actions).

### Steps on macOS:
1. Clone the repository:
   ```bash
   git clone https://github.com/Eswar-SaiTeja/Arise.git
   cd Arise
   npm install
   npm run build:ios
   ```
2. Open in Xcode:
   ```bash
   npx cap open ios
   ```
3. In Xcode:
   - Select the **App** scheme and target **Any iOS Device (arm64)**.
   - Go to **Signing & Capabilities** and choose your Apple Developer Team.
   - Click **Product -> Archive**.
   - In the Xcode Organizer, select **Distribute App** -> **TestFlight & App Store**.

---

## 8. COMMON BUILD ERRORS & FIXES

### 1. `Cannot find a Java installation matching languageVersion=21`
- **Cause**: Capacitor 8 and Android Gradle Plugin 8.14 require Java 21 LTS.
- **Fix**: Set `$env:JAVA_HOME = "C:\Users\ADMIN\AppData\Local\Programs\jdk-21\jdk-21.0.13+9"`.

### 2. `Installed Build Tools revision 36.0.0 is corrupted or missing`
- **Fix**: Open Android Studio SDK Manager or use build-tools `35.0.0` configured in `android/variables.gradle`.

### 3. `Downloading from services.gradle.org failed: timeout`
- **Fix**: Increase timeout in `android/gradle/wrapper/gradle-wrapper.properties` to `networkTimeout=120000` or use `gradle-8.14.3-bin.zip`.

---

## 9. GITHUB INTEGRATION & WORKFLOWS

- Repository: `https://github.com/Eswar-SaiTeja/Arise`
- Main Branch: `main`
- All native Android Studio and Xcode wrapper files are tracked.
- Build outputs (`build/`, `.apk`, `.aab`, `node_modules`, `.gradle`) are excluded via `.gitignore`.
- Cloud automated builds are pre-configured in `mobile-ci/mobile-build.yml`.

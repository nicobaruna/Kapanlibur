const fs = require('fs');
const path = require('path');

// Helper to replace content with regex
function replaceInFile(filePath, regex, replacement) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const newContent = content.replace(regex, replacement);
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log(`Patched ${filePath}`);
            return true;
        }
    }
    return false;
}

// 1. Fix root build.gradle
const rootBuildGradlePath = path.join(__dirname, 'android', 'build.gradle');
replaceInFile(rootBuildGradlePath, /\s*kotlinVersion = findProperty\('android.kotlinVersion'\) \?\: '1\.8\.10'/, '\n        kotlinVersion = "1.8.10"');
replaceInFile(rootBuildGradlePath, /classpath\('com\.android\.tools\.build\:gradle'\)/, 'classpath("com.android.tools.build:gradle:8.1.1")\n        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")');

// 2. Fix expo-modules-core publishing bug
const expoPluginPath = path.join(__dirname, 'node_modules', 'expo-modules-core', 'android', 'ExpoModulesCorePlugin.gradle');
const publishingTarget = /release\(MavenPublication\) \{\s+from components\.release\s+\}/g;
const publishingReplacement = `release(MavenPublication) {
          def releaseComponent = components.findByName("release")
          if (releaseComponent != null) {
              from releaseComponent
          }
        }`;
replaceInFile(expoPluginPath, publishingTarget, publishingReplacement);

// 3. Ensure namespace in app/build.gradle
const appBuildGradlePath = path.join(__dirname, 'android', 'app', 'build.gradle');
if (fs.existsSync(appBuildGradlePath)) {
    let content = fs.readFileSync(appBuildGradlePath, 'utf8');
    if (!content.includes('namespace')) {
        replaceInFile(appBuildGradlePath, /android \{/, 'android {\n    namespace "com.nicobaruna.liburindonesia"');
    }
}

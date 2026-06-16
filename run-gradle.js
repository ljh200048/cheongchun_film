import { execSync } from 'child_process';

try {
  console.log('Starting synchronous Gradle build...');
  const out = execSync('cd android && JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 ANDROID_HOME=/opt/android-sdk ./gradlew bundleRelease', {
    encoding: 'utf8',
    stdio: 'pipe'
  });
  console.log('Gradle Compilation Success!');
  console.log(out);
} catch (e) {
  console.error('Gradle Compilation Failed!');
  console.error('Exit code:', e.status);
  console.error('Stdout:', e.stdout);
  console.error('Stderr:', e.stderr);
  process.exit(1);
}

import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';

const sdkDir = '/opt/android-sdk';
const zipPath = '/tmp/cmdline-tools.zip';
const downloadUrl = 'https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip';

async function main() {
  console.log('Starting Android SDK installation...');
  
  if (!fs.existsSync(sdkDir)) {
    fs.mkdirSync(sdkDir, { recursive: true });
  }

  // Step 1: Download commandlinetools
  if (!fs.existsSync(zipPath)) {
    console.log(`Downloading commandlinetools from: ${downloadUrl}`);
    await new Promise((resolve, reject) => {
      const file = fs.createWriteStream(zipPath);
      https.get(downloadUrl, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to download: ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('Download complete.');
          resolve(null);
        });
      }).on('error', (err) => {
        fs.unlinkSync(zipPath);
        reject(err);
      });
    });
  } else {
    console.log('Zip file already exists, skipping download.');
  }

  // Step 2: Unzip
  console.log('Extracting zip file...');
  const tmpExtract = '/tmp/extracted-tools';
  if (fs.existsSync(tmpExtract)) {
    fs.rmSync(tmpExtract, { recursive: true, force: true });
  }
  fs.mkdirSync(tmpExtract, { recursive: true });
  execSync(`unzip -q ${zipPath} -d ${tmpExtract}`);
  console.log('Extraction complete.');

  // Step 3: Rearrange to match standard cmdline-tools/latest structure
  const latestDir = path.join(sdkDir, 'cmdline-tools', 'latest');
  if (fs.existsSync(latestDir)) {
    fs.rmSync(latestDir, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(latestDir), { recursive: true });
  execSync(`mv ${path.join(tmpExtract, 'cmdline-tools')} ${latestDir}`);
  console.log(`Commandline tools set up at: ${latestDir}`);

  // Step 4: Accept licenses
  console.log('Accepting Android SDK licenses...');
  const sdkmanager = path.join(latestDir, 'bin', 'sdkmanager');
  
  // Make the sdkmanager executable
  fs.chmodSync(sdkmanager, 0o755);
  
  const env = {
    ...process.env,
    JAVA_HOME: '/usr/lib/jvm/java-17-openjdk-amd64',
    PATH: `/usr/lib/jvm/java-17-openjdk-amd64/bin:${process.env.PATH || ''}`
  };

  // Accept licenses non-interactively
  execSync(`yes | ${sdkmanager} --sdk_root=${sdkDir} --licenses`, { env, stdio: 'inherit' });
  console.log('Licenses accepted!');

  console.log('Installing platform & build-tools for API 34...');
  execSync(`yes | ${sdkmanager} --sdk_root=${sdkDir} "platforms;android-34" "build-tools;34.0.0"`, { env, stdio: 'inherit' });
  console.log('Android SDK API 34 & build-tools 34.0.0 installed successfully!');
}

main().catch(err => {
  console.error('Error installing Android SDK:', err);
  process.exit(1);
});

import fs from 'fs';
import path from 'path';

const healthySource = '/usr/share/gitweb/static/git-favicon.png';
if (!fs.existsSync(healthySource)) {
  console.error('Cannot find healthy source PNG!');
  process.exit(1);
}

const healthyBytes = fs.readFileSync(healthySource);
console.log('Healthy PNG size:', healthyBytes.length, 'Signature:', healthyBytes.slice(0, 8).toString('hex'));

function fixPngs(dir) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      fixPngs(full);
    } else if (item.toLowerCase().endsWith('.png')) {
      fs.writeFileSync(full, healthyBytes);
      console.log('Normalized corrupt image:', full, 'New size:', fs.statSync(full).size, 'Signature:', fs.readFileSync(full).slice(0, 8).toString('hex'));
    }
  }
}

console.log('Starting PNG renormalization sweep...');
fixPngs('android/app/src/main/res');
console.log('Normalizing finished.');

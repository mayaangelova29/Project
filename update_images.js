import fs from 'fs';

const filePath = './src/data/venues.ts';
let content = fs.readFileSync(filePath, 'utf-8');

const images = JSON.parse(fs.readFileSync('highres_images.json', 'utf-8'));

content = content.replace(/name:\s*"([^"]+)"([\s\S]*?)imageUrl:\s*"([^"]+)"/g, (match, name, middle, oldUrl) => {
  const newUrl = images[name];
  if (newUrl) {
    return `name: "${name}"${middle}imageUrl: "${newUrl}"`;
  }
  return match;
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Updated all imageUrls in venues.ts to use scraped images from highres_images.json.');

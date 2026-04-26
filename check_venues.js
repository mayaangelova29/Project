import { search } from 'duck-duck-scrape';
import fs from 'fs';

async function checkVenues() {
  const fileContent = fs.readFileSync('./src/data/venues.ts', 'utf-8');
  const names = [...fileContent.matchAll(/name:\s*"([^"]+)"/g)].map(m => m[1]);
  
  const results = {};
  for (const name of names) {
    try {
      const searchRes = await search(`${name} Sofia`, { safeSearch: 'off' });
      const topResults = searchRes.results.slice(0, 3).map(r => r.title.toLowerCase());
      const hasMatch = topResults.some(title => {
        const parts = name.toLowerCase().split(' ');
        return parts.filter(p => p.length > 3).some(p => title.includes(p));
      });
      
      results[name] = hasMatch;
      console.log(`${name}: ${hasMatch ? 'LIKELY REAL' : 'POTENTIALLY FAKE'}`);
    } catch (e) {
      console.log(`Error checking ${name}`);
    }
  }
  fs.writeFileSync('venue_check.json', JSON.stringify(results, null, 2));
}

checkVenues();

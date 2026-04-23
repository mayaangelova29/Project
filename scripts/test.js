import https from 'https';

const query = encodeURIComponent('Next Level NDK Sofia interior');
const url = `https://images.search.yahoo.com/search/images?p=${query}`;

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // Yahoo images are usually embedded as data-src or in img tags
        const matches = [...data.matchAll(/img[^>]+src=["']([^"']+)["']/gi)];
        if(matches.length > 0) {
            console.log("Found matches!");
            console.log(matches.slice(0, 5).map(m => m[1]));
        } else {
            console.log("No images found.");
        }
    });
});

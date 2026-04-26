import fs from 'fs';

const filePath = './src/data/venues.ts';
let content = fs.readFileSync(filePath, 'utf-8');

const fixMap = {
  "Bulgarian Top Team MMA": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
  "FAST Academy": "https://images.unsplash.com/photo-1599058945522-28d584b6f4ff?auto=format&fit=crop&w=800&q=80",
  "Steel Style Boxing Gym": "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=800&q=80",
  "Latin Force Dance Studio": "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?auto=format&fit=crop&w=800&q=80",
  "Spartak Swimming Complex": "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
  "Ritmo Dance Studio": "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80",
  "Paletro Dance Spot": "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=800&q=80",
  "Dance Academy Sofia": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
  "MG Tennis Club": "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80",
  "Dianabad Swimming Pool": "https://images.unsplash.com/photo-1600965962361-9035dbfd1c50?auto=format&fit=crop&w=800&q=80",
  "Twisted Jiu Jitsu": "https://images.unsplash.com/photo-1564415315949-27aa28659837?auto=format&fit=crop&w=800&q=80",
  "Fight Club Bulgaria": "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80",
  "Yoga Studio 108": "https://images.unsplash.com/photo-1599901860904-17e08c2d0cb4?auto=format&fit=crop&w=800&q=80",
  "CrossFit Vitosha": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
};

content = content.replace(/name:\s*"([^"]+)"([\s\S]*?)imageUrl:\s*"([^"]+)"/g, (match, name, middle, oldUrl) => {
  if (fixMap[name]) {
    return `name: "${name}"${middle}imageUrl: "${fixMap[name]}"`;
  }
  return match;
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed broken and mismatched URLs');

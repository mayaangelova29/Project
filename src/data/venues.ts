export interface Venue {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  keywords: string[];
  rating: number;
  reviewCount: number;
  acceptsMultisport: boolean;
  freeSession: boolean;
  imageUrl: string;
  description: string;
}

// Sofia center approx: 42.6977° N, 23.3219° E
// We generate a robust list around Sofia.
export const venues: Venue[] = [
  {
    id: "v1",
    name: "Spartak Wrestling Club",
    lat: 42.6780, lng: 23.3200,
    address: "bul. Arsenalski 4, Sofia",
    keywords: ["intense", "strict", "sparring", "pro-level"],
    rating: 4.8, reviewCount: 124,
    acceptsMultisport: false, freeSession: true,
    imageUrl: "https://images.unsplash.com/photo-1599552683573-9dc48255fe85?w=500&q=80",
    description: "High-intensity wrestling and grappling club with strict discipline."
  },
  {
    id: "v2",
    name: "Pulse Fitness & Spa",
    lat: 42.6540, lng: 23.2980,
    address: "Bulgaria Blvd 132, Sofia",
    keywords: ["clean", "relaxed", "cardio", "community-focused"],
    rating: 4.6, reviewCount: 2045,
    acceptsMultisport: true, freeSession: false,
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80",
    description: "Premium fitness center with huge cardio areas and relaxed spa."
  },
  {
    id: "v3",
    name: "Bulgarian Top Team MMA",
    lat: 42.6850, lng: 23.3100,
    address: "Cherni Vrah Blvd 47, Sofia",
    keywords: ["intense", "fast-paced", "sparring", "community-focused"],
    rating: 4.9, reviewCount: 312,
    acceptsMultisport: true, freeSession: true,
    imageUrl: "https://images.unsplash.com/photo-1599552599723-f3630fbc8c56?w=500&q=80",
    description: "The home of Bulgarian MMA. Fast-paced, supportive, intense."
  },
  {
    id: "v4",
    name: "Next Level Fitness - Serdika",
    lat: 42.6920, lng: 23.3550,
    address: "Sitnyakovo Blvd 48, Sofia",
    keywords: ["clean", "beginner-friendly", "cardio", "friendly"],
    rating: 4.7, reviewCount: 890,
    acceptsMultisport: true, freeSession: false,
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80",
    description: "Modern gym within the mall, great for beginners and cardio enthusiasts."
  },
  {
    id: "v5",
    name: "Yoga Vibe South",
    lat: 42.6650, lng: 23.3000,
    address: "Gotse Delchev Blvd, Sofia",
    keywords: ["relaxed", "friendly", "technique-focused", "clean"],
    rating: 4.9, reviewCount: 450,
    acceptsMultisport: true, freeSession: true,
    imageUrl: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500&q=80",
    description: "Peaceful environment focusing on mind-body connection and technique."
  },
  {
    id: "v6",
    name: "Fight Club Sofia",
    lat: 42.7000, lng: 23.3250,
    address: "Alabin St 50, Sofia",
    keywords: ["intense", "strict", "sparring", "fast-paced"],
    rating: 4.5, reviewCount: 178,
    acceptsMultisport: false, freeSession: false,
    imageUrl: "https://images.unsplash.com/photo-1549719386-74fc44bc0a6e?w=500&q=80",
    description: "Old-school boxing gym. Very strict, high-intensity workouts."
  },
  {
    id: "v7",
    name: "Walltopia Climbing Center",
    lat: 42.6450, lng: 23.3750,
    address: "Tsarigradsko Shose 111, Sofia",
    keywords: ["community-focused", "friendly", "technique-focused", "intense"],
    rating: 4.8, reviewCount: 1102,
    acceptsMultisport: true, freeSession: false,
    imageUrl: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=500&q=80",
    description: "Huge indoor climbing walls for all levels, strong community."
  },
  {
    id: "v8",
    name: "Zumba with Maria",
    lat: 42.7100, lng: 23.3100,
    address: "Slivnitsa Blvd 200, Sofia",
    keywords: ["fast-paced", "friendly", "beginner-friendly", "cardio"],
    rating: 5.0, reviewCount: 88,
    acceptsMultisport: true, freeSession: true,
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80",
    description: "High-energy, fun zumba dance classes for everyone."
  },
  {
    id: "v9",
    name: "CrossFit Vitosha",
    lat: 42.6350, lng: 23.3150,
    address: "Okolovrasten pat, Sofia",
    keywords: ["intense", "community-focused", "pro-level", "fast-paced"],
    rating: 4.8, reviewCount: 355,
    acceptsMultisport: true, freeSession: true,
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80",
    description: "Real CrossFit affiliate with a super supportive community and tough WODs."
  },
  {
    id: "v10",
    name: "Titan Fitness Center",
    lat: 42.6900, lng: 23.3300,
    address: "Vasil Levski Blvd, Sofia",
    keywords: ["strict", "clean", "technique-focused", "pro-level"],
    rating: 4.4, reviewCount: 210,
    acceptsMultisport: false, freeSession: false,
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&q=80",
    description: "No-nonsense iron-pumping gym. Heavy weights, serious lifters."
  },
  {
    id: "v11",
    name: "Capoeira Sofia",
    lat: 42.6800, lng: 23.3400,
    address: "Borisova Gradina, Sofia",
    keywords: ["community-focused", "fast-paced", "relaxed", "beginner-friendly"],
    rating: 4.9, reviewCount: 156,
    acceptsMultisport: true, freeSession: true,
    imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&q=80",
    description: "Flow, rhythm, and martial arts combined in a friendly group."
  },
  {
    id: "v12",
    name: "Sofia Gymnastics Hall",
    lat: 42.7050, lng: 23.3550,
    address: "Vladimir Vazov Blvd, Sofia",
    keywords: ["strict", "technique-focused", "pro-level", "clean"],
    rating: 4.6, reviewCount: 89,
    acceptsMultisport: false, freeSession: false,
    imageUrl: "https://images.unsplash.com/photo-1592656094267-764a45160876?w=500&q=80",
    description: "Professional gymnastics equipment and disciplined coaches."
  },
  {
    id: "v13",
    name: "AquaCenter Dianabad",
    lat: 42.6650, lng: 23.3450,
    address: "Nikola Gabrovski, Sofia",
    keywords: ["relaxed", "cardio", "beginner-friendly", "clean"],
    rating: 4.3, reviewCount: 650,
    acceptsMultisport: true, freeSession: false,
    imageUrl: "https://images.unsplash.com/photo-1600965962361-9035dbfd1c50?w=500&q=80",
    description: "Large swimming complex for swimming laps or relaxing."
  },
  {
    id: "v14",
    name: "Senshi Karate Dojo",
    lat: 42.6700, lng: 23.2900,
    address: "Tsar Boris III Blvd, Sofia",
    keywords: ["strict", "sparring", "technique-focused", "intense"],
    rating: 4.8, reviewCount: 215,
    acceptsMultisport: true, freeSession: true,
    imageUrl: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=500&q=80",
    description: "Traditional Kyokushin karate dojo pushing your limits."
  },
  {
    id: "v15",
    name: "Dance Station NDK",
    lat: 42.6850, lng: 23.3190,
    address: "Bulgaria Sqr 1, Sofia",
    keywords: ["fast-paced", "friendly", "community-focused", "beginner-friendly"],
    rating: 4.8, reviewCount: 520,
    acceptsMultisport: true, freeSession: false,
    imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&q=80",
    description: "Hip-hop, salsa, and contemporary dance classes right in NDK."
  }
];

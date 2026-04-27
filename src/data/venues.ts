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
// We generate a robust list around Sofia based on verified, real-world sports facilities.
export const venues: Venue[] = [
  {
    id: "v1",
    name: "Next Level NDK",
    lat: 42.6845, lng: 23.3190,
    address: "1 Bulgaria Sq., Sofia",
    keywords: ["clean", "cardio", "pro-level", "fast-paced"],
    rating: 4.6, reviewCount: 840,
    acceptsMultisport: true, freeSession: false,
    imageUrl: "https://prod0mobileapp.blob.core.windows.net/facilities/facilities/bg/3082/images/3_3082_3_0_FacilityPhoto.jpg?-276268773",
    description: "In the heart of the city, Next Level offers state-of-the-art equipment, Les Mills classes, and an energizing atmosphere."
  },
  {
    id: "v2",
    name: "Pulse Fitness & Spa Platinum",
    lat: 42.7107, lng: 23.3424,
    address: "47 Rezbarska Str., Sofia",
    keywords: ["relaxed", "clean", "pro-level", "community-focused"],
    rating: 4.8, reviewCount: 1540,
    acceptsMultisport: true, freeSession: false,
    imageUrl: "https://s.inyourpocket.com/gallery/162677.jpg",
    description: "Premium fitness club boasting an enormous weight area, luxurious spa facilities, and a stunning indoor pool."
  },
  {
    id: "v3",
    name: "V GYM Fitness & SPA",
    lat: 42.6934, lng: 23.3362,
    address: "22 San Stefano Str., Sofia",
    keywords: ["strict", "pro-level", "intense", "clean"],
    rating: 4.9, reviewCount: 310,
    acceptsMultisport: false, freeSession: true,
    imageUrl: "https://s.inyourpocket.com/gallery/162686.jpg",
    description: "Highly exclusive luxury complex with professional equipment, highly-certified personal trainers, and top-tier spa treatments."
  },
  {
    id: "v4",
    name: "Athletic Fitness - Mega Mall",
    lat: 42.7235, lng: 23.2662,
    address: "15 Tsaritsa Yoanna Blvd., Sofia",
    keywords: ["beginner-friendly", "fast-paced", "cardio", "friendly"],
    rating: 4.5, reviewCount: 615,
    acceptsMultisport: true, freeSession: false,
    imageUrl: "https://bulgaria-infoguide.com/wp-content/uploads/2018/10/athletic-fitness-6.jpg",
    description: "Spacious, well-ventilated club with an emphasis on cardio and accessibility. Extremely welcoming environment for newcomers."
  },
  {
    id: "v5",
    name: "Walltopia Climbing Center",
    lat: 42.6450, lng: 23.3750,
    address: "111V Tsarigradsko Shose Blvd., Sofia",
    keywords: ["community-focused", "technique-focused", "intense", "friendly"],
    rating: 4.9, reviewCount: 1302,
    acceptsMultisport: true, freeSession: false,
    imageUrl: "https://cdn.walltopia.com/wp-content/uploads/20231030104515/Image-2-8.jpg",
    description: "The largest climbing gym in Eastern Europe. A phenomenal community with massive lead climbing and bouldering areas."
  },
  {
    id: "v6",
    name: "Bulgarian Top Team MMA",
    lat: 42.6510, lng: 23.3440,
    address: "Studentski Grad, Hall 'Bonsist', Sofia",
    keywords: ["intense", "sparring", "fast-paced", "community-focused"],
    rating: 4.9, reviewCount: 420,
    acceptsMultisport: false, freeSession: true,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    description: "The premier martial arts team in Bulgaria. Whether you're a beginner or Pro MMA fighter, the training here is authentic and demanding."
  },

  {
    id: "v8",
    name: "CrossFit Vitosha",
    lat: 42.6280, lng: 23.3150,
    address: "266 Okolovrasten pat, Sofia",
    keywords: ["intense", "community-focused", "pro-level", "fast-paced"],
    rating: 4.8, reviewCount: 388,
    acceptsMultisport: true, freeSession: true,
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    description: "An official CrossFit affiliate boasting highly structured, grueling WODs and one of the finest fitness communities in the capital."
  },
  {
    id: "v9",
    name: "Levski Sofia Fight Club",
    lat: 42.6860, lng: 23.3360,
    address: "38 Evlogi i Hristo Georgiev Blvd., Sofia",
    keywords: ["intense", "sparring", "pro-level", "strict"],
    rating: 4.7, reviewCount: 215,
    acceptsMultisport: true, freeSession: false,
    imageUrl: "https://alchetron.com/cdn/levski-sofia-sports-club-3542dd38-0874-43c9-b80c-22903923550-resize-750.jpg",
    description: "Iconic fight club catering to Brazilian Jiu-Jitsu, Muay Thai, and Boxing. High intensity environment with highly experienced coaches."
  },
  {
    id: "v10",
    name: "Fight Club Bulgaria",
    lat: 42.6770, lng: 23.2730,
    address: "1 Koloman Str., Sofia",
    keywords: ["intense", "sparring", "pro-level", "community-focused"],
    rating: 4.8, reviewCount: 312,
    acceptsMultisport: false, freeSession: true,
    imageUrl: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80",
    description: "Massive facility focusing on MMA, Combat Sambo, Boxing, and Grappling. Great for serious competitors and aspiring fighters."
  },
  {
    id: "v11",
    name: "FAST Academy",
    lat: 42.6740, lng: 23.3860,
    address: "4-8 Prof. Tsvetan Lazarov Blvd., Sofia",
    keywords: ["fast-paced", "technique-focused", "beginner-friendly", "community-focused"],
    rating: 4.9, reviewCount: 140,
    acceptsMultisport: true, freeSession: true,
    imageUrl: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80",
    description: "Fighting Academy Sofia Teams. A very welcoming gym teaching MMA and BJJ to all skill levels with a fantastic community."
  },
  {
    id: "v12",
    name: "Steel Style Boxing Gym",
    lat: 42.6455, lng: 23.3350,
    address: "6 Acad. Yordan Trifonov Str., Sofia",
    keywords: ["strict", "pro-level", "technique-focused", "cardio"],
    rating: 4.6, reviewCount: 198,
    acceptsMultisport: true, freeSession: false,
    imageUrl: "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=800&q=80",
    description: "Old-school style boxing gym focusing heavily on strict technique, stamina, and hardcore boxing foundations."
  },
  {
    id: "v13",
    name: "Klub za Narodni Tanci Vitosha",
    lat: 42.6780, lng: 23.3240,
    address: "ul. Lozenska planina, Sofia",
    keywords: ["relaxed", "community-focused", "friendly", "beginner-friendly"],
    rating: 4.9, reviewCount: 680,
    acceptsMultisport: true, freeSession: true,
    imageUrl: "https://time4.dance/ads/FB-post-image-narodni-tanci.jpg?ver=1",
    description: "Immerse yourself in Bulgarian culture with traditional circular folklore dancing. Very friendly, community-driven, and open to complete beginners."
  },
  {
    id: "v14",
    name: "Latin Force Dance Studio",
    lat: 42.6980, lng: 23.3210,
    address: "50 Tsar Samuil Str., Sofia",
    keywords: ["fast-paced", "friendly", "cardio", "community-focused"],
    rating: 4.8, reviewCount: 955,
    acceptsMultisport: true, freeSession: false,
    imageUrl: "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?auto=format&fit=crop&w=800&q=80",
    description: "One of the largest salsa and bachata dance schools. Expect upbeat latin music, energetic cardio, and polished wooden floors."
  },
  {
    id: "v15",
    name: "Sofia Padel Club",
    lat: 42.6350, lng: 23.3150,
    address: "Tsarsko Selo Complex, Sofia",
    keywords: ["fast-paced", "pro-level", "friendly", "cardio"],
    rating: 4.8, reviewCount: 220,
    acceptsMultisport: false, freeSession: false,
    imageUrl: "https://res.cloudinary.com/playtomic/image/upload/v1684788582/pro/tenants/61e73f55-98c6-405f-ac6b-e2677af5905f/1684788581764.jpg",
    description: "Premium panoramic outdoor padel tennis courts located at the foot of Vitosha mountain. A fast-paced, highly addictive sport."
  },
  {
    id: "v16",
    name: "Yoga District Mandala",
    lat: 42.7050, lng: 23.3235,
    address: "58 Knyaginya Maria Luiza Blvd, Sofia",
    keywords: ["relaxed", "technique-focused", "clean", "friendly"],
    rating: 4.9, reviewCount: 410,
    acceptsMultisport: true, freeSession: true,
    imageUrl: "https://theyogadistrict.net/wp-content/uploads/2024/05/Mandala-Yang.webp",
    description: "A huge, high-ceiling modern yoga and meditation studio with deep spiritual roots. Highly recommended for mindful realignment."
  },
  {
    id: "v17",
    name: "Spartak Swimming Complex",
    lat: 42.6780, lng: 23.3200,
    address: "4 Arsenalski Blvd., Sofia",
    keywords: ["cardio", "pro-level", "clean", "strict"],
    rating: 4.5, reviewCount: 1650,
    acceptsMultisport: true, freeSession: false,
    imageUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
    description: "Sofia's most iconic olympic-sized swimming compound. Crystal blue water, huge indoor pools, excellent for serious cardio sessions."
  },
  {
    id: "v18", name: "Ritmo Dance Studio", lat: 42.6450, lng: 23.3440, address: "Studentski Grad, Sofia",
    keywords: ["fast-paced", "friendly", "community-focused", "cardio"], rating: 4.9, reviewCount: 880,
    acceptsMultisport: true, freeSession: true, imageUrl: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80",
    description: "Top-rated salsa and bachata studio located in the lively student district. Great parties and amazing instructors."
  },
  {
    id: "v19", name: "Salsa Diva", lat: 42.6950, lng: 23.3250, address: "78 Knyaz Boris I Str., Sofia",
    keywords: ["fast-paced", "technique-focused", "friendly"], rating: 4.8, reviewCount: 420,
    acceptsMultisport: true, freeSession: false, imageUrl: "https://yt3.googleusercontent.com/ytc/AIdro_lNdtOyoJyVvrCQF6FOIa6t57xBvm5ZwdOPBCoFVz8R3rw=s900-c-k-c0x00ffffff-no-rj",
    description: "Intimate and focused salsa school right in the center. Very welcoming for intermediate and advanced dancers."
  },
  {
    id: "v20", name: "Paletro Dance Spot", lat: 42.6730, lng: 23.3210, address: "8-10 Korab Planina Str., Sofia",
    keywords: ["fast-paced", "pro-level", "clean", "community-focused"], rating: 4.7, reviewCount: 310,
    acceptsMultisport: true, freeSession: false, imageUrl: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=800&q=80",
    description: "Modern, fully equipped space for Latin dance training in Lozenets. Impeccable floor and great lighting."
  },
  {
    id: "v21", name: "Dance Academy Sofia", lat: 42.6850, lng: 23.3100, address: "blvd. Cherni vrah 47, Sofia",
    keywords: ["cardio", "friendly", "beginner-friendly", "clean"], rating: 4.6, reviewCount: 1045,
    acceptsMultisport: true, freeSession: true, imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
    description: "A massive multi-dance facility teaching everything from ballroom to hip hop and contemporary."
  },

  {
    id: "v23", name: "Ludo Mlado Folklore Club", lat: 42.7000, lng: 23.3300, address: "Zaimov Park area, Sofia",
    keywords: ["fast-paced", "intense", "community-focused"], rating: 4.9, reviewCount: 888,
    acceptsMultisport: false, freeSession: false, imageUrl: "https://i1.sndcdn.com/artworks-000193354331-1wt7nj-t500x500.jpg",
    description: "High-energy folklore ensemble. They teach complex steps to energetic traditional music."
  },

  {
    id: "v25", name: "National Tennis Center", lat: 42.6800, lng: 23.3350, address: "Borisova Gradina, Sofia",
    keywords: ["pro-level", "technique-focused", "cardio", "strict"], rating: 4.5, reviewCount: 955,
    acceptsMultisport: false, freeSession: false, imageUrl: "https://bblbg.com/wp-content/uploads/2021/11/tennis-tournament-2021-46.jpg",
    description: "12 clay courts embedded beautifully inside Borisova Garden. The historical home of Bulgarian tennis."
  },
  {
    id: "v26", name: "MG Tennis Club", lat: 42.6985, lng: 23.3385, address: "30 Yanko Sakuzov Blvd., Sofia",
    keywords: ["technique-focused", "clean", "pro-level"], rating: 4.6, reviewCount: 420,
    acceptsMultisport: true, freeSession: false, imageUrl: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80",
    description: "Right at Zaimov park. Semi-indoor hard courts providing an excellent surface for fast-paced games."
  },
  {
    id: "v27", name: "Maleeva Tennis Club", lat: 42.6610, lng: 23.3150, address: "57 Nicola Vaptsarov Blvd., Sofia",
    keywords: ["pro-level", "luxury", "clean", "strict"], rating: 4.8, reviewCount: 1540,
    acceptsMultisport: false, freeSession: false, imageUrl: "https://sofiaestates.com/wp-content/uploads/2015/06/pic-123.jpg",
    description: "Owned by the famous Maleeva sisters. Exceptional indoor clay courts and an elite country-club atmosphere."
  },
  {
    id: "v28", name: "AYA Padel Club", lat: 42.6500, lng: 23.3500, address: "Studentski Grad, Sofia",
    keywords: ["fast-paced", "cardio", "friendly", "community-focused"], rating: 4.9, reviewCount: 320,
    acceptsMultisport: true, freeSession: false, imageUrl: "https://yt3.googleusercontent.com/4lL0Y8kfQnv4gTqfRlu1_0_Xi14bAlIJ1vm63FQxKzvvIRpveEjq21CaaZQqq9_qTwiwL10JYFU=s900-c-k-c0x00ffffff-no-rj",
    description: "Featuring cutting-edge Panoramic 180+ courts. Very trendy, active community of padel enthusiasts."
  },
  {
    id: "v29", name: "Yoga Studio 108", lat: 42.6900, lng: 23.3200, address: "23 Solunska Str., Sofia",
    keywords: ["relaxed", "technique-focused", "clean"], rating: 4.9, reviewCount: 650,
    acceptsMultisport: true, freeSession: true, imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    description: "Downtown oasis for classical yoga. Known for its deeply spiritual teachers and quiet atmosphere."
  },
  {
    id: "v30", name: "Santosha Yoga", lat: 42.6920, lng: 23.3250, address: "11 Benkovski Str., Sofia",
    keywords: ["relaxed", "friendly", "beginner-friendly"], rating: 4.8, reviewCount: 520,
    acceptsMultisport: true, freeSession: true, imageUrl: "https://images.squarespace-cdn.com/content/v1/5ea7ff45e700fe5427a12fe5/1599207600042-KNVO2FCW7BL8JAYG6HWZ/_DSC0346.jpg?format=1500w",
    description: "A cozy inner-city hideaway emphasizing mindful breathing and vinyasa flows for all levels."
  },
  {
    id: "v31", name: "Yoga Vibe East", lat: 42.6700, lng: 23.3600, address: "Mladost 1, Sofia",
    keywords: ["relaxed", "clean", "technique-focused", "community-focused"], rating: 4.9, reviewCount: 410,
    acceptsMultisport: true, freeSession: false, imageUrl: "https://media.licdn.com/dms/image/v2/D4D0BAQGO3mQwlSYwDw/company-logo_200_200/company-logo_200_200/0/1692012790885?e=2147483647&v=beta&t=Uxsud6Wck3AL-94-nGCry7Gt_-d6Ja1ftlsqCXqnu8Q",
    description: "Bright, spacious yoga rooms located in the Eastern suburbs. Famous for aerial yoga classes."
  },
  {
    id: "v32", name: "Dianabad Swimming Pool", lat: 42.6650, lng: 23.3450, address: "Nikola Gabrovski Blvd., Sofia",
    keywords: ["cardio", "pro-level", "intense"], rating: 4.4, reviewCount: 1100,
    acceptsMultisport: true, freeSession: false, imageUrl: "https://images.unsplash.com/photo-1600965962361-9035dbfd1c50?auto=format&fit=crop&w=800&q=80",
    description: "A historic swimming facility known for its rigorous swim lanes and no-nonsense sports vibe."
  },

  {
    id: "v34", name: "Twisted Jiu Jitsu", lat: 42.6800, lng: 23.3100, address: "Golo Bardo 4, Sofia",
    keywords: ["technique-focused", "intense", "community-focused", "sparring"], rating: 4.9, reviewCount: 740,
    acceptsMultisport: true, freeSession: true, imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    description: "The most prestigious BJJ academy in Sofia. Highly technical grappling with a very cohesive team culture."
  },
  {
    id: "v35", name: "Martial Arts Club Armeec", lat: 42.6950, lng: 23.3500, address: "Arena Armeec Complex, Sofia",
    keywords: ["strict", "pro-level", "intense", "sparring"], rating: 4.9, reviewCount: 1200,
    acceptsMultisport: false, freeSession: false, imageUrl: "https://mktickets.mk/wp-content/uploads/2019/01/Arena-Armeec-JESC-2.jpg",
    description: "A hardcore Kickboxing and Muay Thai gym that breeds champions. Very intense training sessions."
  },
  {
    id: "v36", name: "ABC Fight Club", lat: 42.6880, lng: 23.3320, address: "Vasil Levski Stadium, Sofia",
    keywords: ["fast-paced", "strict", "pro-level", "cardio"], rating: 4.7, reviewCount: 450,
    acceptsMultisport: true, freeSession: false, imageUrl: "https://yt3.googleusercontent.com/ytc/AIdro_nK8M6bdlL7jdmhuXdKxURknmMPJMx3Pov2bEJo_ClV=s900-c-k-c0x00ffffff-no-rj",
    description: "Operating inside the national stadium. Renowned for their Taekwondo and classic boxing programs."
  },
  {
    id: "v37", name: "Boulderland", lat: 42.6530, lng: 23.3150, address: "Paradise Center, Sofia",
    keywords: ["community-focused", "friendly", "technique-focused"], rating: 4.8, reviewCount: 1800,
    acceptsMultisport: true, freeSession: false, imageUrl: "https://i.redd.it/e36p3zxjlj661.jpg",
    description: "An amazing bouldering gym situated inside the mall. Fun problem-solving routes and a super chill community."
  }
];

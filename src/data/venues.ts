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
  mapQuery?: string;
}

const API_URL = 'http://localhost:3001';

// Runtime venue list — populated from the server on load
export const venues: Venue[] = [];

/** Fetch all venues from the JSON server and populate the runtime array. */
export async function loadVenues(): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/venues`);
    if (!res.ok) return;
    const data: Venue[] = await res.json();
    // Clear and repopulate
    venues.length = 0;
    data.forEach((v) => venues.push(v));
  } catch {
    // Server not available — venues stays empty
  }
}

/** Add a new venue to the server and the runtime list. */
export async function addVenue(venue: Venue): Promise<void> {
  // Add to runtime immediately
  venues.push(venue);

  // Persist to JSON server
  try {
    await fetch(`${API_URL}/venues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venue),
    });
  } catch (err) {
    console.error('Failed to save venue to server:', err);
  }
}

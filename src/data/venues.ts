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
export async function addVenue(venue: Omit<Venue, 'id'> | Venue): Promise<Venue> {
  try {
    const res = await fetch(`${API_URL}/venues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venue),
    });
    const createdVenue = await res.json();
    venues.push(createdVenue);
    return createdVenue;
  } catch (err) {
    console.error('Failed to save venue to server:', err);
    const fallbackVenue = venue as Venue;
    if (!fallbackVenue.id) fallbackVenue.id = 'v' + Date.now();
    venues.push(fallbackVenue);
    return fallbackVenue;
  }
}

/** Edit an existing venue on the server and update the runtime list. */
export async function editVenue(id: string, updates: Partial<Venue>): Promise<Venue | null> {
  try {
    const res = await fetch(`${API_URL}/venues/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) return null;
    const updatedVenue = await res.json();
    
    // Update the runtime array
    const index = venues.findIndex(v => v.id === id);
    if (index !== -1) {
      venues[index] = { ...venues[index], ...updatedVenue };
    }
    
    return updatedVenue;
  } catch (err) {
    console.error(`Failed to edit venue ${id} on server:`, err);
    return null;
  }
}

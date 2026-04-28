import type { Venue } from '../data/venues';
import { calculateDistance } from './geolocation';
import type { Coordinates } from './geolocation';

export interface MatchedVenue extends Venue {
  distance: number; // in km
  matchPercentage: number; // 0-100
  hybridScore: number; // 0-100
}

const DEFAULT_MAX_RADIUS_KM = 10;

/**
 * Calculates how well a venue matches the user's preferred keywords.
 */
export function calculateVibeMatch(userKeywords: string[], venueKeywords: string[]): number {
  if (userKeywords.length === 0) return 50; // baseline if no traits

  const intersection = userKeywords.filter((kw) => venueKeywords.includes(kw));
  // Exact match ratio: how many of the user's preferred keywords are in the venue?
  // Let's make it more forgiving. If they match 3 traits, it's 100%. 2 is 66%, etc.
  const score = (intersection.length / Math.max(1, userKeywords.length)) * 100;
  
  // We can add a small baseline so it never says 0%
  return Math.min(100, Math.max(10, score));
}

/**
 * Ranks venues for a specific user profile and location
 */
export function rankVenues(
  venues: Venue[],
  userLocation: Coordinates,
  userKeywords: string[],
  maxRadiusKm: number = DEFAULT_MAX_RADIUS_KM
): MatchedVenue[] {
  const result: MatchedVenue[] = [];

  for (const venue of venues) {
    const distance = calculateDistance(userLocation, { lat: venue.lat, lng: venue.lng });
    
    // Only include venues within the specified radius
    if (distance <= maxRadiusKm) {
      const matchPercentage = calculateVibeMatch(userKeywords, venue.keywords);
      
      // Distance score: 0km = 100%, maxRadius = 0%
      const distanceScore = Math.max(0, 100 - (distance / maxRadiusKm) * 100);

      // Hybrid calculation: 60% vibe, 40% distance
      const hybridScore = (0.6 * matchPercentage) + (0.4 * distanceScore);

      if (matchPercentage >= 45) {
        result.push({
          ...venue,
          distance,
          matchPercentage,
          hybridScore
        });
      }
    }
  }

  // Sort descending by match percentage
  return result.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

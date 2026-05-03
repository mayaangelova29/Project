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
  // Exact match ratio
  const ratio = intersection.length / Math.max(1, userKeywords.length);
  
  // Square the ratio to heavily penalize missing traits. 
  // e.g., 50% match becomes 25% score, but 100% match stays 100%.
  const score = Math.pow(ratio, 2) * 100;
  
  // We can add a small baseline so it never says 0%
  return Math.min(100, Math.max(10, Math.round(score)));
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
      
      // Filter out venues that don't meet the minimum 45% match threshold
      if (matchPercentage < 45) {
        continue;
      }
      
      // Distance score: 0km = 100%, maxRadius = 0%
      const distanceScore = Math.max(0, 100 - (distance / maxRadiusKm) * 100);

      // Hybrid calculation: 85% vibe, 15% distance. 
      // Vibe must be the dominant factor so closer irrelevant venues don't outrank perfect matches further away.
      const hybridScore = (0.85 * matchPercentage) + (0.15 * distanceScore);

      result.push({
        ...venue,
        distance,
        matchPercentage,
        hybridScore
      });
    }
  }

  // Sort descending by match percentage, then ascending by distance
  return result.sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    return a.distance - b.distance;
  });
}

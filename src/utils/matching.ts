import type { Venue } from '../data/venues';
import { venues as allVenues } from '../data/venues';
import { calculateDistance } from './geolocation';
import type { Coordinates } from './geolocation';

export interface MatchedVenue extends Venue {
  distance: number; // in km
  matchPercentage: number; // 0-100
  hybridScore: number; // 0-100
}

const DEFAULT_MAX_RADIUS_KM = 10;

/**
 * Computes IDF-style weights for keywords across the venue corpus.
 * Rare keywords (like "sparring") get a much higher weight than
 * ubiquitous ones (like "beginner-friendly").
 */
function computeKeywordWeights(venues: Venue[]): Map<string, number> {
  const docFrequency = new Map<string, number>();
  const totalVenues = venues.length || 1;

  for (const venue of venues) {
    const seen = new Set<string>();
    for (const kw of venue.keywords) {
      if (!seen.has(kw)) {
        docFrequency.set(kw, (docFrequency.get(kw) || 0) + 1);
        seen.add(kw);
      }
    }
  }

  const weights = new Map<string, number>();
  for (const [kw, freq] of docFrequency) {
    // Squared IDF for stronger discrimination of rare keywords.
    // e.g. "sparring" in 3/16 venues → weight ~3.1
    //      "intense" in 12/16 venues → weight ~1.1
    const rawIdf = Math.log((totalVenues + 1) / (freq + 1));
    weights.set(kw, rawIdf * rawIdf + 1);
  }

  return weights;
}

/**
 * Calculates how well a venue matches the user's preferred keywords.
 * Uses IDF-weighted recall as the primary signal (does the venue cover
 * what the user needs?) with a small Jaccard penalty for venues that
 * have many completely unrelated keywords.
 */
export function calculateVibeMatch(
  userKeywords: string[],
  venueKeywords: string[],
  keywordWeights?: Map<string, number>
): number {
  if (userKeywords.length === 0) return 50; // baseline if no traits

  const userSet = new Set(userKeywords);
  const venueSet = new Set(venueKeywords);

  // Weighted recall: what fraction of the user's weighted needs does the venue cover?
  let recallNum = 0;
  let recallDen = 0;
  for (const kw of userSet) {
    const w = keywordWeights?.get(kw) ?? 1;
    recallDen += w;
    if (venueSet.has(kw)) {
      recallNum += w;
    }
  }
  const recall = recallDen > 0 ? recallNum / recallDen : 0;

  // Jaccard for a small penalty on venues with many unrelated keywords
  const unionSet = new Set([...userSet, ...venueSet]);
  let jaccardNum = 0;
  let jaccardDen = 0;
  for (const kw of unionSet) {
    const w = keywordWeights?.get(kw) ?? 1;
    if (userSet.has(kw) && venueSet.has(kw)) {
      jaccardNum += w;
    }
    jaccardDen += w;
  }
  const jaccard = jaccardDen > 0 ? jaccardNum / jaccardDen : 0;

  // 80% recall (covers user needs) + 20% Jaccard (penalizes irrelevant extras)
  const score = (0.8 * recall + 0.2 * jaccard) * 100;

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

  // Pre-compute keyword weights across the full venue corpus
  const keywordWeights = computeKeywordWeights(allVenues.length > 0 ? allVenues : venues);

  for (const venue of venues) {
    const distance = calculateDistance(userLocation, { lat: venue.lat, lng: venue.lng });
    
    // Only include venues within the specified radius
    if (distance <= maxRadiusKm) {
      const matchPercentage = calculateVibeMatch(userKeywords, venue.keywords, keywordWeights);
      
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

  // Sort descending by hybrid score (blends vibe match + distance)
  return result.sort((a, b) => {
    if (Math.abs(b.hybridScore - a.hybridScore) > 0.5) {
      return b.hybridScore - a.hybridScore;
    }
    return a.distance - b.distance;
  });
}

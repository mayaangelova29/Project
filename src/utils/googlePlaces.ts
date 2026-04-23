// Fetches the real, official Google Maps photo for a venue using the Places API (New)
export async function fetchGooglePlacePhoto(venueName: string, venueAddress: string, apiKey: string): Promise<string | null> {
  if (!apiKey) return null;

  try {
    const searchUrl = `https://places.googleapis.com/v1/places:searchText`;
    
    // We send a POST request with the text query
    const searchResponse = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.photos' // Only request photos to save bandwidth
      },
      body: JSON.stringify({
        textQuery: `${venueName} ${venueAddress} Sofia`
      })
    });

    if (!searchResponse.ok) {
      console.warn("Failed to fetch from Google Places API", searchResponse.status);
      return null;
    }
    
    const data = await searchResponse.json();
    
    // Check if the place query returned any places with photos attached
    if (data.places && data.places.length > 0 && data.places[0].photos && data.places[0].photos.length > 0) {
      // Get the photo resource name
      const photoName = data.places[0].photos[0].name;
      // Construct the exact image URL representing that place
      return `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=600&maxWidthPx=800&key=${apiKey}`;
    }
    return null;
  } catch (error) {
    console.error("Error fetching place photo:", error);
    return null;
  }
}

export interface Coordinates {
  lat: number;
  lng: number;
}

// Haversine formula to calculate distance in km
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const toRadian = (angle: number) => (Math.PI / 180) * angle;

  const R = 6371; // Earth radius in km
  const dLat = toRadian(coord2.lat - coord1.lat);
  const dLon = toRadian(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadian(coord1.lat)) *
      Math.cos(toRadian(coord2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d; // returned in km
}

export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
}

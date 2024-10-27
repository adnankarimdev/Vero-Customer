import { Coordinates } from "@/components/Types/types";

export async function getLatLongFromAddress(address: string) {
  const GOOGLE_MAPS_API_KEY = "AIzaSyDEJBvbJXfBOqam_dohKIp-9OT6ZBYB2rY";
  const encodedAddress = encodeURIComponent(address); // Encode address to URL format

  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.status === "OK") {
      const location = data.results[0].geometry.location;
      // console.log("place Latitude:", location.lat);
      // console.log("place Longitude:", location.lng);
      return { latitude: location.lat, longitude: location.lng };
    } else {
      console.error("Geocoding error:", data.status);
    }
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
  }
}

export function getUserLocation() {
  return new Promise<{ latitude: number; longitude: number } | null>(
    (resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            // console.log("User Latitude:", latitude);
            // console.log("User Longitude:", longitude);
            resolve({ latitude, longitude });
          },
          (error) => {
            console.error("Error getting location:", error);
            reject(null);
          },
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        reject(null);
      }
    },
  );
}

/**
 * Calculates the distance between two geographic coordinates in meters using the Haversine formula
 * @param point1 First coordinate point with latitude and longitude
 * @param point2 Second coordinate point with latitude and longitude
 * @returns Distance between the points in meters
 */
const calculateDistanceInMeters = (
  point1: Coordinates,
  point2: Coordinates,
): number => {
  // Earth's radius in meters
  const EARTH_RADIUS_METERS = 6371000;

  // Convert latitude and longitude to radians
  const lat1 = toRadians(point1.latitude);
  const lon1 = toRadians(point1.longitude);
  const lat2 = toRadians(point2.latitude);
  const lon2 = toRadians(point2.longitude);

  // Differences in coordinates
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate distance in meters and round to nearest meter
  return Math.round(EARTH_RADIUS_METERS * c);
};

/**
 * Converts degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

// Example usage for checking if a user is within 50 meters of a location
export const isWithinRadius = (
  userLocation: Coordinates,
  targetLocation: Coordinates,
  radiusInMeters: number,
): boolean => {
  const distance = calculateDistanceInMeters(userLocation, targetLocation);
  return distance <= radiusInMeters;
};

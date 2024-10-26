export async function getLatLongFromAddress(address: string) {
  const GOOGLE_MAPS_API_KEY = "AIzaSyDEJBvbJXfBOqam_dohKIp-9OT6ZBYB2rY";
  const encodedAddress = encodeURIComponent(address); // Encode address to URL format

  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.status === "OK") {
      const location = data.results[0].geometry.location;
      console.log("place Latitude:", location.lat);
      console.log("place Longitude:", location.lng);
      return { lat: location.lat, lng: location.lng };
    } else {
      console.error("Geocoding error:", data.status);
    }
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
  }
}

export function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        console.log("user Latitude:", lat);
        console.log("user Longitude:", long);
      },
      (error) => {
        console.error("Error getting location:", error);
      },
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

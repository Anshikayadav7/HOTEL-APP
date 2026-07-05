/* ============================================
   api.js — All API calls in one place
   API: https://demohotelsapi.pythonanywhere.com/hotels/
   Each hotel: { id, name, price, thumbnail, rating, location, description, photos[] }
   ============================================ */

const API_URL = "https://demohotelsapi.pythonanywhere.com/hotels/";

/**
 * Fetch all hotels
 * Returns: array of hotel objects from data[]
 */
async function fetchHotels() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch hotels");
  const json = await res.json();
  return json.data; // API wraps hotels in { status, count, returned, message, data: [...] }
}

/**
 * Fetch a single hotel by ID
 * The API doesn't have a /hotels/:id endpoint, so we fetch all and filter.
 */
async function fetchHotelById(id) {
  const hotels = await fetchHotels();
  const hotel = hotels.find((h) => h.id === Number(id));
  if (!hotel) throw new Error("Hotel not found");
  return hotel;
}

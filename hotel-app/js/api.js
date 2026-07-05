const API_URL = "https://demohotelsapi.pythonanywhere.com/hotels/";

async function fetchHotels() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch hotels");
  const json = await res.json();
  return json.data; // API wraps hotels in { status, count, returned, message, data: [...] }
}

async function fetchHotelById(id) {
  const hotels = await fetchHotels();
  const hotel = hotels.find((h) => h.id === Number(id));
  if (!hotel) throw new Error("Hotel not found");
  return hotel;
}

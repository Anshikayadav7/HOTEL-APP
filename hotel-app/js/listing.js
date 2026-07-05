/* ============================================
   listing.js — Hotel Listing Page Logic
   - Fetches all hotels from API
   - Search by name or location
   - Sort by price / rating
   - Click card → hotel.html?id=...
   ============================================ */

const hotelGrid = document.getElementById("hotelGrid");
const loadingMsg = document.getElementById("loadingMsg");
const errorMsg = document.getElementById("errorMsg");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const resultsCount = document.getElementById("resultsCount");

let allHotels = [];

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

function renderHotels(hotels) {
  hotelGrid.innerHTML = "";
  resultsCount.textContent = `${hotels.length} hotel${hotels.length !== 1 ? "s" : ""} found`;

  if (hotels.length === 0) {
    hotelGrid.innerHTML = `<div class="no-results">No hotels match your search. Try a different keyword.</div>`;
    return;
  }

  hotels.forEach((hotel) => {
    const card = document.createElement("div");
    card.className = "hotel-card";

    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${hotel.thumbnail}" alt="${hotel.name}" loading="lazy" />
        <div class="card-rating">${hotel.rating} ★</div>
      </div>
      <div class="card-body">
        <div class="card-location">📍 ${hotel.location}</div>
        <h3 class="card-name">${hotel.name}</h3>
        <p class="card-desc">${hotel.description.slice(0, 90)}...</p>
        <div class="card-footer">
          <div class="card-price">₹${parseFloat(hotel.price).toLocaleString("en-IN")}<span>/night</span></div>
          <button class="view-btn" data-id="${hotel.id}">View Hotel</button>
        </div>
      </div>
    `;

    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("view-btn")) {
        window.location.href = `hotel.html?id=${hotel.id}`;
      } else {
        window.location.href = `hotel.html?id=${hotel.id}`;
      }
    });

    hotelGrid.appendChild(card);
  });
}

function getFilteredAndSorted() {
  const query = searchInput.value.toLowerCase().trim();
  const sort = sortSelect.value;

  let filtered = allHotels.filter((h) =>
    h.name.toLowerCase().includes(query) ||
    h.location.toLowerCase().includes(query)
  );

  if (sort === "price-asc") filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  else if (sort === "price-desc") filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  else if (sort === "rating-desc") filtered.sort((a, b) => b.rating - a.rating);

  return filtered;
}

async function loadHotels() {
  try {
    allHotels = await fetchHotels();
    renderHotels(allHotels);
  } catch (err) {
    errorMsg.textContent = "Could not load hotels. Please check your connection and try again.";
    errorMsg.style.display = "block";
    console.error(err);
  } finally {
    loadingMsg.style.display = "none";
  }
}

searchInput.addEventListener("input", () => renderHotels(getFilteredAndSorted()));
sortSelect.addEventListener("change", () => renderHotels(getFilteredAndSorted()));

loadHotels();

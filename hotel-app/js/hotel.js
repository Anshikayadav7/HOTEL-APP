/* ============================================
   hotel.js — Hotel Detail Page Logic
   - Reads ?id= from URL
   - Shows hotel info, photo gallery, rating
   - Book Now → booking.html?id=...
   ============================================ */

const loadingMsg = document.getElementById("loadingMsg");
const errorMsg = document.getElementById("errorMsg");
const hotelDetail = document.getElementById("hotelDetail");

let currentPhoto = 0;

function getIdFromURL() {
  return new URLSearchParams(window.location.search).get("id");
}

function renderGallery(photos, thumbnail) {
  const allPhotos = [thumbnail, ...photos];
  return `
    <div class="gallery">
      <div class="gallery-main">
        <img id="mainPhoto" src="${allPhotos[0]}" alt="Hotel photo" />
        <button class="gallery-arrow left" id="prevPhoto">&#8592;</button>
        <button class="gallery-arrow right" id="nextPhoto">&#8594;</button>
      </div>
      <div class="gallery-thumbs" id="thumbs">
        ${allPhotos.map((p, i) => `<img src="${p}" class="thumb ${i === 0 ? "active" : ""}" data-index="${i}" alt="thumb" />`).join("")}
      </div>
    </div>
  `;
}

function setupGallery(photos, thumbnail) {
  const allPhotos = [thumbnail, ...photos];
  const mainPhoto = document.getElementById("mainPhoto");
  const thumbs = document.querySelectorAll(".thumb");

  function setPhoto(index) {
    currentPhoto = (index + allPhotos.length) % allPhotos.length;
    mainPhoto.src = allPhotos[currentPhoto];
    thumbs.forEach((t) => t.classList.remove("active"));
    thumbs[currentPhoto].classList.add("active");
    thumbs[currentPhoto].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  document.getElementById("prevPhoto").addEventListener("click", () => setPhoto(currentPhoto - 1));
  document.getElementById("nextPhoto").addEventListener("click", () => setPhoto(currentPhoto + 1));
  thumbs.forEach((t) => t.addEventListener("click", () => setPhoto(Number(t.dataset.index))));
}

function renderHotel(hotel) {
  document.title = `StayBliss - ${hotel.name}`;

  hotelDetail.innerHTML = `
    ${renderGallery(hotel.photos, hotel.thumbnail)}

    <div class="detail-body">
      <div class="detail-info">
        <div class="detail-location">📍 ${hotel.location}</div>
        <h1 class="detail-name">${hotel.name}</h1>
        <div class="detail-rating">
          <span class="rating-badge">${hotel.rating} ★</span>
          <span class="rating-label">${hotel.rating >= 4.5 ? "Exceptional" : hotel.rating >= 4.0 ? "Excellent" : hotel.rating >= 3.5 ? "Very Good" : hotel.rating >= 3.0 ? "Good" : "Average"}</span>
        </div>
        <p class="detail-desc">${hotel.description}</p>

        <div class="amenities">
          <h3>What's included</h3>
          <div class="amenities-grid">
            <div class="amenity">🛎️ Concierge</div>
            <div class="amenity">🅿️ Free Parking</div>
            <div class="amenity">📶 Free WiFi</div>
            <div class="amenity">🍳 Breakfast</div>
            <div class="amenity">🏊 Pool</div>
            <div class="amenity">🏋️ Gym</div>
            <div class="amenity">❄️ AC Rooms</div>
            <div class="amenity">🧹 Daily Housekeeping</div>
          </div>
        </div>
      </div>

      <div class="booking-card">
        <div class="booking-price">₹${parseFloat(hotel.price).toLocaleString("en-IN")}<span>/night</span></div>
        <div class="booking-rating">${hotel.rating} ★ · ${hotel.location}</div>
        <div class="booking-inputs">
          <div class="booking-input-row">
            <div class="b-input">
              <label>Check-in</label>
              <input type="date" id="checkinQuick" />
            </div>
            <div class="b-input">
              <label>Check-out</label>
              <input type="date" id="checkoutQuick" />
            </div>
          </div>
          <select id="guestsQuick" class="b-select">
            <option>1 Guest</option>
            <option>2 Guests</option>
            <option>3 Guests</option>
            <option>4+ Guests</option>
          </select>
        </div>
        <button class="book-btn" id="bookNowBtn">Book Now</button>
        <p class="no-charge-note">No charge yet · Free cancellation</p>
      </div>
    </div>
  `;

  setupGallery(hotel.photos, hotel.thumbnail);

  // Set default dates (today and tomorrow)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  document.getElementById("checkinQuick").value = today.toISOString().split("T")[0];
  document.getElementById("checkoutQuick").value = tomorrow.toISOString().split("T")[0];

  document.getElementById("bookNowBtn").addEventListener("click", () => {
    window.location.href = `booking.html?id=${hotel.id}`;
  });
}

async function loadHotelDetail() {
  const id = getIdFromURL();
  if (!id) {
    errorMsg.textContent = "No hotel selected.";
    errorMsg.style.display = "block";
    loadingMsg.style.display = "none";
    return;
  }

  try {
    const hotel = await fetchHotelById(id);
    renderHotel(hotel);
  } catch (err) {
    errorMsg.textContent = "Could not load hotel details. Please go back and try again.";
    errorMsg.style.display = "block";
    console.error(err);
  } finally {
    loadingMsg.style.display = "none";
  }
}

loadHotelDetail();

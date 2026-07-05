const loadingMsg = document.getElementById("loadingMsg");
const hotelSummary = document.getElementById("hotelSummary");
const successMsg = document.getElementById("successMsg");
const formError = document.getElementById("formError");

let hotelData = null;

function getIdFromURL() {
  return new URLSearchParams(window.location.search).get("id");
}

function renderHotelSummary(hotel) {
  hotelSummary.innerHTML = `
    <img src="${hotel.thumbnail}" alt="${hotel.name}" class="summary-img" />
    <div class="summary-info">
      <div class="summary-location">📍 ${hotel.location}</div>
      <div class="summary-name">${hotel.name}</div>
      <div class="summary-rating">${hotel.rating} ★</div>
      <div class="summary-price">₹${parseFloat(hotel.price).toLocaleString("en-IN")} <span>/night</span></div>
    </div>
  `;
}

function updatePriceSummary() {
  if (!hotelData) return;

  const checkin = document.getElementById("checkin").value;
  const checkout = document.getElementById("checkout").value;
  const rooms = parseInt(document.getElementById("rooms").value);

  if (!checkin || !checkout) {
    ["pricePerNight", "numNights", "numRooms", "subtotal", "taxes", "grandTotal"]
      .forEach((id) => document.getElementById(id).textContent = "-");
    return;
  }

  const inDate = new Date(checkin);
  const outDate = new Date(checkout);
  const nights = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));

  if (nights <= 0) {
    document.getElementById("numNights").textContent = "Invalid dates";
    return;
  }

  const pricePerNight = parseFloat(hotelData.price);
  const subtotal = pricePerNight * nights * rooms;
  const taxes = subtotal * 0.12;
  const total = subtotal + taxes;

  document.getElementById("pricePerNight").textContent = `₹${pricePerNight.toLocaleString("en-IN")}`;
  document.getElementById("numNights").textContent = nights;
  document.getElementById("numRooms").textContent = rooms;
  document.getElementById("subtotal").textContent = `₹${subtotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  document.getElementById("taxes").textContent = `₹${taxes.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  document.getElementById("grandTotal").textContent = `₹${total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function validateForm() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const checkin = document.getElementById("checkin").value;
  const checkout = document.getElementById("checkout").value;

  if (!firstName || !lastName) return "Please enter your full name.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
  if (!phone || phone.length < 8) return "Please enter a valid phone number.";
  if (!checkin) return "Please select a check-in date.";
  if (!checkout) return "Please select a check-out date.";
  if (new Date(checkout) <= new Date(checkin)) return "Check-out date must be after check-in date.";

  return null; // no error
}

document.getElementById("submitBtn").addEventListener("click", () => {
  formError.style.display = "none";

  const error = validateForm();
  if (error) {
    formError.textContent = error;
    formError.style.display = "block";
    formError.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  document.getElementById("submitBtn").textContent = "Processing...";
  document.getElementById("submitBtn").disabled = true;

  setTimeout(() => {
    successMsg.style.display = "block";
    successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
    document.getElementById("submitBtn").textContent = "Booking Confirmed ✓";
  }, 1200);
});

["checkin", "checkout", "rooms"].forEach((id) => {
  document.getElementById(id).addEventListener("change", updatePriceSummary);
});

async function loadBookingPage() {
  const id = getIdFromURL();
  if (!id) {
    hotelSummary.innerHTML = `<p class="error-msg">No hotel selected.</p>`;
    return;
  }

  document.getElementById("backToHotel").href = `hotel.html?id=${id}`;

  try {
    hotelData = await fetchHotelById(id);
    renderHotelSummary(hotelData);

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    document.getElementById("checkin").value = today.toISOString().split("T")[0];
    document.getElementById("checkout").value = tomorrow.toISOString().split("T")[0];
    document.getElementById("checkin").min = today.toISOString().split("T")[0];
    document.getElementById("checkout").min = tomorrow.toISOString().split("T")[0];

    updatePriceSummary();
  } catch (err) {
    hotelSummary.innerHTML = `<p class="error-msg">Could not load hotel info.</p>`;
    console.error(err);
  }
}

loadBookingPage();

const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "admin") {
    alert("Access denied.");
    window.location.href = "index.html";
}

const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

let selectedBookingId = null;

function openDamageModal(id) {
    localStorage.setItem("selectedBookingId", id);
    document.getElementById("damageModal").classList.remove("hidden");
}

function finalizeReturn() {
    const fee = parseFloat(document.getElementById("damageFee").value || "0");
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const selectedId = parseInt(localStorage.getItem("selectedBookingId"));

    const booking = bookings.find(b => b.id === selectedId);
    if (!booking) {
        alert("Booking not found!");
        return;
    }
    
    booking.returned = true;
    booking.damageFee = fee;
    booking.total = booking.days * booking.pricePerDay + fee;

    localStorage.setItem("bookings", JSON.stringify(bookings));
    console.log("Before saving: booking.returned =", booking.returned);
    alert(`Final bill: $${booking.total}`); //change to bills side with total 
    location.reload();
    
}

function displayNewBookings() {
    const list = document.getElementById("newBookingsList");
    list.innerHTML = "";

    bookings
        .filter(b => !b.pickedUp)
        .forEach(b => {
            const div = document.createElement("div");
            div.className = "car-card";
            div.innerHTML = `
  <p><strong>${b.name}</strong> - ${b.car}</p>
  <p>Pickup: ${b.pickup}</p>
  <button class="pickup-btn btn-primary" data-id="${b.id}">Mark as Picked Up</button>
`;
            list.appendChild(div);
        });
}

// PENDING RETURNS
function displayPendingReturns() {
    const list = document.getElementById("bookingTable");
    list.innerHTML = "";

    bookings
        .filter(b => b.pickedUp && !b.returned)
        .forEach(b => {
            const row = document.createElement("div");
            row.className = "car-card";
            row.innerHTML = `
  <p><strong>${b.car}</strong> by ${b.name} (${b.days ?? "?"} day(s))</p>
  <button class="btn-primary" onclick="openDamageModal(${b.id})">Mark as Returned</button>`;
            list.appendChild(row);
        });
}

// COMPLETED RETURNS
function displayCompletedReturns() {
    const list = document.getElementById("returnedBookings");
    list.innerHTML = "";

    bookings
        .filter(b => b.returned)
        .forEach(b => {
            const div = document.createElement("div");
            div.className = "car-card";
            div.innerHTML = `
  <p><strong>${b.name}</strong> - ${b.car}</p>
  <p>Total: $${b.total}</p>
  <p>Damage Fee: $${b.damageFee}</p>
  <p>Status: ${b.paid ? "Paid" : "Unpaid"}</p>`;
            list.appendChild(div);
        });
}

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("pickup-btn")) {
        const id = parseInt(e.target.dataset.id);
        const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        const booking = bookings.find(b => b.id === id);
        if (booking) {
            booking.pickedUp = true;
            localStorage.setItem("bookings", JSON.stringify(bookings));
            location.reload(); // or call display again
        }
    }
});
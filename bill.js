const currentUser = JSON.parse(localStorage.getItem("user"));
const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
const billContainer = document.getElementById("billCards");

// Filter only current user's bookings
const userBookings = bookings.filter(b => b.email === currentUser?.email);

console.log("Current User:", currentUser);
console.log("Bookings:", bookings);

userBookings.forEach((bill, index) => {
  // Status logic
  let statusText = "Pending Pickup";
  if (bill.pickedUp && !bill.returned) statusText = "Pending Return";
  else if (bill.pickedUp && bill.returned) statusText = "Finalized";
  else if (bill.paid) statusText = "Paid";

  const card = document.createElement("div");
  card.className = "car-card";
  card.innerHTML = `
    <h3>${bill.name || "Unknown"} - ${bill.car}</h3>
    <p><strong>Total:</strong> $${bill.total ?? 0}</p>
    <p><strong>Status:</strong> ${statusText}</p>
    <button onclick="openBillModal(${index})">View</button>
  `;
  billContainer.appendChild(card);
});

function openBillModal(index) {
  const bill = userBookings[index];
  console.log("Modal Data:", bill);

  document.getElementById("billName").textContent = bill.name || "-";
  document.getElementById("billCar").textContent = bill.car || "-";
  document.getElementById("billRent").textContent = bill.days * bill.pricePerDay || 0;
  document.getElementById("billDamage").textContent = bill.damageFee || 0;
  document.getElementById("billTotal").textContent = bill.total || 0;

  //pay bills logicc
  const payBtn = document.getElementById("billPayBtn");

  if (!bill.returned) {
    // Not returned: payment disabled
    payBtn.textContent = "Awaiting Return";
    payBtn.disabled = true;
    payBtn.title = "Payment will be available after the car is returned.";
  } else if (bill.paid) {
    // Already paid
    payBtn.textContent = "Paid";
    payBtn.disabled = true;
    payBtn.title = "";
  } else {
    // Ready to pay
    payBtn.textContent = "Pay now";
    payBtn.disabled = false;
    payBtn.title = "";
    payBtn.onclick = () => payBill(bill.id);
  }
  
  document.getElementById("billModal").classList.remove("hidden");
}

function closeBillModal() {
  document.getElementById("billModal").classList.add("hidden");
}

function payBill(bookingId) {
  const all = JSON.parse(localStorage.getItem("bookings")) || [];
  const i = all.findIndex(b => b.id === bookingId);
  if (i === -1) {
    alert("Booking not found.");
    return;
  }

  // mark as paid
  all[i].paid = true;
  localStorage.setItem("bookings", JSON.stringify(all));

  alert("Payment received. Thank you!");
  closeBillModal();
  // refresh cards/status
  location.reload();
}

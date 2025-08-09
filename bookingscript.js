const carTypes = [
    { name: "Mercedes SUV", price: 25 },
    { name: "Mercedes Saloon", price: 50 },
    { name: "Mercedes MPV", price: 45 },
    { name: "Toyota RAV4", price: 35 },
    { name: "Toyota Harrier", price: 50 },
    { name: "Toyota Corolla Altis", price: 50 },
    { name: "Toyota Corolla Cross", price: 60 },
    { name: "Toyota Yaris Cross", price: 70 },
    { name: "Toyota Alphard", price: 50 },
    { name: "BMW Z4 Roadster", price: 200 },
    { name: "BMW Series 1", price: 60 },
    { name: "BMW MW315", price: 70 }
];

const rentalPlaces = [
    "Changi Airport",
    "Orchard",
    "Bugis",
    "Woodlands",
    "Tampines",
    "Bukit Timah",
    "Tuas"
];

function populateSelect(id, options, placeholder = "Select an option") {
    const select = document.getElementById(id);
    select.innerHTML = "";

    const placeholderOption = document.createElement("option");
    placeholderOption.textContent = placeholder;
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.appendChild(placeholderOption);

    options.forEach(opt => {
        const option = document.createElement("option");

        if (typeof opt === "object") {
            option.value = opt.name;
            option.dataset.price = opt.price;
            option.textContent = `${opt.name} - $${opt.price}/day`;
        } else {
            option.value = opt;
            option.textContent = opt;
        }

        select.appendChild(option);
    });
}
//Credit card form
const openBtn = document.getElementById("openCardModal"); //
const modal = document.getElementById("ccardModal");
const closeBtn = document.getElementById("closeCardModal");

if (openBtn) {
    openBtn.onclick = () => {
        // Show credit card modal, ensure carBookingModal is hidden
        const carDropdown = document.getElementById("carType");
        const selectedOption = carDropdown.options[carDropdown.selectedIndex];

        const carName = selectedOption.value;
        const price = selectedOption.dataset.price;

        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        const pickupDate = document.getElementById("rentalDate")?.value || "";
        const returnDate = document.getElementById("returnDate")?.value || "";

        // Pre-fill modal fields
        document.getElementById("cb-name").value = fullName;
        document.getElementById("cb-email").value = email;
        document.getElementById("cb-car").value = carName;
        document.getElementById("cb-price").value = `$${price} per day`;
        document.getElementById("cb-pickup").value = pickupDate;
        document.getElementById("cb-return").value = returnDate;
        toggleModals("ccardModal", ["carBookingModal"]);
    };
}

closeBtn.onclick = () => {
    modal.classList.add("hidden");
};

window.onclick = (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
};

// View Details → open 2nd booking modal
document.querySelectorAll(".view-details").forEach(btn => {
    btn.addEventListener("click", () => {
        console.log("Click detected for:", btn.dataset.car);
        const carName = btn.dataset.car;
        const carPrice = btn.dataset.price;

        document.getElementById("cb-car").value = carName;
        document.getElementById("cb-price").value = `$${carPrice} per day`;

        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.email) {
            document.getElementById("cb-email").value = storedUser.email;
        }

        document.getElementById("carBookingModal").classList.remove("hidden");
    });
});

function toggleModals(showId, hideIds = []) {
    hideIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
    });

    const showEl = document.getElementById(showId);
    if (showEl) showEl.classList.remove("hidden");
}

document.getElementById("closeCardModal").onclick = () => {
    document.getElementById("ccardModal").classList.add("hidden");
};

document.getElementById("closeCarBookingModal").onclick = () => {
    document.getElementById("carBookingModal").classList.add("hidden");
};

// Book now → show credit card popup
document.getElementById("cb-book-now").onclick = () => {
    toggleModals("ccardModal", ["carBookingModal"]);
};


document.getElementById("ccardForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("cb-name").value;
    const email = document.getElementById("cb-email").value;
    const car = document.getElementById("cb-car").value;
    const pricePerDay = parseFloat(document.getElementById("cb-price").value.replace(/[^\d.]/g, ''));
    const pickup = document.getElementById("cb-pickup").value;
    const ret = document.getElementById("cb-return").value;

    const start = new Date(pickup);
    const end = new Date(ret);
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const total = days * pricePerDay;

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.push({
        id: Date.now(),
        name,
        email,
        car,
        pickup,
        returnDate: ret,
        days,
        pricePerDay,
        total,
        pickedUp: false,
        returned: false,
        damageFee: 0,
        paid: false
    });

    localStorage.setItem("bookings", JSON.stringify(bookings));
    window.location.href = "bill.html";
});


//For loading form dropdowns
window.onload = () => {
    populateSelect("carType", carTypes, "Select Car");
    populateSelect("rentalPlace", rentalPlaces, "Select Pickup location");
    populateSelect("returnPlace", rentalPlaces, "Select Return location");
};

console.log("Binding .view-details buttons...");
console.log("Buttons found:", document.querySelectorAll(".view-details").length);

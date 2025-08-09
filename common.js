
const loggedIn = JSON.parse(localStorage.getItem("loginStatus"));

//Prevent booking access if not logged in
if (!loggedIn) {
  document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("#openCardModal, #cb-book-now, .view-details");
    buttons.forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        alert("You must be logged in to book a car.");
        window.location.href = "login.html";
      });
    });
  });
}

//Show Bills tab in navbar if user is logged in
document.addEventListener("DOMContentLoaded", () => {
  if (loggedIn) {
    const nav = document.querySelector("nav");
    if (nav && !document.querySelector("#bills-link")) {
      const billsLink = document.createElement("a");
      billsLink.href = "bill.html";
      billsLink.id = "bills-link";
      billsLink.textContent = "Bills";
      nav.appendChild(billsLink);
    }
  }
});

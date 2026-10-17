const dealerId = localStorage.getItem("dealerId");
const container = document.getElementById("listingsContainer");
const msg = document.getElementById("listingsMessage");

if (!dealerId) {
    msg.classList.add("error");
    msg.textContent = "Dealer ID missing. Please log in again.";
} else {
    loadListings();
}

async function loadListings() {
    msg.classList.remove("error");
    msg.textContent = "Loading your listings...";

    try {
        const response = await fetch(`http://localhost:3000/api/inventory/dealer/${dealerId}`);


        if (!response.ok) {
            msg.classList.add("error");
            msg.textContent = "Failed to load listings.";
            return;
        }

        const cars = await response.json();

        if (cars.length === 0) {
            msg.classList.remove("error");
            msg.textContent = "You have not added any cars yet.";
            return;
        }

        msg.textContent = "";

        container.innerHTML = cars.map(dealerCarCard).join("");

    } catch (error) {
        msg.classList.add("error");
        msg.textContent = "Could not connect to server.";
    }
}

function goBackToDashboard() {
    window.location.href = "dashboard.html";
}


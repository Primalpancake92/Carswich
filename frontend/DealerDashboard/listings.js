console.log("listings.js is running");

const dealerId = localStorage.getItem("dealerId");
const container = document.getElementById("listingsContainer");
const msg = document.getElementById("listingsMessage");

if (!dealerId) {
    msg.style.color = "red";
    msg.textContent = "Dealer ID missing. Please log in again.";
} else {
    loadListings();
}

async function loadListings() {
    msg.style.color = "blue";
    msg.textContent = "Loading your listings...";

    try {
        const response = await fetch(`http://localhost:3000/api/inventory/dealer/${dealerId}`);


        if (!response.ok) {
            msg.style.color = "red";
            msg.textContent = "Failed to load listings.";
            return;
        }

        const cars = await response.json();

        if (cars.length === 0) {
            msg.style.color = "black";
            msg.textContent = "You have not added any cars yet.";
            return;
        }

        msg.textContent = "";
        container.innerHTML = "";

        cars.forEach(car => {
            const card = document.createElement("div");
            card.classList.add("listing-card");

            card.innerHTML = `
                <h3>${car.make} ${car.model}</h3>
                <p><strong>Year:</strong> ${car.year}</p>
                <p><strong>Mileage:</strong> ${car.mileage} km</p>
                <p><strong>Colour:</strong> ${car.colour}</p>
                <p><strong>Price:</strong> $${car.price}</p>
                <p><strong>Status:</strong> ${car.isSold ? "Sold" : "Available"}</p>
                <p><strong>Description:</strong> ${car.description}</p>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        msg.style.color = "red";
        msg.textContent = "Could not connect to server.";
    }
}

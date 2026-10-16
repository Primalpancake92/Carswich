// Load dealer info
const dealerId = localStorage.getItem("dealerId");
const dealershipName = localStorage.getItem("dealerName");
const dealerFullName = localStorage.getItem("dealerFullName");
const dealerEmail = localStorage.getItem("dealerEmail");

// Redirect if not logged in
if (!dealerId) {
    window.location.href = "../Login/login.html";
}

// Fill profile panel
document.getElementById("dealerId").textContent = dealerId;
document.getElementById("dealerFullName").textContent = dealerFullName;
document.getElementById("dealershipName").textContent = dealershipName;
document.getElementById("dealerEmail").textContent = dealerEmail;

// Navbar name
document.getElementById("dealerNameNav").textContent = dealerFullName;

// Welcome message
document.getElementById("dealerFirstName").textContent = dealerFullName.split(" ")[0];

// Default stats (will be replaced with real data)
document.getElementById("dealerListingsCount").textContent = 0;
document.getElementById("dealerSoldCount").textContent = 0;
document.getElementById("dealerRevenue").textContent = "$0";

// Load real dashboard listings
async function loadDashboardListings() {
    try {
        const response = await fetch(`http://localhost:3000/api/inventory/dealer/${dealerId}`);

        if (!response.ok) {
            document.getElementById("dealerListingsGrid").innerHTML = "<p>Could not load listings.</p>";
            return;
        }

        const cars = await response.json();

        // Update listing count
        document.getElementById("dealerListingsCount").textContent = cars.length;

        // If no cars exist
        if (cars.length === 0) {
            document.getElementById("dealerListingsGrid").innerHTML = "<p>No listings yet.</p>";
            return;
        }

        // Show latest 3 cars
        const latest = cars.slice(-3).reverse();

        const grid = document.getElementById("dealerListingsGrid");
        grid.innerHTML = "";

        latest.forEach(car => {
            const card = document.createElement("div");
            card.classList.add("listing-card-small");

            card.innerHTML = `
                <h3>${car.make} ${car.model}</h3>
                <p><strong>Year:</strong> ${car.year}</p>
                <p><strong>Price:</strong> $${car.price}</p>
                <p><strong>Status:</strong> ${car.isSold ? "Sold" : "Available"}</p>
            `;

            grid.appendChild(card);
        });

    } catch (err) {
        document.getElementById("dealerListingsGrid").innerHTML = "<p>Could not connect to server.</p>";
    }
}

loadDashboardListings();

// Buttons
function goToAddCar() {
    window.location.href = "addcar.html";
}

function goToListings() {
    window.location.href = "listings.html";
}

function goToAccount() {
    window.location.href = "dealeraccount.html";
}




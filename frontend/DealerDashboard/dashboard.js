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

// Navbar name and avatar are filled by dealer-nav.js

// Welcome message
document.getElementById("dealerFirstName").textContent = dealerFullName.split(" ")[0];

// ---------- Your listings: GET /api/inventory/dealer/{dealerId} ----------

async function loadDashboardListings() {
    const grid = document.getElementById("dealerListingsGrid");

    try {
        const response = await fetch(`http://localhost:3000/api/inventory/dealer/${dealerId}`);

        if (!response.ok) {
            grid.innerHTML = '<p class="empty">Could not load listings.</p>';
            return;
        }

        const cars = await response.json();

        // Only cars that still have stock count as listings for sale
        document.getElementById("dealerListingsCount").textContent = cars.filter(isForSale).length;

        if (cars.length === 0) {
            grid.innerHTML = '<p class="empty">No listings yet.</p>';
            return;
        }

        // Show the latest 3 cars
        grid.innerHTML = cars.slice(-3).reverse().map(dealerCarCard).join("");
    } catch (err) {
        grid.innerHTML = '<p class="empty">Could not connect to server.</p>';
    }
}

// ---------- Cars sold and revenue: GET /api/dealers/{dealerId}/sales ----------

// Same route as the Sales history and Revenue tabs on the Account page,
// so these two cards always match those totals
async function loadSalesStats() {
    const sold = document.getElementById("dealerSoldCount");
    const revenue = document.getElementById("dealerRevenue");

    try {
        const response = await fetch(`http://localhost:3000/api/dealers/${dealerId}/sales`);

        if (!response.ok) {
            sold.textContent = "–";
            revenue.textContent = "–";
            return;
        }

        const sales = await response.json();

        sold.textContent = sales.length;
        revenue.textContent = dealerMoney.format(sales.reduce((sum, sale) => sum + sale.paidAmount, 0));
    } catch (err) {
        sold.textContent = "–";
        revenue.textContent = "–";
    }
}

loadDashboardListings();
loadSalesStats();

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




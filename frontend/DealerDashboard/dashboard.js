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

// Placeholder stats
document.getElementById("dealerListingsCount").textContent = 0;
document.getElementById("dealerSoldCount").textContent = 0;
document.getElementById("dealerRevenue").textContent = "$0";

// Placeholder listings
document.getElementById("dealerListingsGrid").innerHTML = `
    <p>No listings yet.</p>
`;

// Buttons
function goToAddCar() {
    window.location.href = "addcar.html";
}

function goToListings() {
    alert("Dealer Listings page coming soon.");
}

function goToAccount() {
    window.location.href = "../Account/account.html";
}



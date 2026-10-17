// Shared by every logged-in buyer page (Home, Browse, Car details, Purchase, Purchase history, Account).
// Load this before the page's own script. The background art is in background.js,
// the car picture in car-picture.js.
// Everything comes from the ASP.NET backend; the logged-in buyer is the one Login/login.js saved.

const API = "http://localhost:3000/api";

// The buyer saved by the login page
const buyerId = Number(localStorage.getItem("buyerId"));

// Buyer pages need a logged-in buyer
if (!buyerId) {
    window.location.href = "../Login/login.html";
}

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("en-US");

const el = id => document.getElementById(id);
const all = selector => document.querySelectorAll(selector);

// Escape text before putting it in innerHTML so listing text can't inject HTML
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(isoDate) {
    return new Date(isoDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

// ---------- The logged-in buyer ----------

// Starts with what the login page saved, so the navbar fills in straight away.
// loadCurrentUser() then swaps in the latest details and balance from the backend.
let currentUser = {
    userId: buyerId,
    userType: "Buyer",
    fullName: localStorage.getItem("buyerFullName") || "",
    email: localStorage.getItem("buyerEmail") || "",
    phoneNumber: localStorage.getItem("buyerPhone") || "",
    address: localStorage.getItem("buyerAddress") || "",
    balance: Number(localStorage.getItem("buyerBalance")) || 0,
};

// Fill every element marked data-user="field" with that field of the logged-in buyer
function renderUser() {
    const names = currentUser.fullName.trim().split(/\s+/).filter(Boolean);
    const values = {
        ...currentUser,
        firstName: names[0] || "",
        initials: names.map(part => part[0]).join("").slice(0, 2).toUpperCase(),
    };

    all("[data-user]").forEach(node => {
        node.textContent = values[node.dataset.user];
    });
}

// GET /api/buyers/{buyerId}: the latest details and balance (it changes after buying or adding funds)
async function loadCurrentUser() {
    try {
        const response = await fetch(`${API}/buyers/${buyerId}`);
        if (!response.ok) return currentUser;

        currentUser = await response.json();

        localStorage.setItem("buyerFullName", currentUser.fullName);
        localStorage.setItem("buyerEmail", currentUser.email);
        localStorage.setItem("buyerPhone", currentUser.phoneNumber);
        localStorage.setItem("buyerAddress", currentUser.address);
        localStorage.setItem("buyerBalance", currentUser.balance);

        renderUser();
    } catch (error) {
        console.error(error);
    }
    return currentUser;
}

// Pages that need the real balance wait for this (await userReady)
const userReady = loadCurrentUser();

// ---------- Dealers ----------

// Dealership name for each dealerId, from GET /api/dealers.
// Without the names the cards still show, just with "Private seller".
async function loadDealershipNames() {
    const names = {};
    try {
        const response = await fetch(`${API}/dealers`);
        if (response.ok) {
            (await response.json()).forEach(dealer => {
                names[dealer.userId] = dealer.dealershipName;
            });
        }
    } catch (error) {
        console.error(error);
    }
    return names;
}

// ---------- Car cards ----------

// Every Buy button on every page goes to the same Purchase page
function purchaseLink(carId) {
    return `../Purchase/purchase.html?id=${carId}`;
}

// The Buy button, greyed out and not clickable when the balance is below the price
function buyButton(car, label = "Buy") {
    if (currentUser.balance < car.price) {
        return `<button type="button" class="btn btn-primary" disabled
                    title="Not enough funds: you need ${money.format(car.price - currentUser.balance)} more">${label}</button>`;
    }
    return `<a href="${purchaseLink(car.carId)}" class="btn btn-primary">${label}</a>`;
}

function carCard(car, dealership = "Private seller") {
    return `
        <article class="car-card">
            <div class="car-image">${carPicture(car.colour)}</div>
            <div class="car-body">
                <h3 class="car-title">${car.year} ${escapeHtml(car.make)} ${escapeHtml(car.model)}</h3>
                <p class="car-dealer">${escapeHtml(dealership)}</p>
                <ul class="car-specs">
                    <li>${number.format(car.mileage)} km</li>
                    <li>${escapeHtml(car.colour)}</li>
                </ul>
                <p class="car-description">${escapeHtml(car.description)}</p>
                <div class="car-footer">
                    <div>
                        <p class="car-price">${money.format(car.price)}</p>
                        <p class="car-stock">${car.quantity} in stock</p>
                    </div>
                    ${buyButton(car)}
                </div>
            </div>
        </article>`;
}

// ---------- Messages ----------

let toastTimer;
function showToast(text, isError) {
    const toast = el("toast");
    toast.textContent = text;
    toast.classList.toggle("error", isError);
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

function showFormMessage(id, text, isError) {
    const message = el(id);
    message.textContent = text;
    message.classList.toggle("error", isError);
}

renderUser();

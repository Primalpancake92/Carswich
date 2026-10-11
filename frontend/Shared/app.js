// Shared by every logged-in page (Home, Browse, Account).
// Load this before the page's own script.

// TODO: replace this sample data with fetch() calls once the backend routes exist,
// e.g. GET /api/me, GET /api/cars, GET /api/dealers, GET /api/purchases.
// Field names match the C# models (camelCase, which is how ASP.NET sends JSON).
const sampleData = {
    // Who is logged in. See the ?as= switch below.
    currentUserId: 1,

    buyers: [
        { userId: 1, userType: "Buyer", fullName: "Alex Taylor", email: "alex@example.com", phoneNumber: "0412 345 678", address: "12 Harbour St, Sydney", balance: 45000 },
        { userId: 2, userType: "Buyer", fullName: "Sam Lee", email: "sam@example.com", phoneNumber: "0423 456 789", address: "4 Ocean Rd, Manly", balance: 30000 },
        { userId: 3, userType: "Buyer", fullName: "Priya Patel", email: "priya@example.com", phoneNumber: "0434 567 890", address: "88 King St, Newtown", balance: 52000 },
    ],

    dealers: [
        { userId: 10, userType: "Dealer", fullName: "Jordan Smith", dealershipName: "Harbour Motors", email: "jordan@harbourmotors.example", phoneNumber: "02 9555 1000", address: "200 Harbour St, Sydney", balance: 120000 },
        { userId: 11, userType: "Dealer", fullName: "Chris Wong", dealershipName: "Northside Autos", email: "chris@northside.example", phoneNumber: "02 9555 2000", address: "15 Pacific Hwy, Chatswood", balance: 85000 },
        { userId: 12, userType: "Dealer", fullName: "Taylor Brown", dealershipName: "Bluewater Cars", email: "taylor@bluewater.example", phoneNumber: "02 9555 3000", address: "7 Beach Rd, Bondi", balance: 64000 },
    ],

    cars: [
        { carId: 1, dealerId: 10, make: "Toyota", model: "Corolla", year: 2021, mileage: 32000, colour: "White", price: 21500, description: "One owner, full service history, very economical.", quantity: 2, isSold: false },
        { carId: 2, dealerId: 10, make: "Mazda", model: "CX-5", year: 2020, mileage: 48000, colour: "Red", price: 28900, description: "Roomy SUV with leather seats and reversing camera.", quantity: 1, isSold: false },
        { carId: 3, dealerId: 11, make: "Honda", model: "Civic", year: 2019, mileage: 61000, colour: "Blue", price: 17800, description: "Reliable hatchback, new tyres and brakes.", quantity: 3, isSold: false },
        { carId: 4, dealerId: 11, make: "Ford", model: "Ranger", year: 2022, mileage: 25000, colour: "Grey", price: 46500, description: "Dual cab ute with tow bar and tub liner.", quantity: 1, isSold: false },
        { carId: 5, dealerId: 12, make: "Hyundai", model: "i30", year: 2018, mileage: 74000, colour: "Silver", price: 13900, description: "Great first car, Apple CarPlay and Bluetooth.", quantity: 2, isSold: false },
        { carId: 6, dealerId: 12, make: "Tesla", model: "Model 3", year: 2023, mileage: 12000, colour: "Black", price: 52000, description: "Long range, autopilot, still under warranty.", quantity: 1, isSold: false },
        { carId: 7, dealerId: 10, make: "Toyota", model: "RAV4", year: 2022, mileage: 18000, colour: "Green", price: 39900, description: "Hybrid, excellent fuel economy, like new.", quantity: 0, isSold: true },
        { carId: 8, dealerId: 12, make: "Kia", model: "Picanto", year: 2017, mileage: 82000, colour: "Yellow", price: 8900, description: "Cheap to run city car.", quantity: 0, isSold: true },
    ],

    // Matches backend/Models/Purchase.cs: who bought which car from which dealer
    purchases: [
        { buyerId: 1, dealerId: 10, carId: 7, date: "2026-09-21", price: 39900 },
        { buyerId: 1, dealerId: 12, carId: 8, date: "2026-03-04", price: 8900 },
        { buyerId: 2, dealerId: 10, carId: 1, date: "2026-08-02", price: 21500 },
        { buyerId: 3, dealerId: 10, carId: 2, date: "2026-06-15", price: 28900 },
    ],
};

// Each page is a separate HTML file, so changes (buying, deposits, account edits)
// are kept in sessionStorage to carry over between pages until the backend exists.
const storageKey = "carswich-sample-data-v2";

function loadData() {
    try {
        const saved = sessionStorage.getItem(storageKey);
        if (saved) return JSON.parse(saved);
    } catch {
        // Storage blocked or data unreadable: fall back to the sample data
    }
    return structuredClone(sampleData);
}

function saveData() {
    try {
        sessionStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
        // Storage blocked: changes only last until the page is left
    }
}

const data = loadData();
const { buyers, dealers, cars, purchases } = data;

// Sample login: add ?as=dealer or ?as=buyer to any page's URL to switch who is logged in.
// The choice is saved, so it stays when moving between pages.
// TODO: use the user returned by the login route instead.
const switchTo = new URLSearchParams(location.search).get("as");
if (switchTo === "dealer" || switchTo === "buyer") {
    data.currentUserId = (switchTo === "dealer" ? dealers : buyers)[0].userId;
    saveData();
}

// The logged-in user: a Buyer or a Dealer (userType says which)
const currentUser = [...buyers, ...dealers].find(user => user.userId === data.currentUserId);
const isDealer = currentUser.userType === "Dealer";

// Colour names from the database mapped to a paint colour for the car picture
const paint = {
    white: "#f4f6f8", black: "#1f2933", red: "#d64545", blue: "#2b7bd6", grey: "#7b8794",
    silver: "#c1c7cd", green: "#3f9142", yellow: "#f0c419", orange: "#e8833a",
};

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("en-US");

const el = id => document.getElementById(id);
const all = selector => document.querySelectorAll(selector);

function buyerName(buyerId) {
    const buyer = buyers.find(b => b.userId === buyerId);
    return buyer ? buyer.fullName : "Unknown buyer";
}

function dealerName(dealerId) {
    const dealer = dealers.find(d => d.userId === dealerId);
    return dealer ? dealer.dealershipName : "Private seller";
}

// Escape text before putting it in innerHTML so listing text can't inject HTML
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(isoDate) {
    return new Date(isoDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

// Same car shape as the logo, painted in the car's colour
function carPicture(colour) {
    const fill = paint[colour.toLowerCase()] || "#2b7bd6";
    return `
        <svg viewBox="0 0 64 40" aria-hidden="true">
            <path d="M6 28 L10 17 Q12 12 18 12 L40 12 Q45 12 49 17 L54 22 Q60 23 60 28 L60 30 L6 30 Z" fill="${fill}" stroke="#0d3b66" stroke-width="0.6"/>
            <path d="M16 17 Q17 15 20 15 L29 15 L29 22 L13 22 Z M32 15 L39 15 Q43 15 46 19 L48 22 L32 22 Z" fill="#dbeeff"/>
            <circle cx="18" cy="30" r="6" fill="#0d3b66"/>
            <circle cx="18" cy="30" r="2.5" fill="#ffffff"/>
            <circle cx="48" cy="30" r="6" fill="#0d3b66"/>
            <circle cx="48" cy="30" r="2.5" fill="#ffffff"/>
        </svg>`;
}

// ---------- Background art ----------

// Same style as the landing page scene. Fixed behind the page so it fills the empty
// space at the sides and bottom; the white panels sit on top of it.
function renderBackground() {
    const car = (x, y, scale, body) => `
        <g transform="translate(${x} ${y}) scale(${scale})">
            <path d="M6 28 L10 17 Q12 12 18 12 L40 12 Q45 12 49 17 L54 22 Q60 23 60 28 L60 30 L6 30 Z" fill="${body}"/>
            <path d="M16 17 Q17 15 20 15 L29 15 L29 22 L13 22 Z M32 15 L39 15 Q43 15 46 19 L48 22 L32 22 Z" fill="#dbeeff"/>
            <circle cx="18" cy="30" r="6" fill="#0d3b66"/>
            <circle cx="18" cy="30" r="2.5" fill="#ffffff"/>
            <circle cx="48" cy="30" r="6" fill="#0d3b66"/>
            <circle cx="48" cy="30" r="2.5" fill="#ffffff"/>
        </g>`;

    const cloud = (x, y, size) => `
        <g transform="translate(${x} ${y}) scale(${size})">
            <ellipse cx="0" cy="0" rx="60" ry="18"/>
            <ellipse cx="-18" cy="-12" rx="30" ry="18"/>
            <ellipse cx="16" cy="-16" rx="36" ry="22"/>
        </g>`;

    document.body.insertAdjacentHTML("afterbegin", `
        <div class="page-art" aria-hidden="true">
            <!-- Sky: sun, clouds and birds, mostly at the sides where the page is empty -->
            <svg class="page-sky" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMin slice">
                <circle cx="1290" cy="190" r="64" fill="#b9dfff" opacity="0.8"/>
                <circle cx="1290" cy="190" r="92" fill="#b9dfff" opacity="0.25"/>
                <g fill="#ffffff" opacity="0.9">
                    ${cloud(150, 230, 1.2)}
                    ${cloud(90, 470, 0.8)}
                    ${cloud(1180, 330, 1)}
                    ${cloud(1350, 540, 0.75)}
                    ${cloud(720, 150, 0.6)}
                </g>
                <g fill="none" stroke="#7cc4fa" stroke-width="3" stroke-linecap="round">
                    <path d="M40 340 q8 -8 16 0 q8 -8 16 0"/>
                    <path d="M78 318 q6 -6 12 0 q6 -6 12 0"/>
                    <path d="M1360 420 q8 -8 16 0 q8 -8 16 0"/>
                </g>
            </svg>

            <!-- Ground: hills, trees and a road. The road is the bottom edge,
                 so it sits right on top of the footer. -->
            <svg class="page-ground" viewBox="0 0 1440 162" preserveAspectRatio="xMidYMax slice">
                <g fill="#7cc4fa">
                    <rect x="117" y="40" width="6" height="70"/>
                    <rect x="1297" y="30" width="6" height="80"/>
                    <rect x="1338" y="44" width="4" height="66"/>
                </g>
                <circle cx="120" cy="32" r="18" fill="#b9dfff"/>
                <circle cx="1300" cy="22" r="20" fill="#b9dfff"/>
                <circle cx="1340" cy="38" r="13" fill="#7cc4fa"/>

                <path d="M0 80 Q180 30 360 70 T720 60 T1080 55 T1440 50 V162 H0 Z" fill="#dbeeff"/>
                <path d="M0 115 Q240 85 480 108 T960 100 T1440 98 V162 H0 Z" fill="#b9dfff" opacity="0.7"/>

                <rect x="0" y="132" width="1440" height="30" fill="#7cc4fa" opacity="0.55"/>
                <line x1="0" y1="147" x2="1440" y2="147" stroke="#ffffff" stroke-width="3" stroke-dasharray="26 22"/>

                <g stroke="#7cc4fa" stroke-width="3" stroke-linecap="round">
                    <line x1="200" y1="128" x2="240" y2="128"/>
                    <line x1="190" y1="138" x2="236" y2="138"/>
                </g>
                ${car(240, 100, 1.2, "#2b7bd6")}
                ${car(1060, 104, 1.05, "#7cc4fa")}
            </svg>
        </div>`);
}

renderBackground();

// ---------- Rendering used on several pages ----------

// Fill every element marked data-user="field" with that field of the logged-in user
function renderUser() {
    const names = currentUser.fullName.trim().split(/\s+/);
    const values = {
        ...currentUser,
        firstName: names[0],
        initials: names.map(part => part[0]).join("").slice(0, 2).toUpperCase(),
    };

    all("[data-user]").forEach(node => {
        node.textContent = values[node.dataset.user];
    });
}

function availableCars() {
    return cars.filter(car => !car.isSold && car.quantity > 0);
}

// Fill every element marked data-stat="name" with that summary value
function renderStats() {
    const bought = purchaseHistory();
    const spent = bought.reduce((total, p) => total + p.price, 0);
    const earned = salesHistory().reduce((total, p) => total + p.price, 0);

    const values = {
        balance: money.format(currentUser.balance),
        available: number.format(availableCars().length),
        dealers: number.format(dealers.length),
        purchases: number.format(bought.length),
        spent: `${money.format(spent)} spent in total`,
        earned: `${money.format(earned)} earned in total`,
    };

    all("[data-stat]").forEach(node => {
        node.textContent = values[node.dataset.stat];
    });
}

function carCard(car) {
    const canAfford = currentUser.balance >= car.price;

    return `
        <article class="car-card">
            <div class="car-image">${carPicture(car.colour)}</div>
            <div class="car-body">
                <h3 class="car-title">${car.year} ${escapeHtml(car.make)} ${escapeHtml(car.model)}</h3>
                <p class="car-dealer">${escapeHtml(dealerName(car.dealerId))}</p>
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
                    <button type="button" class="btn btn-primary" data-car-id="${car.carId}"
                        ${canAfford ? "" : "disabled title=\"Not enough balance\""}>
                        Buy
                    </button>
                </div>
            </div>
        </article>`;
}

// Newest first, with each purchase's car attached
function withCars(list) {
    return [...list]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map(p => ({ ...p, car: cars.find(c => c.carId === p.carId) }));
}

// Cars the logged-in user has bought
function purchaseHistory() {
    return withCars(purchases.filter(p => p.buyerId === currentUser.userId));
}

// Cars the logged-in dealer has sold
function salesHistory() {
    return withCars(purchases.filter(p => p.dealerId === currentUser.userId));
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

// ---------- Buying ----------

// Mirrors Buyer.Buy() in backend/Models/Buyer.cs. Returns true if the car was bought.
// TODO: POST /api/buy with { carId } and use the response instead of changing local data.
function buyCar(carId) {
    const car = cars.find(c => c.carId === carId);

    if (currentUser.balance < car.price) {
        showToast("You don't have enough money to buy this car.", true);
        return false;
    }

    if (car.quantity <= 0) {
        showToast(`There is no stock for the ${car.make} ${car.model}.`, true);
        return false;
    }

    currentUser.balance -= car.price;
    car.quantity--;
    if (car.quantity === 0) car.isSold = true;

    purchases.push({
        buyerId: currentUser.userId,
        dealerId: car.dealerId,
        carId: car.carId,
        date: new Date().toISOString().slice(0, 10),
        price: car.price,
    });
    saveData();

    showToast(`You bought the ${car.year} ${car.make} ${car.model}!`, false);
    return true;
}

// One listener on the page handles every Buy button, even after re-rendering.
// afterBuy is the page's own function for redrawing what changed.
function listenForBuyClicks(afterBuy) {
    document.addEventListener("click", event => {
        const button = event.target.closest("button[data-car-id]");
        if (button && buyCar(Number(button.dataset.carId))) afterBuy();
    });
}

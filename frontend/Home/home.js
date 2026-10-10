// TODO: replace this sample data with fetch() calls once the backend routes exist,
// e.g. GET /api/me, GET /api/cars, GET /api/dealers, GET /api/purchases.
// Field names match the C# models (camelCase, which is how ASP.NET sends JSON).
const buyer = {
    userId: 1,
    userType: "Buyer",
    fullName: "Alex Taylor",
    email: "alex@example.com",
    phoneNumber: "0412 345 678",
    address: "12 Harbour St, Sydney",
    balance: 45000,
};

const dealers = [
    { userId: 10, dealershipName: "Harbour Motors" },
    { userId: 11, dealershipName: "Northside Autos" },
    { userId: 12, dealershipName: "Bluewater Cars" },
];

const cars = [
    { carId: 1, dealerId: 10, make: "Toyota", model: "Corolla", year: 2021, mileage: 32000, colour: "White", price: 21500, description: "One owner, full service history, very economical.", quantity: 2, isSold: false },
    { carId: 2, dealerId: 10, make: "Mazda", model: "CX-5", year: 2020, mileage: 48000, colour: "Red", price: 28900, description: "Roomy SUV with leather seats and reversing camera.", quantity: 1, isSold: false },
    { carId: 3, dealerId: 11, make: "Honda", model: "Civic", year: 2019, mileage: 61000, colour: "Blue", price: 17800, description: "Reliable hatchback, new tyres and brakes.", quantity: 3, isSold: false },
    { carId: 4, dealerId: 11, make: "Ford", model: "Ranger", year: 2022, mileage: 25000, colour: "Grey", price: 46500, description: "Dual cab ute with tow bar and tub liner.", quantity: 1, isSold: false },
    { carId: 5, dealerId: 12, make: "Hyundai", model: "i30", year: 2018, mileage: 74000, colour: "Silver", price: 13900, description: "Great first car, Apple CarPlay and Bluetooth.", quantity: 2, isSold: false },
    { carId: 6, dealerId: 12, make: "Tesla", model: "Model 3", year: 2023, mileage: 12000, colour: "Black", price: 52000, description: "Long range, autopilot, still under warranty.", quantity: 1, isSold: false },
    { carId: 7, dealerId: 10, make: "Toyota", model: "RAV4", year: 2022, mileage: 18000, colour: "Green", price: 39900, description: "Hybrid, excellent fuel economy, like new.", quantity: 0, isSold: true },
    { carId: 8, dealerId: 12, make: "Kia", model: "Picanto", year: 2017, mileage: 82000, colour: "Yellow", price: 8900, description: "Cheap to run city car.", quantity: 0, isSold: true },
];

const purchases = [
    { carId: 7, date: "2026-09-21", price: 39900 },
    { carId: 8, date: "2026-03-04", price: 8900 },
];

// Colour names from the database mapped to a paint colour for the car picture
const paint = {
    white: "#f4f6f8", black: "#1f2933", red: "#d64545", blue: "#2b7bd6", grey: "#7b8794",
    silver: "#c1c7cd", green: "#3f9142", yellow: "#f0c419", orange: "#e8833a",
};

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("en-US");

const el = id => document.getElementById(id);
const all = selector => document.querySelectorAll(selector);

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

// ---------- Side menu: show one panel at a time ----------

const panels = [...all(".panel-view")].map(panel => panel.dataset.panel);

function showPanel() {
    const name = location.hash.slice(1);
    const current = panels.includes(name) ? name : "dashboard";

    all(".panel-view").forEach(panel => {
        panel.hidden = panel.dataset.panel !== current;
    });

    all(".side-link").forEach(link => {
        const isCurrent = link.getAttribute("href") === `#${current}`;
        link.classList.toggle("active", isCurrent);
        if (isCurrent) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
    });

    window.scrollTo({ top: 0 });
}

// Like a tiny client-side router: the hash in the URL picks the panel,
// so the back button and refreshing both work
window.addEventListener("hashchange", showPanel);

// ---------- Rendering ----------

// Fill every element marked data-user="field" with that field of the buyer
function renderUser() {
    const names = buyer.fullName.trim().split(/\s+/);
    const values = {
        ...buyer,
        firstName: names[0],
        initials: names.map(part => part[0]).join("").slice(0, 2).toUpperCase(),
    };

    all("[data-user]").forEach(node => {
        node.textContent = values[node.dataset.user];
    });
}

function renderStats() {
    const forSale = cars.filter(car => !car.isSold && car.quantity > 0);
    const spent = purchases.reduce((total, p) => total + p.price, 0);

    const values = {
        balance: money.format(buyer.balance),
        available: number.format(forSale.length),
        dealers: number.format(dealers.length),
        purchases: number.format(purchases.length),
        spent: `${money.format(spent)} spent in total`,
    };

    all("[data-stat]").forEach(node => {
        node.textContent = values[node.dataset.stat];
    });
}

function carCard(car) {
    const canAfford = buyer.balance >= car.price;

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

function availableCars() {
    return cars.filter(car => !car.isSold && car.quantity > 0);
}

function filteredCars() {
    const search = el("search").value.trim().toLowerCase();
    const make = el("make").value;
    const maxPrice = Number(el("max-price").value) || Infinity;
    const sort = el("sort").value;

    const results = availableCars().filter(car => {
        if (make && car.make !== make) return false;
        if (car.price > maxPrice) return false;

        const text = `${car.make} ${car.model} ${car.colour}`.toLowerCase();
        return text.includes(search);
    });

    const sorters = {
        "newest": (a, b) => b.year - a.year,
        "price-asc": (a, b) => a.price - b.price,
        "price-desc": (a, b) => b.price - a.price,
        "mileage": (a, b) => a.mileage - b.mileage,
    };

    return results.sort(sorters[sort]);
}

function fillMakeFilter() {
    const makes = [...new Set(cars.map(car => car.make))].sort();
    const select = el("make");

    makes.forEach(make => {
        const option = document.createElement("option");
        option.value = make;
        option.textContent = make;
        select.appendChild(option);
    });
}

function renderFeatured() {
    const newest = availableCars().sort((a, b) => b.year - a.year).slice(0, 3);
    el("featured-grid").innerHTML = newest.map(carCard).join("");
}

function renderCars() {
    const results = filteredCars();

    el("results-count").textContent = `${results.length} car${results.length === 1 ? "" : "s"}`;
    el("no-results").hidden = results.length > 0;
    el("car-grid").innerHTML = results.map(carCard).join("");
}

// Purchases newest first, with their car attached
function purchaseHistory() {
    return [...purchases]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map(p => ({ ...p, car: cars.find(c => c.carId === p.carId) }));
}

function renderPurchases() {
    const history = purchaseHistory();

    all("[data-empty='purchases']").forEach(node => {
        node.hidden = history.length > 0;
    });

    // Full table in the Purchase history panel
    el("purchase-rows").innerHTML = history.map(({ car, date, price }) => `
        <tr>
            <td>${car.year} ${escapeHtml(car.make)} ${escapeHtml(car.model)}</td>
            <td>${escapeHtml(dealerName(car.dealerId))}</td>
            <td>${number.format(car.mileage)} km</td>
            <td>${formatDate(date)}</td>
            <td class="num">${money.format(price)}</td>
        </tr>`).join("");

    // Short list in the right-hand column
    el("history-list").innerHTML = history.slice(0, 5).map(({ car, date, price }) => `
        <li>
            <span class="history-icon">${carPicture(car.colour)}</span>
            <div class="history-text">
                <p class="history-car">${car.year} ${escapeHtml(car.make)} ${escapeHtml(car.model)}</p>
                <p class="history-meta">${formatDate(date)} · ${escapeHtml(dealerName(car.dealerId))}</p>
            </div>
            <p class="history-price">${money.format(price)}</p>
        </li>`).join("");
}

function fillAccountForm() {
    const form = el("account-form");
    ["fullName", "email", "phoneNumber", "address"].forEach(field => {
        form[field].value = buyer[field];
    });
}

function renderAll() {
    renderUser();
    renderStats();
    renderFeatured();
    renderCars();
    renderPurchases();
}

// ---------- Actions ----------

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

// Mirrors Buyer.Buy() in backend/Models/Buyer.cs.
// TODO: POST /api/buy with { carId } and use the response instead of changing local data.
function buyCar(carId) {
    const car = cars.find(c => c.carId === carId);

    if (buyer.balance < car.price) {
        showToast("You don't have enough money to buy this car.", true);
        return;
    }

    if (car.quantity <= 0) {
        showToast(`There is no stock for the ${car.make} ${car.model}.`, true);
        return;
    }

    buyer.balance -= car.price;
    car.quantity--;
    if (car.quantity === 0) car.isSold = true;

    purchases.push({ carId: car.carId, date: new Date().toISOString().slice(0, 10), price: car.price });

    showToast(`You bought the ${car.year} ${car.make} ${car.model}!`, false);
    renderAll();
}

// One listener on the page handles every Buy button, even after re-rendering
document.addEventListener("click", event => {
    const button = event.target.closest("button[data-car-id]");
    if (button) buyCar(Number(button.dataset.carId));
});

el("filters").addEventListener("input", renderCars);
el("filters").addEventListener("submit", event => event.preventDefault());

// Same rule as Dealer.BalanceDeposit(): amount must be greater than 0.
// TODO: POST /api/wallet/deposit with { amount } once the route exists.
el("deposit-form").addEventListener("submit", event => {
    event.preventDefault();

    const input = el("deposit-amount");
    const amount = Number(input.value);

    if (!amount || amount <= 0) {
        showFormMessage("deposit-message", "Enter an amount greater than $0.", true);
        return;
    }

    buyer.balance += amount;
    input.value = "";
    showFormMessage("deposit-message", `Added ${money.format(amount)} to your balance.`, false);
    renderAll();
});

// TODO: PUT /api/me with the updated fields once the route exists.
el("account-form").addEventListener("submit", event => {
    event.preventDefault();

    const form = event.target;
    const data = {
        fullName: form.fullName.value.trim(),
        email: form.email.value.trim(),
        phoneNumber: form.phoneNumber.value.trim(),
        address: form.address.value.trim(),
    };

    if (!data.fullName || !data.email || !data.phoneNumber || !data.address) {
        showFormMessage("account-message", "Please fill in all fields.", true);
        return;
    }

    if (!form.email.checkValidity()) {
        showFormMessage("account-message", "Please enter a valid email address.", true);
        return;
    }

    Object.assign(buyer, data);
    showFormMessage("account-message", "Your details have been saved.", false);
    renderUser();
});

fillMakeFilter();
fillAccountForm();
renderAll();
showPanel();

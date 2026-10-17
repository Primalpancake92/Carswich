// Purchase page: the one place every Buy button leads to (Browse, Dashboard, Car details).
// Shows the car and an order summary with the buyer's real balance, then POST /api/buy.

// API and buyerId come from ../Shared/app.js

let selectedCar = null;
let buyer = null;


async function loadPurchasePage() {
    const carId = new URLSearchParams(window.location.search).get("id");

    if (!carId) {
        showPurchaseError("Purchase unavailable", "No car was selected.");
        return;
    }

    // Cancel and Back go to this car's details page
    el("back-link").href = `../CarDetails/car-details.html?id=${carId}`;
    el("back-link").textContent = "← Back to car details";

    if (!buyerId) {
        showPurchaseError("Log in to buy", "You need to be logged in as a buyer to buy a car.",
            `<a href="../Login/login.html" class="btn btn-primary">Log in</a>`);
        return;
    }

    try {
        const [carResponse, buyerResponse, dealersResponse] = await Promise.all([
            fetch(`${API}/cars/${carId}`),
            fetch(`${API}/buyers/${buyerId}`),
            fetch(`${API}/dealers`),
        ]);

        if (!carResponse.ok) {
            showPurchaseError("Car unavailable", "This car could not be found or has already sold out.");
            return;
        }

        if (!buyerResponse.ok) {
            showPurchaseError("Log in to buy", "Your buyer account could not be found. Please log in again.",
                `<a href="../Login/login.html" class="btn btn-primary">Log in</a>`);
            return;
        }

        selectedCar = await carResponse.json();
        buyer = await buyerResponse.json();

        const dealers = dealersResponse.ok ? await dealersResponse.json() : [];
        const dealer = dealers.find(d => d.userId === selectedCar.dealerId);
        selectedCar.dealershipName = dealer ? dealer.dealershipName : "Private seller";

        renderPurchase();
    } catch (error) {
        console.error(error);
        showPurchaseError("Purchase unavailable", "Could not connect to the server.");
    }
}


function renderPurchase() {
    const car = selectedCar;
    const after = buyer.balance - car.price;
    const canAfford = after >= 0;

    el("purchase-panel").innerHTML = `
        <div class="panel-header">
            <h1>Confirm purchase</h1>
        </div>

        <div class="purchase-grid">
            <!-- Left: the car -->
            <div class="purchase-car">
                <div class="purchase-image">${carPicture(car.colour)}</div>
                <h2>${car.year} ${escapeHtml(car.make)} ${escapeHtml(car.model)}</h2>
                <p class="car-dealer">${escapeHtml(car.dealershipName)}</p>
                <ul class="car-specs">
                    <li>${number.format(car.mileage)} km</li>
                    <li>${escapeHtml(car.colour)}</li>
                    <li>${car.quantity} in stock</li>
                </ul>
                <p class="car-description">${escapeHtml(car.description)}</p>
            </div>

            <!-- Right: what the buyer pays and has left -->
            <div class="order-summary">
                <h2>Order summary</h2>
                <dl>
                    <div>
                        <dt>Car price</dt>
                        <dd>${money.format(car.price)}</dd>
                    </div>
                    <div>
                        <dt>Your balance</dt>
                        <dd>${money.format(buyer.balance)}</dd>
                    </div>
                    <div class="order-total${canAfford ? "" : " short"}">
                        <dt>Balance after purchase</dt>
                        <dd>${money.format(after)}</dd>
                    </div>
                </dl>

                <p class="form-message${canAfford ? "" : " error"}" id="purchase-message">
                    ${canAfford ? "" : `You need ${money.format(-after)} more. <a href="../Account/account.html?car=${car.carId}#wallet" class="text-link">Add funds</a>`}
                </p>

                <div class="purchase-actions">
                    <button type="button" class="btn btn-primary" id="confirm-purchase" ${canAfford ? "" : "disabled"}>
                        Buy for ${money.format(car.price)}
                    </button>
                    <a href="../CarDetails/car-details.html?id=${car.carId}" class="btn btn-secondary">Cancel</a>
                </div>
            </div>
        </div>
    `;

    el("confirm-purchase").addEventListener("click", purchaseCar);
}


async function purchaseCar() {
    const button = el("confirm-purchase");

    button.disabled = true;
    button.textContent = "Processing...";

    try {
        const response = await fetch(`${API}/buy`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ buyerId, carId: selectedCar.carId })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Purchase failed.");
        }

        localStorage.setItem("buyerBalance", result.buyerBalance);

        // Saved first, so the confirmation still shows if the page reloads, even several times
        // (VS Code Live Server reloads when the backend writes its database files).
        // redirectAt is a fixed time, so the countdown keeps going across reloads.
        const purchase = {
            carId: selectedCar.carId,
            car: `${selectedCar.year} ${selectedCar.make} ${selectedCar.model}`,
            colour: selectedCar.colour,
            dealershipName: selectedCar.dealershipName,
            paid: selectedCar.price,
            balance: result.buyerBalance,
            redirectAt: Date.now() + redirectSeconds * 1000,
        };
        sessionStorage.setItem(lastPurchaseKey, JSON.stringify(purchase));

        showPurchaseSuccess(purchase);
    } catch (error) {
        console.error(error);
        showFormMessage("purchase-message", error.message, true);

        button.disabled = false;
        button.textContent = `Buy for ${money.format(selectedCar.price)}`;
    }
}


// The purchase that just went through. Kept until the buyer closes the modal or leaves the page,
// so a reload (or several) shows the confirmation again instead of the checkout.
const lastPurchaseKey = "carswich-last-purchase";

// After buying, go to Purchase history automatically after this many seconds
const redirectSeconds = 5;
const historyPage = "../PurchaseHistory/purchase-history.html";

function readLastPurchase() {
    try {
        return JSON.parse(sessionStorage.getItem(lastPurchaseKey));
    } catch {
        return null;
    }
}

function forgetLastPurchase() {
    sessionStorage.removeItem(lastPurchaseKey);
}

let redirectTimer;

// "Taking you to your purchase history in 5s", counting down to purchase.redirectAt
function startRedirect(purchase) {
    clearInterval(redirectTimer);

    const tick = () => {
        const secondsLeft = Math.ceil((purchase.redirectAt - Date.now()) / 1000);

        if (secondsLeft <= 0) {
            clearInterval(redirectTimer);
            forgetLastPurchase();
            window.location.href = historyPage;
            return;
        }

        el("modal-redirect").textContent =
            `Taking you to your purchase history in ${secondsLeft} second${secondsLeft === 1 ? "" : "s"}...`;
    };

    tick();
    redirectTimer = setInterval(tick, 250);
}

// Success: a summary in the panel, and the confirmation modal on top of it
function showPurchaseSuccess(purchase) {
    el("back-link").hidden = true;

    el("purchase-panel").innerHTML = `
        <div class="purchase-result">
            <span class="result-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M5 12.5 L10 17.5 L19 7"/></svg>
            </span>
            <h1>You bought the ${escapeHtml(purchase.car)}!</h1>
            <p class="muted">You paid ${money.format(purchase.paid)} to ${escapeHtml(purchase.dealershipName)}.
                Your balance is now ${money.format(purchase.balance)}.</p>
            <div class="purchase-actions">
                <a href="${historyPage}" class="btn btn-primary">View purchase history</a>
                <a href="../Browse/browse.html" class="btn btn-secondary">Keep browsing</a>
            </div>
        </div>
    `;

    el("modal-car").innerHTML = `${carPicture(purchase.colour)}<span>You bought the ${escapeHtml(purchase.car)}</span>`;
    el("modal-dealer").textContent = purchase.dealershipName;
    el("modal-paid").textContent = money.format(purchase.paid);
    el("modal-balance").textContent = money.format(purchase.balance);

    const modal = el("purchase-modal");
    if (!modal.open) modal.showModal();

    startRedirect(purchase);
}

// Closing the modal (×, Escape or the backdrop) stays on this page and stops the redirect
el("purchase-modal").addEventListener("close", () => {
    clearInterval(redirectTimer);
    forgetLastPurchase();
});

el("modal-close").addEventListener("click", () => el("purchase-modal").close());

el("purchase-modal").addEventListener("click", event => {
    if (event.target === event.currentTarget) event.currentTarget.close();
});

// Leaving through any link: the confirmation has done its job
document.addEventListener("click", event => {
    if (event.target.closest("a[href]") && readLastPurchase()) forgetLastPurchase();
});


function showPurchaseError(title, message, action) {
    el("purchase-panel").innerHTML = `
        <div class="purchase-result">
            <h1>${escapeHtml(title)}</h1>
            <p class="muted">${escapeHtml(message)}</p>
            <div class="purchase-actions">
                ${action || ""}
                <a href="../Browse/browse.html" class="btn ${action ? "btn-secondary" : "btn-primary"}">Back to Browse</a>
            </div>
        </div>
    `;
}


renderUser();

// Just bought this car (and the page reloaded)? Show the confirmation instead of the checkout
const justBought = readLastPurchase();
const pageCarId = Number(new URLSearchParams(window.location.search).get("id"));

// Only a purchase from the last couple of minutes counts, in case one was never cleared
if (justBought && justBought.carId === pageCarId && Date.now() - justBought.redirectAt < 2 * 60 * 1000) {
    showPurchaseSuccess(justBought);
} else {
    loadPurchasePage();
}

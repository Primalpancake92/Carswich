// Temporary until login is connected to the real backend user
const testBuyerId = 2;

let selectedCar = null;


async function loadPurchasePage() {
    const params = new URLSearchParams(window.location.search);
    const carId = params.get("id");

    if (!carId) {
        showPurchaseError("No car was selected.");
        return;
    }

    try {
        const response =
            await fetch(`http://localhost:3000/api/cars/${carId}`);

        if (!response.ok) {
            throw new Error("Car could not be found.");
        }

        selectedCar = await response.json();

        renderPurchase(selectedCar);

    } catch (error) {
        console.error(error);
        showPurchaseError(
            "This car could not be loaded or is no longer available."
        );
    }
}


function renderPurchase(car) {
    const panel = el("purchase-panel");

    panel.innerHTML = `
        <h1>Confirm purchase</h1>

        <div class="purchase-car">

            <div class="purchase-image">
                ${carPicture(car.colour)}
            </div>

            <div>
                <h2>
                    ${car.year}
                    ${escapeHtml(car.make)}
                    ${escapeHtml(car.model)}
                </h2>

                <p>
                    ${number.format(car.mileage)} km ·
                    ${escapeHtml(car.colour)}
                </p>

                <p class="purchase-price">
                    ${money.format(car.price)}
                </p>
            </div>

        </div>

        <div class="purchase-summary">
            <p><strong>Price:</strong> ${money.format(car.price)}</p>
            <p><strong>Stock available:</strong> ${car.quantity}</p>
        </div>

        <p>
            Please confirm that you want to purchase this car.
        </p>

        <div class="purchase-actions">

            <button
                type="button"
                class="btn btn-primary"
                id="confirm-purchase">
                Confirm purchase
            </button>

            <a href="../Browse/browse.html"
               class="btn btn-secondary">
                Cancel
            </a>

        </div>
    `;

    el("confirm-purchase")
        .addEventListener("click", purchaseCar);
}


async function purchaseCar() {
    const button = el("confirm-purchase");

    button.disabled = true;
    button.textContent = "Processing...";

    try {
        const response = await fetch(
            "http://localhost:3000/api/buy",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    buyerId: testBuyerId,
                    carId: selectedCar.carId
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Purchase failed."
            );
        }

        showToast(
            "Car purchased successfully!",
            false
        );

        button.textContent = "Purchase complete";

        setTimeout(() => {
            window.location.href =
                "../Browse/browse.html";
        }, 1500);

    } catch (error) {
        console.error(error);

        showToast(error.message, true);

        button.disabled = false;
        button.textContent = "Confirm purchase";
    }
}


function showPurchaseError(message) {
    el("purchase-panel").innerHTML = `
        <h2>Purchase unavailable</h2>

        <p>${escapeHtml(message)}</p>

        <a href="../Browse/browse.html"
           class="btn btn-primary">
            Back to Browse
        </a>
    `;
}


renderUser();
loadPurchasePage();
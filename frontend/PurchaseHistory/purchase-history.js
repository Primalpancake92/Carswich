// API and buyerId (the buyer saved by the login page) come from ../Shared/app.js


async function loadPurchaseHistory() {
    if (!buyerId) {
        el("purchase-list").innerHTML = `
            <p class="error-message">
                <a href="../Login/login.html" class="text-link">Log in</a> as a buyer to see your purchases.
            </p>
        `;
        return;
    }

    try {
        const response = await fetch(
            `${API}/buyers/${buyerId}/purchases`
        );

        if (!response.ok) {
            throw new Error("Could not load purchase history.");
        }

        const purchases = await response.json();

        renderPurchaseHistory(purchases);

    } catch (error) {
        console.error(error);

        el("purchase-list").innerHTML = `
            <p class="error-message">
                Purchase history could not be loaded.
            </p>
        `;
    }
}


function renderPurchaseHistory(purchases) {

    el("history-count").textContent =
        `${purchases.length} purchase${purchases.length === 1 ? "" : "s"}`;

    if (purchases.length === 0) {
        el("purchase-list").innerHTML = "";
        el("no-purchases").hidden = false;
        return;
    }

    el("no-purchases").hidden = true;

    el("purchase-list").innerHTML =
        purchases.map(purchase => {

            const car = purchase.car;
            const dealer = purchase.dealer;

            return `
                <article class="purchase-card">

                    <div class="purchase-image">
                        ${carPicture(car.colour)}
                    </div>

                    <div class="purchase-info">

                        <h2>
                            ${car.year}
                            ${escapeHtml(car.make)}
                            ${escapeHtml(car.model)}
                        </h2>

                        <p class="dealer-name">
                            ${escapeHtml(dealer.dealershipName)}
                        </p>

                        <div class="purchase-details">

                            <p>
                                <strong>Mileage:</strong>
                                ${number.format(car.mileage)} km
                            </p>

                            <p>
                                <strong>Colour:</strong>
                                ${escapeHtml(car.colour)}
                            </p>

                            <p>
                                <strong>Purchase date:</strong>
                                ${formatDate(purchase.purchaseDate)}
                            </p>

                            <p>
                                <strong>Purchase ID:</strong>
                                #${purchase.purchaseId}
                            </p>

                        </div>

                    </div>

                    <div class="purchase-price">
                        ${money.format(purchase.paidAmount)}
                    </div>

                </article>
            `;
        }).join("");
}


renderUser();
loadPurchaseHistory();
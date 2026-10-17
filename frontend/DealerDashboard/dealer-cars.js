// Car cards for the dealer pages (Dashboard and Your listings).
// Same look as the buyer car cards (carCard() in ../Shared/app.js), but with the
// stock and sale status instead of a Buy button. Needs ../Shared/car-picture.js.

const dealerMoney = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const dealerNumber = new Intl.NumberFormat("en-US");

// Escape text before putting it in innerHTML so listing text can't inject HTML
function escapeDealerText(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// A car is for sale while it still has stock
function isForSale(car) {
    return !car.isSold && car.quantity > 0;
}

function dealerCarCard(car) {
    const forSale = isForSale(car);

    return `
        <article class="car-card">
            <div class="car-image">${carPicture(car.colour)}</div>
            <div class="car-body">
                <h3 class="car-title">${car.year} ${escapeDealerText(car.make)} ${escapeDealerText(car.model)}</h3>
                <ul class="car-specs">
                    <li>${dealerNumber.format(car.mileage)} km</li>
                    <li>${escapeDealerText(car.colour)}</li>
                </ul>
                <p class="car-description">${escapeDealerText(car.description)}</p>
                <div class="car-footer">
                    <div>
                        <p class="car-price">${dealerMoney.format(car.price)}</p>
                        <p class="car-stock">${car.quantity} in stock</p>
                    </div>
                    <span class="car-status${forSale ? "" : " sold"}">${forSale ? "For sale" : "Sold out"}</span>
                </div>
            </div>
        </article>`;
}

// Dashboard page. Data and shared helpers come from ../Shared/app.js.

function renderFeatured() {
    const newest = availableCars().sort((a, b) => b.year - a.year).slice(0, 3);
    el("featured-grid").innerHTML = newest.map(carCard).join("");
}

// Every purchase, newest first, in the right-hand column (the list scrolls)
function renderHistory() {
    const history = purchaseHistory();

    el("no-history").hidden = history.length > 0;
    el("history-list").innerHTML = history.map(({ car, date, price }) => `
        <li>
            <span class="history-icon">${carPicture(car.colour)}</span>
            <div class="history-text">
                <p class="history-car">${car.year} ${escapeHtml(car.make)} ${escapeHtml(car.model)}</p>
                <p class="history-meta">${formatDate(date)} · ${escapeHtml(dealerName(car.dealerId))}</p>
            </div>
            <p class="history-price">${money.format(price)}</p>
        </li>`).join("");
}

function renderPage() {
    renderUser();
    renderStats();
    renderFeatured();
    renderHistory();
}

listenForBuyClicks(renderPage);
renderPage();

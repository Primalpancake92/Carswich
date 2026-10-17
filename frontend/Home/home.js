// Dashboard page. Shared helpers and the logged-in buyer come from ../Shared/app.js.
// Data: GET /api/cars, GET /api/dealers and GET /api/buyers/{buyerId}/purchases.

// Fill every element marked data-stat="name" with that summary value
function renderStats(values) {
    all("[data-stat]").forEach(node => {
        if (node.dataset.stat in values) node.textContent = values[node.dataset.stat];
    });
}

// Newest three cars for sale (the backend already sorts them newest first)
function renderFeatured(cars, dealershipNames) {
    el("featured-grid").innerHTML = cars.length
        ? cars.slice(0, 3).map(car => carCard(car, dealershipNames[car.dealerId] || "Private seller")).join("")
        : '<p class="empty">No cars are for sale right now.</p>';
}

// Every purchase, newest first, in the right-hand column (the list scrolls)
function renderHistory(purchases) {
    el("no-history").hidden = purchases.length > 0;
    el("history-list").innerHTML = purchases.map(({ car, dealer, purchaseDate, paidAmount }) => `
        <li>
            <span class="history-icon">${carPicture(car.colour)}</span>
            <div class="history-text">
                <p class="history-car">${car.year} ${escapeHtml(car.make)} ${escapeHtml(car.model)}</p>
                <p class="history-meta">${formatDate(purchaseDate)} · ${escapeHtml(dealer.dealershipName)}</p>
            </div>
            <p class="history-price">${money.format(paidAmount)}</p>
        </li>`).join("");
}

// Each list falls back to empty if its route fails, so one problem doesn't blank the whole page
async function getList(url) {
    try {
        const response = await fetch(url);
        return response.ok ? await response.json() : [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function loadDashboard() {
    const [cars, dealershipNames, purchases] = await Promise.all([
        getList(`${API}/cars`),
        loadDealershipNames(),
        getList(`${API}/buyers/${buyerId}/purchases`),
        userReady,
    ]);

    const spent = purchases.reduce((total, p) => total + p.paidAmount, 0);

    renderStats({
        balance: money.format(currentUser.balance),
        available: number.format(cars.length),
        dealers: number.format(Object.keys(dealershipNames).length),
        purchases: number.format(purchases.length),
        spent: `${money.format(spent)} spent in total`,
    });

    renderFeatured(cars, dealershipNames);
    renderHistory(purchases);
}

loadDashboard();

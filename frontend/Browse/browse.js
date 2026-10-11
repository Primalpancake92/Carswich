// Browse cars page. Data and shared helpers come from ../Shared/app.js.

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

function renderCars() {
    const results = filteredCars();

    el("results-count").textContent = `${results.length} car${results.length === 1 ? "" : "s"}`;
    el("no-results").hidden = results.length > 0;
    el("car-grid").innerHTML = results.map(carCard).join("");
}

function renderPage() {
    renderUser();
    renderCars();
}

el("filters").addEventListener("input", renderCars);
el("filters").addEventListener("submit", event => event.preventDefault());
listenForBuyClicks(renderPage);

fillMakeFilter();
renderPage();

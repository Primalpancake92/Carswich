// Browse cars page.
// Cars are loaded from the ASP.NET backend.

let browseCars = [];

// Get cars from the backend
async function loadCars() {
    try {
        const response = await fetch("http://localhost:3000/api/cars");

        if (!response.ok) {
            throw new Error("Could not load cars.");
        }

        browseCars = await response.json();

        fillMakeFilter();
        renderPage();
    } catch (error) {
        console.error(error);

        el("results-count").textContent = "Could not load cars";
        el("no-results").hidden = false;
        el("no-results").textContent =
            "There was a problem loading cars from the server.";
    }
}


function filteredCars() {
    const search = el("search").value.trim().toLowerCase();
    const make = el("make").value;
    const maxPrice = Number(el("max-price").value) || Infinity;
    const sort = el("sort").value;

    const results = browseCars.filter(car => {
        if (make && car.make !== make) {
            return false;
        }

        if (car.price > maxPrice) {
            return false;
        }

        const text =
            `${car.make} ${car.model} ${car.colour}`.toLowerCase();

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
    const makes = [...new Set(
        browseCars.map(car => car.make)
    )].sort();

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

    el("results-count").textContent =
        `${results.length} car${results.length === 1 ? "" : "s"}`;

    el("no-results").hidden = results.length > 0;

    el("car-grid").innerHTML =
        results.map(carCard).join("");
}


function renderPage() {
    renderUser();
    renderCars();
}


el("filters").addEventListener("input", renderCars);

el("filters").addEventListener("submit", event => {
    event.preventDefault();
});


// Load cars when the page opens
loadCars();
// Car Details page

async function loadCarDetails() {

    const params = new URLSearchParams(window.location.search);

    const carId = params.get("id");

    if (!carId) {
        showError("No car was selected.");
        return;
    }

    try {

        const response =
            await fetch(`http://localhost:3000/api/cars/${carId}`);

        if (!response.ok) {
            throw new Error("Car could not be found.");
        }

        const car = await response.json();

        renderCar(car);

    } catch (error) {

        console.error(error);

        showError(
            "This car could not be loaded or is no longer available."
        );
    }
}


function renderCar(car) {

    const container = el("car-details");

    container.innerHTML = `
        <div class="details-image">
            ${carPicture(car.colour)}
        </div>

        <div class="details-content">

            <h1>
                ${car.year}
                ${escapeHtml(car.make)}
                ${escapeHtml(car.model)}
            </h1>

            <p class="details-price">
                ${money.format(car.price)}
            </p>

            <dl class="details-specs">

                <div>
                    <dt>Make</dt>
                    <dd>${escapeHtml(car.make)}</dd>
                </div>

                <div>
                    <dt>Model</dt>
                    <dd>${escapeHtml(car.model)}</dd>
                </div>

                <div>
                    <dt>Year</dt>
                    <dd>${car.year}</dd>
                </div>

                <div>
                    <dt>Mileage</dt>
                    <dd>${number.format(car.mileage)} km</dd>
                </div>

                <div>
                    <dt>Colour</dt>
                    <dd>${escapeHtml(car.colour)}</dd>
                </div>

                <div>
                    <dt>Stock</dt>
                    <dd>${car.quantity}</dd>
                </div>

            </dl>

            <h2>Description</h2>

            <p>
                ${escapeHtml(car.description)}
            </p>

            <button
                type="button"
                class="btn btn-primary"
                id="buy-button"
                data-car-id="${car.carId}">
                Buy this car
            </button>

        </div>
    `;
}


function showError(message) {

    el("car-details").innerHTML = `
        <div class="error-message">
            <h2>Car unavailable</h2>
            <p>${escapeHtml(message)}</p>

            <a href="../Browse/browse.html"
               class="btn btn-primary">
                Back to Browse
            </a>
        </div>
    `;
}


renderUser();

loadCarDetails();
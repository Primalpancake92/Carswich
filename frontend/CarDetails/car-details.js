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
            await fetch(`${API}/cars/${carId}`);

        if (!response.ok) {
            throw new Error("Car could not be found.");
        }

        const car = await response.json();

        // Dealership name, and the balance that decides whether Buy is greyed out
        const [dealershipNames] = await Promise.all([loadDealershipNames(), userReady]);
        car.dealershipName = dealershipNames[car.dealerId] || "Private seller";

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

            <p class="car-dealer">
                ${escapeHtml(car.dealershipName)}
            </p>

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

            ${buyButton(car, `Buy for ${money.format(car.price)}`)}

            ${currentUser.balance < car.price
                ? `<p class="form-message error">You need ${money.format(car.price - currentUser.balance)} more.
                       <a href="../Account/account.html?car=${car.carId}#wallet" class="text-link">Add funds</a></p>`
                : ""}

        </div>
    `;
}


function showError(message) {

    el("car-details").innerHTML = `
        <div class="error-message">
            <h2>Car unavailable</h2>
            <p class="muted">${escapeHtml(message)}</p>

            <a href="../Browse/browse.html"
               class="btn btn-primary">
                Back to Browse
            </a>
        </div>
    `;
}


renderUser();

loadCarDetails();
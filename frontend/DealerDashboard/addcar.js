console.log("addcar.js is running");

document.getElementById("addCarForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const msg = document.getElementById("addCarMessage");
    msg.classList.remove("error");
    msg.textContent = "Submitting car details...";

    const dealerId = localStorage.getItem("dealerId");

    if (!dealerId) {
        msg.classList.add("error");
        msg.textContent = "Dealer ID missing. Please log in again.";
        return;
    }

    const carData = {
        make: document.getElementById("make").value,
        model: document.getElementById("model").value,
        year: parseInt(document.getElementById("year").value),
        mileage: parseInt(document.getElementById("mileage").value),
        colour: document.getElementById("colour").value,
        price: parseFloat(document.getElementById("price").value),
        description: document.getElementById("description").value,
        dealerId: parseInt(dealerId)
    };

    try {
        const response = await fetch("http://localhost:3000/api/cars/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(carData)
        });

        if (response.ok) {
            msg.classList.remove("error");
            msg.textContent = "Car added successfully!";
        } else {
            const data = await response.json();
            msg.classList.add("error");
            msg.textContent = data.message || "Failed to add car.";
        }
    } catch (error) {
        msg.classList.add("error");
        msg.textContent = "Could not connect to server.";
    }
});

function goBackToDashboard() {
    window.location.href = "dashboard.html";
}




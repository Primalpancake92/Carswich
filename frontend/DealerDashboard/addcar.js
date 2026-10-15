document.getElementById("addCarForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const dealerId = localStorage.getItem("dealerId");

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

    const response = await fetch("https://localhost:7074/api/cars/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carData)
    });

    const data = await response.json();

    const msg = document.getElementById("addCarMessage");

    if (response.ok) {
        msg.style.color = "green";
        msg.textContent = "Car added successfully!";
    } else {
        msg.style.color = "red";
        msg.textContent = data.message || "Failed to add car.";
    }
});


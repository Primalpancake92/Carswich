const form = document.getElementById("register-form");
const message = document.getElementById("form-message");

// Show / hide the password fields
document.querySelectorAll(".toggle-password").forEach(button => {
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.target);
        const hidden = input.type === "password";
        input.type = hidden ? "text" : "password";
        button.textContent = hidden ? "Hide" : "Show";
    });
});

// Dealership name only applies to dealers
const dealershipGroup = document.getElementById("dealership-group");

function isDealer() {
    return form.accountType.value === "dealer";
}

function updateDealershipField() {
    dealershipGroup.hidden = !isDealer();
    form.dealershipName.required = isDealer();
}

form.querySelectorAll("input[name='accountType']").forEach(radio => {
    radio.addEventListener("change", updateDealershipField);
});

// The browser can remember "dealer" when you come back to the page
updateDealershipField();

function showMessage(text, isError) {
    message.textContent = text;
    message.classList.toggle("error", isError);
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const data = {
        accountType: form.accountType.value,
        fullName: form.fullName.value.trim(),
        email: form.email.value.trim(),
        phoneNumber: form.phoneNumber.value.trim(),
        address: form.address.value.trim(),
        password: form.password.value,
    };

    // Matches Dealer.DealershipName in backend/Models/Dealer.cs
    if (isDealer()) {
        data.dealershipName = form.dealershipName.value.trim();
    }

    if (!data.fullName || !data.email || !data.phoneNumber || !data.address || !data.password) {
        showMessage("Please fill in all fields.", true);
        return;
    }

    if (isDealer() && !data.dealershipName) {
        showMessage("Please enter your dealership name.", true);
        return;
    }

    if (!form.email.checkValidity()) {
        showMessage("Please enter a valid email address.", true);
        return;
    }

    if (data.password.length < 8) {
        showMessage("Password must be at least 8 characters.", true);
        return;
    }

    if (data.password !== form.confirmPassword.value) {
        showMessage("Passwords don't match.", true);
        return;
    }

    // TODO: send data to the backend once the register API route exists
    //showMessage("Registration isn't connected to the backend yet.", false);
    
    // send registration data to backend (no other changes required)
    fetch(`http://localhost:3000/api/${data.accountType}s/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(async res => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
            showMessage(body.message || body.error || "Registration failed.", true);
            return;
        }
        showMessage("Registration successful. Redirecting to login…", false);
        setTimeout(() => window.location.href = "../Login/login.html", 900);
    })
    .catch(err => {
        console.error("Registration error:", err);
        showMessage("Network error. Make sure the backend is running.", true);
    });
});
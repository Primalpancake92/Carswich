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

const submitButton = form.querySelector("button[type='submit']");

form.addEventListener("submit", async event => {
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

    // TODO: call the dealer register route once it exists
    if (isDealer()) {
        showMessage("Dealer registration isn't available yet.", true);
        return;
    }

    // POST /api/buyers/register (backend/Routes/Buyer/BuyerRegRoute.cs).
    // Sends the fields of BuyerRegisterRequest; accountType and confirmPassword stay here.
    submitButton.disabled = true;
    showMessage("Creating your account…", false);

    const result = await postJson("/api/buyers/register", {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        password: data.password,
    });

    if (!result.ok) {
        showMessage(errorMessage(result), true);
        submitButton.disabled = false;
        return;
    }

    // The new account is logged in straight away
    saveUser(result.data, false);
    showMessage("Account created!", false);
    location.href = "../Home/home.html";
});

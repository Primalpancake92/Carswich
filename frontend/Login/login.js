const form = document.getElementById("login-form");
const message = document.getElementById("form-message");

// Show / hide the password
document.querySelectorAll(".toggle-password").forEach(button => {
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.target);
        const hidden = input.type === "password";
        input.type = hidden ? "text" : "password";
        button.textContent = hidden ? "Hide" : "Show";
    });
});

// Buyer / Dealer switch: keep the button text in step with the selected account type
const loginButton = document.getElementById("login-button");

function updateLoginButton() {
    loginButton.textContent = `Log in as a ${form.accountType.value}`;
}

form.querySelectorAll("input[name='accountType']").forEach(radio => {
    radio.addEventListener("change", updateLoginButton);
});

// The browser can remember "dealer" when you come back to the page
updateLoginButton();

function showMessage(text, isError) {
    message.textContent = text;
    message.classList.toggle("error", isError);
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    const accountType = form.accountType.value;   // "buyer" or "dealer"
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
        showMessage("Please enter your email and password.", true);
        return;
    }

    if (!form.email.checkValidity()) {
        showMessage("Please enter a valid email address.", true);
        return;
    }

    // TODO: call the dealer login route once it exists
    if (accountType === "dealer") {
        showMessage("Dealer login isn't available yet.", true);
        return;
    }

    // POST /api/buyers/login (backend/Routes/Buyer/BuyerAuthRoute.cs)
    loginButton.disabled = true;
    showMessage("Logging in…", false);

    const result = await postJson("/api/buyers/login", { email, password });

    if (!result.ok) {
        showMessage(errorMessage(result), true);
        loginButton.disabled = false;
        return;
    }

    saveUser(result.data, form.remember.checked);
    showMessage(`Welcome back, ${result.data.fullName}!`, false);
    location.href = "../Home/home.html";
});

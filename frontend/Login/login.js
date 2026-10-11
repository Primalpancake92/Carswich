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

form.addEventListener("submit", event => {
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

    // TODO: send { accountType, email, password } to the backend once the login API route exists
    showMessage(`${accountType === "dealer" ? "Dealer" : "Buyer"} login isn't connected to the backend yet.`, false);
});

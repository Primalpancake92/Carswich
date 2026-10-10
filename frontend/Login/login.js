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

function showMessage(text, isError) {
    message.textContent = text;
    message.classList.toggle("error", isError);
}

form.addEventListener("submit", event => {
    event.preventDefault();

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

    // TODO: send { email, password } to the backend once the login API route exists
    showMessage("Login isn't connected to the backend yet.", false);
});

// Talking to the C# backend, and remembering who is logged in.
// Used by Login, Register and every logged-in page (load it before their own script).

// Where the backend runs (backend/Properties/launchSettings.json)
const API_URL = "http://localhost:3000";

// The logged-in user is saved under this key. Shared/app.js reads it on the other pages.
const USER_KEY = "carswich-user";

// POST a JSON body to the backend. Never throws: always gives back { ok, status, data }.
// status is 0 when the request got no answer at all (backend not running, or CORS blocked it).
async function postJson(path, body) {
    try {
        const response = await fetch(`${API_URL}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await response.json().catch(() => null);
        return { ok: response.ok, status: response.status, data };
    } catch {
        return { ok: false, status: 0, data: null };
    }
}

// One line of text for the form, from any failed postJson result
function errorMessage(result) {
    if (result.status === 0) {
        return "Can't reach the server. Make sure the backend is running.";
    }

    const data = result.data;

    // Our routes send { message } (BuyerErrorResponse)
    if (data?.message) return data.message;

    // Validation failures send { errors: { Email: ["..."], Password: ["..."] } }
    if (data?.errors) return Object.values(data.errors).flat().join(" ");

    return "Something went wrong. Please try again.";
}

// Save the user from a login or register response (BuyerResponse).
// remember: keep them logged in after the browser is closed.
function saveUser(response, remember) {
    const { message, ...user } = response;

    try {
        clearUser();
        (remember ? localStorage : sessionStorage).setItem(USER_KEY, JSON.stringify(user));
    } catch {
        // Storage blocked: the user won't stay logged in between pages
    }
}

function loadUser() {
    try {
        const saved = sessionStorage.getItem(USER_KEY) ?? localStorage.getItem(USER_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

function clearUser() {
    try {
        sessionStorage.removeItem(USER_KEY);
        localStorage.removeItem(USER_KEY);
    } catch {
        // Storage blocked: nothing was saved
    }
}

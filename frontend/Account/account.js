// Account page: Account details, Purchase history and Wallet tabs for the logged-in buyer.
// Shared helpers (el, all, money, escapeHtml, showFormMessage...) come from ../Shared/app.js.
// The data comes from the backend: GET/PUT /api/buyers/{id}, GET /api/buyers/{id}/purchases
// and POST /api/buyers/deposit.

// buyerId (the buyer saved by the login page) comes from ../Shared/app.js,
// which also sends visitors who aren't logged in to the login page
const api = `${API}/buyers`;

// ---------- Tabs: show one section at a time ----------

const tabs = [...all("[data-tab]")].map(section => section.dataset.tab);

// Like a tiny client-side router: the hash in the URL picks the tab,
// so links like account.html#wallet, the back button and refreshing all work
function showTab() {
    const name = location.hash.slice(1);
    const current = tabs.includes(name) ? name : "details";

    all("[data-tab]").forEach(section => {
        section.hidden = section.dataset.tab !== current;
    });

    all(".tab-link").forEach(link => {
        if (link.getAttribute("href") === `#${current}`) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
    });
}

window.addEventListener("hashchange", showTab);

// ---------- The logged-in buyer ----------

let buyer = null;

// Fill the navbar, side card and Wallet balance, and remember the details for other pages
function showBuyer() {
    const names = buyer.fullName.trim().split(/\s+/);
    const values = {
        ...buyer,
        firstName: names[0],
        initials: names.map(part => part[0]).join("").slice(0, 2).toUpperCase(),
    };

    all("[data-user]").forEach(node => {
        node.textContent = values[node.dataset.user];
    });

    el("wallet-balance").textContent = money.format(buyer.balance);

    localStorage.setItem("buyerFullName", buyer.fullName);
    localStorage.setItem("buyerEmail", buyer.email);
    localStorage.setItem("buyerPhone", buyer.phoneNumber);
    localStorage.setItem("buyerAddress", buyer.address);
    localStorage.setItem("buyerBalance", buyer.balance);
}

async function loadBuyer() {
    try {
        const response = await fetch(`${api}/${buyerId}`);
        const data = await response.json();

        if (!response.ok) {
            showFormMessage("account-message", data.message, true);
            return;
        }

        buyer = data;
        showBuyer();
        fillAccountForm();
    } catch (err) {
        showFormMessage("account-message", "Could not connect to server.", true);
        showFormMessage("deposit-message", "Could not connect to server.", true);
    }
}

// ---------- Account details ----------

const accountFields = ["fullName", "email", "phoneNumber", "address"];

function fillAccountForm() {
    const form = el("account-form");
    accountFields.forEach(field => {
        form[field].value = buyer[field];
    });
}

el("account-form").addEventListener("submit", async event => {
    event.preventDefault();

    const form = event.target;
    const changes = {
        fullName: form.fullName.value.trim(),
        email: form.email.value.trim(),
        phoneNumber: form.phoneNumber.value.trim(),
        address: form.address.value.trim(),
    };

    if (accountFields.some(field => !changes[field])) {
        showFormMessage("account-message", "Please fill in all fields.", true);
        return;
    }

    if (!form.email.checkValidity()) {
        showFormMessage("account-message", "Please enter a valid email address.", true);
        return;
    }

    try {
        const response = await fetch(`${api}/${buyerId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(changes)
        });

        const data = await response.json();

        if (!response.ok) {
            showFormMessage("account-message", data.message || "Could not save your details.", true);
            return;
        }

        buyer = data;
        showBuyer();
        fillAccountForm();
        showFormMessage("account-message", "Your details have been saved.", false);
    } catch (err) {
        showFormMessage("account-message", "Could not connect to server.", true);
    }
});

// ---------- Purchase history ----------

async function loadPurchases() {
    try {
        const response = await fetch(`${api}/${buyerId}/purchases`);

        if (!response.ok) {
            el("no-purchases").textContent = "Could not load your purchases.";
            el("no-purchases").hidden = false;
            return;
        }

        const purchases = await response.json();
        const spent = purchases.reduce((total, p) => total + p.paidAmount, 0);

        el("history-total").textContent = `${money.format(spent)} spent in total`;
        el("no-purchases").hidden = purchases.length > 0;
        el("purchase-rows").innerHTML = purchases.map(({ car, dealer, purchaseDate, paidAmount }) => `
            <tr>
                <td>${car.year} ${escapeHtml(car.make)} ${escapeHtml(car.model)}</td>
                <td>${escapeHtml(dealer.dealershipName)}</td>
                <td>${number.format(car.mileage)} km</td>
                <td>${formatDate(purchaseDate)}</td>
                <td class="num">${money.format(paidAmount)}</td>
            </tr>`).join("");
    } catch (err) {
        el("no-purchases").textContent = "Could not connect to server.";
        el("no-purchases").hidden = false;
    }
}

// ---------- Wallet ----------

// − and + buttons change the amount by their data-step, never going below 0
all(".stepper-btn").forEach(button => {
    button.addEventListener("click", () => {
        const input = el("deposit-amount");
        const amount = (Number(input.value) || 0) + Number(button.dataset.step);
        input.value = Math.max(0, amount);
        input.focus();
    });
});

// Came here from "Add funds" on the Purchase page: offer a way back to that car
const returnCarId = new URLSearchParams(location.search).get("car");

// Same rule as Buyer.BalanceDeposit(): amount must be greater than 0 (the backend checks it too)
el("deposit-form").addEventListener("submit", async event => {
    event.preventDefault();

    const input = el("deposit-amount");
    const button = event.target.querySelector("button[type='submit']");
    const amount = Number(input.value);

    if (!amount || amount <= 0) {
        showFormMessage("deposit-message", "Enter an amount greater than $0.", true);
        return;
    }

    button.disabled = true;

    try {
        const response = await fetch(`${api}/deposit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ buyerId, amount })
        });

        const data = await response.json();

        if (!response.ok) {
            showFormMessage("deposit-message", data.message || "Could not add funds.", true);
            return;
        }

        buyer.balance = data.balance;
        showBuyer();

        input.value = "";
        showFormMessage("deposit-message", `Added ${money.format(amount)} to your balance.`, false);

        if (returnCarId) {
            el("deposit-message").insertAdjacentHTML("beforeend",
                ` <a href="../Purchase/purchase.html?id=${encodeURIComponent(returnCarId)}" class="text-link">Continue to your purchase</a>`);
        }
    } catch (err) {
        showFormMessage("deposit-message", "Could not connect to server.", true);
    } finally {
        button.disabled = false;
    }
});

showTab();
loadBuyer();
loadPurchases();

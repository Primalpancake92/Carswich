// Account page: Account details, Purchase history and Wallet tabs.
// Data and shared helpers come from ../Shared/app.js.

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

// ---------- Account details ----------

const accountFields = ["fullName", "email", "phoneNumber", "address"];

function fillAccountForm() {
    const form = el("account-form");
    accountFields.forEach(field => {
        form[field].value = buyer[field];
    });
}

// TODO: PUT /api/me with the updated fields once the route exists.
el("account-form").addEventListener("submit", event => {
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

    Object.assign(buyer, changes);
    saveData();

    showFormMessage("account-message", "Your details have been saved.", false);
    renderUser();
});

// ---------- Purchase history ----------

function renderPurchases() {
    const history = purchaseHistory();

    el("no-purchases").hidden = history.length > 0;
    el("purchase-rows").innerHTML = history.map(({ car, date, price }) => `
        <tr>
            <td>${car.year} ${escapeHtml(car.make)} ${escapeHtml(car.model)}</td>
            <td>${escapeHtml(dealerName(car.dealerId))}</td>
            <td>${number.format(car.mileage)} km</td>
            <td>${formatDate(date)}</td>
            <td class="num">${money.format(price)}</td>
        </tr>`).join("");
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

// Same rule as Dealer.BalanceDeposit(): amount must be greater than 0.
// TODO: POST /api/wallet/deposit with { amount } once the route exists.
el("deposit-form").addEventListener("submit", event => {
    event.preventDefault();

    const input = el("deposit-amount");
    const amount = Number(input.value);

    if (!amount || amount <= 0) {
        showFormMessage("deposit-message", "Enter an amount greater than $0.", true);
        return;
    }

    buyer.balance += amount;
    saveData();

    input.value = "";
    showFormMessage("deposit-message", `Added ${money.format(amount)} to your balance.`, false);
    renderStats();
});

renderUser();
renderStats();
fillAccountForm();
renderPurchases();
showTab();

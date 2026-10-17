// Dealer Account page: Account details, Sales history and Revenue tabs.
// Same layout as the buyer Account page (../Account/account.html), but the data
// comes from the backend: GET/PUT /api/dealers/{id} and GET /api/dealers/{id}/sales.

const api = "http://localhost:3000/api/dealers";
const dealerId = localStorage.getItem("dealerId");

// Redirect if not logged in
if (!dealerId) {
    window.location.href = "../Login/login.html";
}

const el = id => document.getElementById(id);
const all = selector => document.querySelectorAll(selector);

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("en-US");

// Escape text before putting it in innerHTML so listing text can't inject HTML
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(date) {
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function showFormMessage(id, text, isError) {
    const message = el(id);
    message.textContent = text;
    message.classList.toggle("error", isError);
}

function carsSold(count) {
    return `${count} ${count === 1 ? "car" : "cars"} sold`;
}

el("dealerId").textContent = dealerId;

// ---------- Tabs: show one section at a time ----------

const tabs = [...all("[data-tab]")].map(section => section.dataset.tab);

// The hash in the URL picks the tab, so dealeraccount.html#revenue, the back button and refreshing all work
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
showTab();

// ---------- Account details ----------

const accountFields = ["fullName", "dealershipName", "email", "phoneNumber", "address"];

function fillAccountForm(dealer) {
    const form = el("account-form");
    accountFields.forEach(field => {
        form[field].value = dealer[field];
    });
}

// Keep the navbar and the rest of the dealer pages in step with the saved details
function rememberDealer(dealer) {
    localStorage.setItem("dealerFullName", dealer.fullName);
    localStorage.setItem("dealerName", dealer.dealershipName);
    localStorage.setItem("dealerEmail", dealer.email);

    const initials = dealer.fullName.split(" ").filter(Boolean).map(part => part[0]).join("").slice(0, 2).toUpperCase();
    all('[data-dealer="fullName"]').forEach(node => node.textContent = dealer.fullName);
    all('[data-dealer="initials"]').forEach(node => node.textContent = initials);
}

async function loadDealer() {
    try {
        const response = await fetch(`${api}/${dealerId}`);
        const data = await response.json();

        if (!response.ok) {
            showFormMessage("account-message", data.message, true);
            return;
        }

        fillAccountForm(data);
        rememberDealer(data);
    } catch (err) {
        showFormMessage("account-message", "Could not connect to server.", true);
    }
}

el("account-form").addEventListener("submit", async event => {
    event.preventDefault();

    const form = event.target;
    const changes = {};
    accountFields.forEach(field => {
        changes[field] = form[field].value.trim();
    });

    if (accountFields.some(field => !changes[field])) {
        showFormMessage("account-message", "Please fill in all fields.", true);
        return;
    }

    if (!form.email.checkValidity()) {
        showFormMessage("account-message", "Please enter a valid email address.", true);
        return;
    }

    try {
        const response = await fetch(`${api}/${dealerId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(changes)
        });

        const data = await response.json();

        if (!response.ok) {
            showFormMessage("account-message", data.message || "Could not save your details.", true);
            return;
        }

        rememberDealer(data);
        showFormMessage("account-message", "Your details have been saved.", false);
    } catch (err) {
        showFormMessage("account-message", "Could not connect to server.", true);
    }
});

// ---------- Sales history ----------

let sales = [];

function renderSales() {
    const total = sales.reduce((sum, sale) => sum + sale.paidAmount, 0);
    el("sales-total").textContent = `${carsSold(sales.length)} · ${money.format(total)} earned`;

    el("no-sales").hidden = sales.length > 0;
    el("sales-rows").innerHTML = sales.map(({ car, buyer, date, paidAmount }) => `
        <tr>
            <td>${car.year} ${escapeHtml(car.make)} ${escapeHtml(car.model)}</td>
            <td>${escapeHtml(buyer.fullName)}</td>
            <td>${number.format(car.mileage)} km</td>
            <td>${formatDate(date)}</td>
            <td class="num">${money.format(paidAmount)}</td>
        </tr>`).join("");
}

// ---------- Revenue ----------

// The start of the day, week (Monday), month or year that a date falls in
function startOf(period, date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (period === "week") d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    if (period === "month") d.setDate(1);
    if (period === "year") d.setMonth(0, 1);
    return d;
}

// Move a period start back or forward by a number of periods
function shift(period, date, steps) {
    const d = new Date(date);
    if (period === "day") d.setDate(d.getDate() + steps);
    if (period === "week") d.setDate(d.getDate() + steps * 7);
    if (period === "month") d.setMonth(d.getMonth() + steps);
    if (period === "year") d.setFullYear(d.getFullYear() + steps);
    return d;
}

// How many bars each view shows, the words for "this one" and "the one before",
// and how each bar is labelled on the axis and in the tooltip / table
const periods = {
    day: {
        count: 14, current: "Today", previous: "Yesterday", title: "Revenue per day (last 14 days)", column: "Day",
        axis: d => d.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
        full: d => d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
    },
    week: {
        count: 12, current: "This week", previous: "Last week", title: "Revenue per week (last 12 weeks)", column: "Week starting",
        axis: d => d.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
        full: d => `Week of ${d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`,
    },
    month: {
        count: 12, current: "This month", previous: "Last month", title: "Revenue per month (last 12 months)", column: "Month",
        axis: d => d.toLocaleDateString("en-US", { month: "short" }),
        full: d => d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    },
    year: {
        count: 5, current: "This year", previous: "Last year", title: "Revenue per year (last 5 years)", column: "Year",
        axis: d => String(d.getFullYear()),
        full: d => String(d.getFullYear()),
    },
};

// One bucket per bar, oldest first: { start, revenue, count }
function buckets(period) {
    const now = startOf(period, new Date());
    const list = [];
    for (let i = periods[period].count - 1; i >= 0; i--) {
        list.push({ start: shift(period, now, -i), revenue: 0, count: 0 });
    }

    sales.forEach(sale => {
        const start = startOf(period, sale.date).getTime();
        const bucket = list.find(b => b.start.getTime() === start);
        if (bucket) {
            bucket.revenue += sale.paidAmount;
            bucket.count++;
        }
    });

    return list;
}

// Round the top of the axis up to 1, 2 or 5 times a power of ten, so gridlines land on round numbers
function niceMax(value) {
    if (value <= 0) return 1000;
    const power = 10 ** Math.floor(Math.log10(value));
    const step = [1, 2, 5, 10].find(s => s * power >= value);
    return step * power;
}

const compactMoney = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });

let period = "day";

function renderRevenue() {
    const info = periods[period];
    const list = buckets(period);
    const current = list[list.length - 1];
    const previous = list[list.length - 2];
    const total = sales.reduce((sum, sale) => sum + sale.paidAmount, 0);

    all(".period-switch button").forEach(button => {
        button.setAttribute("aria-pressed", button.dataset.period === period);
    });

    // Summary tiles
    el("current-label").textContent = info.current;
    el("current-revenue").textContent = money.format(current.revenue);
    el("current-sales").textContent = carsSold(current.count);
    el("previous-label").textContent = info.previous;
    el("previous-revenue").textContent = money.format(previous.revenue);
    el("previous-sales").textContent = carsSold(previous.count);
    el("total-revenue").textContent = money.format(total);
    el("total-sales").textContent = carsSold(sales.length);

    // Bar chart: gridlines at quarters of a round maximum, one column per bucket
    const max = niceMax(Math.max(...list.map(b => b.revenue)));
    const gridlines = [0, 0.25, 0.5, 0.75, 1].map(f => `
        <div class="chart-gridline" style="bottom: ${f * 100}%"><span>${compactMoney.format(max * f)}</span></div>`).join("");

    const columns = list.map((b, i) => `
        <button type="button" class="chart-column${i % 2 ? " odd" : ""}" data-index="${i}"
                aria-label="${info.full(b.start)}: ${money.format(b.revenue)}, ${carsSold(b.count)}">
            <span class="chart-plot"><span class="chart-bar" style="height: ${(b.revenue / max) * 100}%"></span></span>
            <span class="chart-label">${info.axis(b.start)}</span>
        </button>`).join("");

    el("chart-title").textContent = info.title;
    el("revenue-chart").innerHTML = `<div class="chart-grid">${gridlines}</div><div class="chart-columns">${columns}</div>`;
    el("chart-tooltip").hidden = true;

    // Hover or focus a column to see its exact numbers
    all(".chart-column").forEach(column => {
        const show = () => {
            const b = list[column.dataset.index];
            const tooltip = el("chart-tooltip");
            tooltip.innerHTML = `<strong>${info.full(b.start)}</strong>${money.format(b.revenue)} · ${carsSold(b.count)}`;
            tooltip.hidden = false;

            // Centre the tooltip over the column, kept inside the panel
            const panel = column.closest(".card-panel").getBoundingClientRect();
            const box = column.getBoundingClientRect();
            const width = tooltip.offsetWidth;
            const left = Math.min(Math.max(box.left + box.width / 2 - width / 2, panel.left + 8), panel.right - width - 8);
            tooltip.style.left = `${left - panel.left}px`;
            tooltip.style.top = `${box.top - panel.top - tooltip.offsetHeight + 8}px`;
        };
        column.addEventListener("mouseenter", show);
        column.addEventListener("focus", show);
        column.addEventListener("mouseleave", () => el("chart-tooltip").hidden = true);
        column.addEventListener("blur", () => el("chart-tooltip").hidden = true);
    });

    // Same numbers as a table, newest first
    el("table-period").textContent = info.column;
    el("revenue-rows").innerHTML = [...list].reverse().map(b => `
        <tr>
            <td>${info.full(b.start)}</td>
            <td class="num">${b.count}</td>
            <td class="num">${money.format(b.revenue)}</td>
        </tr>`).join("");
}

all(".period-switch button").forEach(button => {
    button.addEventListener("click", () => {
        period = button.dataset.period;
        renderRevenue();
    });
});

async function loadSales() {
    try {
        const response = await fetch(`${api}/${dealerId}/sales`);

        if (!response.ok) {
            el("no-sales").textContent = "Could not load your sales.";
            el("no-sales").hidden = false;
            return;
        }

        // Turn the date strings into Date objects once, so the revenue maths can use them
        sales = (await response.json()).map(sale => ({ ...sale, date: new Date(sale.purchaseDate) }));
    } catch (err) {
        el("no-sales").textContent = "Could not connect to server.";
        el("no-sales").hidden = false;
    }

    renderSales();
    renderRevenue();
}

loadDealer();
loadSales();

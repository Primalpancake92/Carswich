// Load dealer info
const dealerId = localStorage.getItem("dealerId");
const dealershipName = localStorage.getItem("dealerName");
const dealerFullName = localStorage.getItem("dealerFullName");
const dealerEmail = localStorage.getItem("dealerEmail");

// Redirect if not logged in
if (!dealerId) {
    window.location.href = "../Login/login.html";
}

// Fill page fields
document.getElementById("dealerId").textContent = dealerId;
document.getElementById("dealerFullName").textContent = dealerFullName;
document.getElementById("dealershipName").textContent = dealershipName;
document.getElementById("dealerEmail").textContent = dealerEmail;

// Back button
function goBack() {
    window.location.href = "dashboard.html";
}

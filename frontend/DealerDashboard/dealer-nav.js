// Shared by every dealer page: fills the navbar name and avatar from the logged-in dealer
(function () {
    const fullName = localStorage.getItem("dealerFullName") || "";
    const initials = fullName.split(" ").filter(Boolean).map(part => part[0]).join("").slice(0, 2).toUpperCase();

    document.querySelectorAll('[data-dealer="fullName"]').forEach(node => node.textContent = fullName);
    document.querySelectorAll('[data-dealer="initials"]').forEach(node => node.textContent = initials);

    // Log out: forget the dealer before going back to the landing page
    document.querySelectorAll(".nav-logout").forEach(link => {
        link.addEventListener("click", () => {
            ["dealerId", "dealerName", "dealerFullName", "dealerEmail"].forEach(key => localStorage.removeItem(key));
        });
    });
})();

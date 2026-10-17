// Background art shared by every logged-in page (buyer and dealer).
// Needs ../Shared/app.css for the .page-art styles.

// ---------- Background art ----------

// Same style as the landing page scene. Fixed behind the page so it fills the empty
// space at the sides and bottom; the white panels sit on top of it.
function renderBackground() {
    const car = (x, y, scale, body) => `
        <g transform="translate(${x} ${y}) scale(${scale})">
            <path d="M6 28 L10 17 Q12 12 18 12 L40 12 Q45 12 49 17 L54 22 Q60 23 60 28 L60 30 L6 30 Z" fill="${body}"/>
            <path d="M16 17 Q17 15 20 15 L29 15 L29 22 L13 22 Z M32 15 L39 15 Q43 15 46 19 L48 22 L32 22 Z" fill="#dbeeff"/>
            <circle cx="18" cy="30" r="6" fill="#0d3b66"/>
            <circle cx="18" cy="30" r="2.5" fill="#ffffff"/>
            <circle cx="48" cy="30" r="6" fill="#0d3b66"/>
            <circle cx="48" cy="30" r="2.5" fill="#ffffff"/>
        </g>`;

    const cloud = (x, y, size) => `
        <g transform="translate(${x} ${y}) scale(${size})">
            <ellipse cx="0" cy="0" rx="60" ry="18"/>
            <ellipse cx="-18" cy="-12" rx="30" ry="18"/>
            <ellipse cx="16" cy="-16" rx="36" ry="22"/>
        </g>`;

    document.body.insertAdjacentHTML("afterbegin", `
        <div class="page-art" aria-hidden="true">
            <!-- Sky: sun, clouds and birds, mostly at the sides where the page is empty -->
            <svg class="page-sky" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMin slice">
                <circle cx="1290" cy="190" r="64" fill="#b9dfff" opacity="0.8"/>
                <circle cx="1290" cy="190" r="92" fill="#b9dfff" opacity="0.25"/>
                <g fill="#ffffff" opacity="0.9">
                    ${cloud(150, 230, 1.2)}
                    ${cloud(90, 470, 0.8)}
                    ${cloud(1180, 330, 1)}
                    ${cloud(1350, 540, 0.75)}
                    ${cloud(720, 150, 0.6)}
                </g>
                <g fill="none" stroke="#7cc4fa" stroke-width="3" stroke-linecap="round">
                    <path d="M40 340 q8 -8 16 0 q8 -8 16 0"/>
                    <path d="M78 318 q6 -6 12 0 q6 -6 12 0"/>
                    <path d="M1360 420 q8 -8 16 0 q8 -8 16 0"/>
                </g>
            </svg>

            <!-- Ground: hills, trees and a road. The road is the bottom edge,
                 so it sits right on top of the footer. -->
            <svg class="page-ground" viewBox="0 0 1440 162" preserveAspectRatio="xMidYMax slice">
                <g fill="#7cc4fa">
                    <rect x="117" y="40" width="6" height="70"/>
                    <rect x="1297" y="30" width="6" height="80"/>
                    <rect x="1338" y="44" width="4" height="66"/>
                </g>
                <circle cx="120" cy="32" r="18" fill="#b9dfff"/>
                <circle cx="1300" cy="22" r="20" fill="#b9dfff"/>
                <circle cx="1340" cy="38" r="13" fill="#7cc4fa"/>

                <path d="M0 80 Q180 30 360 70 T720 60 T1080 55 T1440 50 V162 H0 Z" fill="#dbeeff"/>
                <path d="M0 115 Q240 85 480 108 T960 100 T1440 98 V162 H0 Z" fill="#b9dfff" opacity="0.7"/>

                <rect x="0" y="132" width="1440" height="30" fill="#7cc4fa" opacity="0.55"/>
                <line x1="0" y1="147" x2="1440" y2="147" stroke="#ffffff" stroke-width="3" stroke-dasharray="26 22"/>

                <g stroke="#7cc4fa" stroke-width="3" stroke-linecap="round">
                    <line x1="200" y1="128" x2="240" y2="128"/>
                    <line x1="190" y1="138" x2="236" y2="138"/>
                </g>
                ${car(240, 100, 1.2, "#2b7bd6")}
                ${car(1060, 104, 1.05, "#7cc4fa")}
            </svg>
        </div>`);
}

renderBackground();

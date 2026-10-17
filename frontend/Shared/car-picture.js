// Car picture shared by every page that shows cars (buyer and dealer).
// Cars have no photos in the database, so each one is drawn in its colour.

// Colour names from the database mapped to a paint colour for the car picture
const paint = {
    white: "#f4f6f8", black: "#1f2933", red: "#d64545", blue: "#2b7bd6", grey: "#7b8794",
    silver: "#c1c7cd", green: "#3f9142", yellow: "#f0c419", orange: "#e8833a",
};

// Same car shape as the logo, painted in the car's colour
function carPicture(colour) {
    const fill = paint[colour.toLowerCase()] || "#2b7bd6";
    return `
        <svg viewBox="0 0 64 40" aria-hidden="true">
            <path d="M6 28 L10 17 Q12 12 18 12 L40 12 Q45 12 49 17 L54 22 Q60 23 60 28 L60 30 L6 30 Z" fill="${fill}" stroke="#0d3b66" stroke-width="0.6"/>
            <path d="M16 17 Q17 15 20 15 L29 15 L29 22 L13 22 Z M32 15 L39 15 Q43 15 46 19 L48 22 L32 22 Z" fill="#dbeeff"/>
            <circle cx="18" cy="30" r="6" fill="#0d3b66"/>
            <circle cx="18" cy="30" r="2.5" fill="#ffffff"/>
            <circle cx="48" cy="30" r="6" fill="#0d3b66"/>
            <circle cx="48" cy="30" r="2.5" fill="#ffffff"/>
        </svg>`;
}

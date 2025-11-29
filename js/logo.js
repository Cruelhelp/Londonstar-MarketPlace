// London Star Marketplace - Logo Components
// Reusable SVG logo definitions

const LondonStarLogo = {
    // Full logo with text
    full: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200">
        <circle cx="100" cy="100" r="85" fill="none" stroke="#ff9900" stroke-width="2.5"/>
        <circle cx="100" cy="100" r="75" fill="none" stroke="#ff9900" stroke-width="3"/>
        <circle cx="100" cy="100" r="65" fill="none" stroke="#ff9900" stroke-width="3.5"/>
        <path d="M 100 40 L 115 75 L 152 80 L 126 105 L 132 142 L 100 125 L 68 142 L 74 105 L 48 80 L 85 75 Z" fill="#ff9900"/>
        <text x="100" y="68" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#131921" text-anchor="middle" letter-spacing="1">LONDON</text>
        <text x="220" y="115" font-family="Arial, sans-serif" font-size="68" font-weight="700" fill="#131921">marketplace</text>
    </svg>`,

    // Icon only (for header)
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="85" fill="none" stroke="#ff9900" stroke-width="3"/>
        <circle cx="100" cy="100" r="75" fill="none" stroke="#ff9900" stroke-width="4"/>
        <circle cx="100" cy="100" r="65" fill="none" stroke="#ff9900" stroke-width="4.5"/>
        <path d="M 100 40 L 118 78 L 160 83 L 130 112 L 138 154 L 100 133 L 62 154 L 70 112 L 40 83 L 82 78 Z" fill="#ff9900"/>
        <text x="100" y="68" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" fill="#131921" text-anchor="middle" letter-spacing="1.5">LONDON</text>
        <text x="100" y="135" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="600" fill="#131921" text-anchor="middle" letter-spacing="0.5">marketplace</text>
    </svg>`,

    // Loading screen version (white)
    loading: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="85" fill="none" stroke="#ff9900" stroke-width="3"/>
        <circle cx="100" cy="100" r="75" fill="none" stroke="#ff9900" stroke-width="4"/>
        <circle cx="100" cy="100" r="65" fill="none" stroke="#ff9900" stroke-width="4.5"/>
        <path d="M 100 40 L 118 78 L 160 83 L 130 112 L 138 154 L 100 133 L 62 154 L 70 112 L 40 83 L 82 78 Z" fill="#ff9900"/>
        <text x="100" y="68" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" fill="white" text-anchor="middle" letter-spacing="1.5">LONDON</text>
        <text x="100" y="135" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="600" fill="white" text-anchor="middle" letter-spacing="0.5">marketplace</text>
    </svg>`,

    // Compact horizontal (for navigation)
    compact: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 80">
        <circle cx="40" cy="40" r="35" fill="none" stroke="#ff9900" stroke-width="2"/>
        <circle cx="40" cy="40" r="30" fill="none" stroke="#ff9900" stroke-width="2.5"/>
        <circle cx="40" cy="40" r="25" fill="none" stroke="#ff9900" stroke-width="3"/>
        <path d="M 40 15 L 47 30 L 63 32 L 51.5 43 L 54 59 L 40 51 L 26 59 L 28.5 43 L 17 32 L 33 30 Z" fill="#ff9900"/>
        <text x="40" y="27" font-family="Arial, sans-serif" font-size="6" font-weight="700" fill="#131921" text-anchor="middle" letter-spacing="0.5">LONDON</text>
        <text x="95" y="50" font-family="Arial, sans-serif" font-size="32" font-weight="700" fill="#131921">marketplace</text>
    </svg>`
};

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.LondonStarLogo = LondonStarLogo;
}

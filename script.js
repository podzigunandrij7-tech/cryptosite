/**
 * CRYPTOLAB - CORE LOGIC
 * Organized by functional blocks
 */

// Global state
let cryptoSwiper = null;

// ============================================================
// 1. DATA FETCHING & RENDERING
// ============================================================

/**
 * Fetches top 15 USDT pairs from Binance and renders cards
 */
async function loadCryptoData() {
    const container = document.getElementById("cards-container");
    if (!container) return;

    try {
        // Correct Binance 24hr Ticker API endpoint
        const response = await fetch("https://api.binance.com/api/v3/ticker/24hr");
        const data = await response.json();

        // Filter and sort by volume to get top 15 pairs
        const topPairs = data
            .filter(item => item.symbol.endsWith("USDT"))
            .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
            .slice(0, 15);

        // Map data to HTML structure
        container.innerHTML = topPairs.map(coin => {
            const symbol = coin.symbol.replace("USDT", "");
            const price = parseFloat(coin.lastPrice).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 5
            });
            const change = parseFloat(coin.priceChangePercent);
            const isUp = change >= 0;

            return `
                <div class="swiper-slide">
                    <div class="coin-name">${symbol} / USDT</div>
                    <div class="price">$${price}</div>
                    <div class="change ${isUp ? 'up' : 'down'}">
                        ${isUp ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%
                    </div>
                </div>
            `;
        }).join("");

        // Initialize or Update Swiper
        initSwiper();

    } catch (error) {
        console.error("Binance API Error:", error);
        container.innerHTML = `<p style="color:red">Failed to load market data.</p>`;
    }
}

// ============================================================
// 2. COMPONENT INITIALIZATION
// ============================================================

/**
 * Handles Swiper Carousel logic
 */
function initSwiper() {
    // If swiper already exists, destroy it before re-initializing
    if (cryptoSwiper) {
        cryptoSwiper.destroy(true, true);
    }

    cryptoSwiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1400: { slidesPerView: 5 }
        }
    });
}

/**
 * Handles Mobile Navigation
 */
function initMobileMenu() {
    const burger = document.getElementById('burger-menu');
    const menu = document.getElementById('nav-menu');

    if (burger && menu) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
            // Optional: change burger icon to 'X' if you add that CSS later
            // burger.classList.toggle('open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', () => {
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
        });
    }
}

/**
 * Updates the year in the footer
 */
function updateFooterYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ============================================================
// 3. EVENT LISTENERS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    updateFooterYear();
    initMobileMenu();
    loadCryptoData();
});

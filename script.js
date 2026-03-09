let cryptoSwiper;

// Допоміжні функції (залишаємо твої робочі)
function coinDisplayName(symbol, cgName) {
    const base = symbol.replace(/USDT$/, "");
    return cgName ? `${cgName} (${base})` : base;
}

function safeNum(n) {
    const x = parseFloat(n);
    return Number.isFinite(x) ? x : null;
}

async function fetchCryptoData() {
    try {
        // 1. Отримуємо дані (ПОВНІ ПОСИЛАННЯ)
        const [binanceRes, cgRes] = await Promise.all([
            fetch("https://api.binance.com"),
            fetch("https://api.coingecko.com")
        ]);

        const tickers = await binanceRes.json();
        const cgData = await cgRes.json();

        // 2. Обробка масивів
        const usdtPairs = tickers
            .filter(t => t.symbol && t.symbol.endsWith("USDT"))
            .sort((a, b) => parseFloat(b.quoteVolume || 0) - parseFloat(a.quoteVolume || 0))
            .slice(0, 30);

        const cgBySymbol = {};
        cgData.forEach(c => { if (c && c.symbol) cgBySymbol[c.symbol.toUpperCase()] = c; });

        const container = document.getElementById("cards-container");
        if (!container) return;
        container.innerHTML = ""; 

        // 3. Генерація слайдів
        usdtPairs.forEach(c => {
            const base = c.symbol.replace(/USDT$/, "");
            const cg = cgBySymbol[base];
            const name = coinDisplayName(c.symbol, cg ? cg.name : undefined);
            const image = cg && cg.image ? cg.image : `https://ui-avatars.com{base}&background=random`;
            const price = safeNum(c.lastPrice);
            const change = safeNum(c.priceChangePercent);
            const cls = (change !== null && change >= 0) ? "up" : "down";
            
            const priceTxt = (price !== null) ? "$" + (price < 1 ? price.toFixed(6) : price.toLocaleString()) : "—";
            const changeTxt = (change !== null) ? (change >= 0 ? "+" : "") + change.toFixed(2) + "%" : "—";

            const slideHTML = `
                <div class="swiper-slide">
                    <div class="coin-info">
                        <img class="coin-logo" src="${image}" alt="${name}" width="32" height="32">
                        <h3 class="coin-name">${name}</h3>
                    </div>
                    <div class="price">${priceTxt}</div>
                    <div class="change ${cls}">${changeTxt}</div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', slideHTML);
        });

        // 4. Запускаємо слайдер ТІЛЬКИ після того, як слайди додані в HTML
        initMySwiper();

    } catch (e) {
        console.error("Error loading crypto data:", e);
    }
}

function initMySwiper() {
    // Якщо слайдер вже існує — знищуємо старий перед створенням нового
    if (cryptoSwiper) {
        cryptoSwiper.destroy(true, true);
    }

    cryptoSwiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1200: { slidesPerView: 5 }
        }
    });
}

// Запуск при завантаженні сторінки
document.addEventListener("DOMContentLoaded", fetchCryptoData);

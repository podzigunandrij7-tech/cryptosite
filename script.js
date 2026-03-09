let cryptoSwiper;

async function loadData() {
    try {
        const res = await fetch("https://api.binance.com");
        const data = await res.json();
        
        // Фільтруємо USDT пари та сортуємо за обсягом (щоб були топові монети)
        const usdtPairs = data
            .filter(i => i.symbol.endsWith("USDT"))
            .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
            .slice(0, 15);
        
        const container = document.getElementById("cards-container");
        if (!container) return;

        container.innerHTML = usdtPairs.map(c => {
            const symbol = c.symbol.replace("USDT", "");
            const change = parseFloat(c.priceChangePercent);
            const price = parseFloat(c.lastPrice);
            const cls = change >= 0 ? 'up' : 'down';
            
            return `
                <div class="swiper-slide">
                    <div class="card-content">
                        <h3 class="coin-name">${symbol}</h3>
                        <p class="price">$${price < 1 ? price.toFixed(4) : price.toLocaleString()}</p>
                        <span class="change ${cls}">${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%</span>
                    </div>
                </div>
            `;
        }).join("");

        // Ініціалізація Swiper
        if (cryptoSwiper) cryptoSwiper.destroy(true, true);
        
        cryptoSwiper = new Swiper(".mySwiper", {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            observer: true, // ВАЖЛИВО: стежить за змінами в DOM
            observeParents: true,
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
    } catch (e) { 
        console.error("Помилка завантаження даних:", e); 
    }
}

// Бургер-меню
const burger = document.getElementById('burger-menu');
const menu = document.getElementById('nav-menu');

if (burger && menu) {
    burger.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
}

// Запуск
document.addEventListener("DOMContentLoaded", loadData);

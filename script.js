let cryptoSwiper;

async function loadData() {
    try {
        const res = await fetch("https://api.binance.com");
        const data = await res.json();
        
        const usdtPairs = data
            .filter(i => i.symbol.endsWith("USDT"))
            .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
            .slice(0, 15);
        
        const container = document.getElementById("cards-container");
        if (!container) return;

        container.innerHTML = usdtPairs.map(c => `
            <div class="swiper-slide">
                <div class="card-content">
                    <h3 style="margin-bottom:10px">${c.symbol.replace("USDT", "")}</h3>
                    <p style="font-size:1.4rem; font-weight:800; margin:5px 0">$${parseFloat(c.lastPrice).toLocaleString()}</p>
                    <span class="${parseFloat(c.priceChangePercent) >= 0 ? 'up' : 'down'}">
                        ${parseFloat(c.priceChangePercent) >= 0 ? '▲' : '▼'} ${Math.abs(c.priceChangePercent).toFixed(2)}%
                    </span>
                </div>
            </div>
        `).join("");

        // Даємо браузеру 100мс "прожувати" новий HTML
        setTimeout(() => {
            if (cryptoSwiper) cryptoSwiper.destroy(true, true);
            cryptoSwiper = new Swiper(".mySwiper", {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: true,
                centeredSlides: true,
                autoplay: { delay: 3000 },
                pagination: { el: ".swiper-pagination", clickable: true },
                navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
                breakpoints: {
                    480: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1200: { slidesPerView: 5 }
                }
            });
        }, 100);

    } catch (e) { console.error("API Error:", e); }
}


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

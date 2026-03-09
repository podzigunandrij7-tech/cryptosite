let cryptoSwiper;

async function loadData() {
    try {
        const res = await fetch("https://api.binance.com");
        const data = await res.json();
        const top10 = data.filter(i => i.symbol.endsWith("USDT")).slice(0, 10);
        
        const container = document.getElementById("cards-container");
        container.innerHTML = top10.map(c => `
            <div class="swiper-slide">
                <h3>${c.symbol.replace("USDT", "")}</h3>
                <p style="font-size: 1.5rem; font-weight: 800">$${parseFloat(c.lastPrice).toLocaleString()}</p>
                <span class="${parseFloat(c.priceChangePercent) >= 0 ? 'up' : 'down'}">
                    ${c.priceChangePercent}%
                </span>
            </div>
        `).join("");

        if (cryptoSwiper) cryptoSwiper.destroy();
        cryptoSwiper = new Swiper(".mySwiper", {
            slidesPerView: 1, spaceBetween: 20, loop: true,
            autoplay: { delay: 3000 },
            breakpoints: { 768: { slidesPerView: 3 }, 1200: { slidesPerView: 5 } }
        });
    } catch (e) { console.error(e); }
}

document.getElementById('burger-menu').addEventListener('click', () => {
    document.getElementById('nav-menu').classList.toggle('active');
});

document.addEventListener("DOMContentLoaded", loadData);

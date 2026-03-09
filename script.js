document.addEventListener("DOMContentLoaded", async () => {
  const track = document.getElementById("carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");

  let index = 0;
  const visibleCards = 5;
  const cardWidth = 200; // приблизна ширина картки
  const gap = 16;

  async function loadCarousel() {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false");
    const data = await res.json();
    data.forEach(coin => {
      const card = document.createElement("div");
      card.className = "crypto-card";
      card.style.background = "#161b22";
      card.style.borderRadius = "12px";
      card.style.padding = "1rem";
      card.style.minWidth = cardWidth + "px";
      card.style.textAlign = "center";
      card.innerHTML = `
        <img src="${coin.image}" alt="${coin.name}" style="width:40px;height:40px;" />
        <h3>${coin.name}</h3>
        <p>$${coin.current_price.toFixed(5)}</p>
        <p style="color:${coin.price_change_percentage_24h >= 0 ? 'lime' : 'red'};">
          ${coin.price_change_percentage_24h.toFixed(2)}%
        </p>
      `;
      track.appendChild(card);
    });
  }

  function updateCarousel() {
    track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
  }

  prevBtn.addEventListener("click", () => {
    if (index > 0) index--;
    updateCarousel();
  });

  nextBtn.addEventListener("click", () => {
    if (index < track.children.length - visibleCards) index++;
    updateCarousel();
  });

  await loadCarousel();

  // TradingView widgets
  new TradingView.widget({
    "container_id": "tradingview_btc",
    "autosize": true,
    "symbol": "BINANCE:BTCUSDT",
    "interval": "D",
    "timezone": "Etc/UTC",
    "theme": "dark",
    "style": "1",
    "locale": "en"
  });

  new TradingView.widget({
    "container_id": "tradingview_eth",
    "autosize": true,
    "symbol": "BINANCE:ETHUSDT",
    "interval": "D",
    "timezone": "Etc/UTC",
    "theme": "dark",
    "style": "1",
    "locale": "en"
  });
});

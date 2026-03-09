
function coinDisplayName(symbol, cgName) {
  const base = symbol.replace(/USDT$/, "");
  const full = cgName || base;
  return `${full} (${base})`;
}

function safeNum(n) {
  const x = parseFloat(n);
  return Number.isFinite(x) ? x : null;
}

async function loadTopCoinsCarousel() {
  try {
    // Binance tickers
    const binanceRes = await fetch("https://api.binance.com/api/v3/ticker/24hr");
    const tickers = await binanceRes.json();
    if (!Array.isArray(tickers)) throw new Error("Unexpected Binance response");

    // Top by USDT quote volume
    const usdtPairs = tickers.filter(t => t.symbol && t.symbol.endsWith("USDT"));
    usdtPairs.sort((a,b) => parseFloat(b.quoteVolume||0) - parseFloat(a.quoteVolume||0));
    const top30 = usdtPairs.slice(0, 30);

    // CoinGecko markets (for images + proper names); pull top 250 to get wider symbol coverage
    const cgRes = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false");
    const cgData = await cgRes.json();
    const cgBySymbol = {};
    cgData.forEach(c => { if (c && c.symbol) cgBySymbol[c.symbol.toUpperCase()] = c; });

    const container = document.getElementById("cards-container");
    container.innerHTML = "";

    top30.forEach(c => {
      const base = c.symbol.replace(/USDT$/, "");
      const cg = cgBySymbol[base];
      const name = coinDisplayName(c.symbol, cg ? cg.name : undefined);
      const image = cg && cg.image ? cg.image : "https://via.placeholder.com/36?text=%20"; // fallback transparent
      const price = safeNum(c.lastPrice);
      const change = safeNum(c.priceChangePercent);
      const cls = (change !== null && change >= 0) ? "up" : "down";
      const priceTxt = (price !== null) ? "$" + price.toFixed(5) : "—";
      const changeTxt = (change !== null) ? (change >=0 ? "+" : "") + change.toFixed(2) + "%" : "—";

      container.insertAdjacentHTML('beforeend', `
        <div class="swiper-slide">
          <h3 class="coin-name"><img class="coin-logo" src="${image}" alt="${name}">${name}</h3>
          <div class="price">${priceTxt}</div>
          <div class="change ${cls}">${changeTxt}</div>
        </div>
      `);
    });

    // Init Swiper (5 per view, responsive, loop + autoplay)
    new Swiper(".mySwiper", {
      slidesPerView: 5,
      spaceBetween: 20,
      loop: true,
      autoplay: { delay: 2500, disableOnInteraction: false },
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
      breakpoints: {
        0:   { slidesPerView: 1 },
        480: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024:{ slidesPerView: 4 },
        1200:{ slidesPerView: 5 }
      }
    });
  } catch (e) {
    console.error("Error loading top coins", e);
    const container = document.getElementById("cards-container");
    if (container && container.innerHTML.trim() === "") {
      container.innerHTML = '<div class="swiper-slide">Error loading data</div>';
    }
  }
}

document.addEventListener("DOMContentLoaded", loadTopCoinsCarousel);

if (document.getElementById('promo-games')) {
  fetch('data/products.json').then(r=>r.json()).then(data=>{
    const promo = data.slice(0,8);
    document.getElementById('promo-games').innerHTML = promo.map(game =>
      `<div class="game-card npw-card">
        <img src="${game.cover}" alt="${game.title}">
        <div style="font-size:1.2em;font-weight:700;margin:8px 0;">${game.title}</div>
        <div style="color:var(--primary);font-size:1.1em;">${game.price} ₽</div>
        <button class="npw-btn npw-btn-cta" onclick="addToCart(${game.id})">Купить</button>
      </div>`
    ).join('');
  });
}
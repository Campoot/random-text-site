let caseHistory = JSON.parse(localStorage.getItem('caseHistory')||"[]");

if(document.getElementById('open-case-btn')) {
  document.getElementById('open-case-btn').onclick = openCaseModal;
  document.getElementById('close-case-btn').onclick = closeCaseModal;
}
function openCaseModal() {
  document.getElementById('case-modal').style.display='flex';
  startCaseAnimation();
}
function closeCaseModal() {
  document.getElementById('case-modal').style.display='none';
  document.getElementById('case-fireworks').style.display='none';
}
async function startCaseAnimation() {
  const roller = document.getElementById('case-roller');
  roller.innerHTML = '';
  document.getElementById('case-fireworks').style.display='none';
  const data = await fetch('data/products.json').then(res=>res.json());
  let rollGames = [];
  for(let i=0;i<15;i++)
    rollGames.push(data[Math.floor(Math.random()*data.length)]);
  const winner = data[Math.floor(Math.random()*data.length)];
  rollGames = rollGames.concat([winner]);
  for(let i=0;i<rollGames.length;i++) {
    const img = document.createElement('img');
    img.src = rollGames[i].cover;
    img.className = 'case-game-img animate__animated animate__tada';
    roller.appendChild(img);
  }
  let scroll = 0, pos = 0;
  function animateRoller() {
    scroll += 45 + Math.sin(scroll/16)*2;
    roller.scrollLeft = scroll;
    pos++;
    if(pos < 42) requestAnimationFrame(animateRoller);
    else showWinner();
  }
  animateRoller();
  function showWinner() {
    const imgs = roller.querySelectorAll('.case-game-img');
    imgs[imgs.length-1].classList.add('selected', 'animate__rubberBand');
    setTimeout(()=>{
      document.getElementById('case-fireworks').innerHTML='<img src="img/fireworks.gif" />';
      document.getElementById('case-fireworks').style.display = 'flex';
      caseHistory.push({
        id: winner.id,
        title: winner.title,
        cover: winner.cover,
        date: new Date().toISOString()
      });
      localStorage.setItem('caseHistory', JSON.stringify(caseHistory));
      renderCaseHistory();
      setTimeout(()=>alert('Поздравляем! Вы выбили: '+winner.title),600);
    },480);
  }
}
function renderCaseHistory() {
  const list = document.getElementById('case-won-list');
  if(!list) return;
  let html = "<div class='case-history-title'>Выпадения из кейса:</div>";
  caseHistory.slice(-5).reverse().forEach(h=>{
    html += `<div class="case-hist-item"><img src="${h.cover}" class="case-hist-img" alt=""><span>${h.title}</span></div>`;
  });
  list.innerHTML = html;
}
renderCaseHistory();
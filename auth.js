// Simple SPA-auth logic: LocalStorage
let users = JSON.parse(localStorage.getItem('users') || "[]");
let session = JSON.parse(localStorage.getItem('session') || "null");
if (!users.find(u => u.login === "ANTIP")) {
  users.push({
    login: "ANTIP",
    password: "Muhebejenek228",
    email: "admin@apkeys.ru",
    avatar: "img/mascot-bear-headphones.png",
    role: "admin",
    orders: [],
    caseHistory: []
  });
  localStorage.setItem('users', JSON.stringify(users));
}

function saveSession(user) {
  localStorage.setItem('session', JSON.stringify(user));
  session = user;
}
function logout() {
  localStorage.removeItem('session');
  location.href = "login.html";
}

// --- Registration
if (document.getElementById('register-form')) {
  document.getElementById('register-form').onsubmit = function(e) {
    e.preventDefault();
    let form = new FormData(this);
    let login = form.get('login').trim();
    let password = form.get('password');
    let email = form.get('email').trim();
    if (!/^[a-zA-Z0-9_]{3,}$/.test(login)) {
      document.getElementById('register-result').textContent = "Логин должен быть латиницей, не короче 3 символов.";
      return;
    }
    if (users.find(u => u.login === login)) {
      document.getElementById('register-result').textContent = "Такой логин уже занят!";
      return;
    }
    let avatar = "img/mascot-dog-joy.png";
    const file = form.get('avatar');
    if (file && file.size > 0) {
      let reader = new FileReader();
      reader.onload = function(evt) {
        saveUser(evt.target.result);
      };
      reader.readAsDataURL(file);
    } else saveUser(avatar);
    function saveUser(ava) {
      let user = {login, password, email, avatar: ava, role: "user", orders: [], caseHistory: []};
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      saveSession(user);
      location.href = "profile.html";
    }
  };
}

// --- Login
if (document.getElementById('login-form')) {
  document.getElementById('login-form').onsubmit = function(e) {
    e.preventDefault();
    let form = new FormData(this);
    let login = form.get('login').trim();
    let password = form.get('password');
    let user = users.find(u => u.login === login && u.password === password);
    if (user) {
      saveSession(user);
      location.href = "profile.html";
    } else {
      document.getElementById('login-result').innerText = "Неверный логин или пароль";
    }
  }
}

// --- Profile (Личный кабинет)
if (document.getElementById('profile-block')) renderProfile();
function renderProfile() {
  if (!session) {
    document.getElementById('profile-block').innerHTML = `<p>Вы не авторизованы. <a href="login.html">Войти</a></p>`;
    return;
  }
  let html = `<div style="display:flex;gap:32px;align-items:center;flex-wrap:wrap;">
    <img src="${session.avatar}" alt="avatar" style="width:100px;height:100px;border-radius:50%;background:#eee;box-shadow:0 2px 10px #ffe03144;">
    <div>
      <h2>${session.login} ${session.role === 'admin' ? '<span style="color:#ff4a5c;">[ADMIN]</span>' : ''}</h2>
      <p>${session.email}</p>
      <button onclick="logout()" class="btn big-btn">Выйти</button>
      ${session.role === 'admin' ? '<a href="admin.html" class="btn big-btn" style="margin-left:10px;">В админку</a>' : ''}
      <br><br>
      <form id="avatar-form"><label>Сменить аватар: <input type="file" name="newavatar"></label>
      <button type="submit" class="btn big-btn">Сохранить</button></form>
    </div>
  </div>`;

  // История заказов
  html += "<hr><h3>История покупок:</h3>";
  if (session.orders && session.orders.length > 0) {
    html += "<ul>";
    session.orders.slice(-10).reverse().forEach(order => {
      html += `<li>${order.date.split('T')[0]} — <b>${order.items.map(it=>it.title).join(", ")}</b> на сумму <b>${order.total}₽</b></li>`;
    });
    html += "</ul>";
  } else html += "<p>Нет покупок.</p>";

  // История кейсов
  html += "<hr><h3>Выпавшие из кейса:</h3>";
  if (session.caseHistory && session.caseHistory.length > 0) {
    html += "<div style='display:flex;gap:12px;flex-wrap:wrap;'>";
    session.caseHistory.slice(-10).reverse().forEach(h => {
      html += `<div style="text-align:center;"><img src="${h.cover}" style="width:50px;height:60px;border-radius:12px;"><br>${h.title}</div>`;
    });
    html += "</div>";
  } else html += "<p>Не открывали кейсы.</p>";
  document.getElementById('profile-block').innerHTML = html;

  document.getElementById('avatar-form').onsubmit = function(e) {
    e.preventDefault();
    const file = this.newavatar.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function(evt) {
      session.avatar = evt.target.result;
      users = users.map(u => u.login === session.login ? {...u, avatar: evt.target.result} : u);
      localStorage.setItem('users', JSON.stringify(users));
      saveSession(session);
      renderProfile();
    };
    reader.readAsDataURL(file);
  }
}
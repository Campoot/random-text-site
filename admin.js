let users = JSON.parse(localStorage.getItem('users') || "[]");
let session = JSON.parse(localStorage.getItem('session') || "null");
let orders = JSON.parse(localStorage.getItem('orders') || "[]");

if (document.getElementById('admin-block')) renderAdmin();
function renderAdmin() {
  if (!session || session.role !== "admin") {
    document.getElementById('admin-block').innerHTML = '<p>Доступ только для администратора. <a href="login.html">Войти</a></p>';
    return;
  }
  let html = `<h2>Пользователи</h2><ul>`;
  users.forEach(u => html += `<li>${u.login} (${u.role}) — ${u.email}</li>`);
  html += '</ul><hr>';

  html += `<h2>Последние заказы</h2>`;
  if (orders.length > 0) {
    html += "<ul>";
    orders.slice(-20).reverse().forEach(order => {
      html += `<li>${order.date.split('T')[0]} — <b>${order.items.map(it=>it.title).join(", ")}</b> (${order.user}) на сумму <b>${order.total}₽</b></li>`;
    });
    html += "</ul>";
  } else html += "<p>Нет заказов.</p>";

  document.getElementById('admin-block').innerHTML = html;
}
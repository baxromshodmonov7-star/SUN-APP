const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// СОСТОЯНИЕ
let balance = 0;
let history = JSON.parse(localStorage.getItem("history") || "[]");
let currentAction = null;

// ТЕКСТЫ (RU/EN)
const translations = {
  ru: {
    balance: "Баланс",
    deposit: "Пополнить",
    withdraw: "Вывести",
    daily: "+1.0% в день",
    top: "🏆 Топ игроков",
    games: "🎮 Игры",
    friends: "👥 Друзья",
    earn: "💰 Задания",
    navTop: "Топ",
    navGames: "Игры",
    navFriends: "Друзья",
    navEarn: "Доход",
    confirm: "Подтвердить",
    cancel: "Отмена",
    hist: "История транзакций"
  },
  en: {
    balance: "Balance",
    deposit: "Deposit",
    withdraw: "Withdraw",
    daily: "+1.0% daily",
    top: "🏆 Top Players",
    games: "🎮 Games",
    friends: "👥 Friends",
    earn: "💰 Earn",
    navTop: "Top",
    navGames: "Games",
    navFriends: "Friends",
    navEarn: "Earn",
    confirm: "Confirm",
    cancel: "Cancel",
    hist: "Transaction History"
  }
};

// ЯЗЫК
function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  document.getElementById("langModal").style.display = "none";
  updateUI();
  if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function toggleLanguage() {
  const cur = localStorage.getItem("lang") || "ru";
  setLanguage(cur === "ru" ? "en" : "ru");
}

function updateUI() {
  const lang = localStorage.getItem("lang") || "ru";
  const t = translations[lang];

  document.querySelector(".balance-container .label").textContent = t.balance;
  document.getElementById("percentBadge").querySelector(".badge-text").textContent = t.daily;
  document.querySelector(".btn-deposit").textContent = t.deposit;
  document.querySelector(".btn-withdraw").textContent = t.withdraw;
  
  document.querySelector("#top .title").textContent = t.top;
  document.querySelector("#games .title").textContent = t.games;
  document.querySelector("#friends .title").textContent = t.friends;
  document.querySelector("#earn .title").textContent = t.earn;
  document.getElementById("histTitle").textContent = t.hist;

  const labels = document.querySelectorAll(".nav-label");
  labels[0].textContent = t.navTop;
  labels[1].textContent = t.navGames;
  labels[2].textContent = t.navFriends;
  labels[3].textContent = t.navEarn;
}

// ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  
  document.querySelectorAll(".nav-item").forEach(btn => btn.style.color = "var(--text-dim)");
  event.currentTarget.style.color = "var(--accent-light)";
  
  if (tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
}

// ACTION SHEET (ДЕПОЗИТ/ВЫВОД)
function deposit() { openSheet('deposit'); }
function withdraw() { openSheet('withdraw'); }

function openSheet(type) {
  currentAction = type;
  const lang = localStorage.getItem("lang") || "ru";
  const t = translations[lang];
  
  document.getElementById("sheetTitle").textContent = (type === 'deposit' ? t.deposit : t.withdraw);
  document.getElementById("confirmBtn").textContent = t.confirm;
  document.getElementById("confirmBtn").style.background = (type === 'deposit' ? "var(--success)" : "var(--danger)");
  
  document.getElementById("actionSheet").classList.add("active");
  document.getElementById("sheetInput").focus();
  if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
}

function closeSheet() {
  document.getElementById("actionSheet").classList.remove("active");
  document.getElementById("sheetInput").value = "";
}

document.getElementById("confirmBtn").onclick = () => {
  const amt = parseFloat(document.getElementById("sheetInput").value);
  if (amt > 0) {
    if (currentAction === 'deposit') {
      balance += amt;
      addHistory("Deposit", amt);
    } else {
      if (balance >= amt) {
        balance -= amt;
        addHistory("Withdraw", amt);
      } else {
        tg.showAlert("Not enough balance!");
        return;
      }
    }
    updateBalance();
    closeSheet();
    if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
  }
};

// ИСТОРИЯ
function openHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  history.forEach(h => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${h.type}</span> <b>${h.amount} TON</b>`;
    list.appendChild(li);
  });
  document.getElementById("historyModal").style.display = "flex";
}
function closeHistory() { document.getElementById("historyModal").style.display = "none"; }

function addHistory(type, amt) {
  history.unshift({type, amount: amt});
  localStorage.setItem("history", JSON.stringify(history));
}

function updateBalance() {
  document.getElementById("balance").textContent = balance.toFixed(3);
}

// СТАРТ
document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("lang");
  if (!saved) document.getElementById("langModal").style.display = "flex";
  else updateUI();
  
  // Фейковый ТОП
  const topList = document.getElementById("topList");
  for(let i=1; i<=10; i++){
    const li = document.createElement("li");
    li.innerHTML = `<span>User_${i*123}</span> <b>${(100/i).toFixed(2)} TON</b>`;
    topList.appendChild(li);
  }
});

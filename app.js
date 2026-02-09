const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

let balance = 0;
let history = JSON.parse(localStorage.getItem("history") || "[]");
let currentAction = null;

const translations = {
  ru: { home: "Главная", top: "Топ", games: "Игры", friends: "Друзья", earn: "Доход", deposit: "Пополнить", withdraw: "Вывести", balance: "Баланс" },
  en: { home: "Home", top: "Top", games: "Games", friends: "Friends", earn: "Earn", deposit: "Deposit", withdraw: "Withdraw", balance: "Balance" }
};

function updateUI() {
  const lang = localStorage.getItem("lang") || "ru";
  const t = translations[lang];
  const labels = document.querySelectorAll(".nav-label");
  labels[0].textContent = t.home;
  labels[1].textContent = t.top;
  labels[2].textContent = t.games;
  labels[3].textContent = t.friends;
  labels[4].textContent = t.earn;
  document.querySelector(".btn-deposit").textContent = t.deposit;
  document.querySelector(".btn-withdraw").textContent = t.withdraw;
  document.querySelector(".label").textContent = t.balance;
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".nav-item").forEach(btn => btn.classList.remove("active"));
  event.currentTarget.classList.add("active");
  if (tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
}

function openSheet(type) {
  currentAction = type;
  document.getElementById("sheetTitle").textContent = type === 'deposit' ? "Deposit" : "Withdraw";
  document.getElementById("actionSheet").classList.add("active");
}

function closeSheet() { document.getElementById("actionSheet").classList.remove("active"); }

document.getElementById("confirmBtn").onclick = () => {
  const val = parseFloat(document.getElementById("sheetInput").value);
  if (val > 0) {
    if (currentAction === 'deposit') balance += val;
    else if (balance >= val) balance -= val;
    updateBalance();
    closeSheet();
  }
};

function updateBalance() { document.getElementById("balance").textContent = balance.toFixed(3); }

function setLanguage(l) { localStorage.setItem("lang", l); document.getElementById("langModal").style.display="none"; updateUI(); }
function toggleLanguage() { const l = localStorage.getItem("lang") === "ru" ? "en" : "ru"; setLanguage(l); }

function deposit() { openSheet('deposit'); }
function withdraw() { openSheet('withdraw'); }

function openHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = history.map(h => `<li><span>${h.type}</span><b>${h.amount}</b></li>`).join("");
  document.getElementById("historyModal").style.display = "flex";
}
function closeHistory() { document.getElementById("historyModal").style.display = "none"; }

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("lang")) document.getElementById("langModal").style.display = "flex";
  updateUI();
  // Fake top
  document.getElementById("topList").innerHTML = "<li><span>Player 1</span><b>10.5 TON</b></li><li><span>Player 2</span><b>8.2 TON</b></li>";
});

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// STATE
let balance = 0;
let history = JSON.parse(localStorage.getItem("history") || "[]");

// LANGUAGE
const savedLang = localStorage.getItem("lang");
if (!savedLang) {
  document.getElementById("langModal").style.display = "flex";
}

function setLanguage(lang){
  localStorage.setItem("lang", lang);
  document.getElementById("langModal").style.display="none";
}

function toggleLanguage(){
  const lang = localStorage.getItem("lang")==="ru"?"en":"ru";
  setLanguage(lang);
}

// SCREENS
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// HISTORY
function openHistory(){
  const list=document.getElementById("historyList");
  list.innerHTML="";
  history.forEach(h=>{
    const li=document.createElement("li");
    li.textContent=`${h.type}: ${h.amount} TON`;
    list.appendChild(li);
  });
  document.getElementById("historyModal").style.display="flex";
}
function closeHistory(){document.getElementById("historyModal").style.display="none";}

// DEPOSIT / WITHDRAW (demo)
function deposit(){
  const amt=prompt("Сумма пополнения TON","");
  if(amt && !isNaN(amt)){ balance+=parseFloat(amt); addHistory("Deposit",amt); updateBalance();}
}
function withdraw(){
  const amt=prompt("Сумма вывода TON","");
  if(amt && !isNaN(amt)){ balance-=parseFloat(amt); addHistory("Withdraw",amt); updateBalance();}
}
function addHistory(type,amt){ history.unshift({type,amount:amt}); localStorage.setItem("history",JSON.stringify(history));}
function updateBalance(){document.getElementById("balance").textContent=balance.toFixed(3);}

// TOP (FAKE DATA)
const topList = document.getElementById("topList");
for(let i=1;i<=50;i++){
  const li=document.createElement("li");
  li.textContent=`${i}. User${i} — ${Math.floor(Math.random()*1000)} TON`;
  topList.appendChild(li);
}

// INIT
updateBalance();

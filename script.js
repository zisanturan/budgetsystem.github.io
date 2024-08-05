const target = 1000000;
let currentTotal = 0;
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let currentDate = new Date();

// Yeni İşlem Ekleme Modalını Aç
function openAddTransactionModal() {
  document.getElementById("addTransactionModal").style.display = "block";
}

// Yeni İşlem Ekleme Modalını Kapat
function closeAddTransactionModal() {
  document.getElementById("addTransactionModal").style.display = "none";
}

// Yeni İşlem Ekle
function addNewTransaction() {
  const incomeInput = document.getElementById("newIncome");
  const extraIncomeInput = document.getElementById("newExtraIncome");
  const expenseInput = document.getElementById("newExpense");
  const dateInput = document.getElementById("transactionDate");
  const income = parseFloat(incomeInput.value) || 0;
  const extraIncome = parseFloat(extraIncomeInput.value) || 0;
  const expense = parseFloat(expenseInput.value) || 0;
  const date = new Date(dateInput.value).toLocaleDateString();

  if (income < 0 || extraIncome < 0 || expense < 0 || !date) {
    alert("Lütfen geçerli bir tarih ve tutar giriniz.");
    return;
  }

  const totalIncome = income + extraIncome;
  const net = totalIncome - expense;
  currentTotal += net;

  const transaction = {
    date,
    income,
    extraIncome,
    expense,
    net,
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();
  updateTarget();
  updateCalendar();
  closeAddTransactionModal();
}

// Mevcut işlemler ve değişkenler
function addTransaction() {
  const incomeInput = document.getElementById("income");
  const extraIncomeInput = document.getElementById("extraIncome");
  const expenseInput = document.getElementById("expense");
  const income = parseFloat(incomeInput.value) || 0;
  const extraIncome = parseFloat(extraIncomeInput.value) || 0;
  const expense = parseFloat(expenseInput.value) || 0;

  if (income < 0 || extraIncome < 0 || expense < 0) {
    alert("Lütfen geçerli bir tutar giriniz.");
    return;
  }

  const totalIncome = income + extraIncome;
  currentTotal += totalIncome - expense;

  const transaction = {
    date: currentDate.toLocaleDateString(),
    income,
    extraIncome,
    expense,
    net: totalIncome - expense,
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();
  updateTarget();
  updateCalendar();

  resetInputs();
}

function resetInputs() {
  document.getElementById("income").value = "";
  document.getElementById("extraIncome").value = "";
  document.getElementById("expense").value = "";
}

function updateTransactionList() {
  const transactionList = document.getElementById("transactionList");
  transactionList.innerHTML = "";

  transactions.forEach((transaction, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Gelir: +${transaction.income} TL, Ek Kazanç: +${transaction.extraIncome} TL, Gider: -${transaction.expense} TL, Net: ${transaction.net} TL (${transaction.date})`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Sil";
    deleteButton.classList.add("delete");
    deleteButton.onclick = () => deleteTransaction(index);

    listItem.appendChild(deleteButton);
    transactionList.appendChild(listItem);
  });
}

function updateTarget() {
  const remainingTarget = target - currentTotal;
  document.getElementById("remainingTarget").textContent =
    remainingTarget.toLocaleString();
}

function updateCalendar() {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dayBox = document.createElement("div");
    dayBox.className = "day";
    dayBox.textContent = day;

    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toLocaleDateString();
    const dailyTransactions = transactions.filter(
      (transaction) => transaction.date === date
    );

    if (dailyTransactions.length > 0) {
      dayBox.style.backgroundColor = "#d4edda";
      dayBox.title = `Net: ${dailyTransactions.reduce(
        (sum, trans) => sum + trans.net,
        0
      )} TL`;
      dayBox.onclick = () => openAddTransactionModalWithDate(date);
    } else {
      dayBox.onclick = () => openAddTransactionModalWithDate(date);
    }

    calendar.appendChild(dayBox);
  }
}

function deleteTransaction(index) {
  const transaction = transactions[index];
  currentTotal -= transaction.net;
  transactions.splice(index, 1);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();
  updateTarget();
  updateCalendar();
}

function openAddTransactionModalWithDate(date) {
  document.getElementById("transactionDate").value = new Date(date)
    .toISOString()
    .split("T")[0];
  openAddTransactionModal();
}

function closeAddTransactionModal() {
  document.getElementById("addTransactionModal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  currentTotal = transactions.reduce(
    (sum, transaction) => sum + transaction.net,
    0
  );
  document.getElementById("remainingTarget").textContent = (
    target - currentTotal
  ).toLocaleString();
  updateTransactionList();
  updateCalendar();
});

window.onclick = function (event) {
  const modal = document.getElementById("addTransactionModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

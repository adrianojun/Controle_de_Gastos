const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const btnNew = document.querySelector("#btnNew");
const dateSelector = document.querySelector("#date");
const btnSearch = document.querySelector("#btnSearch");
const startDate = document.querySelector("#startDate");
const endDate = document.querySelector("#endDate");
const btnTagSearch = document.querySelector("#btnTagSearch");
const tagInput = document.querySelector("#tag");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");

let items = getItensBD();

document.addEventListener('DOMContentLoaded', () => {
  loadItensByDate(); 
});

btnNew.addEventListener('click', () => {
  if (validateForm()) {
    addItem();
    clearForm();
    loadItensByDate(); 
  } else {
    alert("Preencha todos os campos!");
  }
});

btnSearch.addEventListener("click", () => {
  loadItensByDate();
});

btnTagSearch.addEventListener("click", () => {
  loadItensByTag();
});

function deleteItem(index) {
  items.splice(index, 1);
  setItensBD();
  loadItensByDate();
}

function insertItem(item, index) {
  const tr = document.createElement("tr");
  const icon = item.type === "Entrada" ? '<i class="bx bxs-chevron-up-circle"></i>' : '<i class="bx bxs-chevron-down-circle"></i>';

  tr.innerHTML = `
    <td>${item.desc}</td>
    <td>R$ ${item.amount}</td>
    <td class="columnType">${icon}</td>
    <td>${item.date}</td>
    <td class="columnAction">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}

function loadItensByDate() {
  console.log("Carregando itens por data");

  const start = startDate.value;
  const end = endDate.value;

  // Filtra os itens por data
  const dateFilteredItems = items.filter(item => {
    const isWithinDateRange = (!start || item.date >= start) && (!end || item.date <= end);
    return isWithinDateRange;
  });

  updateTable(dateFilteredItems);
}

function loadItensByTag() {
  console.log("Carregando itens por tag");

  const tag = tagInput.value.toLowerCase();

  const tagFilteredItems = items.filter(item => {
    const itemDesc = item.desc.toLowerCase();
    return !tag || itemDesc.includes(tag);
  });

  updateTable(tagFilteredItems);
}

function updateTable(filteredItems) {
  tbody.innerHTML = "";
  filteredItems.forEach((item, index) => {
    insertItem(item, index);
  });

  updateTotals();
}

function updateTotals() {
  const amountIncomes = getTransactionTotal("Entrada");
  const amountExpenses = getTransactionTotal("Saída");

  const totalIncomes = amountIncomes.toFixed(2);
  const totalExpenses = Math.abs(amountExpenses).toFixed(2);
  const totalItems = (amountIncomes - amountExpenses).toFixed(2);

  incomes.innerHTML = totalIncomes;
  expenses.innerHTML = totalExpenses;
  total.innerHTML = totalItems;
}

function getTransactionTotal(type) {
  return items
    .filter(item => item.type === type)
    .map(item => Number(item.amount))
    .reduce((acc, cur) => acc + cur, 0);
}

dateSelector.addEventListener("change", () => {
  loadItensByDate();
});

function parseTags(description) {
  const regex = /#\w+/g;
  return (description.match(regex) || []).map(tag => tag.toLowerCase());
}

function getItensBD() {
  return JSON.parse(localStorage.getItem("db_items")) || [];
}

function setItensBD() {
  localStorage.setItem("db_items", JSON.stringify(items));
}

function validateForm() {
  return descItem.value !== "" && amount.value !== "" && type.value !== "";
}

function addItem() {
  items.push({
    desc: descItem.value,
    amount: Math.abs(amount.value).toFixed(2),
    type: type.value,
    date: dateSelector.value,
    tags: parseTags(descItem.value),
  });

  setItensBD();
}

function clearForm() {
  descItem.value = "";
  amount.value = "";
}

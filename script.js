const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const btnNew = document.querySelector("#btnNew");
const dateSelector = document.querySelector("#date");
const btnSearch = document.querySelector("#btnSearch");
const startDate = document.querySelector("#startDate");
const endDate = document.querySelector("#endDate");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");

// Carregar itens do Local Storage durante a inicialização
let items = getItensBD();

// Função para obter itens do Local Storage
function getItensBD() {
  return JSON.parse(localStorage.getItem("db_items")) || [];
}

// Função para definir itens no Local Storage
function setItensBD() {
  localStorage.setItem("db_items", JSON.stringify(items));
}

// Carregar itens quando a página estiver pronta
document.addEventListener('DOMContentLoaded', function () {
  loadItens();
});

// Adicionar evento de clique para o botão Incluir
btnNew.addEventListener('click', function() {
  console.log("Botão Incluir clicado");

  if (descItem.value === "" || amount.value === "" || type.value === "") {
    alert("Preencha todos os campos!");
    return;
  }

  items.push({
    desc: descItem.value,
    amount: Math.abs(amount.value).toFixed(2),
    type: type.value,
    date: dateSelector.value,
  });

  setItensBD();
  loadItens();

  descItem.value = "";
  amount.value = "";
});

// Adicionar evento de clique para o botão de pesquisa
btnSearch.addEventListener("click", function() {
  loadItens();
});

// Função para excluir um item
function deleteItem(index) {
  items.splice(index, 1);
  setItensBD();
  loadItens();
}

// Função para inserir um item na tabela
function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.desc}</td>
    <td>R$ ${item.amount}</td>
    <td class="columnType">${
      item.type === "Entrada"
        ? '<i class="bx bxs-chevron-up-circle"></i>'
        : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>
    <td>${item.date}</td>
    <td class="columnAction">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}

// Função para carregar itens na tabela
function loadItens() {
  console.log("Carregando itens");

  const start = startDate.value;
  const end = endDate.value;

  // Se as datas de início e fim não estiverem definidas, exibe todas as operações
  const filteredItems = start && end
    ? items.filter(item => item.date >= start && item.date <= end)
    : items;

  tbody.innerHTML = "";
  filteredItems.forEach((item, index) => {
    insertItem(item, index);
  });

  getTotals();
}

// Função para obter totais
function getTotals() {
  const amountIncomes = items
    .filter((item) => item.type === "Entrada")
    .map((transaction) => Number(transaction.amount));

  const amountExpenses = items
    .filter((item) => item.type === "Saída")
    .map((transaction) => Number(transaction.amount));

  const totalIncomes = amountIncomes
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2);

  const totalExpenses = Math.abs(
    amountExpenses.reduce((acc, cur) => acc + cur, 0)
  ).toFixed(2);

  const totalItems = (totalIncomes - totalExpenses).toFixed(2);

  incomes.innerHTML = totalIncomes;
  expenses.innerHTML = totalExpenses;
  total.innerHTML = totalItems;
}

// Adicionar evento de mudança para o campo de seleção de data
dateSelector.addEventListener("change", function () {
  loadItens();
});

// Inicializar o carregamento de itens
loadItens();

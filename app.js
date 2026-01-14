let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budget = Number(localStorage.getItem("budget")) || 0;
let currentDate = new Date();
let selectedCategory = "Food";
let chart;

/* DOM */
const list = document.getElementById("expenseList");
const monthTotalEl = document.getElementById("monthTotal");
const monthLabel = document.getElementById("currentMonth");
const budgetLabel = document.getElementById("budgetLabel");
const sheet = document.getElementById("sheet");

/* INIT */
updateMonthLabel();
render();

/* OPEN / CLOSE */
document.getElementById("openAdd").onclick = () => sheet.classList.remove("hidden");
document.getElementById("closeSheet").onclick = () => sheet.classList.add("hidden");

/* CATEGORY */
document.querySelectorAll(".categories button").forEach(btn => {
  btn.onclick = () => selectedCategory = btn.dataset.cat;
});

/* SAVE */
document.getElementById("saveExpense").onclick = () => {
  const amount = Number(amountInput.value);
  const note = noteInput.value;
  const newBudget = Number(budgetInput.value);

  if (newBudget) {
    budget = newBudget;
    localStorage.setItem("budget", budget);
  }

  if (!amount) return;

  expenses.push({
    amount,
    note,
    category: selectedCategory,
    date: new Date().toISOString()
  });

  localStorage.setItem("expenses", JSON.stringify(expenses));
  sheet.classList.add("hidden");
  amountInput.value = noteInput.value = budgetInput.value = "";
  render();
};

/* RENDER */
function render() {
  list.innerHTML = "";
  let total = 0;
  let monthData = [];

  expenses.forEach((e, i) => {
    const d = new Date(e.date);
    if (
      d.getMonth() === currentDate.getMonth() &&
      d.getFullYear() === currentDate.getFullYear()
    ) {
      total += e.amount;
      monthData.push(e);

      const li = document.createElement("li");
      li.innerHTML = `
        <span>${e.category} ${e.note || ""}</span>
        <strong>₹${e.amount}</strong>
      `;
      li.onclick = () => deleteExpense(i);
      list.appendChild(li);
    }
  });

  monthTotalEl.innerText = total;
  renderChart(monthData);

  if (budget) {
    budgetLabel.innerText = `Budget: ₹${budget}`;
    if (total > budget) budgetLabel.style.color = "#ef4444";
    else if (total > budget * 0.8) budgetLabel.style.color = "#f59e0b";
    else budgetLabel.style.color = "#22c55e";
  }
}

/* DELETE */
function deleteExpense(i) {
  if (!confirm("Delete this expense?")) return;
  expenses.splice(i, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  render();
}

/* CHART */
function renderChart(data) {
  const ctx = document.getElementById("categoryChart");
  const map = {};

  data.forEach(e => map[e.category] = (map[e.category] || 0) + e.amount);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: Object.keys(map),
      datasets: [{
        data: Object.values(map),
        backgroundColor: ["#22c55e","#3b82f6","#f59e0b","#ef4444"]
      }]
    },
    options: {
      plugins: {
        legend: { labels: { color: "#e5e7eb" } }
      }
    }
  });
}

/* MONTH NAV */
document.getElementById("prevMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateMonthLabel();
  render();
};

document.getElementById("nextMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateMonthLabel();
  render();
};

function updateMonthLabel() {
  monthLabel.innerText = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });
}

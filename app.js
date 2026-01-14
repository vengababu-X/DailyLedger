let entries = JSON.parse(localStorage.getItem("ledgerly")) || [];
let currentMonth = new Date().toISOString().slice(0,7); // YYYY-MM
let barChart = null;
let pieChart = null;

/* ELEMENTS */
const monthLabel = document.getElementById("monthLabel");
const spentEl = document.getElementById("spent");
const savedEl = document.getElementById("saved");
const payEl = document.getElementById("pay");
const listEl = document.getElementById("entryList");

/* MONTH LABEL */
function updateMonthLabel() {
  const d = new Date(currentMonth + "-01");
  monthLabel.textContent = d.toLocaleString("default", { month: "long", year: "numeric" });
}

/* MONTH NAV */
document.getElementById("prevMonth").onclick = () => {
  const d = new Date(currentMonth + "-01");
  d.setMonth(d.getMonth() - 1);
  currentMonth = d.toISOString().slice(0,7);
  updateMonthLabel();
  render();
};

document.getElementById("nextMonth").onclick = () => {
  const d = new Date(currentMonth + "-01");
  d.setMonth(d.getMonth() + 1);
  currentMonth = d.toISOString().slice(0,7);
  updateMonthLabel();
  render();
};

/* ADD ENTRY */
document.getElementById("addBtn").onclick = () => {
  const amt = Number(amount.value);
  if (!amt || amt <= 0 || amt > 100000) return;

  entries.push({
    id: Date.now(),
    type: entryType.value,
    amount: amt,
    category: category.value,
    note: note.value,
    month: currentMonth
  });

  localStorage.setItem("ledgerly", JSON.stringify(entries));
  amount.value = "";
  note.value = "";
  render();
};

/* DELETE */
function deleteEntry(id) {
  entries = entries.filter(e => e.id !== id);
  localStorage.setItem("ledgerly", JSON.stringify(entries));
  render();
}

/* RENDER */
function render() {
  let spent = 0, saved = 0, pay = 0;
  let categoryMap = {};
  listEl.innerHTML = "";

  const monthEntries = entries.filter(e => e.month === currentMonth);

  monthEntries.forEach(e => {
    if (e.type === "spend") {
      spent += e.amount;
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    }
    if (e.type === "save") saved += e.amount;
    if (e.type === "pay") pay += e.amount;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${e.type === "pay" ? "To Pay" : e.category} ₹${e.amount}</span>
      <span class="delete">✕</span>
    `;
    li.querySelector(".delete").onclick = () => deleteEntry(e.id);
    listEl.appendChild(li);
  });

  spentEl.textContent = spent;
  savedEl.textContent = saved;
  payEl.textContent = pay;

  drawCharts(spent, saved, categoryMap);
}

/* CHARTS */
function drawCharts(spent, saved, categoryMap) {
  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: ["Spend", "Save"],
      datasets: [{
        data: [spent, saved],
        backgroundColor: ["#ef4444", "#22c55e"]
      }]
    },
    options: { plugins: { legend: { display: false } } }
  });

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: Object.keys(categoryMap),
      datasets: [{
        data: Object.values(categoryMap),
        backgroundColor: ["#22c55e","#3b82f6","#f59e0b","#ef4444"]
      }]
    }
  });
}

/* INIT */
updateMonthLabel();
render();

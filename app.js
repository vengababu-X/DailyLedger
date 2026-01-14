let entries = JSON.parse(localStorage.getItem("ledgerly")) || [];
let currentDate = new Date();
let barChart, pieChart;

/* MONTH LABEL */
function updateMonthLabel() {
  monthLabel.textContent = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });
}

/* MONTH NAV */
prevMonth.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateMonthLabel();
  render();
};

nextMonth.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateMonthLabel();
  render();
};

/* ADD ENTRY */
addEntry.onclick = () => {
  const amt = Number(amount.value);
  if (!amt || amt <= 0 || amt > 100000) return;

  entries.push({
    id: Date.now(),
    type: type.value,          // spend | save | pay
    amount: amt,
    note: note.value,
    category: category.value,
    date: new Date(currentDate)
  });

  localStorage.setItem("ledgerly", JSON.stringify(entries));
  amount.value = note.value = "";
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
  let spent = 0, saved = 0, payable = 0;
  let categoryMap = {};
  list.innerHTML = "";

  entries.forEach(e => {
    const d = new Date(e.date);
    if (
      d.getMonth() === currentDate.getMonth() &&
      d.getFullYear() === currentDate.getFullYear()
    ) {
      if (e.type === "spend") {
        spent += e.amount;
        categoryMap[e.category] =
          (categoryMap[e.category] || 0) + e.amount;
      }
      if (e.type === "save") saved += e.amount;
      if (e.type === "pay") payable += e.amount;

      const li = document.createElement("li");
      li.innerHTML = `
        <span>${e.type === "pay" ? "To Pay" : e.category} — ₹${e.amount}</span>
        <span class="delete" onclick="deleteEntry(${e.id})">✕</span>
      `;
      list.appendChild(li);
    }
  });

  spentEl.textContent = spent;
  savedEl.textContent = saved;
  payableEl.textContent = payable;

  drawBar(spent, saved);
  drawPie(categoryMap);
}

/* CHARTS */
function drawBar(spend, save) {
  if (barChart) barChart.destroy();
  barChart = new Chart(barChartCtx = document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: ["Spend", "Save"],
      datasets: [{
        data: [spend, save],
        backgroundColor: ["#ef4444", "#22c55e"]
      }]
    },
    options: { plugins: { legend: { display: false } } }
  });
}

function drawPie(map) {
  if (pieChart) pieChart.destroy();
  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: Object.keys(map),
      datasets: [{
        data: Object.values(map),
        backgroundColor: ["#22c55e","#3b82f6","#f59e0b","#ef4444"]
      }]
    }
  });
}

/* INIT */
updateMonthLabel();
render();

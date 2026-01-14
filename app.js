let entries = JSON.parse(localStorage.getItem("ledgerly")) || [];
let barChart, pieChart;

const today = new Date().toISOString().slice(0,10);
todayLabel.textContent = today;

openSheet.onclick = () => sheet.classList.remove("hidden");

saveEntry.onclick = () => {
  const amountVal = Number(amount.value);
  if (!amountVal || amountVal <= 0 || amountVal > 100000) return;

  entries.push({
    type: entryType.value,
    amount: amountVal,
    category: category.value,
    date: today
  });

  localStorage.setItem("ledgerly", JSON.stringify(entries));
  amount.value = "";
  sheet.classList.add("hidden");
  render();
};

function render() {
  let spent = 0, saved = 0;
  let todaySpent = 0, todaySaved = 0;
  let categoryMap = {};

  list.innerHTML = "";

  entries.slice().reverse().forEach(e => {
    if (e.type === "spend") spent += e.amount;
    if (e.type === "save") saved += e.amount;

    if (e.date === today) {
      if (e.type === "spend") todaySpent += e.amount;
      if (e.type === "save") todaySaved += e.amount;
    }

    if (e.type === "spend") {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    }

    list.innerHTML += `
      <li>
        <span>${e.type === "save" ? "Saved" : e.category}</span>
        <strong>₹${e.amount}</strong>
      </li>
    `;
  });

  totalSpent.textContent = spent;
  totalSaved.textContent = saved;

  drawBar(todaySpent, todaySaved);
  drawPie(categoryMap);
}

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
    options: { plugins:{ legend:{ display:false } } }
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

render();

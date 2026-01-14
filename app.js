let data = JSON.parse(localStorage.getItem("ledgerly")) || [];
let barChart, pieChart;

const today = new Date().toISOString().slice(0, 10);

toggleAdd.onclick = () => {
  addForm.style.display =
    addForm.style.display === "none" ? "block" : "none";
};

addEntry.onclick = () => {
  const amt = Number(amount.value);
  if (!amt || amt <= 0 || amt > 100000) return;

  data.push({
    type: type.value,
    amount: amt,
    category: category.value,
    date: today
  });

  localStorage.setItem("ledgerly", JSON.stringify(data));
  amount.value = "";
  render();
};

function render() {
  let todaySpend = 0, todaySave = 0;
  let categoryMap = {};
  list.innerHTML = "";

  data.slice().reverse().forEach(e => {
    if (e.date === today) {
      if (e.type === "spend") todaySpend += e.amount;
      if (e.type === "save") todaySave += e.amount;
    }

    if (e.type === "spend") {
      categoryMap[e.category] =
        (categoryMap[e.category] || 0) + e.amount;
    }

    list.innerHTML += `
      <li>
        <span>${e.type === "save" ? "Saved" : e.category}</span>
        <strong>₹${e.amount}</strong>
      </li>
    `;
  });

  todaySpent.textContent = todaySpend;
  todaySaved.textContent = todaySave;

  drawBar(todaySpend, todaySave);
  drawPie(categoryMap);
}

function drawBar(spend, save) {
  if (barChart) barChart.destroy();
  barChart = new Chart(barChart = document.getElementById("barChart"), {
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

render();

let data = JSON.parse(localStorage.getItem("ledgerly")) || [];
let view = "month";
let categoryFilter = null;
let search = "";
let chart;

const totalEl = document.getElementById("totalAmount");
const labelEl = document.getElementById("summaryLabel");
const budgetEl = document.getElementById("budgetStatus");
const list = document.getElementById("list");

/* VIEW TOGGLE */
document.querySelectorAll(".view-toggle button").forEach(b => {
  b.onclick = () => {
    document.querySelectorAll(".view-toggle button").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    view = b.dataset.view;
    render();
  };
});

/* SEARCH */
document.getElementById("search").oninput = e => {
  search = e.target.value.toLowerCase();
  render();
};

/* FAB */
fab.onclick = () => sheet.classList.remove("hidden");

/* CATEGORY */
let currentCat = "Food";
document.querySelectorAll(".cats button").forEach(b => {
  b.onclick = () => currentCat = b.dataset.cat;
});

/* SAVE */
save.onclick = () => {
  if (!amount.value) return;
  data.push({
    amount: +amount.value,
    note: note.value,
    cat: currentCat,
    date: new Date()
  });
  localStorage.setItem("ledgerly", JSON.stringify(data));
  sheet.classList.add("hidden");
  amount.value = note.value = "";
  render();
};

/* RENDER */
function render() {
  list.innerHTML = "";
  let filtered = data.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    if (view === "day") return d.toDateString() === now.toDateString();
    if (view === "month") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    return d.getFullYear() === now.getFullYear();
  });

  if (categoryFilter) filtered = filtered.filter(e => e.cat === categoryFilter);
  if (search) filtered = filtered.filter(e => (e.note || "").toLowerCase().includes(search));

  let total = filtered.reduce((s,e) => s+e.amount, 0);
  totalEl.textContent = total;
  labelEl.textContent = `${view.charAt(0).toUpperCase()+view.slice(1)} spend`;

  filtered.forEach(e => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <div>${e.cat}</div>
        <div class="item-note">${e.note || "—"}</div>
      </div>
      <strong>₹${e.amount}</strong>
    `;
    list.appendChild(li);
  });

  renderChart(filtered);
  insightText.textContent = filtered.length
    ? `Most recent focus: ${filtered[filtered.length-1].cat}`
    : "No data for this period.";
}

/* CHART */
function renderChart(arr) {
  let map = {};
  arr.forEach(e => map[e.cat] = (map[e.cat]||0)+e.amount);

  if (chart) chart.destroy();
  chart = new Chart(chart.getContext("2d"), {
    type: "doughnut",
    data: {
      labels: Object.keys(map),
      datasets: [{ data: Object.values(map) }]
    },
    options: {
      onClick: (_, el) => {
        if (!el.length) return;
        categoryFilter = Object.keys(map)[el[0].index];
        render();
      }
    }
  });
}

render();

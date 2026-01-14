let data = JSON.parse(localStorage.getItem("ledgerly-data")) || [];
const monthlyBudget = 5000;

const totalEl = document.getElementById("total");
const varianceEl = document.getElementById("variance");
const categoryTable = document.getElementById("categoryTable");
const entryTable = document.getElementById("entryTable");

function render() {
  let total = data.reduce((sum, e) => sum + e.amount, 0);
  totalEl.textContent = total;
  varianceEl.textContent = `₹ ${monthlyBudget - total}`;

  // Category summary
  const categoryMap = {};
  data.forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  categoryTable.innerHTML = "";
  Object.keys(categoryMap).forEach(cat => {
    const pct = total ? ((categoryMap[cat] / total) * 100).toFixed(1) : 0;
    categoryTable.innerHTML += `
      <div class="table">
        <span>${cat}</span>
        <span>₹ ${categoryMap[cat]}</span>
        <span>${pct}%</span>
      </div>
    `;
  });

  // Entry table
  entryTable.innerHTML = "";
  data.slice().reverse().forEach(e => {
    entryTable.innerHTML += `
      <div class="table">
        <span>${e.date}</span>
        <span>${e.category}</span>
        <span>₹ ${e.amount}</span>
      </div>
    `;
  });
}

document.getElementById("addBtn").onclick = () => {
  const amount = Number(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  if (!amount || amount <= 0 || amount > 100000) return;

  data.push({
    amount,
    category,
    date: new Date().toLocaleDateString()
  });

  localStorage.setItem("ledgerly-data", JSON.stringify(data));
  document.getElementById("amount").value = "";
  render();
};

render();

let data = JSON.parse(localStorage.getItem("ledgerly")) || [];
let chart;

const totals = {
  Food:0, Travel:0, Shopping:0, Bills:0
};

open.onclick = () => sheet.classList.remove("hidden");

save.onclick = () => {
  const amt = Number(amount.value);
  if(!amt || amt <= 0 || amt > 100000) return;

  data.push({
    amount:amt,
    category:category.value,
    note:note.value
  });

  localStorage.setItem("ledgerly",JSON.stringify(data));
  amount.value = note.value = "";
  sheet.classList.add("hidden");
  render();
};

function render() {
  list.innerHTML = "";
  Object.keys(totals).forEach(k => totals[k]=0);

  let total = 0;
  data.slice().reverse().forEach(e=>{
    total += e.amount;
    totals[e.category] += e.amount;

    list.innerHTML += `
      <li>
        <div>
          <strong>${e.category}</strong>
          <div class="note">${e.note||""}</div>
        </div>
        <span>₹${e.amount}</span>
      </li>
    `;
  });

  totalEl.textContent = total;
  foodTotal.textContent = `₹${totals.Food}`;
  travelTotal.textContent = `₹${totals.Travel}`;
  shoppingTotal.textContent = `₹${totals.Shopping}`;
  billsTotal.textContent = `₹${totals.Bills}`;

  drawChart();
}

function drawChart() {
  if(chart) chart.destroy();
  chart = new Chart(chartEl = document.getElementById("chart"), {
    type:"doughnut",
    data:{
      labels:Object.keys(totals),
      datasets:[{
        data:Object.values(totals),
        backgroundColor:["#22c55e","#3b82f6","#f59e0b","#ef4444"]
      }]
    },
    options:{
      cutout:"70%",
      plugins:{ legend:{ position:"bottom" } }
    }
  });
}

render();

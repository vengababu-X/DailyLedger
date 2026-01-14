let data = JSON.parse(localStorage.getItem("ledgerly")) || [];
let currentCat = null;
let chart;

const totalEl = document.getElementById("totalAmount");
const list = document.getElementById("list");
const catsWrap = document.getElementById("categories");

/* FAB */
fab.onclick = () => sheet.classList.remove("hidden");

/* CATEGORY PICK */
document.querySelectorAll(".cats button").forEach(b=>{
  b.onclick = ()=> currentCat = b.dataset.cat;
});

/* SAVE */
save.onclick = ()=>{
  if(!amount.value) return;
  data.push({
    amount:+amount.value,
    note:note.value,
    cat:currentCat || "Food",
    date:new Date()
  });
  localStorage.setItem("ledgerly",JSON.stringify(data));
  amount.value=note.value="";
  sheet.classList.add("hidden");
  render();
};

function render() {
  list.innerHTML="";
  catsWrap.innerHTML="";

  let map={};
  let total=0;

  data.forEach(e=>{
    total+=e.amount;
    map[e.cat]=(map[e.cat]||0)+e.amount;
  });

  totalEl.textContent=total;

  Object.keys(map).forEach(c=>{
    const row=document.createElement("div");
    row.className="category";
    row.innerHTML=`<span>${c}</span><strong>₹${map[c]}</strong>`;
    row.onclick=()=>{ currentCat=c; render(); };
    catsWrap.appendChild(row);
  });

  data
    .filter(e=>!currentCat || e.cat===currentCat)
    .forEach(e=>{
      const li=document.createElement("li");
      li.innerHTML=`
        <div>
          <div>${e.cat}</div>
          <div class="note">${e.note||"—"}</div>
        </div>
        <strong>₹${e.amount}</strong>
      `;
      list.appendChild(li);
    });

  drawChart(map);
}

function drawChart(map){
  if(chart) chart.destroy();
  chart=new Chart(document.getElementById("chart"),{
    type:"doughnut",
    data:{
      labels:Object.keys(map),
      datasets:[{ data:Object.values(map) }]
    },
    options:{
      cutout:"70%",
      plugins:{ legend:{ display:false } }
    }
  });
}

render();

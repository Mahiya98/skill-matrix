<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Employee Skill Dashboard</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<style>
  body {
    font-family: Arial, sans-serif;
    margin: 20px;
    background: #f5f6f8;
  }
  .cards {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .card {
    background: #fff;
    border-radius: 8px;
    padding: 16px 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    min-width: 140px;
    text-align: center;
  }
  .card h3 {
    margin: 0 0 8px 0;
    font-size: 13px;
    color: #666;
    text-transform: uppercase;
  }
  .card div {
    font-size: 26px;
    font-weight: bold;
    color: #222;
  }
  .charts {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .chart-box {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    width: 380px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  th, td {
    padding: 8px 12px;
    border-bottom: 1px solid #eee;
    text-align: left;
    font-size: 14px;
  }
  th {
    background: #fafafa;
  }
  #status {
    color: #b00;
    margin-bottom: 12px;
  }
</style>
</head>
<body>

<h1>Employee Skill Dashboard</h1>
<div id="status"></div>

<div class="cards">
  <div class="card"><h3>Total Employees</h3><div id="total">-</div></div>
  <div class="card"><h3>Average Score</h3><div id="average">-</div></div>
  <div class="card"><h3>Skill Level A</h3><div id="levelA">-</div></div>
  <div class="card"><h3>Skill Level B</h3><div id="levelB">-</div></div>
</div>

<div class="charts">
  <div class="chart-box"><canvas id="skillChart"></canvas></div>
  <div class="chart-box"><canvas id="roleChart"></canvas></div>
</div>

<table>
  <thead>
    <tr>
      <th>Enroll</th>
      <th>Role</th>
      <th>Score</th>
      <th>Skill Level</th>
    </tr>
  </thead>
  <tbody id="table"></tbody>
</table>

<script>
const sheetURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRY0uYrlxVpMNyoC-rg_8w91TXF9RyhvirQGL6nuNZA3treJYL2tooOygrxskfvHHhHz5xq5HkHFy9C/pub?gid=1128780812&single=true&output=csv";

let employees = [];

fetch(sheetURL)
  .then(response => {
    if (!response.ok) {
      throw new Error("Fetch failed with status " + response.status);
    }
    return response.text();
  })
  .then(csv => {
    console.log(csv);
    let result = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true
    });
    console.log(result.data);
    employees = result.data.map(row => {
      return {
        sbu: row["SBU"],
        section: row["Section"],
        enroll: row["Enroll"],
        role: row["Role"],
        score: parseFloat((row["Score"] || "0").replace("%", "")),
        skill: row["Skill Level"],
        tna: row["TNA"]
      };
    });
    console.log("Employees:", employees);
    createDashboard();
  })
  .catch(error => {
    console.error(error);
    document.getElementById("status").innerHTML =
      "Could not load data: " + error.message +
      ". Make sure the sheet is published to the web (File > Share > Publish to web) and the gid matches the correct tab.";
  });

function createDashboard() {
  document.getElementById("total").innerHTML = employees.length;

  let avg =
    employees.reduce((sum, e) => sum + e.score, 0) / employees.length;
  document.getElementById("average").innerHTML = avg.toFixed(2) + "%";

  let levelA = employees.filter(e => e.skill && e.skill.includes("A")).length;
  let levelB = employees.filter(e => e.skill && e.skill.includes("B")).length;
  document.getElementById("levelA").innerHTML = levelA;
  document.getElementById("levelB").innerHTML = levelB;

  loadTable();
  loadCharts();
}

function loadTable() {
  let html = "";
  employees.forEach(e => {
    html += `
      <tr>
        <td>${e.enroll}</td>
        <td>${e.role}</td>
        <td>${e.score}%</td>
        <td>${e.skill}</td>
      </tr>
    `;
  });
  document.getElementById("table").innerHTML = html;
}

function loadCharts() {
  let skills = {};
  employees.forEach(e => {
    let s = e.skill || "Unknown";
    skills[s] = (skills[s] || 0) + 1;
  });
  new Chart(document.getElementById("skillChart"), {
    type: "pie",
    data: {
      labels: Object.keys(skills),
      datasets: [{ data: Object.values(skills) }]
    },
    options: {
      plugins: { title: { display: true, text: "Skill Level Distribution" } }
    }
  });

  let roles = {};
  employees.forEach(e => {
    let role = e.role || "Unknown";
    if (!roles[role]) roles[role] = [];
    roles[role].push(e.score);
  });
  let roleAverage = {};
  Object.keys(roles).forEach(role => {
    roleAverage[role] =
      (roles[role].reduce((a, b) => a + b, 0) / roles[role].length).toFixed(2);
  });
  new Chart(document.getElementById("roleChart"), {
    type: "bar",
    data: {
      labels: Object.keys(roleAverage),
      datasets: [{ label: "Average Score %", data: Object.values(roleAverage) }]
    },
    options: {
      plugins: { title: { display: true, text: "Average Score by Role" } }
    }
  });
}
</script>

</body>
</html>

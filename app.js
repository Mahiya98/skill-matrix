const sheetURL =
"const sheetURL = "https://docs.google.com/spreadsheets/d/2PACX-1vRY0uYrlxVpMNyoC-rg_8w91TXF9RyhvirQGL6nuNZA3treJYL2tooOygrxskfvHHhHz5xq5HkHFy9C/export?format=csv&gid=1128780812";
";


let employees=[];


fetch(sheetURL)

.then(response => response.text())

.then(csv => {


console.log(csv);


let result = Papa.parse(csv,{
    header:true,
    skipEmptyLines:true
});


console.log(result.data);



employees = result.data.map(row => {


return {

sbu: row["SBU"],

section: row["Section"],

enroll: row["Enroll"],

role: row["Role"],


score:
parseFloat(
(row["Score"] || "0")
.replace("%","")
),


skill:
row["Skill Level"],


tna:
row["TNA"]

};


});



console.log("Employees:",employees);


createDashboard();


})

.catch(error=>{

console.error(error);

});





function createDashboard(){


document.getElementById("total").innerHTML =
employees.length;



let avg =
employees.reduce(
(sum,e)=>sum+e.score,0
)
/employees.length;


document.getElementById("average").innerHTML =
avg.toFixed(2)+"%";



let levelA =
employees.filter(e =>
e.skill &&
e.skill.includes("A")
).length;



let levelB =
employees.filter(e =>
e.skill &&
e.skill.includes("B")
).length;



document.getElementById("levelA").innerHTML =
levelA;


document.getElementById("levelB").innerHTML =
levelB;



loadTable();

loadCharts();


}





function loadTable(){


let html="";


employees.forEach(e=>{


html += `

<tr>

<td>${e.enroll}</td>

<td>${e.role}</td>

<td>${e.score}%</td>

<td>${e.skill}</td>

</tr>

`;

});


document.getElementById("table").innerHTML=html;


}






function loadCharts(){


let skills={};


employees.forEach(e=>{


let s=e.skill || "Unknown";


skills[s]=(skills[s]||0)+1;


});



new Chart(
document.getElementById("skillChart"),
{

type:"pie",

data:{


labels:Object.keys(skills),


datasets:[{

data:Object.values(skills)

}]


}

});





let roles={};


employees.forEach(e=>{


let role=e.role || "Unknown";


if(!roles[role])
roles[role]=[];


roles[role].push(e.score);


});



let roleAverage={};


Object.keys(roles).forEach(role=>{


roleAverage[role]=

(
roles[role].reduce((a,b)=>a+b,0)
/
roles[role].length

).toFixed(2);


});



new Chart(
document.getElementById("roleChart"),
{


type:"bar",


data:{


labels:Object.keys(roleAverage),


datasets:[{

label:"Average Score %",

data:Object.values(roleAverage)

}]


}


});


}

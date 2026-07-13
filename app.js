const sheetURL =
"https://docs.google.com/spreadsheets/d/1sIJuNhN5PiV77MpHgfVDi1tQKGxk4IP42Jbz8119dA4/edit?gid=1128780812#gid=1128780812";



let employees=[];



fetch(sheetURL)

.then(response=>response.text())

.then(data=>{


let rows=data.split("\n");


let headers=
rows[0].split(",");



rows.slice(1).forEach(row=>{


let col=row.split(",");



if(col.length>=7){


employees.push({

sbu:col[0],

section:col[1],

enroll:col[2],

role:col[3],

score:
parseFloat(
col[4].replace("%","")
),

skill:col[5],

tna:col[6]


});


}


});



createDashboard();



});






function createDashboard(){



document.getElementById("total")
.innerHTML=
employees.length;



let avg=
employees.reduce(
(a,b)=>a+b.score,0
)
/employees.length;



document.getElementById("average")
.innerHTML=
avg.toFixed(2)+"%";





let levelA=
employees.filter(
x=>x.skill.includes("A")
).length;


let levelB=
employees.filter(
x=>x.skill.includes("B")
).length;



document.getElementById("levelA")
.innerHTML=
levelA;


document.getElementById("levelB")
.innerHTML=
levelB;



loadTable();

loadCharts();


}






function loadTable(){


let html="";


employees.forEach(e=>{


html+=`

<tr>

<td>${e.enroll}</td>

<td>${e.role}</td>

<td>${e.score}%</td>

<td>${e.skill}</td>

</tr>

`;


});


document.getElementById("table")
.innerHTML=html;


}






function loadCharts(){



let skills={};


employees.forEach(e=>{


skills[e.skill]=
(skills[e.skill]||0)+1;


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


if(!roles[e.role])

roles[e.role]=[];


roles[e.role].push(e.score);


});



let roleAverage={};



Object.keys(roles)
.forEach(r=>{


roleAverage[r]=
(
roles[r].reduce((a,b)=>a+b,0)
/roles[r].length
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

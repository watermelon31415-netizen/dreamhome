let images = [];

let currentKeyword = "";


fetch("images.json")
.then(response => response.json())
.then(data => {

    images = data.map(item => {

        if(!item.id){

            item.id = Date.now() + Math.random();

        }

        return item;

    });


    showTags();

    showImages();

});

let currentKeyword = "";

function showTags(){

let tagCount = {};


images.forEach(item=>{

(item.tags || []).forEach(tag=>{

if(tagCount[tag]){

tagCount[tag]++;

}else{

tagCount[tag]=1;

}

});

});


document.getElementById("tagList").innerHTML =

Object.keys(tagCount).map(tag=>`

<button onclick="searchByTag('${tag}')">

🏷 ${tag} ${tagCount[tag]}

</button>

`).join("");

}


function searchByTag(tag){

currentKeyword = tag;


document.getElementById("客厅").innerHTML="";
document.getElementById("卧室").innerHTML="";
document.getElementById("阳台").innerHTML="";
document.getElementById("厨房").innerHTML="";
document.getElementById("工作室").innerHTML="";
document.getElementById("卫生间").innerHTML="";
document.getElementById("餐厅").innerHTML="";

showImages();

}


function showImages(){



images.forEach(item=>{


if(
currentKeyword &&
!(item.tags || []).join(",").includes(currentKeyword)
){

return;

}


let box = document.getElementById(item.room);



let tagsHTML = "";


if(item.tags){

item.tags.forEach(tag=>{

tagsHTML += `<span class="tag">#${tag}</span>`;

});

}



box.innerHTML += `


<div class="card">


<img src="${item.image}">


<div>

${tagsHTML}

</div>



${item.note ? `<p>📝 ${item.note}</p>` : ""}

<button onclick="editImage(${item.id})">
✏️ 编辑
</button>


<button onclick="deleteImage(${item.id})">
🗑 删除
</button>

</div>


`;



});


}




function saveImage(){


let file = document.getElementById("imageInput").files[0];


let room = document.getElementById("room").value;


let note = document.getElementById("note").value;


let tagsText = document.getElementById("tags").value;


let tags = tagsText
.split(",")
.map(t=>t.trim())
.filter(t=>t);



if(!file){

alert("请选择图片");

return;

}



let reader = new FileReader();



reader.onload=function(e){


images.push({
id: Date.now(),
room:room,

image:e.target.result,

note:note,

tags:tags

});



localStorage.setItem(

"dreamHome",

JSON.stringify(images)

);



location.reload();



}



reader.readAsDataURL(file);



}



currentKeyword = document
.getElementById("search")
.value
.trim();


document.getElementById("客厅").innerHTML="";
document.getElementById("卧室").innerHTML="";
document.getElementById("阳台").innerHTML="";
document.getElementById("厨房").innerHTML="";
document.getElementById("餐厅").innerHTML="";
document.getElementById("工作室").innerHTML="";
document.getElementById("卫生间").innerHTML="";

showTags();

showImages();

}



function deleteImage(id){

let result = confirm("确定删除这张图片吗？");


if(result){

images = images.filter(item => item.id !== id);


localStorage.setItem(
"dreamHome",
JSON.stringify(images)
);


location.reload();

}

}


function editImage(id){


let item = images.find(item => item.id == id);

let newRoom = prompt(
"修改房间：客厅 / 卧室 / 阳台 / 厨房 / 工作室 / 卫生间 / 餐厅",
item.room
);

let newTags = prompt(
"修改标签，用逗号分隔",
(item.tags || []).join(",")
);


if(newTags !== null){

item.tags = newTags
.split(",")
.map(t=>t.trim())
.filter(t=>t);

}

if(newRoom !== null && newRoom !== ""){

item.room = newRoom;

}

let newNote = prompt(
"修改备注：",
item.note || ""
);


if(newNote !== null){


item.note = newNote;


localStorage.setItem(
"dreamHome",
JSON.stringify(images)
);


location.reload();


}


}

const supabaseUrl = "你的 Project URL";
const supabaseKey = "你的 Publishable key";

const supabase = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);


let images = [];
let currentKeyword = "";

async function loadImages(){

    const { data, error } = await supabase
        .from("images")
        .select("*")
        .order("created_at", { ascending: false });


    if(error){

        console.error("读取失败:", error);

        return;

    }


    images = data;


    showTags();

    showImages();

}

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

if(currentKeyword && 
!item.tags.join(",").includes(currentKeyword)){
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


<img src="${item.image_url}">


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







loadImages();

function searchImages(){

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

async function deleteImage(id){

    let result = confirm("确定删除这张图片吗？");

    if(result){

        const { error } = await supabase
            .from("images")
            .delete()
            .eq("id", id);


        if(error){

            console.error(error);

        }


        location.reload();

    }

}





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




location.reload();


}


}

console.log("Dream Home script loaded");

const supabaseUrl = "https://ocqurgwxtqhmvavmbrky.supabase.co";
const supabaseKey = "sb_publishable_euhGO6kO7Q7cciA3G_hiqg_xZ1xnoHy";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

let images = [];
let currentKeyword = "";

async function loadImages(){

    const { data, error } = await supabaseClient
        .from("images")
        .select("*")
        .order("created_at", { ascending: false });


    if(error){

        console.error("读取失败:", error);

        return;

    }


images = data.map(item => {

   if(typeof item.tags === "string"){

    item.tags = item.tags
        .replace("[", "")
        .replace("]", "")
        .split(",")
        .map(t => t.trim());

}

    return item;

});


console.log(images);


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


<button onclick="deleteImage('${item.id}')">
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



async function saveImage(){

    let file = document.getElementById("imageInput").files[0];

    let room = document.getElementById("room").value;

    let note = document.getElementById("note").value;

    let title = document.getElementById("title").value;

    console.log("TITLE:", title);

    let tagsText = document.getElementById("tags").value;


    let tags = tagsText
        .split(/[,，]/)
        .map(t => t.trim())
        .filter(t => t);


    if(!file){

        alert("请选择图片");

        return;

    }


    let fileExt = file.name.split(".").pop();
    
    let fileName = Date.now() + "." + fileExt;


    const { error: uploadError } = await supabaseClient
        .storage
        .from("dream-home")
        .upload(fileName, file);


    if(uploadError){

        console.error(uploadError);

        alert("图片上传失败");

        return;

    }


    const { data: urlData } = supabaseClient
        .storage
        .from("dream-home")
        .getPublicUrl(fileName);


    const image_url = urlData.publicUrl;



    const { error: insertError } = await supabaseClient
    .from("images")
    .insert({

        title: title,

        room: room,

        tags: tags,

        image_url: image_url,

        note: note

    });



    if(insertError){

        console.error(insertError);

        alert("保存失败");

        return;

    }


    alert("上传成功");

    location.reload();

}



async function deleteImage(id){

    console.log("删除ID:", id);

    let result = confirm("确定删除这张图片吗？");

    if(result){

        const { error } = await supabaseClient
            .from("images")
            .delete()
            .eq("id", id);


        if(error){

            console.error(error);
            alert("删除失败");
            return;

        }

        location.reload();

    }

}

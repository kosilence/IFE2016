// 定义DOM搜索函数
$ = function(x){
    return document.querySelector(x);
};
$a = function(x){
    return document.querySelectorAll(x);
};

//定义全局变量
var allSchool = [["清华大学","北京大学","北京师范大学","中国人民大学","北京交通大学","中央财经大学"],
                ["复旦大学","同济大学","上海交通大学","华东师范大学","上海大学","上海财经大学"],
                ["中山大学","华南理工大学","华南师范大学","广东外语外贸大学","广东工业大学","广州大学"]];

//在校生和非在校生界面切换函数
function chooseId(){
    if(this.id == "isStu"){
        $(".inSchool").style.display = "flex";
        $(".inCompany").style.display = "none";
    }else{
        $(".inSchool").style.display = "none";
        $(".inCompany").style.display = "flex";
    }
}
//更新select表格内容
function changeSelect(arr){
    var school = $a("#school option");
    for(var i=0;i<6;i++){
        school[i].innerHTML = arr[i];
    }
}
//根据city的选择，刷新school列表
function refreshSchool(){
    var city = this.value;
    if(city == "shanghai"){
        changeSelect(allSchool[1]);
    }else if(city == "guangzhou"){
        changeSelect(allSchool[2]);
    }else{
        changeSelect(allSchool[0]);
    }
}

// 初始化函数
function init(){
    $a("input")[0].onfocus = chooseId;
    $a("input")[1].onfocus = chooseId;
    $("#city").onchange = refreshSchool;
}
window.onload = init;
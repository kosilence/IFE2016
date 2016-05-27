// 定义DOM搜索函数
$ = function(x){
    return document.querySelector(x);
};
$a = function(x){
    return document.querySelectorAll(x);
};

//定义全局变量
var limit = /^[\w\u4e00-\u9fa5]+$/;

//初始化函数
function inputInit(){
    var myTip = $("p");
    myTip.innerHTML = "必填，长度为4-16个字符";
    myTip.className = "tip";
}
//判断输入是否符合要求
function getLength(str){
    var len = str.length;
    var realLen = 0;
    for(var i=0;i<len;i++){
        var charCode = str.charCodeAt(i);
        if(charCode >= 0 && charCode <= 128){
            realLen += 1;
        }else{
            realLen += 2;
        }
    }
    return realLen;
}
//判断myStr的输入是否符合要求
function checkInput(){
    inputInit();
    var myStr = $("input").value.trim();
    var myTip = $("p");
    var len = getLength(myStr);
    if(myStr != ''){
        if(limit.test(myStr)){
            if(len>=4 && len<=16){
                myTip.innerHTML = "名称格式正确";
                myTip.className += " correct";
            }else{
                myTip.innerHTML = "名称长度不符，请重新输入";
                myTip.className += " error";
            }
        }else{
            myTip.innerHTML = "名称含有非法字符，请重新输入";
            myTip.className += " error";
        }
    }else{
        myTip.innerHTML = "姓名不能为空";
        myTip.className += " error";
    }
    return false;
}

// 初始化函数
function init(){
    $("button").onclick = checkInput;
}
window.onload = init;
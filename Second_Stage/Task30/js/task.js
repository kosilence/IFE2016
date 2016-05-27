// 定义DOM搜索函数
$ = function(x){
    return document.querySelector(x);
};
$a = function(x){
    return document.querySelectorAll(x);
};

//定义全局变量
var myTip = $(".tip");
var l_name = /^[\w\u4e00-\u9fa5]+$/;
var l_password = /^\w+$/;
var l_email = /^\w+[-_.]?\w+@(\w+[-.])+\w{2,5}$/;
var l_phone = /^1[0-9]{10}$/;
var inputState = [0,0,0,0,0];


//输入框初始化函数
function inputInit(){
    this.nextElementSibling.style.display = "block";
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
//判断Name的输入是否符合要求
function checkName(){
    var myInfo = this;
    var myTip = this.nextElementSibling;
    var myInfoStr = myInfo.value.trim();
    var len = getLength(myInfoStr);
    if(myInfoStr != ''){
        if(l_name.test(myInfoStr)){
            if(len>=4 && len<=16){
                myTip.innerHTML = "名称格式正确";
                myTip.style.color = "#25f936";
                myInfo.style.border = "2px solid #25f936";
                inputState[0] = 1;
            }else{
                myTip.innerHTML = "名称长度不符，请重新输入";
                myTip.style.color = "#fd2745";
                myInfo.style.border = "2px solid #fd2745";
                inputState[0] = 0;
            }
        }else{
            myTip.innerHTML = "名称含有非法字符，请重新输入";
            myTip.style.color = "#fd2745";
            myInfo.style.border = "2px solid #fd2745";
            inputState[0] = 0;
        }
    }else{
        myTip.innerHTML = "名称不能为空";
        myTip.style.color = "#fd2745";
        myInfo.style.border = "2px solid #fd2745";
        inputState[0] = 0;
    }
}
//判断Password的输入是否符合要求
function checkPassword(){
    var myInfo = this;
    var myTip = this.nextElementSibling;
    var myInfoStr = myInfo.value.trim();
    var len = getLength(myInfoStr);
    if(myInfoStr != ''){
        if(l_password.test(myInfoStr)){
            if(len>=6 && len<=10){
                myTip.innerHTML = "密码可用";
                myTip.style.color = "#25f936";
                myInfo.style.border = "2px solid #25f936";
                inputState[1] = 1;
            }else{
                myTip.innerHTML = "密码长度不符，请重新输入";
                myTip.style.color = "#fd2745";
                myInfo.style.border = "2px solid #fd2745";
                inputState[1] = 0;
            }
        }else{
            myTip.innerHTML = "密码含有非法字符，请重新输入";
            myTip.style.color = "#fd2745";
            myInfo.style.border = "2px solid #fd2745";
            inputState[1] = 0;
        }
    }else{
        myTip.innerHTML = "密码不能为空";
        myTip.style.color = "#fd2745";
        myInfo.style.border = "2px solid #fd2745";
        inputState[1] = 0;
    }
}
//判断RePassword的输入是否符合要求
function checkRePassword(){
    var myInfo = this;
    var myTip = this.nextElementSibling;
    var myInfoStr = myInfo.value.trim();
    var myPassword = $a("input")[1].value.trim();
    if(myInfoStr != ''){
        if(myInfoStr == myPassword){
            myTip.innerHTML = "密码一致";
            myTip.style.color = "#25f936";
            myInfo.style.border = "2px solid #25f936";
            inputState[2] = 1;
        }else{
            myTip.innerHTML = "两次密码输入不一致，请重新输入";
            myTip.style.color = "#fd2745";
            myInfo.style.border = "2px solid #fd2745";
            inputState[2] = 0;
        }
    }else{
        myTip.innerHTML = "密码不能为空";
        myTip.style.color = "#fd2745";
        myInfo.style.border = "2px solid #fd2745";
        inputState[2] = 0;
    }
}
//判断Email的输入是否符合要求
function checkEmail(){
    var myInfo = this;
    var myTip = this.nextElementSibling;
    var myInfoStr = myInfo.value.trim();
    if(myInfoStr != ''){
        if(l_email.test(myInfoStr)){
            myTip.innerHTML = "邮箱可用";
            myTip.style.color = "#25f936";
            myInfo.style.border = "2px solid #25f936";
            inputState[3] = 1;
        }else{
            myTip.innerHTML = "邮箱格式错误，请重新输入";
            myTip.style.color = "#fd2745";
            myInfo.style.border = "2px solid #fd2745";
            inputState[3] = 0;
        }
    }else{
        myTip.innerHTML = "邮箱不能为空";
        myTip.style.color = "#fd2745";
        myInfo.style.border = "2px solid #fd2745";
        inputState[3] = 0;
    }
}
//判断Phone的输入是否符合要求
function checkPhone(){
    var myInfo = this;
    var myTip = this.nextElementSibling;
    var myInfoStr = myInfo.value.trim();
    if(myInfoStr != ''){
        if(l_phone.test(myInfoStr)){
            myTip.innerHTML = "号码可用";
            myTip.style.color = "#25f936";
            myInfo.style.border = "2px solid #25f936";
            inputState[4] = 1;
        }else{
            myTip.innerHTML = "号码格式错误，请重新输入";
            myTip.style.color = "#fd2745";
            myInfo.style.border = "2px solid #fd2745";
            inputState[4] = 0;
        }
    }else{
        myTip.innerHTML = "号码不能为空";
        myTip.style.color = "#fd2745";
        myInfo.style.border = "2px solid #fd2745";
        inputState[4] = 0;
    }
}
//提交按钮处理函数
function checkBtn(){
    for(var i=0;i<5;i++){
        if(inputState[i] == 0){
            alert("输入有误");
            return false;
        }
    }
    alert("提交成功");
    return true;
}
// 初始化函数
function init(){
    $a("input")[0].onfocus = inputInit;
    $a("input")[1].onfocus = inputInit;
    $a("input")[2].onfocus = inputInit;
    $a("input")[3].onfocus = inputInit;
    $a("input")[4].onfocus = inputInit;
    $a("input")[0].onblur = checkName;
    $a("input")[1].onblur = checkPassword;
    $a("input")[2].onblur = checkRePassword;
    $a("input")[3].onblur = checkEmail;
    $a("input")[4].onblur = checkPhone;
    $("button").onclick = checkBtn;
}
window.onload = init;
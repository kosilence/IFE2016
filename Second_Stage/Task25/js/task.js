// 定义DOM搜索函数
$ = function(x){
    return document.querySelector(x);
};
$a = function(x){
    return document.querySelectorAll(x);
};

//定义全局变量
var divOrder = [];//DIV节点存储数组
var Pvalue = [];//文本节点存储数组
var myRoot = $(".root");//根节点

// 重置函数
function reset(){
    var len = Pvalue.length;
    if(len>0){
        for(var i=0;i<len;i++){
                Pvalue[i].style.backgroundColor = "#deebf2";
        }
    }
    divOrder = [];
    Pvalue = [];
}
// 深度优先遍历
function DFSearch(node){
    if(!(node == null)){
        divOrder.push(node);
        var len = node.children.length;
        for(var i=0;i<len;i++){
            DFSearch(node.children[i]);
        }
    }
}
//需筛出优化遍历中的<p>标签节点
function removeP(){
    var len = divOrder.length;
    for(var i=0;i<len;i++){
        if (divOrder[i].nodeName == "P"){
            Pvalue.push(divOrder[i]);
        }
    }
}
//获取输入值，定位P标签所在DIV的位置
function getInput(){
    var myInput = $('input').value.trim();
    var len = Pvalue.length;
    for(var i=0;i<len;i++){
        if(Pvalue[i].innerHTML.indexOf(myInput) == 0){
            Pvalue[i].style.backgroundColor = "#850083";
            return (Pvalue[i].parentNode);
        }
    }
    return false;
}
// 定位DIV的位置，重置divOrder数组渲染
function locatDIV(){
    var getDiv = getInput();
    if(getDiv){
        //展开标签
        if(getDiv.style.display == "none"){
            getDiv.style.display = "block";
            toggle(getDiv);
        }
    }else{
        alert("搜索不到结果！");
    }
}
//显示和隐藏标签
function toggle(obj){
    if(!(obj == null)){
        if(obj.nextElementSibling.nodeName == "DIV"){
            obj.nextElementSibling.style.display = (obj.nextElementSibling.style.display != "none"?"none":"block");
        }
        toggle(obj.nextElementSibling);
    }
}
//P标签初始化绑定事件
function pInit(obj){
    obj.onclick = function(){
        toggle(this);
        event.cancelBubble = true;//禁止起泡事件，防止div点击事件往上一级传递
    }
    obj.onmouseover = function(){
        obj.lastElementChild.style.display = "inline-block";
    }
    obj.onmouseout = function(){
        obj.lastElementChild.style.display = "none";
    }
}
//Add按钮初始化绑定事件
function addInit(obj){
    obj.lastElementChild.firstElementChild.onclick = function(){
        var myInput = prompt('请输入要添加的内容');
        var newDiv = document.createElement('DIV');
        var newP = document.createElement('P');
        newP.innerHTML = myInput+'<span class="symbol"><span>＋</span><span>×</span></span>';
        newDiv.appendChild(newP);
        newDiv.className = 'child';
        obj.parentNode.appendChild(newDiv);
        divInit();
        event.cancelBubble = true;//禁止起泡事件，防止div点击事件往上一级传递
    }
    obj.lastElementChild.firstElementChild.onmouseover = function(){
        obj.lastElementChild.firstElementChild.style.backgroundColor = '#deebf2';
    }
    obj.lastElementChild.firstElementChild.onmouseout = function(){
        obj.lastElementChild.firstElementChild.style.backgroundColor = '#fff';
    }
}
//Del按钮初始化绑定事件
function delInit(obj){
    obj.lastElementChild.lastElementChild.onclick = function(){
        obj.parentNode.parentNode.removeChild(obj.parentNode);
        event.cancelBubble = true;//禁止起泡事件，防止div点击事件往上一级传递
    }
    obj.lastElementChild.lastElementChild.onmouseover = function(){
        obj.lastElementChild.lastElementChild.style.backgroundColor = '#deebf2';
    }
    obj.lastElementChild.lastElementChild.onmouseout = function(){
        obj.lastElementChild.lastElementChild.style.backgroundColor = '#fff';
    }
}
//div标签初始化绑定onclick事件
function divInit(){
    var divAll = $a(".root p");
    var len =  divAll.length;
    for(var i=0;i<len;i++){
        pInit(divAll[i]);
        addInit(divAll[i]);
        delInit(divAll[i]);
    }
}
//搜索按钮
function btn0(){
    reset();
    DFSearch(myRoot);
    removeP();
    locatDIV();
}
//清除按钮
function btn1(){
    reset();
}
// 初始化函数
function init(){
    $a("button")[0].onclick = btn0;
    $a("button")[1].onclick = btn1;
    // $a("button")[2].onclick = btn2;
    // $a("button")[3].onclick = btn3;
    // $a("button")[4].onclick = btn4;
    divInit();
}
window.onload = init;

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
var timer = null;//定时器渲染页面专用
var BFindex = 0;//BF算法叠加变量
var flag = false;//判断是否为搜索按钮
var divNode = null;//保存现阶段选中的div node

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
// 广度优先遍历
function BFSearch(node){
    if(!(node == null)){
        divOrder.push(node);
        if(divOrder.length>1)
        {
            BFSearch(node.nextElementSibling);
        }
        node = divOrder[BFindex++];
        BFSearch(node.firstElementChild);
    }
}
//需筛出优化遍历中误入的<p>标签节点
function removeP(){
    var term = [];
    var len = divOrder.length;
    for(var i=0;i<len;i++){
        if (divOrder[i].nodeName != "P"){
            term.push(divOrder[i]);
        }else{
            Pvalue.push(divOrder[i]);
        }
    }
    divOrder = term;
}
// 遍历动画渲染函数
function render(){
    var i = 0;
    var len = divOrder.length;
    divOrder[0].style.backgroundColor = "#b18cb0";
    timer = setInterval(function(){
        i++;
        if(i < len){
                divOrder[i].style.backgroundColor = "#b18cb0";
                divOrder[i-1].style.backgroundColor = "#fff";
        }else{
              clearInterval(timer);
              divOrder[i-1].style.backgroundColor = "#fff";
              if(flag){
                divOrder[i-1].style.backgroundColor = "#b18cb0";
              }
        }
    },200)
}
// 重置函数
function reset(){
    var len = divOrder.length;
    if(len>0){
        clearInterval(timer);
        for(var i=0;i<len;i++){
                divOrder[i].style.backgroundColor = "#fff";
        }
    }
    divOrder = [];
    BFindex = 0;
    Pvalue = [];
    flag = false;
}
//获取输入值，定位P标签所在DIV的位置
function getInput(){
    var myInput = $('input').value;
    var len = Pvalue.length;
    for(var i=0;i<len;i++){
        if(Pvalue[i].innerHTML == myInput){
            return (Pvalue[i].parentNode);
        }
    }
    return false;
}
// 定位DIV的位置，重置divOrder数组渲染
function locatDIV(){
    flag = true;
    var len = divOrder.length;
    var getDiv = getInput();
    for(var i=0;i<len;i++){
        if(divOrder[i] == getDiv){
            divOrder = divOrder.slice(0,i+1);
            break;
        }
    }
    if(getDiv){
        render();
    }else{
        alert("搜索不到结果！");
    }
}
//div标签初始化绑定onclick事件
function divInit(){
    var divAll = $a("div");
    var len =  divAll.length;
    for(var i=0;i<len;i++){
        divAll[i].onclick = function(){
            if(divNode){
                divNode.style.backgroundColor = "#fff";
            }
            this.style.backgroundColor = "#b18cb0";
            divNode = this;
            event.cancelBubble = true;//禁止起泡事件，防止div点击事件往上一级传递
        }
    }
}
//几个按钮的点击事件函数
//DF搜索
function btn0(){
    reset();
    DFSearch(myRoot);
    removeP();
    render();
}
//BF搜索
function btn1(){
    reset();
    BFSearch(myRoot);
    removeP();
    render();
}
//搜索按钮
function btn2(){
    reset();
    DFSearch(myRoot);
    removeP();
    locatDIV();
}
//添加元素按钮
function btn3(){
    if(divNode){
        var myInput = $('input').value;
        var newDiv = document.createElement('DIV');
        var newP = document.createElement('P');
        newP.innerHTML = myInput;
        newDiv.appendChild(newP);
        switch(divNode.className){
            case 'root':
                newDiv.className = 'child-1';
                break;
            case 'child-1':
                newDiv.className = 'child-2';
                break;
            case 'child-2':
                newDiv.className = 'child-3';
                break;
            default:
                newDiv.className = 'child-4';
        }
        divNode.appendChild(newDiv);
        divInit();
    }else{
        alert("未选中元素");
    }
}
//删除元素按钮
function btn4(){
    if(divNode){
        divNode.parentNode.removeChild(divNode);
        divNode = null;
    }else{
        alert("未选中元素");
    }
}
// 初始化函数
function init(){
    $a("button")[0].onclick = btn0;
    $a("button")[1].onclick = btn1;
    $a("button")[2].onclick = btn2;
    $a("button")[3].onclick = btn3;
    $a("button")[4].onclick = btn4;
    divInit();
}
window.onload = init;
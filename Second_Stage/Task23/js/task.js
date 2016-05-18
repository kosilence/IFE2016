// 定义DOM搜索函数
$ = function(x){
    return document.querySelector(x);
};
$a = function(x){
    return document.querySelectorAll(x);
};

//定义全局变量
var divOrder = [];
var myRoot = $(".root");
var timer = null;
var BFindex = 0;
var Pvalue = [];
var flag = false;

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
        BFSearch(node.nextElementSibling);
        node = divOrder[++BFindex];
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
// 重置divOrder数组渲染
function locatDIV(){
    reset();
    DFSearch(myRoot);
    removeP();
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
//三个按钮的点击事件函数
function btn0(){
    reset();
    DFSearch(myRoot);
    removeP();
    render();
}
function btn1(){
    reset();
    divOrder.push(myRoot);
    BFSearch(myRoot.firstElementChild);
    removeP();
    render();
}
function btn2(){
    locatDIV();
}
// 初始化函数
function init(){
    $a("button")[0].onclick = btn0;
    $a("button")[1].onclick = btn1;
    $a("button")[2].onclick = btn2;
}
window.onload = init;
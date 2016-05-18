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

// 前序遍历
function preOrder(node){
        if(!(node == null)){
                divOrder.push(node);
                preOrder(node.firstElementChild);
                preOrder(node.lastElementChild);
        }
}
// 中序遍历
function inOrder(node){
        if(!(node == null)){
                inOrder(node.firstElementChild);
                divOrder.push(node);
                inOrder(node.lastElementChild);
        }
}
// 后序遍历
function postOrder(node){
        if(!(node == null)){
                postOrder(node.firstElementChild);
                postOrder(node.lastElementChild);
                divOrder.push(node);
        }
}
// 遍历动画渲染函数
function render(){
        var i = 0;
        divOrder[0].style.backgroundColor = "#b18cb0";
        timer = setInterval(function(){
                i++;
                if(i < 15){
                        divOrder[i].style.backgroundColor = "#b18cb0";
                        divOrder[i-1].style.backgroundColor = "#fff";
                }else{
                      clearInterval(timer);
                      divOrder[i-1].style.backgroundColor = "#fff";
                }
        },300)
}
// 重置函数
function reset(){
        var len = divOrder.length;
        if(len>0){
                clearInterval(timer);
                for(var i=0;i<15;i++){
                        divOrder[i].style.backgroundColor = "#fff";
                }
        }
        divOrder = [];
}
//三个按钮的点击事件函数
function btn0(){
        reset();
        preOrder(myRoot);
        render();
}
function btn1(){
        reset();
        inOrder(myRoot);
        render();
}
function btn2(){
        reset();
        postOrder(myRoot);
        render();
}
// 初始化函数
function init(){
        $a("button")[0].onclick = btn0;
        $a("button")[1].onclick = btn1;
        $a("button")[2].onclick = btn2;
}
window.onload = init;

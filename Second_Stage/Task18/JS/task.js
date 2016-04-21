// 模拟一个队列，队列的每个元素是一个数字，初始队列为空
var my_data = [];

function display(){
        var my_ul = document.getElementById("my_array");
        var mystr = "";
        for(var i=0;i<my_data.length;i++)
        {
                mystr += "<li onclick='ele_del(this)'>"+my_data[i]+"</li>";
        }
        my_ul.innerHTML = mystr;
}
function leftIn(){
        var newnum = document.getElementById("my_input").value;
        my_data.unshift(newnum);
        display();
}
function rightIn(){
        var newnum = document.getElementById("my_input").value;
        my_data.push(newnum);
        display();
}
function leftOut(){
        var num = my_data.shift();
        display();
        alert("已删除："+num);
}
function rightOut(){
        var num = my_data.pop();
        display();
        alert("已删除："+num);
}
function btn_init(){
        var btn1 = document.getElementById("left_in");
        btn1.onclick = function(){leftIn();}
        var btn2 = document.getElementById("right_in");
        btn2.onclick = function(){rightIn();}
        var btn3 = document.getElementById("left_out");
        btn3.onclick = function(){leftOut();}
        var btn4 = document.getElementById("right_out");
        btn4.onclick = function(){rightOut();}
}
function ele_del(obj){
        var my_ul = document.getElementById("my_array");
        for(var i=0;i<my_ul.childNodes.length;i++)
        {
                if(obj == my_ul.childNodes[i])
                {
                        my_data.splice(i,1);
                        display();
                }
        }
}
function init(){
        btn_init();
}
init();
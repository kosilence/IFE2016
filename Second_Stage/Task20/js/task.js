// 模拟一个队列，队列的每个元素是一个数字，初始队列为空
var my_data = [];
var search_mark = [];
// var pattern = new RegExp(",");
var pattern = /\s/g;

function display(){
        var my_ul = document.getElementById("my_array");
        var mystr = "";
        for(var i=0;i<my_data.length;i++)
        {
                        mystr += "<li onclick='ele_del(this)'>"+my_data[i]+"</li>";
        }
        my_ul.innerHTML = mystr;
}
function displayMark(){
        var my_ul = document.getElementById("my_array");
        for(var i=0;i<search_mark.length;i++)
        {
                my_ul.childNodes[search_mark[i]].style.backgroundColor="#ff0049";
        }
}
function getArray(){
        var str = document.getElementById("my_input").value.trim();
        var arrWord = str.split(/[^0-9a-zA-Z\u4e00-\u9fa5]+/).filter(function(e){
                if(e != null && e.length > 0){
                        return true;
                }else{
                        return false;
                }
        });
        return arrWord;
}
function leftIn(){
        var arrStr = getArray();
        for(var i=arrStr.length-1;i>=0;i--)
        {
                my_data.unshift(arrStr[i]);
        }
        display();
}
function searchMark(){
        var findText = document.getElementById("my_search").value.trim();
        search_mark = [];
        for(var i=0;i<my_data.length;i++)
        {
                if(my_data[i].indexOf(findText)>=0){
                        search_mark.push(i);
                }
        }
        displayMark();
}
function btn_init(){
        var btn1 = document.getElementById("insert");
        btn1.onclick = function(){leftIn();}
        var btn2 = document.getElementById("search");
        btn2.onclick = function(){searchMark();}
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
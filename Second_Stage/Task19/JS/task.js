// 模拟一个队列，队列的每个元素是一个数字，初始队列为空
var my_data = [];
var my_view = [];
var timer = null;

function get_num(){
        var newnum = document.getElementById("my_input").value.trim();
        var pattern = /^([0-9]|.)*$/;
        var flag = pattern.test(newnum);
        if(my_data.length > 60)
        {
                alert("数组长度超过60，请核对！");
                return false;
        }
        if(!flag){
                alert("请输入10-100间的数字！");
                return false;
        }
        else{
                newnum = parseFloat(newnum);
                if(newnum >=10 && newnum<=100){
                        return newnum;
                }
                else{
                        alert("请输入10-100间的数字！");
                        return false;
                }
        }
}
function get_color(num){
        var my_color = ["#441d49", "#538289", "#a02730", "#73832a", "#005db1", "#10193a"];
        if(num < 30){return my_color[0];}
        else if(num < 50){return my_color[1];}
        else if(num < 70){return my_color[2];}
        else if(num <90){return my_color[3];}
        else if(num < 100){return my_color[4];}
        else{return my_color[5];}
}
function display(arr){
        var my_ul = document.getElementById("my_array");
        var mystr = "";
        for(var i=0;i<arr.length;i++)
        {
                mystr += "<li onclick='ele_del(this)' style='height:"+arr[i]*3+"px;background-color:"+get_color(arr[i])+"'></li>";
        }
        my_ul.innerHTML = mystr;
}
function leftIn(){
        if(get_num()!=false)
        {
                my_data.unshift(get_num());
                display(my_data);
        }
}
function rightIn(){
        if(get_num()!=false)
        {
                my_data.push(get_num());
                display(my_data); 
        }
}
function leftOut(){
        var num = my_data.shift();
        display(my_data);
}
function rightOut(){
        var num = my_data.pop();
        display(my_data);
}
function delayView(){
        timer = setInterval(paint,10);
        function paint(){
                var view = my_view.shift() || [];
                if(view.length != 0){
                        display(view);
                }else{
                        clearInterval(timer);
                        return;
                }
        }
}
function dataSort(){
        var tdata;
        my_view = [];
        for(var i=0;i<my_data.length-1;i++)
        {
                for(var j=i+1;j<my_data.length;j++)
                {
                        if(parseFloat(my_data[j]) < parseFloat(my_data[i]))
                        {
                                tdata = my_data[j];
                                my_data[j] = my_data[i];
                                my_data[i] = tdata;
                                my_view.push(JSON.parse(JSON.stringify(my_data)));
                        }
                }
        }
}
function getrandom(){
        my_data = [];
        for(var i=0;i<40;i++)
        {       
                var rnum = 10+Math.round((Math.random())*90);
                my_data[i] = rnum;
        }
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
        var btn5 = document.getElementById("sort_btn");
        btn5.onclick = function(){dataSort();delayView();}
        var btn6 = document.getElementById("random_btn");
        btn6.onclick = function(){getrandom();display(my_data);}
}
function ele_del(obj){
        var my_ul = document.getElementById("my_array");
        for(var i=0;i<my_ul.childNodes.length;i++)
        {
                if(obj == my_ul.childNodes[i])
                {
                        my_data.splice(i,1);
                        display(my_data);
                }
        }
}
function init(){
        btn_init();
        getrandom();
        display(my_data);
}
init();
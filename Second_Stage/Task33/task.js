// 定义DOM搜索函数
$ = function(x){
    return document.querySelector(x);
};
$a = function(x){
    return document.querySelectorAll(x);
};

//定义全局变量
var active = $("#active");//方块元素
var x = 0;//方块X轴位置
var y = 0;//方块Y轴位置
var head = 0;//方块的朝向
var order = ["GO","TUN LEF","TUN RIG","TUN BAC"];//指令集

//初始化随机位置函数
function randomDiv(){
        x = Math.floor(Math.random() * 10) * 40;
        y = Math.floor(Math.random() * 10) * 40;
        active.style.left = x + 'px';
        active.style.top = y + 'px';
}
//初始化绘制div函数
function initDiv(){
        var map = $("#map");
        for(var i=0;i<10;i++){
                var newDiv = document.createElement("div");
                var newRow = map.appendChild(newDiv);
                for(var j=0;j<10;j++){
                        var newDiv = document.createElement("div");
                        newRow.appendChild(newDiv);
                }
        }
        randomDiv();
}
//方块位置行走处理
function move(){
        var inRange = (x > 0) && (x < 360) && (y > 0) && (y < 360);
        if(head == 0){
                y = y - 40;
                if(y < 0){y = 0;}
        }else if(head == 1){
                x = x + 40;
                if(x > 360){x = 360;}
        }else if(head == 2){
                y = y + 40;
                if(y > 360){y = 360;}
        }else{
                x = x - 40;
                if(x < 0){x = 0;}
        }
        active.style.left = x + 'px';
        active.style.top = y + 'px';
}
//方块朝向转换处理
function turn(num){
        if(num == 1){
                if(head == 0){
                        active.style.borderStyle = "none solid none none";
                        head = 1;
                }else if(head == 1){
                        active.style.borderStyle = "none none solid none";
                        head = 2;
                }else if(head == 2){
                        active.style.borderStyle = "none none none solid";
                        head = 3;
                }else{
                        active.style.borderStyle = "solid none none none";
                        head = 0;
                }
        }else if(num == 2){
                if(head == 3){
                        active.style.borderStyle = "none solid none none";
                        head = 1;
                }else if(head == 0){
                        active.style.borderStyle = "none none solid none";
                        head = 2;
                }else if(head == 1){
                        active.style.borderStyle = "none none none solid";
                        head = 3;
                }else{
                        active.style.borderStyle = "solid none none none";
                        head = 0;
                }
        }else if(num == 3){
                if(head == 2){
                        active.style.borderStyle = "none solid none none";
                        head = 1;
                }else if(head == 3){
                        active.style.borderStyle = "none none solid none";
                        head = 2;
                }else if(head == 0){
                        active.style.borderStyle = "none none none solid";
                        head = 3;
                }else{
                        active.style.borderStyle = "solid none none none";
                        head = 0;
                }
        }
}
//获取input指令,并执行
function getInput(){
        var my_input = $("input").value.trim();
        if(my_input == order[0]){
                move();
        }else if(my_input == order[1]){
                turn(3);
        }else if(my_input == order[2]){
                turn(1);
        }else if(my_input == order[3]){
                turn(2);
        }
}
//key控制方块变动
function keyMove(e){
        var my_key = e.keyCode;
        if(my_key == 97){
                $("input").value = "TUN LEF";
                getInput();
        }else if(my_key == 119){
                $("input").value = "GO";
                getInput();
        }else if(my_key == 100){
                $("input").value = "TUN RIG";
                getInput();
        }else if(my_key == 115){
                $("input").value = "TUN BAC";
                getInput();
        }
}
// 初始化函数
function init(){
    initDiv();
    $("button").onclick = getInput;
    document.onkeypress = keyMove;
}
window.onload = init;
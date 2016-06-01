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
var head = 0;//方块的朝向,0,1,2,3分别代表顺时针方向：上，右，下，左；
var angle = 0;//方块的旋转角
var order = ["GO","TUN LEF","TUN RIG","TUN BAC","TRA LEF","TRA TOP","TRA RIG","TRA BOT","MOV LEF","MOV TOP","MOV RIG","MOV BOT"];//指令集

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
function GO(){
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
//TUN方块朝向转换处理
function TUN(o){
        switch(o){
                case "LEF":
                        angle = angle - 9;
                        active.style.transform = "rotate(" + angle*10 + "deg)";
                        head = (head == 0) ? 3:(head-1);
                        break;
                case "RIG":
                        angle = angle + 9;
                        active.style.transform = "rotate(" + angle*10 + "deg)";
                        head = (head == 3) ? 0:(head+1);
                        break;
                case "BAC":
                        angle = angle + 18;
                        active.style.transform = "rotate(" + angle*10 + "deg)";
                        head = 3 - head;
                        break;
        }
}
//TRA方块位移指令
function TRA(o){
        switch(o){
                case "LEF":
                        x = (x == 0) ? 0:(x-40);
                        active.style.left = x + 'px';
                        break;
                case "TOP":
                        y = (y == 0) ? 0:(y-40);
                        active.style.top = y + 'px';
                        break;
                case "RIG":
                        x = (x == 360) ? 360:(x+40);
                        active.style.left = x + 'px';
                        break;
                case "BOT":
                        y = (y == 360) ? 360:(y+40);
                        active.style.top = y + 'px';
                        break;
        }
}
//MOV方块转向位移指令
function MOV(o){
        switch(o){
                case "LEF":
                        if(head != 3){
                                angle = angle + (3-head)*9;
                                active.style.transform = "rotate(" + angle*10 + "deg)";
                                head = 3;
                        }
                        GO();
                        break;
                case "TOP":
                        if(head != 0){
                                angle = angle + (4-head)*9;
                                active.style.transform = "rotate(" + angle*10 + "deg)";
                                head = 0;
                        }
                        GO();
                        break;
                case "RIG":
                        if(head != 1){
                                angle = angle + (1-head)*9;
                                active.style.transform = "rotate(" + angle*10 + "deg)";
                                head = 1;
                        }
                        GO();
                        break;
                case "BOT":
                        if(head != 2){
                                angle = angle + (2-head)*9;
                                active.style.transform = "rotate(" + angle*10 + "deg)";
                                head = 2;
                        }
                        GO();
                        break;
        }
}
//获取input指令,并执行
function getInput(){
        var my_input = $("input").value.trim();
        switch(my_input){
                case order[0]://GO
                        GO();
                        break;
                case order[1]://TUN LEF
                        TUN("LEF");
                        break;
                case order[2]://TUN RIG
                        TUN("RIG");
                        break;
                case order[3]://TUN BAC
                        TUN("BAC");
                        break;
                case order[4]://TRA LEF
                        TRA("LEF");
                        break;
                case order[5]://TRA TOP
                        TRA("TOP");
                        break;
                case order[6]://TRA RIG
                        TRA("RIG");
                        break;
                case order[7]://TRA BOT
                        TRA("BOT");
                        break;
                case order[8]://MOV LEF
                        MOV("LEF");
                        break;
                case order[9]://MOV TOP
                        MOV("TOP");
                        break;
                case order[10]://MOV RIG
                        MOV("RIG");
                        break;
                case order[11]://MOV BOT
                        MOV("BOT");
                        break;
        }
}
//key按键控制方块变动
function keyMove(e){
        var my_key = e.keyCode;
        if(my_key == 97){
                $("input").value = "TUN LEF";
        }else if(my_key == 119){
                $("input").value = "GO";
        }else if(my_key == 100){
                $("input").value = "TUN RIG";
        }else if(my_key == 115){
                $("input").value = "TUN BAC";
        }
        getInput();
}
// 初始化函数
function init(){
        initDiv();
        $("button").onclick = getInput;
        document.onkeypress = keyMove;
}
window.onload = init;
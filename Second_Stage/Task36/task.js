// 定义DOM搜索函数
$ = function(x){
        return document.querySelector(x);
};
$a = function(x){
        return document.querySelectorAll(x);
};

//定义全局变量
var active = $("#active");//方块元素
var map = $("#map");//画布地图
var input = $("#input");//输入框
var tip = $("#tip");//tip
var x = 0;//方块X轴位置
var y = 0;//方块Y轴位置
var WIDTH = 30;//方块的宽度
var HEIGHT= 30;//方块的高度
var head = 0;//方块的朝向,0,1,2,3分别代表顺时针方向：上，右，下，左；
var angle = 0;//方块的旋转角
var timer = null;//定时执行命令
var wallArr = [];
var shiftFlag = false;
var ctrlFlag = false;
var order = ["GO","TUN LEF","TUN RIG","TUN BAC","TRA LEF","TRA TOP","TRA RIG",
                "TRA BOT","MOV LEF","MOV TOP","MOV RIG","MOV BOT","BUILD","BRU"];//指令集


//初始化方块随机位置函数
function randomSpan(){
        x = Math.floor(Math.random() * 20) * WIDTH;
        y = Math.floor(Math.random() * 20) * HEIGHT;
        active.style.left = x + 'px';
        active.style.top = y + 'px';
}
//初始化绘制横纵坐标
function initSite(){
        var colSite = $("#colSite");
        var rowSite = $("#rowSite");
        for(var i=0;i<20;i++){
                var newLi = document.createElement("li");
                newLi.innerHTML = i+1;
                colSite.appendChild(newLi);
                var newLi = document.createElement("li");
                newLi.innerHTML = i+1;
                rowSite.appendChild(newLi);
        }
}
//初始化绘制div函数
function initDiv(){
        initSite();
        for(var i=0;i<20;i++){
                var newDiv = document.createElement("div");
                var newRow = map.appendChild(newDiv);
                for(var j=0;j<20;j++){
                        var newDiv = document.createElement("div");
                        newRow.appendChild(newDiv);
                }
        }
        randomSpan();
}
//检查前进方向下一个位置是否无墙,如无，go
function checkWall(nx,ny){
        var col = nx / WIDTH; //前面的位置
        var row = ny / HEIGHT; //前面的位置
        var flag = false;
        for(var i=0;i<wallArr.length;i++){
                if(col == wallArr[i][0] && row == wallArr[i][1]){
                        flag = true;
                        break;
                }
        }
        if(!flag){
                x = nx;
                y = ny;
                active.style.left = x + 'px';
                active.style.top = y + 'px';
        }
}
//方块位置行走处理
function GO(){
        var nx = x;
        var ny = y;
        if(head == 0){
                ny = (ny == 0) ? 0:(ny - HEIGHT);
        }else if(head == 1){
                nx = (nx == 570) ? 570:(nx + WIDTH);
        }else if(head == 2){
                ny = (ny == 570) ? 570:(ny + HEIGHT);
        }else{
                nx = (nx == 0) ? 0:(nx - WIDTH);
        }
        checkWall(nx,ny);
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
                        head = (head < 2) ? (head+2):(head-2);
                        break;
        }
}
//TRA方块位移指令
function TRA(o){
        var nx = x;
        var ny = y;
        switch(o){
                case "LEF":
                        nx = (nx == 0) ? 0:(nx - WIDTH);
                        break;
                case "TOP":
                        ny = (ny == 0) ? 0:(ny - HEIGHT);
                        break;
                case "RIG":
                        nx = (nx == 570) ? 570:(nx + WIDTH);
                        break;
                case "BOT":
                        ny = (ny == 570) ? 570:(ny + HEIGHT);
                        break;
        }
        checkWall(nx,ny);
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
//BUILD造墙指令
function BUILD(){
        var col = x / WIDTH; //此时方块的列号,用于确定造墙位置
        var row = y / HEIGHT; //此时方块的行号,用于确定造墙位置
        switch(head){
                case 0:
                        row = row - 1;
                        break;
                case 1:
                        col = col + 1;
                        break;
                case 2:
                        row = row + 1;
                        break;
                case 3:
                        col = col - 1;
                        break;
        }
        if(row >= 0 && row <= 19 && col >= 0 && col <= 19){
                var flag = false;
                for(var i=0;i<wallArr.length;i++){
                        if(col == wallArr[i][0] && row == wallArr[i][1]){
                                flag = true;
                                break;
                        }
                }
                if(!flag){
                        map.childNodes[row+1].childNodes[col].className = "wall";
                        var newWall = [col,row];
                        wallArr.push(newWall);
                }
        }else{
                console.log("can not build a wall");
        }
}
//BRU color刷墙指令
function BRU(c){
        var col = x / WIDTH; //此时方块的列号,用于确定刷墙位置
        var row = y / HEIGHT; //此时方块的行号,用于确定刷墙位置
        switch(head){
                case 0:
                        row = row - 1;
                        break;
                case 1:
                        col = col + 1;
                        break;
                case 2:
                        row = row + 1;
                        break;
                case 3:
                        col = col - 1;
                        break;
        }
        var flag = false;
        for(var i=0;i<wallArr.length;i++){
                if(col == wallArr[i][0] && row == wallArr[i][1]){
                        map.childNodes[row+1].childNodes[col].style.backgroundColor = c;
                        flag = true;
                        break;
                }
        }
        if(!flag){
                console.log("here is no wall to brush");
        }
}
//获取input指令，分解处理为命令数组保存
function resolveInput(){
        var my_input = input.value.trim();
        var inputArr1 = my_input.split("\n");
        var len = inputArr1.length;
        var inputArr2 = new Array(len);
        for(var i=0;i<len;i++){
                inputArr1[i] = inputArr1[i].trim();
                inputArr2[i] = new Array(2);
                if(inputArr1[i].match(/BRU/)){
                        inputArr2[i][1] = inputArr1[i].replace(/BRU\s*/,"");
                        inputArr2[i][0] = "BRU";
                }else if(inputArr1[i].match(/TO\s+/)){
                        inputArr2[i][1] = inputArr1[i].replace(/MOV\s+TO\s*/,"");
                        inputArr2[i][0] = "MOV TO";
                }else if(inputArr1[i].match(/\d+/)){
                        inputArr2[i][1] = inputArr1[i].match(/\d+/);
                        inputArr2[i][0] = inputArr1[i].replace(/\s+\d+\s*/g,"");
                }else{
                        inputArr2[i][1] = 1;
                        inputArr2[i][0] = inputArr1[i];
                }
        }
        return inputArr2;
}
//匹配指令集内容执行
function action(str,info){
        switch(str){
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
                case order[12]://BUILD
                        BUILD();
                        break;
                case order[13]://BRU color
                        BRU(info);
                        break;
        }
}
//获取input指令,并执行
function getInput(){
        var inputArr = resolveInput();
        var len = inputArr.length;
        var time = 0;
        var i = 0;
        timer = setInterval(function(){
                if(i < len){
                        if(inputArr[i][0] == "BRU" || inputArr[i][0] == "MOV TO"){
                                action(inputArr[i][0],inputArr[i][1]);
                                time = 0;
                                i++;
                        }else if(time < inputArr[i][1]){
                                action(inputArr[i][0]);
                                time++;
                        }else{
                                time = 0;
                                i++;
                        }
                }else{
                        clearInterval(timer);
                }
        },200);
}
//key按键按下控制方块变动
function keyDown(e){
        var my_key;
        if(window.event){// IE
                my_key = e.keyCode;
        }else if(e.which){ // Netscape/Firefox/Opera
                my_key = e.which;
        }
        if(my_key == 16){
                shiftFlag = true;
        }else if(my_key == 17){
                ctrlFlag = true;
        }else if(my_key == 192){
                input.value += "BUILD\n";
                BUILD();
                return false;
        }
        if(shiftFlag){//按下shift键
                switch(my_key){
                        case 37:
                                input.value += "TUN LEF\n";
                                TUN("LEF");
                                break;
                        case 38:
                                input.value += "GO\n";
                                GO();
                                break;
                        case 39:
                                input.value += "TUN RIG\n";
                                TUN("RIG");
                                break;
                        case 40:
                                input.value += "TUN BAC\n";
                                TUN("BAC");
                                break;
                }
        }else if(ctrlFlag){//按下ctrl键
                switch(my_key){
                        case 37:
                                input.value += "TRA LEF\n";
                                TRA("LEF");
                                break;
                        case 38:
                                input.value += "TRA TOP\n";
                                TRA("TOP");
                                break;
                        case 39:
                                input.value += "TRA RIG\n";
                                TRA("RIG");
                                break;
                        case 40:
                                input.value += "TRA BOT\n";
                                TRA("BOT");
                                break;
                }
        }else{//单键行走模式
                switch(my_key){
                        case 37:
                                input.value += "MOV LEF\n";
                                MOV("LEF");
                                break;
                        case 38:
                                input.value += "MOV TOP\n";
                                MOV("TOP");
                                break;
                        case 39:
                                input.value += "MOV RIG\n";
                                MOV("RIG");
                                break;
                        case 40:
                                input.value += "MOV BOT\n";
                                MOV("BOT");
                                break;
                }
        }
}
//key按键抬起
function keyUp(e){
        input.scrollTop = 99999;
        var inputArr = resolveInput();
        var len = inputArr.length;
        renderTip(len);
        var my_key;
        if(window.event){// IE
                my_key = e.keyCode;
        }else if(e.which){ // Netscape/Firefox/Opera
                my_key = e.which;
        }
        if(my_key == 16){
                shiftFlag = false;
        }else if(my_key == 17){
                ctrlFlag = false;
        }else if(my_key == 13 || my_key == 8){
                var flag = false;
                for(var i=0;i<len;i++){
                        for(var j=0;j<14;j++){
                                if(inputArr[i][0] == order[j]){
                                        flag = true;
                                        break;
                                }
                        }
                        if(!flag){
                                tip.childNodes[i].style.color = "red";
                        }else{
                                tip.childNodes[i].style.color = "#fff";
                        }
                        flag = false;
                }
        }
}
//渲染绘制tip指示信息
function renderTip(l){
        var tipLen = tip.childNodes.length;
        if(tipLen < l+1){
                var newLi = document.createElement("li");
                newLi.innerHTML = l+1;
                tip.appendChild(newLi);
        }else if(tipLen > l+1){
                tip.removeChild(tip.lastChild);
        }
}
//检查输入是否为正确的命令
function checkInput(){
        var inputArr = resolveInput();
        var len = inputArr.length;
        alert(len);
        var flag = false;
        renderTip(len);
        for(var i=0;i<len;i++){
                for(var j=0;j<13;j++){
                        if(inputArr[i][0] == order[j]){
                                flag = true;
                                break;
                        }
                }
                if(!flag){
                        tip.childNodes[i].style.color = "red";
                }
                flag = false;
        }
}
//tip跟随input滚动
function followScroll(){
        var dist = input.scrollTop;
        tip.firstChild.style.marginTop = -dist + "px";
}
//刷新按钮功能
function refresh(){
        tip.innerHTML = "<li>1</li>";
        input.value = "";
}
//随机造n面墙
function randomWall(){
        var wallNum = $("#wallNum").value.trim();
        if(wallNum==""){wallNum = 1;}
        for(var i=0;i<wallNum;i++){
                var flag = false;
                while(!flag){
                        var inflag = false;
                        var col = Math.floor(Math.random() * 20);
                        var row = Math.floor(Math.random() * 20);
                        for(var j=0;j<wallArr.length;j++){
                                if(col == wallArr[j][0] && row == wallArr[j][1]){
                                        inflag = true;
                                        break;
                                }
                        }
                        if(!inflag){
                                map.childNodes[row+1].childNodes[col].className = "wall";
                                var newWall = [col,row];
                                wallArr.push(newWall);
                                flag = true;
                        }
                }
        }
}
// 初始化函数
function init(){
        initDiv();
        $a("button")[0].onclick = getInput;
        $a("button")[1].onclick = refresh;
        $a("button")[2].onclick = randomWall;
        input.onscroll = followScroll;
        input.onkeydown = keyDown;
        input.onkeyup = keyUp;
}
window.onload = init;
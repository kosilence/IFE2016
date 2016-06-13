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
                "TRA BOT","MOV LEF","MOV TOP","MOV RIG","MOV BOT","BUILD","BRU","MOV TO"];//指令集


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
function checkInside(arr,c,r){
        var flag = true;
        for(var i=0,len=arr.length;i<len;i++){
                if(c == arr[i][0] && r == arr[i][1]){
                        flag = false;
                        break;
                }
        }
        return flag;
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
        var col = nx / WIDTH;
        var row = ny / HEIGHT;
        if(checkInside(wallArr,col,row)){
                x = nx;
                y = ny;
                active.style.left = x + 'px';
                active.style.top = y + 'px';
        }
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
        var col = nx / WIDTH;
        var row = ny / HEIGHT;
        if(checkInside(wallArr,col,row)){
                x = nx;
                y = ny;
                active.style.left = x + 'px';
                active.style.top = y + 'px';
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
        if(row >= 0 && row <= 19 && col >= 0 && col <= 19 && checkInside(wallArr,col,row)){
                map.childNodes[row+1].childNodes[col].className = "wall";
                var newWall = [col,row];
                wallArr.push(newWall);
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
        if(!checkInside(wallArr,col,row)){
                map.childNodes[row+1].childNodes[col].style.backgroundColor = c;
        }else{
                console.log("here is no wall to brush");
        }
}
//MOV TO c,r处理函数
function MOVTO(info){
        if(info.match(/^\d+\,\d+/)){
                var end = info.split(",");
                var pc = parseInt(end[0]);
                var pr = parseInt(end[1]);
                var path = findWayTo(pc,pr);
                followPath(path);
        }else{
                console.log("MOV TO col,row 坐标格式错误");
                return false;
        }
}
//得到路径，表现行走过程
function followPath(path){
        var len = path.length;
        var col = x / WIDTH; //此时方块的列号0-19
        var row = y / HEIGHT; //此时方块的行号0-19
        var moveOrder = [];
        for(var i=0;i<len;i++){
                var stepOrder = ["",1];
                if(path[i][0] > col){
                        stepOrder[0] = "MOV RIG";
                        moveOrder.push(stepOrder);
                        col = col + 1;
                }else if(path[i][0] < col){
                        stepOrder[0] = "MOV LEF";
                        moveOrder.push(stepOrder);
                        col = col - 1;
                }else if(path[i][1] < row){
                        stepOrder[0] = "MOV TOP";
                        moveOrder.push(stepOrder);
                        row = row - 1;
                }else if(path[i][1] > row){
                        stepOrder[0] = "MOV BOT";
                        moveOrder.push(stepOrder);
                        row = row + 1;
                }
        }
        doOrder(moveOrder);
}
//find way to c,r算法
function findWayTo(pc,pr){
        pc = pc - 1;
        pr = pr - 1;
        var col = x / WIDTH; //此时方块的列号0-19
        var row = y / HEIGHT; //此时方块的行号0-19
        var startPos = [col,row];
        var endPos = [pc,pr];
        if(!checkInside(wallArr,col,row)){
                console.log("目标为墙");
                return false;
        }else if(col == pc && row == pr){
                console.log("目标与起点重叠");
                return false;
        }else{
                // reset函数待定
                var opens = [];//存放可检索的方块(开启列表)
                var closes = [];//存放已检索的方块(关闭列表)
                var cur = null;//当前指针
                var bFind = true;//是否检索
                //设置开始点的F、G为0并放入opens列表(F=G+H)
                startPos.F = 0;
                startPos.G = 0;
                startPos.H = 0;
                //将起点放入closes数组，并设置cur指向起始点
                closes.push(startPos);
                cur = startPos;
                //如果起始点紧邻结束点则不计算路径直接将起始点和结束点放入closes数组
                if(Math.abs(col - pc) + Math.abs(row - pr) == 1){
                        endPos.P = startPos;
                        closes.push(endPos);
                        bFind = false;
                }
                //计算路径
                while(cur && bFind){
                        //如果当前元素cur不在closes列表中，则将其放入closes列表中
                        if(checkInside(closes,cur[0],cur[1])){
                                closes.push(cur);
                        }
                        //然后获取当前点四周点
                        var rounds = getRounds(cur);
                        //当四周点不在opens数组中时，设置G\H\F和父级P，并放入opens数组
                        for(var i=0;i<rounds.length;i++){
                                if(checkInside(closes,rounds[i][0],rounds[i][1]) && checkInside(opens,rounds[i][0],rounds[i][1])){
                                        rounds[i].G = cur.G + 1;//只算竖横，每格距离为1
                                        rounds[i].H = Math.abs(rounds[i][0] - endPos[0]) + Math.abs(rounds[i][1] - endPos[1]);
                                        rounds[i].F = rounds[i].G + rounds[i].H;
                                        rounds[i].P = cur;//cur为.P的父指针
                                        opens.push(rounds[i]);
                                }
                        }
                        if(!opens.length){
                                cur = null;
                                opens = [];
                                closes = [];
                                break;
                        }
                        // //按照F值由小到大将opens数组排序
                        opens.sort(function(a,b){
                                return a.F - b.F;
                        });
                        var oMinF = opens[0];
                        var aMinF = [];//存放opens数组中F值最小的元素集合
                        //循环opens数组，查找F值和cur的F值一样的元素，并压入aMinF数组
                        //找出和最小F值相同的元素有多少
                        for(var i=0;i<opens.length;i++){
                                if(opens[i].F == oMinF.F){
                                        aMinF.push(opens[i]);
                                }
                        }
                        //如果最小F值有多个元素
                        if(aMinF.length > 1){
                                //计算元素与cur的曼哈顿距离
                                for(var i=0;i<aMinF.length;i++){
                                        aMinF[i].D = Math.abs(aMinF[i][0] - cur[0]) + Math.abs(aMinF[i][1] - cur[1]);
                                }
                                aMinF.sort(function(a,b){
                                        return a.D - b.D;
                                });
                                oMinF = aMinF[0];   
                        }
                        //将cur指向D值最小的元素
                                cur = oMinF;
                                //将cur压入closes数组
                                if(checkInside(closes,cur[0],cur[1])){
                                        closes.push(cur);
                                }
                        //将cur从opens数组中删除
                        for(var i=0;i<opens.length;i++){
                                if(opens[i] == cur){
                                        opens.splice(i,1);//找到当前cur删除
                                        break;
                                }
                        }
                        //找到最后一个点，并将结束点压入closes数组
                        if(cur.H == 1){
                                endPos.P = cur;
                                closes.push(endPos);
                                cur = null;
                        }
                }
                if(closes.length){
                        //从结尾开始往前找
                        var dotCur = closes[closes.length - 1];
                        var path = [];//存放最终路径
                        while(dotCur){
                                path.unshift(dotCur);//将当前点压入path数组头部
                                dotCur = dotCur.P;//设置当前点指向父级
                                if(!dotCur.P){
                                        dotCur = null;
                                }
                        }
                        return path;
                }else{
                        console.log("no way move to there");
                        return false;
                }
        }
}
//获取当前点四周点
function getRounds(point){
        var u = new Array(2);//up
        var r = new Array(2);//right
        var d = new Array(2);//down
        var l = new Array(2);//left
        var rounds = new Array();
        //up
        if(point[1] - 1 >= 0){
                u[0] = point[0];
                u[1] = point[1] - 1;
                if(checkInside(wallArr,u[0],u[1])){
                        rounds.push(u);
                }
        }
        //right
        if(point[0] + 1 <= 19){
                r[0] = point[0] + 1;
                r[1] = point[1];
                if(checkInside(wallArr,r[0],r[1])){
                        rounds.push(r);
                }
        }
        //down
        if(point[1] + 1 <= 19){
                d[0] = point[0];
                d[1] = point[1] + 1;
                if(checkInside(wallArr,d[0],d[1])){
                        rounds.push(d);
                }
        }
        //left
        if(point[0] - 1 >= 0){
                l[0] = point[0] - 1;
                l[1] = point[1];
                if(checkInside(wallArr,l[0],l[1])){
                        rounds.push(l);
                }
        }
        return rounds;
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
                case order[14]://MOV TO c,r
                        MOVTO(info);
                        break;
        }
}
//指令处理函数
function doOrder(arr){
        if(timer){
                clearInterval(timer);
        }
        var len = arr.length;
        var time = 0;
        var i = 0;
        timer = setInterval(function(){
                if(i < len){
                        if(arr[i][0] == "BRU" || arr[i][0] == "MOV TO"){
                                action(arr[i][0],arr[i][1]);
                                time = 0;
                                i++;
                        }else if(time < arr[i][1]){
                                action(arr[i][0]);
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
//获取input指令,并执行
function getInput(){
        var inputArr = resolveInput();
        doOrder(inputArr);
}
//key按键按下控制方块变动
function keyDown(e){
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
                shiftFlag = true;
        }else if(my_key == 17){
                ctrlFlag = true;
        }else if(my_key == 192){
                input.value += "BUILD\n";
                BUILD();
                return false;
        }else if(my_key == 13){
                var flag = false;
                for(var i=0;i<len;i++){
                        for(var j=0;j<order.length;j++){
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
                var nowInput = [];
                nowInput.push(inputArr[len-1]);
                doOrder(nowInput);
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
        wallNum = parseInt(wallNum);
        var wallLen = wallArr.length + wallNum;
        if(wallLen > 400){return false;}
        for(var i=0;i<wallNum;i++){
                var flag = false;
                while(!flag){
                        var col = Math.floor(Math.random() * 20);
                        var row = Math.floor(Math.random() * 20);
                        if(checkInside(wallArr,col,row)){
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
// 模拟一个队列，队列的每个元素是一个数字，初始队列为空
var my_data = [];//tag部分主数据
var my_list = [];//hobby部分主数据

$ = function(x){
        return document.querySelector(x);
};
$a = function(x){
        return document.querySelectorAll(x);
};

// tag部分：将处理好的数组写入innerHTML显示
function display(){
        var my_tag = $("#my_tag");
        var mystr = "";
        var len = my_data.length;
        for(var i=0;i<len;i++)
        {
                mystr += "<li class='li_style' onclick='ele_del(this)' onmouseover='ele_change(this)' onmouseout='ele_recover(this)'>"+my_data[i]+"</li>";
        }
        my_tag.innerHTML = mystr;
}
// hobby部分：将处理好的数组写入innerHTML显示
function displayHobby(){
        var my_hobby = $("#my_hobby");
        var mystr = "";
        var len = my_list.length;
        for(var i=0;i<len;i++)
        {
                mystr += "<li class='hobby_style' onclick='ele_del(this)'>"+my_list[i]+"</li>";
        }
        my_hobby.innerHTML = mystr;
}
// 检查按下的值是否为三者之一
var keynum = [13,32,188];
function checkKey(keyCode){
        for(var i=0;i<3;i++)
        {
                if(keynum[i] == keyCode){
                        return true;
                }
        }
        return false;
}
// 检查去重函数
function cleanRepeat(arr){
        var len = arr.length;
        if(len>1){
                for(var i=0;i<len-1;i++){
                        if(arr[i] == arr[len-1])
                        {
                                arr.pop();
                                return arr;
                        }
                }
        }
        return arr;
}
// 处理新插入的元素，分割为数组元素
function getArray(e){
        if(checkKey(e.keyCode)){
                var str = $("#my_input").value.trim();
                str = str.replace(/[,， ]/,'');
                if(str){
                        my_data.push(str);
                }
                my_data = cleanRepeat(my_data);
                if(my_data.length > 10){
                        my_data.shift();
                }
                $("#my_input").value = null;
                display();
                return false; //此处需要为enter设置为false，否则会触发页面刷新
        }
}
// 得到爱好数组，进行处理
function getHobby(){
        var str = $("textarea").value.trim();
        var arrWord = str.split(/[^0-9a-zA-Z\u4e00-\u9fa5]+/).filter(function(e){
                if(e != null && e.length > 0){
                        return true;
                }else{
                        return false;
                }
        });
        
        my_list = my_list.concat(arrWord);
        if(my_list.length > 10){
                my_list = my_list.slice(-10);
        }
        displayHobby();
        return false;
}
// 点击删除元素
function ele_del(obj){
        var my_ul = obj.parentNode;
        var ul_len = my_ul.childNodes.length;
        for(var i=0;i<ul_len;i++)
        {
                if(obj === my_ul.childNodes[i])
                {
                        if(my_ul.id == "my_tag"){
                                my_data.splice(i,1);
                                display(); 
                        }else{
                                my_list.splice(i,1);
                                displayHobby(); 
                        }
                }
        }
}
//鼠标移动变换颜色，显示提示
function ele_change(obj){
        var objText = obj.innerHTML;
        obj.className += ' li_change';
        obj.innerHTML = 'Del: ' + objText;
}
// 鼠标移走之后恢复原有状态
function ele_recover(obj){
        var objText = obj.innerHTML;
        obj.className ='li_style';
        obj.innerHTML = objText.slice(5);
}
// 事件绑定初始化函数
function event_init(){
        // var inputObj = document.getElementById("my_input");
        // inputObj.addEventListener("keyup",getArray);
        // $("input").onkeyup = getArray;
        $("#my_input").onkeydown = getArray; //暂用此种比较简便快捷绑定事件的方法
        $("button").onclick = getHobby;
}
// 初始化绑定button事件
function init(){
        event_init();
}
init();
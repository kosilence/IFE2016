/**
 * 一些基础功能
 * @type {{$, $a, addEvent}}
 */
var func = (function() {
        // 返回模块
        return{
                //获取单个元素
                $: function(x) {
                        return document.querySelector(x);
                },
                //获取指定全部元素
                $a: function(xa) {
                        return document.querySelectorAll(xa);
                },
                //添加事件函数
                addEvent: function (element, event, listener) {
                        if (element.addEventListener) { //标准
                                element.addEventListener(event, listener, false);
                        } else if (element.attachEvent) { //低版本ie
                                element.attachEvent("on" + event, listener);
                        } else { //都不行的情况
                                element["on" + event] = listener;
                        }
                },
                //移除事件函数
                removeEvent: function (element, event, listener) {
                        if(element.addEventListener) {//标准
                                element.removeEventListener(event, listener, false);
                        } else if (element.attachEvent) {//低版本ie
                                element.detachEvent("on" + event, listener);
                        } else {//其他情况
                                element["on" + event] = "";
                        }
                }
        }
})();

var table = function(config) {
        this.appendUnder = config.appendUnder;//此标签内插入新table
        this.thead = config.data.thead;//表头内容
        this.tbody = config.data.tbody;//表身内容
        this.IsEnableSort = config.IsEnableSort;//排序是否可用
        this.IsEnableFreeze = config.IsEnableFreeze;//冻结表头是否可用
        this.ele = null;

        if(typeof this.init != "function") {//避免重复生成原型函数
                table.prototype.setTableHead = function() {
                        //生成thead
                        var col = this.thead.length;
                        var self = this;
                        var tableHead = document.createElement("tr");
                        for(var i=0;i<col;i++){
                                var th = document.createElement("th");
                                th.innerHTML = this.thead[i];
                                if(this.IsEnableSort[i] == 1) {
                                        var spanUp = document.createElement("span");
                                        var spanDown = document.createElement("span");
                                        func.addEvent(spanUp, "click", function() {
                                                self.sortMethod(0,this);
                                        });
                                        func.addEvent(spanDown, "click", function() {
                                                self.sortMethod(1,this);
                                        });
                                        th.appendChild(spanUp);
                                        th.appendChild(spanDown);
                                }
                                tableHead.appendChild(th);
                        }
                        return tableHead;
                }
                table.prototype.setTableBody = function() {
                        var col = this.thead.length;
                        var row = this.tbody.length;
                        var tableBody = document.createElement("tbody");

                        //生成tbody
                        for(var i=0;i<row;i++){
                                var tr = document.createElement("tr");
                                for(var j=0;j<col;j++){
                                        var td = document.createElement("td");
                                        td.innerHTML = this.tbody[i][j];
                                        tr.appendChild(td);
                                }
                                tableBody.appendChild(tr);
                        }
                        return tableBody;
                }
                table.prototype.sortMethod = function(sign,spanEle) {
                        var col = this.thead.length;
                        var row = this.tbody.length;
                        var count = 0;
                        for(var i=0;i<col;i++) {
                                if(this.ele.firstChild.childNodes[i] == spanEle.parentNode) {
                                        count = i;
                                        break;
                                }
                        }

                        var objBody = this.tbody;
                        var objList = [];
                        var Presion = function(o,n) {
                                this.info = o;
                                this.num = n;
                        }
                        for(var i=0;i<row;i++) {
                                objList.push(new Presion(objBody[i],objBody[i][count]));
                        }
                        objList.sort(function(a,b) {
                                if(sign == 0){
                                        return (a.num - b.num);
                                }else if(sign == 1){
                                        return (b.num - a.num);
                                }
                        });
                        this.tbody = [];
                        for(var i=0;i<row;i++) {
                                this.tbody.push(objList[i].info);
                        }

                        this.ele.removeChild(this.ele.lastChild);
                        this.ele.appendChild(this.setTableBody());
                }
                table.prototype.freezeRank = function() {
                        if(this.IsEnableFreeze){
                                var self = this;
                                var tableHeight = self.ele.offsetHeight;
                                var theadHeight = self.ele.firstChild.offsetHeight;
                                var offsetTop = self.ele.offsetTop;
                                func.addEvent(window, "scroll", function() {
                                        var scrollTop = func.$("body").scrollTop;
                                        if((scrollTop > offsetTop + theadHeight)
                                         &&(scrollTop < offsetTop + theadHeight + tableHeight )) {
                                                self.ele.firstChild.className = "freeze-rank";
                                        }else{
                                                self.ele.firstChild.className = "";
                                        }
                                });
                        }
                }
                table.prototype.init = function() {
                        var t = document.createElement("table");
                        this.ele = func.$(this.appendUnder).appendChild(t);
                        this.ele.appendChild(this.setTableHead());
                        this.ele.appendChild(this.setTableBody());
                        this.freezeRank();
                }
        }
};

var table1 = new table( {
        appendUnder: 'section',
        data:{
                thead:["姓名","数学","语文","英语","总分"],
                tbody:[
                        ["小明",35,85,45,165],
                        ["小红",67,46,88,201],
                        ["小雪",99,88,94,281],
                        ["小亮",87,95,75,257],
                        ["小可",75,66,75,216]
                ]
        },
        IsEnableSort: [0,1,1,1,1],
        IsEnableFreeze: true
});
table1.init();

var table2 = new table( {
        appendUnder: 'section',
        data:{
                thead:["姓名","数学","语文","英语","总分"],
                tbody:[
                        ["小明",35,85,45,165],
                        ["小红",67,46,88,201],
                        ["小雪",99,88,94,281],
                        ["小亮",87,95,75,257],
                        ["小可",75,66,65,206],
                        ["小西",73,76,55,204],
                        ["小北",45,68,15,128],
                        ["小东",65,69,71,205]
                ]
        },
        IsEnableSort: [0,1,1,1,1],
        IsEnableFreeze: false
});
table2.init();

var table3 = new table( {
        appendUnder: 'section',
        data:{
                thead:["姓名","数学","语文","英语","总分"],
                tbody:[
                        ["小明",35,85,45,165],
                        ["小红",67,46,88,201],
                        ["小雪",99,88,94,281],
                        ["小亮",87,95,75,257],
                        ["小可",75,66,65,206],
                        ["小西",73,76,55,204],
                        ["小北",45,68,15,128],
                        ["小东",65,69,71,205],
                        ["小明",35,85,45,165],
                        ["小红",67,46,88,201],
                        ["小雪",99,88,94,281],
                        ["小亮",87,95,75,257],
                        ["小可",75,66,65,206],
                        ["小西",73,76,55,204],
                        ["小北",45,68,15,128],
                        ["小东",65,69,71,205],
                        ["小明",35,85,45,165],
                        ["小红",67,46,88,201],
                        ["小雪",99,88,94,281],
                        ["小亮",87,95,75,257],
                        ["小可",75,66,65,206],
                        ["小西",73,76,55,204],
                        ["小北",45,68,15,128],
                        ["小东",65,69,71,205],
                        ["小明",35,85,45,165],
                        ["小红",67,46,88,201],
                        ["小雪",99,88,94,281],
                        ["小亮",87,95,75,257],
                        ["小可",75,66,65,206],
                        ["小西",73,76,55,204],
                        ["小北",45,68,15,128],
                        ["小东",65,69,71,205]
                ]
        },
        IsEnableSort: [0,1,1,1,1],
        IsEnableFreeze: true
});
table3.init();

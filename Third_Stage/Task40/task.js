/**
 * 一些基础功能
 * @type {{$, $a, addEvent}}
 */
var func = (function() {
        // 返回模块
        return {
                //获取单个元素
                $: function(x) {
                        return document.querySelector(x);
                },
                //获取指定全部元素
                $a: function(xa) {
                        return document.querySelectorAll(xa);
                },
                //添加事件函数
                addEvent: function(element, event, listener) {
                        if (element.addEventListener) { //标准
                                element.addEventListener(event, listener, false);
                        } else if (element.attachEvent) { //低版本ie
                                element.attachEvent("on" + event, listener);
                        } else { //都不行的情况
                                element["on" + event] = listener;
                        }
                },
                //移除事件函数
                removeEvent: function(element, event, listener) {
                        if (element.addEventListener) { //标准
                                element.removeEventListener(event, listener, false);
                        } else if (element.attachEvent) { //低版本ie
                                element.detachEvent("on" + event, listener);
                        } else { //其他情况
                                element["on" + event] = "";
                        }
                }
        };
})();
var calendar = function(config) {
        this.appendUnder = config.appendUnder;//指定父节点
        this.format = config.format;//指定显示格式
        this.display = config.display;//初始是否显示ture || false
        this.viewMode = config.viewMode;//初始赋值，0，1，2
        this.Multiselect = config.Multiselect;//日期多选模式配置

        // this.Multiselect.startData = null;
        // this.Multiselect.endData = null;

        this.selectEle = [];//select元素
        this.today = new Date();
        this.selectData = {
                day: parseInt(this.today.getDate()),
                month: parseInt(this.today.getMonth()),
                year: parseInt(this.today.getFullYear())
        };
        this.currentData = {
                month: parseInt(this.today.getMonth()),
                year: parseInt(this.today.getFullYear())
        };

        this.ele = null;
        this.promptEle = null;
        this.mainEle = null;

        if(typeof this.init != "function") {//避免重复生成父函数,还需绑定事件
                calendar.prototype.renderPrompt = function() {
                        var self = this;

                        var calePrompt = document.createElement("input");
                        calePrompt.className = "cale-prompt";
                        calePrompt.value = this.displayPrompt(this.selectData);
                        calePrompt.readOnly = "readonly";
                        func.addEvent(calePrompt, "click", function() {
                                if(self.display) {
                                        self.mainEle.style.display = "none";
                                        self.display = false;
                                }else{
                                        self.mainEle.style.display = "block";
                                        self.display = true;
                                }
                        });

                        return calePrompt;
                };
                calendar.prototype.renderHead = function() {
                        var self = this;
                        var caleHead = document.createElement("div");
                        //日历标题左侧span
                        var spanLeft = document.createElement("span");
                        spanLeft.innerHTML = "←";
                        func.addEvent(spanLeft, "click", function() {
                                if(self.viewMode === 0) {
                                        self.changeMonth(-1);
                                }else if(self.viewMode === 1) {
                                        self.changeMonth(-12);
                                }else if(self.viewMode === 2) {
                                        self.changeMonth(12 * 10 * -1);
                                }
                        });
                        //日历标题中间div
                        var divCenter = document.createElement("div");
                        divCenter.innerHTML = self.DataGroup.months[self.currentData.month] + "&nbsp" + self.currentData.year;
                        func.addEvent(divCenter, "click", function() {
                                self.viewMode = self.viewMode + 1;
                                if(self.viewMode > 2) {
                                        self.viewMode = 2;
                                }else{
                                      self.changeMonth(0);
                                }
                        });
                        //日历标题右侧span
                        var spanRight = document.createElement("span");
                        spanRight.innerHTML = "→";
                        func.addEvent(spanRight, "click", function() {
                                if(self.viewMode === 0) {
                                        self.changeMonth(1);
                                }else if(self.viewMode === 1) {
                                        self.changeMonth(12);
                                }else if(self.viewMode === 2) {
                                        self.changeMonth(12 * 10);
                                }
                        });
                        caleHead.appendChild(spanLeft);
                        caleHead.appendChild(divCenter);
                        caleHead.appendChild(spanRight);
                        caleHead.className = "cale-head";
                        return caleHead;
                };
                calendar.prototype.renderBody = function(mode) {

                        var self = this;
                        /**
                         * 日期天数处理
                         * @param {num} thisMonthDay 本月天数
                         * @param {num} preMonthDay 前一个月天数(含跨年情况)
                         * @param {date} firstDay 本月的第一天
                         * @param {num} firstDayWeek 本月第一天的星期数1-7
                         * @param {num} nextMonthDay 下个月天数计数填充
                         */
                        var thisMonthDay = self.getDaysInMonth(self.currentData.year, self.currentData.month);
                        var preMonthDay = (self.currentData.month === 0) ? self.getDaysInMonth(self.currentData.year - 1, 11) : self.getDaysInMonth(self.currentData.year, self.currentData.month - 1);
                        var firstDay = new Date(self.currentData.year, self.currentData.month, 1);
                        var firstDayWeek = (firstDay.getDay() === 0) ? (firstDay.getDay() + 7) : firstDay.getDay();
                        var nextMonthDay = 0;

                        //行列数处理
                        var bodyCol = 0;//body展示部分列数
                        var bodyRow = 0;//body展示部分行数
                        var caleBody = document.createElement("div");

                        if(mode === 0){//日期显示模式
                                bodyCol = 7;
                                bodyRow = 6;
                                //生成元素及添加事件
                                var newOl = document.createElement("ol");
                                for(var i=0;i<7;i++) {
                                        var newLi = document.createElement("li");
                                        newLi.innerHTML = this.DataGroup.daysMin[i];
                                        newLi.className = "cale-body-day";
                                        newOl.appendChild(newLi);
                                }
                                caleBody.appendChild(newOl);
                                for(var i=0;i<bodyRow;i++) {
                                        var newUl = document.createElement("ul");
                                        for(var j=0;j<bodyCol;j++) {
                                                var newLi = document.createElement("li");
                                                func.addEvent(newLi, "mouseover", function() {
                                                        if(!self.checkSelectEle(this)){
                                                                this.style.backgroundColor = "#eee";
                                                        }
                                                });
                                                func.addEvent(newLi, "mouseout", function() {
                                                        if(!self.checkSelectEle(this)){
                                                                this.style.backgroundColor = "#fff";
                                                        }
                                                });
                                                newLi.className = "cale-body-day";
                                                var x = (i * 7) + j + 1;//1-42
                                                if(x < (firstDayWeek + 1)) {
                                                        newLi.innerHTML = parseInt(preMonthDay - firstDayWeek + x);
                                                        newLi.style.color = "#ccc";
                                                        func.addEvent(newLi, "click", function() {
                                                                self.changeMonth(-1);
                                                        });
                                                }else if(x < (thisMonthDay + firstDayWeek + 1)){
                                                        newLi.innerHTML = parseInt(x - firstDayWeek);
                                                        if(self.checkSelect(newLi.innerHTML)){
                                                                newLi.style.backgroundColor = "#0395e6";
                                                                newLi.style.color = "#fff";
                                                                self.selectEle[0] = newLi;
                                                        }
                                                        func.addEvent(newLi, "click", function() {
                                                                self.selectData.day = parseInt(this.innerHTML);
                                                                self.selectData.month = self.currentData.month;
                                                                self.selectData.year = self.currentData.year;

                                                                if(self.Multiselect.available) {//多选日期模式
                                                                        self.getMultiselectData(this);
                                                                }else {//非多选日期模式

                                                                        if(self.selectEle[0]){
                                                                                self.selectEle[0].style.backgroundColor = "#fff";
                                                                                self.selectEle[0].style.color = "#000";
                                                                        }
                                                                        this.style.backgroundColor = "#0395e6";
                                                                        this.style.color = "#fff";
                                                                        self.selectEle[0] = this;

                                                                        self.promptEle.value = self.displayPrompt(self.selectData);
                                                                        self.mainEle.style.display = "none";
                                                                        self.display = false;
                                                                }
                                                        });
                                                }else{
                                                        newLi.innerHTML = parseInt(nextMonthDay + 1);
                                                        newLi.style.color = "#ccc";
                                                        nextMonthDay++;
                                                        func.addEvent(newLi, "click", function() {
                                                                self.changeMonth(1);
                                                        });
                                                }
                                                newUl.appendChild(newLi);
                                        }
                                        caleBody.appendChild(newUl);
                                }
                        }else if(mode === 1){//月份显示模式
                                bodyCol = 4;
                                bodyRow = 3;
                                //生成元素及添加事件
                                for(var i=0;i<bodyRow;i++) {
                                        var newUl = document.createElement("ul");
                                        for(var j=0;j<bodyCol;j++) {
                                                var newLi = document.createElement("li");
                                                var x = (i * 4) + j;//0-11
                                                newLi.innerHTML = self.DataGroup.monthsShort[x];
                                                if(self.checkSelect(x)){
                                                        newLi.style.backgroundColor = "#0395e6";
                                                        newLi.style.color = "#fff";
                                                        self.selectEle[0] = newLi;
                                                }
                                                newLi.className = "cale-body-monthyear";
                                                func.addEvent(newLi, "mouseover", function() {
                                                        if(!self.checkSelectEle(this)){
                                                                this.style.backgroundColor = "#eee";
                                                        }
                                                });
                                                func.addEvent(newLi, "mouseout", function() {
                                                        if(!self.checkSelectEle(this)){
                                                                this.style.backgroundColor = "#fff";
                                                        }
                                                });
                                                func.addEvent(newLi, "click", function() {
                                                        for(var k=0;k<12;k++) {
                                                                if(this.innerHTML == self.DataGroup.monthsShort[k]) {
                                                                        var clickMonth = k;
                                                                        break;
                                                                }
                                                        }
                                                        self.currentData.month = clickMonth;
                                                        self.viewMode = 0;
                                                        self.changeMonth(0);
                                                });
                                                newUl.appendChild(newLi);
                                        }
                                        caleBody.appendChild(newUl);
                                }
                        }else if(mode === 2) {//年份显示模式
                                bodyCol = 4;
                                bodyRow = 3;
                                //生成元素及添加事件
                                for(var i=0;i<bodyRow;i++) {
                                        var newUl = document.createElement("ul");
                                        for(var j=0;j<bodyCol;j++) {
                                                var newLi = document.createElement("li");
                                                var x = (i * 4) + j;//0-11
                                                newLi.innerHTML = (Math.floor(self.currentData.year / 10) * 10 + x - 1);
                                                if(self.checkSelect(newLi.innerHTML)){
                                                        newLi.style.backgroundColor = "#0395e6";
                                                        newLi.style.color = "#fff";
                                                        self.selectEle[0] = newLi;
                                                }
                                                newLi.className = "cale-body-monthyear";
                                                func.addEvent(newLi, "mouseover", function() {
                                                        if(!self.checkSelectEle(this)){
                                                                this.style.backgroundColor = "#eee";
                                                        }
                                                });
                                                func.addEvent(newLi, "mouseout", function() {
                                                        if(!self.checkSelectEle(this)){
                                                                this.style.backgroundColor = "#fff";
                                                        }
                                                });
                                                if(x === 0) {
                                                        newLi.style.color = "#ccc";
                                                        func.addEvent(newLi, "click", function() {
                                                                self.changeMonth(12 * 10 * -1);
                                                        });
                                                }else if(x < 11) {
                                                        func.addEvent(newLi, "click", function() {
                                                                self.currentData.year = parseInt(this.innerHTML);
                                                                self.viewMode = 1;
                                                                self.changeMonth(0);
                                                        });
                                                }else{
                                                        newLi.style.color = "#ccc";
                                                        func.addEvent(newLi, "click", function() {
                                                                self.changeMonth(12 * 10);
                                                        });
                                                }
                                                newUl.appendChild(newLi);
                                        }
                                        caleBody.appendChild(newUl);
                                }
                        }
                        caleBody.className = "cale-body";

                        return caleBody;
                };
                calendar.prototype.DataGroup = {
                        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                        daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
                        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                        monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                };
                calendar.prototype.getDaysInMonth = function(year,month) {
                        var isLeapYear = function(year){
                                return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
                        };
                        return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
                };
                calendar.prototype.changeMonth = function(order) {
                        var nSign = ((order > 0) ? 1 : -1);
                        var nYear = nSign * Math.floor(Math.abs(order / 12));
                        var nMonth = order % 12;
                        this.currentData.month = this.currentData.month + nMonth;
                        if(this.currentData.month < 0) {
                                this.currentData.month = this.currentData.month + 12;
                                this.currentData.year = this.currentData.year + nYear - 1;
                        }else if(this.currentData.month > 11){
                                this.currentData.month = this.currentData.month - 12;
                                this.currentData.year = this.currentData.year + nYear + 1;
                        }else{
                                this.currentData.year = this.currentData.year + nYear;
                        }
                        if(this.viewMode === 0) {
                                this.mainEle.firstChild.firstChild.nextSibling.innerHTML = this.DataGroup.months[this.currentData.month] + "&nbsp" + this.currentData.year;
                        }else if(this.viewMode === 1) {
                                this.mainEle.firstChild.firstChild.nextSibling.innerHTML = this.currentData.year;
                        }else if(this.viewMode === 2) {
                                this.mainEle.firstChild.firstChild.nextSibling.innerHTML = (Math.floor(this.currentData.year / 10) * 10) + "-" + (Math.floor(this.currentData.year / 10) * 10 + 9);
                        }
                        this.mainEle.removeChild(this.mainEle.lastChild);
                        this.mainEle.appendChild(this.renderBody(this.viewMode));
                };
                calendar.prototype.checkSelect = function(data) {
                        if(this.viewMode === 0) {
                                if((this.selectData.day == data) && (this.selectData.month == this.currentData.month) && (this.selectData.year == this.currentData.year)) {
                                        return true;
                                }
                        }else if(this.viewMode === 1){
                                if((this.selectData.month == data) && (this.selectData.year == this.currentData.year)) {
                                        return true;
                                }
                        }else if(this.viewMode === 2) {
                                if(this.selectData.year == data) {
                                        return true;
                                }
                        }
                        return false;
                };
                calendar.prototype.checkSelectEle = function(ele) {
                        var selectFlag = false;
                        for(var i=0;i<this.selectEle.length;i++) {
                                if(this.selectEle[i] == ele){
                                        selectFlag = true;
                                        break;
                                }
                        }
                        return selectFlag;
                };
                calendar.prototype.displayPrompt = function(data) {
                        var promptDay = (data.day < 10) ? ("0" + data.day) : data.day;
                        var promptMonth = (data.month < 9) ? ("0" + (data.month + 1)) : (data.month + 1);
                        var promptYear = data.year;

                        var promptDataStr = this.format;
                        promptDataStr = promptDataStr.replace("d", promptDay.toString());
                        promptDataStr = promptDataStr.replace("m", promptMonth.toString());
                        promptDataStr = promptDataStr.replace("y", promptYear.toString());

                        return promptDataStr;
                };
                calendar.prototype.getMultiselectData = function(ele) {
                        if(!(this.Multiselect.startData && this.Multiselect.clickFlag)) {
                                this.Multiselect.startData = this.cloneObject(this.selectData);
                                this.Multiselect.clickFlag = true;

                                if(this.selectEle[0]) {
                                        this.selectEle[0].style.backgroundColor = "#fff";
                                        this.selectEle[0].style.color = "#000";
                                        if(this.selectEle[1]) {
                                                this.selectEle[1].style.backgroundColor = "#fff";
                                                this.selectEle[1].style.color = "#000";
                                        }
                                }
                                ele.style.backgroundColor = "#0395e6";
                                ele.style.color = "#fff";
                                this.selectEle[0] = ele;

                                this.promptEle.value = this.displayPrompt(this.Multiselect.startData);
                        }else {
                                if(this.selectData.year < this.Multiselect.startData.year) {
                                        this.Multiselect.endData = this.cloneObject(this.Multiselect.startData);
                                        this.Multiselect.startData = this.cloneObject(this.selectData);
                                }else if(this.selectData.year == this.Multiselect.startData.year && this.selectData.month < this.Multiselect.startData.month) {
                                        this.Multiselect.endData = this.cloneObject(this.Multiselect.startData);
                                        this.Multiselect.startData = this.cloneObject(this.selectData);
                                }else if(this.selectData.year == this.Multiselect.startData.year && this.selectData.month == this.Multiselect.startData.month && this.selectData.day < this.Multiselect.startData.day) {
                                        this.Multiselect.endData = this.cloneObject(this.Multiselect.startData);
                                        this.Multiselect.startData = this.cloneObject(this.selectData);
                                }else {
                                        this.Multiselect.endData = this.cloneObject(this.selectData);
                                }
                                this.Multiselect.clickFlag = false;

                                if(this.Multiselect.endData)
                                ele.style.backgroundColor = "#0395e6";
                                ele.style.color = "#fff";
                                this.selectEle[1] = ele;

                                this.promptEle.value = this.displayPrompt(this.Multiselect.startData) + "  ~  " + this.displayPrompt(this.Multiselect.endData);
                                // this.mainEle.style.display = "none";
                                // this.display = false;
                        }
                };
                calendar.prototype.cloneObject = function(obj) {
                        if(typeof obj != 'object') {
                                return obj;
                        }
                        if(obj == null) {
                                return obj;
                        }
                        var newObj = new Object();
                        for(var i in obj){
                                newObj[i] = this.cloneObject(obj[i]);
                        }
                        return newObj;
                };
                calendar.prototype.getApartDays = function(start, end) {
                        var sData = new Date(start.year, start.month, start.day);
                        var eData = new Date(end.year, end.month, end.day);
                        return parseInt(Math.abs(sData - eData) / 1000 / 60 / 60 / 24);
                };
                calendar.prototype.init = function() {
                        var caleTool = document.createElement("div");
                        caleTool.className = "cale-tool";
                        this.promptEle = caleTool.appendChild(this.renderPrompt());
                        this.mainEle = document.createElement("div");
                        this.mainEle.appendChild(this.renderHead());
                        this.mainEle.appendChild(this.renderBody(this.viewMode));
                        this.mainEle.className = "cale-main";
                        caleTool.appendChild(this.mainEle);

                        this.ele = func.$(this.appendUnder).appendChild(caleTool);
                };
        }
};

var calendar1 = new calendar({
        appendUnder: "section",
        format: "d/m/y",
        display: false,
        viewMode: 0,
        Multiselect: {
                available: true,
                minNumDays: 7,
                maxNumDays: 14
        }
});
calendar1.init();

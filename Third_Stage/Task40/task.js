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
        this.format = null;//暂缓
        this.display = config.display;//初始是否显示ture || false
        this.viewMode = config.viewMode;//初始赋值，0，1，2

        this.selectEle = null;//select元素
        this.today = new Date();
        this.selectDay = parseInt(this.today.getDate());
        this.selectMonth = parseInt(this.today.getMonth());
        this.selectYear = parseInt(this.today.getFullYear());

        this.currentMonth = parseInt(this.today.getMonth());
        this.currentYear = parseInt(this.today.getFullYear());

        this.ele = null;

        if(typeof this.init != "function") {//避免重复生成父函数,还需绑定事件
                calendar.prototype.renderHead = function() {
                        var self = this;
                        var caleHead = document.createElement("div");
                        //日历标题左侧span
                        var spanLeft = document.createElement("span");
                        spanLeft.innerHTML = "←";
                        func.addEvent(spanLeft, "click", function() {
                                self.changeMonth(-1);
                                self.ele.removeChild(self.ele.lastChild);
                                self.ele.appendChild(self.renderBody(self.viewMode));
                        });
                        //日历标题中间div
                        var divCenter = document.createElement("div");
                        divCenter.innerHTML = self.DataGroup.months[self.currentMonth] + "&nbsp" + self.currentYear;
                        func.addEvent(divCenter, "click", function() {
                                self.viewMode = self.viewMode + 1;
                                if(self.viewMode > 2) {
                                        self.viewMode = 2;
                                }
                                self.renderBody(self.viewMode);
                        });
                        //日历标题右侧span
                        var spanRight = document.createElement("span");
                        spanRight.innerHTML = "→";
                        func.addEvent(spanRight, "click", function() {
                                self.changeMonth(1);
                                self.ele.removeChild(self.ele.lastChild);
                                self.ele.appendChild(self.renderBody(self.viewMode));
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
                        var thisMonthDay = self.getDaysInMonth(self.currentYear, self.currentMonth);
                        var preMonthDay = (self.currentMonth === 0) ? self.getDaysInMonth(self.currentYear - 1, 11) : self.getDaysInMonth(self.currentYear, self.currentMonth - 1);
                        var firstDay = new Date(self.currentYear, self.currentMonth, 1);
                        var firstDayWeek = (firstDay.getDay() === 0) ? (firstDay.getDay() + 7) : firstDay.getDay();
                        var nextMonthDay = 0;

                        //行列数处理
                        var bodyCol = 0;//body展示部分列数
                        var bodyRow = 0;//body展示部分行数
                        if(mode === 0){
                                bodyCol = 7;
                                bodyRow = 6;
                        }else{
                                bodyCol = 4;
                                bodyRow = 3;
                        }

                        //生成元素及添加事件
                        var caleBody = document.createElement("div");
                        if(mode === 0) {
                                var newOl = document.createElement("ol");
                                for(var i=0;i<7;i++) {
                                        var newLi = document.createElement("li");
                                        newLi.innerHTML = this.DataGroup.daysMin[i];
                                        newLi.className = "cale-body-day";
                                        newOl.appendChild(newLi);
                                }
                                caleBody.appendChild(newOl);
                        }
                        for(var i=0;i<bodyRow;i++) {
                                var newUl = document.createElement("ul");
                                for(var j=0;j<bodyCol;j++) {
                                        var newLi = document.createElement("li");
                                        func.addEvent(newLi, "mouseover", function() {
                                                if(self.selectEle != this){
                                                        this.style.backgroundColor = "#eee";
                                                }
                                        });
                                        func.addEvent(newLi, "mouseout", function() {
                                                if(self.selectEle != this){
                                                        this.style.backgroundColor = "#fff";
                                                }
                                        });

                                        if(mode === 0){//日期显示模式
                                                newLi.className = "cale-body-day";
                                                var x = (i * 7) + j + 1;//1-42
                                                if(x < (firstDayWeek + 1)) {
                                                        newLi.innerHTML = parseInt(preMonthDay - firstDayWeek + x);
                                                        newLi.style.color = "#ccc";
                                                        func.addEvent(newLi, "click", function() {
                                                                self.changeMonth(-1);
                                                                self.ele.removeChild(self.ele.lastChild);
                                                                self.ele.appendChild(self.renderBody(0));
                                                        });
                                                }else if(x < (thisMonthDay + firstDayWeek + 1)){
                                                        newLi.innerHTML = parseInt(x - firstDayWeek);
                                                        if(self.checkSelectDay(newLi.innerHTML)){
                                                                newLi.style.backgroundColor = "#0395e6";
                                                                newLi.style.color = "#fff";
                                                                self.selectEle = newLi;
                                                        }
                                                        func.addEvent(newLi, "click", function() {
                                                                if(self.selectEle){
                                                                        self.selectEle.style.backgroundColor = "#fff";
                                                                        self.selectEle.style.color = "#000";
                                                                }
                                                                this.style.backgroundColor = "#0395e6";
                                                                this.style.color = "#fff";
                                                                self.selectEle = this;
                                                                self.selectDay = this.innerHTML;
                                                                self.selectMonth = self.currentMonth;
                                                                self.selectYear = self.currentYear;
                                                        });
                                                }else{
                                                        newLi.innerHTML = parseInt(nextMonthDay + 1);
                                                        newLi.style.color = "#ccc";
                                                        nextMonthDay++;
                                                        func.addEvent(newLi, "click", function() {
                                                                self.changeMonth(1);
                                                                self.ele.removeChild(self.ele.lastChild);
                                                                self.ele.appendChild(self.renderBody(0));
                                                        });
                                                }
                                        }else if(mode === 1){//月份显示模式

                                        }
                                        newUl.appendChild(newLi);
                                }
                                caleBody.appendChild(newUl);
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
                        this.currentMonth = this.currentMonth + nMonth;
                        if(this.currentMonth < 0) {
                                this.currentMonth = this.currentMonth + 12;
                                this.currentYear = this.currentYear + nYear - 1;
                        }else if(this.currentMonth > 11){
                                this.currentMonth = this.currentMonth - 12;
                                this.currentYear = this.currentYear + nYear + 1;
                        }else{
                                this.currentYear = this.currentYear + nYear;
                        }
                        this.ele.firstChild.firstChild.nextSibling.innerHTML = this.DataGroup.months[this.currentMonth] + "&nbsp" + this.currentYear;
                };
                calendar.prototype.checkSelectDay = function(day) {
                        if((this.selectDay == day)
                        &&(this.selectMonth == this.currentMonth)
                        &&(this.selectYear == this.currentYear)) {
                                return true;
                        }else{
                                return false;
                        }

                };
                calendar.prototype.init = function() {
                        var caleDiv = document.createElement("div");
                        caleDiv.className = "cale-tool";
                        this.ele = func.$(this.appendUnder).appendChild(caleDiv);
                        this.ele.appendChild(this.renderHead());
                        this.ele.appendChild(this.renderBody(this.viewMode));
                };
        }
};

var calendar1 = new calendar({
        appendUnder: "section",
        viewMode: 0
});
calendar1.init();

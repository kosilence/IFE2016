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
var FloatLayer = function(element) {
        this.ele = element;
        this.visible = false;
        this.maskEle = null;
        this.disX = 0;
        this.disY = 0;
        this.btn = element.lastElementChild;

        this.init();
}

FloatLayer.prototype = {
        show: function() {
                this.visible = true;
                //重置弹出框的显示位置
                this.ele.style.left = 'calc(50% - 150px)';
                this.ele.style.top = 'calc(50% - 100px)';
                this.ele.style.transform = 'scale(1, 1)';
                this.maskEle.style.display = 'block';
        },

        hide: function() {
                this.visible = false;
                this.ele.style.transform = 'scale(1, 0)';
                this.maskEle.style.display = 'none';
        },

        init: function() {
                this.maskEle = func.$('.mask');
                this.maskEle.style.width = window.screen.width + 'px';
                this.maskEle.style.height = window.screen.height + 'px';

                var sign = this;
                func.addEvent(this.btn, "click", function() {
                        sign.hide();
                });

                func.addEvent(this.ele, "mousedown", function(e) {
                        e = e || event;
                        e.cancelBubble = true;
                        sign.disX = e.clientX - sign.ele.offsetLeft;
                        sign.disY = e.clientY - sign.ele.offsetTop;
                        this.style.cursor = 'move';

                        var move = function(e) {
                                e = e || event;
                                sign.ele.style.left = (e.clientX - sign.disX) + 'px';
                                sign.ele.style.top = (e.clientY - sign.disY) + 'px';
                        };

                        func.addEvent(document, "mousemove", move);
                        func.addEvent(document, "mouseup", function() {
                                func.removeEvent(document, "mousemove", move);
                                sign.ele.style.cursor = 'auto';
                        });
                });
        }
}
var signInPopup = new FloatLayer(func.$("#sign-in"));
var signUpPopup = new FloatLayer(func.$("#sign-up"));
/**
 * 登录、注册按钮绑定点击弹出框事件
 */
var signIn = func.$a("li")[0];
var signUp = func.$a("li")[1];
func.addEvent(signIn, "click", function() {
        signInPopup.show();
});
func.addEvent(signUp, "click", function() {
        signUpPopup.show();
});
/**
 * 幕布绑定点击关闭弹出框事件
 */
var backDrop = func.$(".mask");
func.addEvent(backDrop, "click", function() {
        if(signInPopup.visible === true){
                signInPopup.hide();
        }else if(signUpPopup.visible === true){
                signUpPopup.hide();
        }
});

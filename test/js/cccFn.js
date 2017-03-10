/*收集一些平时工作的封装的方法*/

// 数字保留两个小数,并且逢千有个逗号
function fixNum(num) {
    if (typeof(num) == "string") {
        num = Number(num);
    }
    var numArr = num.toFixed(2).split(".");
    numArr[0] = Number(numArr[0]).toLocaleString();
    return numArr.join(".");
}

//保留小数的计算
function sum(arr, range) { //arr是需要计算的数组 , range是保留小数的位数
    var mul = Math.pow(10, range)
    var res = 0;
    for (var i in arr) {
        res += parseInt(Number(arr[i]) * mul);
    }
    return res / mul;
}

// Textarea自适应高度  传入对象,可以是原生dom,jqdom,元素id名;若该元素未设置了box-sizing且不在jq环境下,第二个参数为padding-top加上padding-bottom的和
function autoTextarea(obj, paddingHeight) {
    // 若传进来的是字符串(id名),自动获取该对象
    obj = typeof obj == "string" ? document.getElementById(obj) : obj;

    if (!!window.$ && $ == jQuery) { //在jq环境里面

        obj = obj instanceof jQuery ? obj : $(obj); //无论是否jq都将该对象变成jq对象

        obj.css("overflow", 'hidden');
        var paddingHeight = Number(obj.css("padding-top").slice(0, -2)) + Number(obj.css("padding-bottom").replace("px", ""));

        obj.on('input propertychange', function() {
            obj.css("height", "auto").height($(this)[0].scrollHeight - paddingHeight);
        });

    } else { //非jq环境下 , 未必是原生 , 但是使用原生js方法
        obj.style.overflow = "hidden";

        if (obj.addEventListener) { //ie8以上

            obj.addEventListener("input", function() {
                obj.style.height = "auto";
                obj.style.height = (obj.scrollHeight - paddingHeight) + "px";
            }, false);
            obj.addEventListener("propertychange", function() {
                obj.style.height = "auto";
                obj.style.height = (obj.scrollHeight - paddingHeight) + "px";
            }, false);

        } else {

            obj.oninput = function() {
                obj.style.height = "auto";
                obj.style.height = (obj.scrollHeight - paddingHeight) + "px";

            }
            obj.onpropertychange = function() {
                obj.style.height = "auto";
                obj.style.height = (obj.scrollHeight - paddingHeight) + "px";
            }

        }
    }
}

// 简化版
/*function autoTextarea(obj,paddingHeight){
    obj.style.overflow="hidden";
    obj.oninput = function(){
        obj.style.height = "auto";
        obj.style.height = (obj.scrollHeight-paddingHeight) + "px";

    }
    obj.onpropertychange = function(){
        obj.style.height = "auto";
        obj.style.height = (obj.scrollHeight-paddingHeight) + "px";
    }
}*/

// 这个数组是否有这个值   这个方法没有必要 直接用 Array.prototype.indexOf(ie9以及以上)
if (!Array.prototype.hasVal) {
    Array.prototype.hasVal = function(val) {
        for (var i in this) {
            if (this[i] == val) {
                return i;
            }
        }
        return -1;
    }
}



function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    // return !!obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  //这个是返回布尔型
}

function addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) {
        obj.className = obj.className.trim(); //可以避免空格越来越多
        obj.className += " " + cls;
    }
}

function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
}

function toggleClass(obj, cls) {
    if (hasClass(obj, cls)) {
        removeClass(obj, cls);
    } else {
        addClass(obj, cls);
    }
}

// 上传文件限制 , 配合 <input class="file" type="file" name="" accept="image/png,image/x-png,image/jpeg,image/gif,image/bmp"> 效果更佳
function fileLimit(obj) {
    var that = obj; //jq对象
    if (that[0].files) { //现代浏览器,支持files API浏览器
        var file = that[0].files[0];
    } else {
        var filePath = that.val();
        var fileSystem = new ActiveXObject("Scripting.FileSystemObject"); //ie 自带 Active-x插件
        var file = fileSystem.GetFile(filePath);
    }
    var fileName = file.name;
    var fileType = file.type;
    var fileSize = file.size / 1024 / 1024;



    var fileSuffix = fileName.slice(fileName.lastIndexOf(".") + 1); //后缀
    if (fileSuffix != "jpg" && fileSuffix != "png" && fileSuffix != "gif" && fileSuffix != "bmp") {
        that.add(".file-name").val('');
        alert("上传的文件格式错误，请上传格式为jpg、png、bmp、gif的图片文件");
        return false;
    }

    if (fileSize > 1) {
        alert("上传的文件不得大于1m");
        return false;
    }

}

/*中间变星星*/
String.prototype.star = function(start,end){
    var num = end-start;
    var str = this;
    var starStr = "";
    for(var i = 0;i<num;i++){
        starStr = starStr + "*";
    }
    str = str.slice(0,start)+starStr+str.slice(end);
    return str;
}

/*在字符串里面找出重复最多的字符*/
String.prototype.appearMaxTimes = function() {
    var maxNum = 0,
        index = null,
        num = {},
        arr = [];
    for (var i = 0, len = this.length; i < len; i++) {
        num[this.charAt(i)] ? ++num[this.charAt(i)] : num[this.charAt(i)] = 1;
    }
    for (var i in num) {
        if (num[i] > maxNum) {
            maxNum = num[i];
            arr.splice(0, arr.length); //一旦发现有比maxNum大,清空数组
            arr.push({ "index": i, "maxNum": num[i] }); //保存当前这组数据
        } else if (num[i] == maxNum) {
            arr.push({ "index": i, "maxNum": num[i] }); //添加与maxNum一样大的这组数据
        }
    }
    return arr.length == 1 ? arr[0] : arr;
};

/*将posi位置字符换成newStr,posi可以为数字也可以为由数组组成的数组*/
String.prototype.change = function(posi, newStr) {
    if (!isNaN(str)) { //posi是数字
        return this.slice(0, posi) + newStr + this.slice(posi + 1);//将字符串posi前面的那段 + 新字符newStr + 字符串posi后面那段 拼成新的字符串；
    } else if (Array.isArray && Array.isArray(posi)) {//posi为数组的时候，es6 Array.isArray判断 注意兼容性
        var str = this;
        for (var i = 0, len = posi.length; i < len; i++) {
            str = str.slice(0, posi[i]) + newStr + str.slice(posi[i] + 1);//for循环拼接
        }
        return str;
    }
}

/*将在ori中匹配到的字符，转化为tar中对应的字符*/
String.prototype.exchange = function(ori, tar) {
    var str = "",
        flag = false;//标记是否有匹配到ori中的字符
    for (var i = 0, len = this.length; i < len; i++) {//str字符串遍历一个个字符
        flag = false;
        for (var j = 0, len2 = ori.length; j < len2; j++) {//遍历ori，将str字符串的字符与ori进行比较
            if (this.charAt(i) == ori[j]) {//判断是否匹配
                str += tar[j];//匹配到了，将str对应的字符换成tar[i]中的。
                flag = true;//标记为true
            }
        }
        if (!flag) {//没有匹配到，就str中字符换成会原来那个。
            str += this[i];
        }
    }
    return str;
};
String.prototype.exchange2 = function(ori, tar) {
    var str = "";
    for (var i = 0, len = this.length; i < len; i++) {
        var j = 0,
            len2 = ori.length;
        while (this.charAt(i) != ori[j] && j < len2) {//匹配到或者遍历完ori退出
            j++
        }
        if (j < len2) {//如果j小于ori长度，表示匹配到
            str += tar[j];//匹配到了，用tar对应字符
        } else {//匹配不到
            str += this[i]//用回原来字符
        }
    }
    return str;
};
// e.g. var a = "AGCT"; a.exchange("ATCG", "TAGC")//TCGA ,A=>T,T=>A,C=>G,G=>C
// 传一个哈希表，属性名为匹配字符，值为目标字符
String.prototype.exchange3 = function(hash) {
    var arr = this.split("");
    for (var i = 0, len = arr.length; i < len; i++) {
        // (arr[i] in hashTable) && (arr[i] = hashTable[arr[i]])
        (hashTable[arr[i]]) && (arr[i] = hashTable[arr[i]])//如果与哈希表匹配，则执行后面操作，否则因为false，将跳过后面操作
    }
    return arr.join("");
};
/*
var hashTable = {
    "T": "A",
    "A": "T",
    "G": "C",
    "C": "G"
}
var a = "AGCT";
console.log(a.exchange3(hashTable)); //TCGA
*/

// 是否到底部
function isbottom(){//onscroll时候判断，浏览器滚动条时候
    var top = $(".waiting").offset().top;
    var h = $(".waiting").outerHeight();
    var winH = $(window).height();
    var scrollTop = $(window).scrollTop();
    // 最低下 top+h = winH+scrollTop
    return top<=winH+scrollTop;
}
/*// 或者
$("#wrap").on("scroll",function(){//因为这里滚动的是wrap,所以offset().top变成窗口位置
    var heightPoint = window.screen.height-$("li:last").height();
    if($("li:last").offset().top<heightPoint && falg){
        falg = false;
        var timer = setTimeout(function(){
            add();
            falg = true;
        },1000);
    }
});*/


// 判断ie版本 7-10
function ieVersion(){
    var reg = /msie\s(\d+)\.0/i;
    var agent = navigator.userAgent.toLowerCase();
    if(reg.test(agent)){
        return agent.match(reg)[1];
    }
    return null
}



/*获取元素信息*/
function Ele(dom) {
    if (typeof dom == "string") {
        dom = document.getElementById(dom);
    }
    if (dom) {
        this.dom = dom;
        Ele.prototype.innerWidth = function() {//获取元素宽度(包括padding,border)
            return dom.offsetWidth;
        };
        Ele.prototype.innerHeight = function() {//获取元素高度(包括padding,border)
            return dom.offsetHeight
        };
        Ele.prototype.width = function() {//获取元素content宽度
            var paddingArr = this.getStyle("padding").match(/\d+/g);
            var border = this.getStyle("borderWidth").match(/\d+/g)[0];
            return dom.offsetWidth - paddingArr[1] - paddingArr[3] - border * 2;
        }
        Ele.prototype.height = function() {//获取元素content高度
            var paddingArr = this.getStyle("padding").match(/\d+/g);
            var border = this.getStyle("borderWidth").match(/\d+/g)[0];
            return dom.offsetHeight - paddingArr[0] - paddingArr[2] - border * 2;
        }
        Ele.prototype.getStyle = function(StyleName) {//获取元素css样式
            if (dom.style[StyleName]) {
                return dom.style[StyleName];
            } else {
                if (window.getComputedStyle) {
                    return window.getComputedStyle(dom)[StyleName]
                } else if (dom.currentStyle) { //读取样式表样式
                    return dom.currentStyle[StyleName]
                }
            }
            return null;
        }
        Ele.prototype.docOffset = function() {//元素的文档坐标
            var x = dom.offsetLeft;
            var y = dom.offsetTop;
            while (dom.offsetParent) {
                x = x + dom.offsetParent.offsetLeft + dom.offsetParent.clientLeft;
                y = y + dom.offsetParent.offsetTop + dom.offsetParent.clientTop;
                dom = dom.offsetParent;
            }
            return {
                "left": x,
                "top": y
            }
        }
    }
}
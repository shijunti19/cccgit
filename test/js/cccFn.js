/*收集一些平时工作的封装的方法*/

// 数字保留两个小数,并且逢千有个逗号
function fixNum(num){
    if(typeof(num)=="string"){
        num = Number(num);
    }
    var numArr = num.toFixed(2).split(".");
    numArr[0] = Number(numArr[0]).toLocaleString();
    return numArr.join(".");
}

// Textarea自适应高度  传入对象,可以是原生dom,jqdom,元素id名;若该元素未设置了box-sizing且不在jq环境下,第二个参数为padding-top加上padding-bottom的和
function autoTextarea(obj,paddingHeight){
    // 若传进来的是字符串(id名),自动获取该对象
    obj = typeof obj == "string" ? document.getElementById(obj) : obj;

    if(!!window.$ && $==jQuery){//在jq环境里面

        obj = obj instanceof jQuery ? obj : $(obj);//无论是否jq都将该对象变成jq对象

        obj.css("overflow",'hidden');
        var paddingHeight = Number(obj.css("padding-top").slice(0,-2)) + Number(obj.css("padding-bottom").replace("px",""));

        obj.on('input propertychange',function(){
            obj.css("height","auto").height($(this)[0].scrollHeight-paddingHeight);
        });

    }else{//非jq环境下 , 未必是原生 , 但是使用原生js方法
        obj.style.overflow="hidden";

        if(obj.addEventListener){//ie8以上

            obj.addEventListener("input",function(){
                obj.style.height = "auto";
                obj.style.height = (obj.scrollHeight-paddingHeight) + "px";
            },false);
            obj.addEventListener("propertychange",function(){
                obj.style.height = "auto";
                obj.style.height = (obj.scrollHeight-paddingHeight) + "px";
            },false);

        }else{

            obj.oninput = function(){
                obj.style.height = "auto";
                obj.style.height = (obj.scrollHeight-paddingHeight) + "px";

            }
            obj.onpropertychange = function(){
                obj.style.height = "auto";
                obj.style.height = (obj.scrollHeight-paddingHeight) + "px";
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
if(!Array.prototype.hasVal){
    Array.prototype.hasVal = function (val){
        for(var i in this){
            if(this[i]==val){
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
    if (!this.hasClass(obj, cls)){
        obj.className = obj.className.trim();//可以避免空格越来越多
        obj.className += " " + cls;
    }
}

function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
}

function toggleClass(obj,cls){
    if(hasClass(obj,cls)){
        removeClass(obj, cls);
    }else{
        addClass(obj, cls);
    }
}
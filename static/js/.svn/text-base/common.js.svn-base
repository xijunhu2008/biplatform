/**
* 格式化时间
*/
function formatDate(date, format) {
    date = date || new Date();
    format = format || 'yyyy-MM-dd HH:mm:ss';
    var result = format.replace('yyyy', date.getFullYear().toString())
    .replace('yy', date.getFullYear().toString().substring(2,4))
    .replace('MM', (date.getMonth()< 9?'0':'') + (date.getMonth() + 1).toString())
    .replace('dd', (date.getDate()< 10?'0':'')+date.getDate().toString())
    .replace('HH', (date.getHours() < 10 ? '0' : '') + date.getHours().toString())
    .replace('mm', (date.getMinutes() < 10 ? '0' : '') + date.getMinutes().toString())
    .replace('ss', (date.getSeconds() < 10 ? '0' : '') + date.getSeconds().toString());

    return result;
}


/**
* 转为日期格式
*
* @method parseDate
* @param {string} s 时间字符串   
* @return {date} 日期
*/
function parseDate(s) {
    if (typeof s == 'object') {
        return s;
    }
    if (typeof s == 'string') {
        //类似于/Date(700000+0500)/这种格式的时间串，表示1970-1-1以来的毫秒数
        if (/\/Date\(-?(\d{10,})(\+\d{4})?\)\//i.test(s)) {
            var n = parseInt(RegExp.$1, 10);            
            s = new Date(n);
            return s;
        }
            //如果是"HH:mm:ss"格式 或者'HH:mm'
        else if (new RegExp('^([0-9]{2,2}\:)').test(s)) {
            var tempDate = new Date();
            var dateString = 'yyyy-MM-dd';
            dateString = dateString.replace('yyyy', tempDate.getFullYear().toString())
                .replace('MM', (tempDate.getMonth() < 9 ? '0' : '') + (tempDate.getMonth() + 1).toString())
                .replace('dd', (tempDate.getDate() < 10 ? '0' : '') + tempDate.getDate().toString());

            s = dateString + " " + s;
        }
    }
    var ar = (s + ",0,0,0").match(/\d+/g);
    return ar[5] ? (new Date(ar[0], ar[1] - 1, ar[2], ar[3], ar[4], ar[5])) : (new Date(s));
}

/**
*获得传入字符串是否为.net中的数字类型
**/
function isNetNumber(type) {
    if(!type) return false;
    if (type.toLowerCase().indexOf('sbyte')===0 ||
    type.toLowerCase().indexOf('byte')===0 ||
    type.toLowerCase().indexOf('short')===0 ||
    type.toLowerCase().indexOf('ushort')===0 ||
    type.toLowerCase().indexOf('int')===0 ||
    type.toLowerCase().indexOf('uint')===0 ||
    type.toLowerCase().indexOf('long')===0 ||
    type.toLowerCase().indexOf('ulong')===0 ||
    type.toLowerCase().indexOf('float')===0 ||
    type.toLowerCase().indexOf('double')===0 ||
    type.toLowerCase().indexOf('real')===0 ||
    type.toLowerCase().indexOf('decimal')===0) {
        return true;
    }

    return false;
}

/**
*获得传入字符串是否为时间
**/
function isDateString(str) {
    if (str != null) {
        //将一种看上去像时间，但是需要将其当作字符串对待的时间格式筛选出来(1989-11-13~1989-11-13)
        var isDateReg = new RegExp('^[0-9]{4,4}\-[0-9]{2,2}\-[0-9]{2,2}[\~]{1,1}[0-9]{4,4}\-[0-9]{2,2}\-[0-9]{2,2}');
        if (isDateReg.test(str.toString())) {
            return false;
        }

        //判断是否是一个时间的正则表达式,写得有点长，但是应该是比较好读的
        isDateReg = new RegExp('^[0-9]{4,4}\-[0-9]{2,2}\-[0-9]{2,2}|^[0-9]{2,2}\-[0-9]{2,2}%|^[0-9]{2,2}\-[0-9]{2,2}\-[0-9]{2,2}%|^([0-9]{2,2}\:[0-9]{2,2}){1,1}|^([0-9]{2,2}\:[0-9]{2,2}\:[0-9]{2,2}){1,1}');
        if (isDateReg.test(str.toString())) {
            return true;
        }
    }
    return false;
}

/*
*获得两个日期的天数差
*输入的日期格式为yyyy-mm-dd
*并且是字符串
*/
function getComparDays (dateOne,dateTow) {
    var aDate, oDate1, oDate2, iDays
    var sDate1 = dateOne;   //sDate1和sDate2是2008-12-13格式  
    var sDate2 = dateTow;
    aDate = sDate1.split("-")
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])   //转换为12-13-2008格式     
    aDate = sDate2.split("-")
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    iDays = Number((oDate1 / 1000 / 60 / 60 / 24) - (oDate2 / 1000 / 60 / 60 / 24));   //把相差的毫秒数转换为天数
    return iDays;
}

/*
*千分位分隔符
*/
function thousandsSplit(num) {
    var numStr = $.trim(num.toString()).split('.')[0].split('');
    var output = '';

    var j = 0;
    for (var i = numStr.length-1; i >-1; i--) {
        if (j % 3 == 0 && j!=0) {
            output = numStr[i] + ","+output;
        }else{
            output = numStr[i] + output;
        }
        j++;
    }
    if(num.toString().split('.')[1]){
        output += "." + num.toString().split('.')[1];
    }
    return output ;
}

/**
*获得传入日期是否为周末
**/
function isWeekend(str) {
    if (!isNaN(new Date(str).getDay())) {
        var dayOfWeek = "7123456".charAt(new Date(str).getDay());
        if (dayOfWeek == '7' || dayOfWeek == '6') {
            return true;
        }
    }
    return false;
}


/**
* [/b]滤镜，将加粗换行替换成html
*
* @method boldReplace
* @param {string} strInput 输入的字符串 
* @return {string} 转换好的字符串
*/
function boldReplace(strInput) {
    var reg = new RegExp('\\[b\\]', 'g');
    strInput = strInput.replace(reg, '<div class="boldDiv">');
    reg = new RegExp('\\[\\/b\\]', 'g');
    strInput = strInput.replace(reg, '</div>');
    reg = new RegExp('\\n', 'g');
    strInput = strInput.replace(reg, '<br/>');
    return strInput;
}

/**
* 将大数字简写
*
* @method formatNumber
* @param {string} numberInput 输入的数字   
* @return {string} 转换好的简写数字 
*/
function formatNumber(numberInput) {
    if (numberInput == null) {return null;}
    if (Number(numberInput).toString().indexOf('NaN') != -1) {
        return numberInput;
    }
    var tempNumber = numberInput.toString();
    if (tempNumber.indexOf('.') != -1) {
        tempNumber = tempNumber.split('.')[0];
    }

    if (tempNumber.length <= 3) {
        return numberInput;
    }

    if (tempNumber.length > 3 && tempNumber.length < 7) {
        return (Number(tempNumber) * 0.001).toFixed(2) + "k";
    }
    if (tempNumber.length >= 7) {
        return (Number(tempNumber) * 0.000001).toFixed(2) + "mil";
    }
}

/**
* 将大数字简写2 可传入语言类型
*
* @method formatBigNumber
* @param {string} inputNum 输入的数字   
 @param {string} lan 输入的语言类型
* @return {string} 转换好的简写数字 
*/
function formatBigNumber(inputNum, lan) {
    if (lan == "ch") {
        if (isNaN(Number(inputNum))) { return inputNum; }
        var num = Number(inputNum);
        //亿
        if (num >= 100000000) {
            num = num / 100000000;
            return { num: num,str:'亿' };
        }
        else if (num >= 10000000) {
            num = num / 10000000;
            return { num: num, str: '千万' };
        }
        else if (num >= 1000000) {
            num = num / 1000000;
            return { num: num, str: '百万' };
        }
        else if (num >= 10000) {
            num = num / 10000;
            return { num: num, str: '万' };
        }
        return { num: num, str: '' };
    } else if (lan == 'en') {
        if (inputNum == null) { return null; }
        if (Number(inputNum).toString().indexOf('NaN') != -1) {
            return { num: inputNum, str: '' };
        }
        var tempNumber = inputNum.toString();
        if (tempNumber.indexOf('.') != -1) {
            tempNumber = tempNumber.split('.')[0];
        }

        if (tempNumber.length <= 3) {
            return { num: inputNum, str: '' };
        }

        if (tempNumber.length > 3 && tempNumber.length < 7) {
            return { num: (Number(tempNumber) * 0.001), str: 'k' };
        }
        if (tempNumber.length >= 7) {
            return { num: (Number(tempNumber) * 0.000001), str: 'mil' };

        }
    } else if (lan == 'none') {
        return { num: inputNum, str: '' };
    }
}

/**
 * 去除字符串开始字符
 * 
 * @method trimStart 
 * @param {char} [c] 要去除字符串的前置字符
 * @return {string} 去除前置字符后的字符串
 */
String.prototype.trimStart = function(c) {
    c = c || ' ';
    if(this.length > 0) {
        var sc = this.substr(0,1);
        if(sc === c || c.indexOf(sc) >= 0) {
            var tmp = this.substring(1);
            return tmp.trimStart(c);
        }        
    }
    return this;
}

/**
 * 去除字符串结束的字符c
 *
 * @method trimEnd
 * @param {char} [c] 要去除字符串的后置字符
 * @return {string} 去除后置字符后的字符串
 */
String.prototype.trimEnd = function(c) {
    c = c || ' ';
    if(this.length > 0) {
        var sc = this.substr(this.length - 1, 1); ;

        if(sc === c || c.indexOf(sc) >= 0) {
            var tmp = this.substring(0,this.length - 1);
            return tmp.trimEnd(c);
        }        
    }
    return this;
}

/**
 * 去除字符串开始与结束的字符
 *
 * @method trim
 * @param {char} [c] 要去除字符串的字符
 * @return {string} 去除字符后的字符串
 */
String.prototype.trim = function(c) {
    return this.trimEnd(c).trimStart(c);
}

/**
 * 提取url参数
 */
function getUrlParams(url) {
    var url = url || location.search;
    var pstart = url.indexOf('?');
    if (pstart == 0) {
        url = url.substr(1);
    }
	var params = {};
	
	var ps = url.split('&');
	if(ps.length > 0) {
		for(var i=0;i<ps.length;i++) {
			var p = ps[i];
			var kv = p.split('=');
			if(kv.length == 2) {
				params[kv[0]] = kv[1];
			}
		}
	}
	
	return params;
}

/**
* 随机数
*/
function numberRandom(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

//限制字符数量
String.prototype.subOverFlow = function (num) {
    if (this.length > num) {
        return this.substring(0, num);
    }
    return this;
}

/**
 * 检测是否支持flash,,true=支持,false=不支持
 */
function checkFlash() {
    if(document.all) {
        var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        return swf?true:false;
    }
    else {
        if(navigator.plugins && navigator.plugins.length > 0) {
            var swf = navigator.plugins['Shockwave Flash'];
            return swf?true:false;
        }
    }
    return false;
}

/**
 * 对字符串进行html编码
 *
 * @method htmlEncode
 * @return {string} 编码后的字符串
 */
String.prototype.htmlEncode = function () {
    return this.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\s/g, '&nbsp;');
}

/**
 * 对字符串进行html解码
 *
 * @method htmlDecode
 * @return {string} 解码后的字符串
 */
String.prototype.htmlDecode = function () {
    return this.replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

Array.prototype.contain = function (o) {
    for (var i = 0; i < this.length; i++) {
        if (o == this[i]) return true;
    }
    return false;
}

/**
* 消息提示
*/
var message = (function () {
    //如果需要去设置domain就在此设置一下页面domain
    if (getUrlParams()['setDomain']) {
        document.domain = getUrlParams()['setDomain'];
    }
    if (window.parent && window.parent != window && window.parent.idata && (window.parent.message || window.parent.idata.message)) {
        return window.parent.message || window.parent.idata.message;
    }
    var msg = function () {
        this.cache = {};
    }

    /**
    * 弹出提示信息
    **/
    msg.prototype.show = function (msg, key, css, ind, modal, canclose) {
        var box = ind ? (this.cache[key] || (this.cache[key] = $('<div class="msg-box"></div>'))) : $('<div class="msg-box"></div>');

        //如果为模式窗口
        if (modal) {
            if (!box.bg) box.bg = $('<div class="modal" />');
            box.bg.remove();
            box.bg.appendTo('body').show();
        }

        box.appendTo('body');
        box.toggleClass(css, true);
        box.html(msg);
        if (canclose) {
            $('<a href="#" class="close" title="关闭">×</a>').appendTo(box).click(function () {
                this.parentElement.style.display = 'none';
                return false;
            });
        }

        /*
        *关闭当前弹框
        */
        box.close = function () {
            this.hide();
            if (this.bg) this.bg.remove();
        };
        box.show();
        var onsize = function () {
            (message || idata.message).position(box);
            if (box.bg) {
                var w = Math.max($(window).width(), $(window.document).width());
                var h = Math.max($(window).height(), $(window.document).height());
                box.bg.width(w);
                box.bg.height(h);
            }
        };
        onsize();
        $(window).bind('resize', onsize);
        if (ind != true) {
            setTimeout(function () {
                box.animate({
                    //'top': 0,
                    'opacity': 0
                }, 2000, function () {
                    $(window).unbind('resize', onsize);
                    box.close();
                })
            }, 5000);
        }
        //iflow.log(msg);//调试日志
        return box;
    };

    /**
    * 隐藏
    */
    msg.prototype.close = function (key) {
        var box = this.cache[key];
        if (box) {
            box.hide();
            if (box.bg) box.bg.remove();
        }
    }

    //定位消息框
    msg.prototype.position = function (box) {
        var l = ($(window.document).width() - box.width()) / 2;
        box.css({ 'left': l, 'opacity': 1, 'top': 10 });
    };

    /**
    * 出错信息
    **/
    msg.prototype.error = function (msg, ind) {
        this.show(msg, 'idata.error', 'msg-box-error', ind, false, true);
    };

    /**
    * 警告信息
    **/
    msg.prototype.warning = function (msg, ind) {
        this.show(msg, 'idata.warning', 'msg-box-warning', ind, false, true);
    }

    /**
    * 成功信息
    **/
    msg.prototype.success = function (msg, ind) {
        this.show(msg, 'idata.warning', 'msg-box-success', ind, false, true);
    }

    /**
    * 提示信息
    **/
    msg.prototype.tip = function (msg, ind) {
        return this.show(msg, 'idata.tooltip', 'msg-box-info', ind, false, true);
    }

    /*
    * 弹出等待框
    */
    msg.prototype.showWaiting = function (msg, key) {
        return this.show('<div class="loading">' + msg + '</div>', key || 'idata.waiting', 'msg-box-info', true, true, false);
    }
    return new msg();
})();


/**
 * 前端模板
 */
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
var jmtmpl = (function () {
    var cache = {};
    var fun = function (str, data) {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
          cache[str] = cache[str] ||
            jmtmpl(document.getElementById(str).innerHTML) :

          // Generate a reusable function that will serve as a template
          // generator (and which will be cached).
          new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +

            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +

            // Convert the template into pure JavaScript
            str.replace(/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg, '') //去除注释
              .replace(/[\r\t\n]/g, " ")
              .split("<$").join("\t")
              .replace(/((^|\$>)[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)\$>/g, "',$1,'")
              .split("\t").join("');")
              .split("$>").join("p.push('")
              .split("\r").join("\\'")
          + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn(data) : fn;
    };
    return fun;
})();

/**
* 分页插件
* @param {Object} option 分页参数:
* showCount:{Number} 当前页附件显示多少个页码，默认为6
* className:{String} 分页样式名，默认为 jm_paging
* change:{Function} 页码改变回调，参数为当前页码
* pretext:{String} 上一页字符
* nexttext:{String} 下一页字符
* turntext:{String} 转到
* @namespace jmPaging
* @class jmPaging
* @requires jmPaging
**/
function jmPaging(option) {
    this.option = option;
    /**
    * 当前页附件显示多少个页码
    * 默认为6
    * @property showCount
    * @type Number     
    **/
    this.showCount = option.showCount || 6;

    /**
    * 整个翻页区域元素    
    * @property _pagingBody
    * @type Object   
    * @private  
    **/
    this._pagingBody = $('<div class="jm_paging"></div>'); //翻页div

    /**
    * 承载分页对象的容器    
    * @property parent
    * @type Object
    **/
    this.parent = typeof option.parent == 'string' ? $('#' + option.parent) : option.parent;

    /**
    * 页码点击事件
    * @method _pageClick  
    * @private  
    **/
    this._pageClick = function (index) {
        if (option.change) {
            if (!index) {
                index = $(this).attr('jm_paging_index');
            }
            option.change(index);
        } //页码改变事件
    }

    /**
    * 转页输入事件
    * @method _turnKeypress  
    * @private  
    **/
    this._turnKeypress = function (evt) {
        var c = evt.keyCode ? evt.keyCode : evt.which;
        if (c == 13) {
            if (option.change && $.trim(this.value) != '') {
                option.change(this.value);
            }
        }
        else if ((c <= 57 && c >= 48) || c == 8 || c == 9 || c == 0) {
            //9是opera中的tab健
            return true;
        }
        return false;
    };

    /**
    * 生成页码
    * @method _createPages  
    * @param {Integer} index 当前页码
    * @param {Integer} count 总共有多少页
    * @private  
    * @return Array 所有需要显示的页码
    **/
    this._createPages = function (index, count) {
        //显示的页码
        var pageList = [];
        pageList.push(1); //加入第一页
        if (count > 1) pageList.push(2); //加入第二页
        var floor = Math.floor(this.showCount / 2);
        var showFirst = index - floor;
        var showLast = index + floor;
        if (showFirst < 0) showLast = showLast - showFirst;
        if (showLast > count) showLast = count;
        for (var i = showFirst; i <= showLast; i++) {
            //如果里面不存在则加入显示行列
            if (!pageList.contain(i) && i > 0) pageList.push(i);
        }

        var ltc = count - 1;
        //加上最后第二页
        if (ltc > 1 && !pageList.contain(ltc)) pageList.push(ltc);
        if (count > 1 && !pageList.contain(count)) pageList.push(count); //加上最后一页

        return pageList;
    }

    /**
    * 展现分页区域
    * @method render
    * @param {Object} params 参数json,{index:当前码码，count：总共多少页}
    * @return Object 分页区域元素div
    **/
    this.render = function (params) {
        this._pagingBody.html('');
        var index = parseInt(params.index) || 1; //当前页
        var count = parseInt(params.count) || 1; //总共多少页
        if (count <= 1) return this._pagingBody;

        var preText = option.pretext || "上一页";
        var nexttext = option.nexttext || "下一页";
        var turnpagetext = option.turntext || "转到";

        //生成页码集合
        var pageList = this._createPages(index, count);

        //写入上一页
        var preIndex = index > 1 ? index - 1 : 0;
        if (preIndex > 0) {
            var prelink = $('<a href="javascript:;" jm_paging_index="' + preIndex + '">' + preText + '</a>');
            prelink.bind('click', function () {
                if (option.change) {
                    var index = $(this).attr('jm_paging_index');
                    option.change(index);
                } //页码改变事件
            });
            prelink.appendTo(this._pagingBody);
        }

        var showindex = 0;
        //显示页码
        for (var i = 0; i < pageList.length; i++) {
            var pageindex = pageList[i];
            //中间空档
            if (pageindex - showindex > 1) {
                var sp = $('<span>&nbsp;...&nbsp;</span>');
                sp.appendTo(this._pagingBody);
            }
            var alink = $('<a href="javascript:;" jm_paging_index="' + pageindex + '">' + pageindex + '</a>');
            if (pageindex == index) alink.addClass('jm_curPage');
            else {
                //页码改变事件             
                alink.bind('click', function () {
                    if (option.change) {
                        var index = $(this).attr('jm_paging_index');
                        option.change(index);
                    } //页码改变事件
                });
            }
            alink.appendTo(this._pagingBody);
            showindex = pageindex;
        }
        //写入下一页
        var nextIndex = index < count ? index + 1 : 0;
        if (nextIndex > 0) {
            var nextlink = $('<a href="javascript:;" jm_paging_index="' + nextIndex + '">' + nexttext + '</a>');
            nextlink.bind('click', function () {
                if (option.change) {
                    var index = $(this).attr('jm_paging_index');
                    option.change(index);
                } //页码改变事件
            });
            nextlink.appendTo(this._pagingBody);
        }
        //转到第几页
        if (count > 1) {
            var txt = $('<input type="text" name="jm_PagerTxt" value="' + index + '" />');
            txt.bind('keypress', this._turnKeypress);
            txt.appendTo(this._pagingBody);
            var turnbtn = $('<a href="javascript:;">OK</a>');
            if (turnpagetext) turnbtn.text(turnpagetext);
            //页码改变事件
            turnbtn.bind('click', function () {
                if (option.change) {
                    var index = txt.val();
                    if (index > params.count) index = params.count;
                    else if (index < 1) index = 1;
                    txt.val(index);
                    option.change(index);
                }
            });
            turnbtn.appendTo(this._pagingBody);
        }
        if (this.parent) this._pagingBody.appendTo(this.parent);
        else this._pagingBody.appendTo('body');

        return this;
    }
};

var page_cache = {};
/**
* 加载为jquery插件
**/
$.fn.paging = function (options) {
    var id = $(this).attr('id');
    options = $.extend({ parent: $(this) }, options);
    //获取翻页组件缓存
    var control = page_cache['jm.paging.' + id] = (page_cache['jm.paging.' + id] || new jmPaging(options));
    control.parent = $(this);
    control.render(options);

    //生成新菜单
    return control;
};

/*
*一个多选下拉框
*廖力增加于2013-9-23
*/
jmreport.toolbarControls.controlTypes['checkBoxList'] = function (config) {
    //初始化
    jmreport.toolbarControls.controlTypes.initControl.call(this, config);
    //生成控件id
    this.controlId = (+new Date / Math.random()).toString().replace('.', '');
    this.state = 'loading'; //默认需要拉取数据
    //载入控件主体 
    this.element = this.appendToContainer($('<div value="" id="jmreport_mControl_' + this.controlId + '" class="jmreport-CheckBoxList" ></div>'));
    //右边的结构
    this.rightSide = $('<div class="jmreport-CheckBoxList-right" >  </div>').appendTo(this.element);
    //左边显示所选游戏的结构
    this.leftSide = $('<div class="jmreport-CheckBoxList-left" ></div>').appendTo(this.element);
    //弹出来的层
    this.absoluteLay = $('<div class="jmreport-CheckBoxList-absoluteLay" ></div>').appendTo('#jmreport-page-content');
    var layTitle = $('<div class="title" ></div>').appendTo(this.absoluteLay);
    this.layOptionsContent = $('<div class="optionsContent" ></div>').appendTo(this.absoluteLay);
    //搜索框
    this.searchBox = $('<input type="text" class="search" placeholder="搜索" />').appendTo(layTitle);
    $('<a onclick="$(document).click();" >【关闭】</a>').appendTo(layTitle);
    //默认给所选游戏为'请点击此处选择..'
    this.leftSide.append('<span style="color:#ABADB3" title="请点击此处选择.." >请点击此处选择..</span> ');
    //转存this
    var self = this;

    //如果配置中有配置宽度
    if (this.config.config.Width) {
        //给它配置中的宽度
        this.leftSide.css('max-width', this.config.config.Width + 'px');
    }

    /**
    * 绑定数据
    */
    this.bind = function (data, pageIndex) {
        //data =  jQuery.extend(true, {}, this.data);
        //有数据才绑定
        if (data.Tables.length > 0 && data.Tables[0].Rows != null && data.Tables[0].Rows.length > 0) {

            //初始化分页器
//            this.checkBoxListPager.init(this);

//            if (!pageIndex) {
//                this.checkBoxListPager.thisPage = 1;
//            } else {
//                this.checkBoxListPager.thisPage = pageIndex;
//            }

//            //向页面中加入分页控件
//            this.checkBoxListPager.create(this);

//            //当前页的列表显示范围
//            data.Tables[0] = this.checkBoxListPager.getDataScope(data.Tables[0]);

            this.absoluteLay.find('span').remove();

            var valueTypeIsString = data.Tables[0].Columns[0].DataType.indexOf('string') != -1 || data.Tables[0].Columns[0].DataType.indexOf('String') != -1;
            this.items = [];
            for (var i = 0; i < data.Tables[0].Rows.length; i++) {
                //data.Tables[0].Rows[i].ItemArray[0].Value;这是数据名
                //data.Tables[0].Rows[i].ItemArray[1].Value;这是显示名
                var span = $("<span jmreport_con_id='" + this.controlId + "' displayValue='" + data.Tables[0].Rows[i].ItemArray[1].Value
                                    + "' dataType='" + (valueTypeIsString ? 'string' : 'number')
                                    + "' value='" + data.Tables[0].Rows[i].ItemArray[0].Value + "'>"
                                    + data.Tables[0].Rows[i].ItemArray[1].Value + "</span>").appendTo(this.layOptionsContent);
                this.items.push(span);
            }

            //创建单选框的点击事件
            this.absoluteLay.find('span').click(function () {
                if ($(this).attr('selected')) {
                    $(this).removeAttr('selected');
                } else {
                    $(this).attr('selected', 'selected');
                }
                self.comboBoxClick(this);
            });

            defValCount = false;
            //处理默认值
            if (this.defaultValues && this.defaultValues.length > 0) {
                //取得默认值数组
                var items = this.defaultValues[0];
                items = items.split(',');
                //循环选择默认值中出现的项目
                for (var i = 0; i < this.items.length; i++) {
                    for (var j = 0; j < items.length; j++) {
                        if ($(this.items[i]).attr('value') == items[j].trim("'")) {
                            $(this.items[i]).attr('selected', 'selected');
                            self.comboBoxClick(this.items[i]);
                            defValCount = true;
                        }
                    }
                }
            }

            if (!defValCount) {
                $(this.items[0]).attr('selected', 'selected');
                self.comboBoxClick(this.items[0]);
            }
        }

        //绑定完成的时候触发
        this.finishDataBind();
    };

    //多选框单击
    this.comboBoxClick = function (thisObj) {
        //查找到所有属于这个控件的checkBox
        var items = $("[jmreport_con_id=" + $(thisObj).attr('jmreport_con_id') + "]");
        var str = "";
        var values = "";
        //在结果中查找被选中的checkBox
        for (var i = 0; i < items.length; i++) {
            if ($(items[i]).attr('selected')) {
                if (str != '') { str += "，"; values += ","; }
                str += $(items[i]).attr('displayValue');

                //如果是
                if ($(items[i]).attr("dataType") == 'number') {
                    values += $(items[i]).attr('value');
                } else { values += "'" + $(items[i]).attr('value') + "'"; }
            }
        }
        //生成文本
        //正常情况下，将所收集到的显示名称填入
        var inHtml = "<label>" + str + "</label>";
        //但是如果没有收集到任何的显示名称，表示用户并没选择任何一个checkbox,
        //就将显示框里的值都设为默认的“请点击此处选择..”
        if (str == '') { inHtml = '<span style="color:#ABADB3" >请点击此处选择..</span> '; str = '请点击此处选择..'; } else { str = "选中值为：" + str; }
        //填充以上准备好的字符
        var displayDiv = $("#jmreport_mControl_" + $(thisObj).attr('jmreport_con_id')).find('.jmreport-CheckBoxList-left');
        displayDiv.html(inHtml);
        displayDiv.attr('title', str);
        //给控件主体绑定自定义属性'value' 将真实的收集到的数据赋值上去
        $("#jmreport_mControl_" + $(thisObj).attr('jmreport_con_id')).attr('value', values);

        //当值发生改变的时候
        self.onValueChange();
    }

    //搜索框所激发的方法
    this.search = function () {
        //取出其搜索值
        var sStr = $(this).val();
        if ($.trim(sStr) != '') {
            var request = 0;
            //将搜索值放在正则表达式中
            var reg = new RegExp(sStr, 'g');
            for (var i = 0; i < self.items.length; i++) {
                ///查找是否匹配
                ///如果匹配就显示不匹配就隐藏
                if (reg.test($(self.items[i]).attr('displayValue'))) {
                    $(self.items[i]).css('display', '');
                    request++;
                } else {
                    $(self.items[i]).css('display', 'none');
                }
            }
        } else {
            //如果搜索值为空的话，就直接显示所有
            self.absoluteLay.find("span").css('display', '');
        }
    }

    /*
    *分页器
    */
    this.checkBoxListPager = {
        //100个元素分一页
        pageSize: 0,
        //总行数
        rowNum: 0,
        //当前页
        thisPage: 0,
        //显示分页的面板
        PageCountPanel: '',
        //分页行数
        minPageCount:10,
        init: function (thisObj) {
            if (this.PageCountPanel) {
                $('#' + this.PageCountPanel).remove();
            }

            var psize = 0;
            //如果数据量大于100便开始分页
            if (thisObj.data.Tables[0].Rows.length > this.minPageCount) {
                psize = this.minPageCount;
            } else {
                psize = thisObj.data.Tables[0].Rows.length;
            }

            //初始化分页器
            //设置页大小
            this.pageSize = Number(psize);
            //设置总行数
            this.rowNum = thisObj.data.Tables[0].Rows.length;
            //设置PageCountPanel容器id
            this.PageCountPanel = (+new Date / Math.random()).toString().replace('.', '');
            //设置总页数
            this.pageCount = this.cumputPageCount();
            if (thisObj.data.Tables[0].Rows.length > this.minPageCount) {
                $(thisObj.absoluteLay).append('<div class="PageCountPanel" id=' + this.PageCountPanel + ' ></div>');
            }
        },
        //计算总页数
        cumputPageCount: function () {
            var p = this.rowNum / this.pageSize;
            if (p.toString().indexOf('.') != -1) {
                p = Number(p.toString().split('.')[0]) + 1;
            }
            return p;
        },
        //获得数据范围
        getDataScope: function (data) {
            //复制对象
            var outputDT = jQuery.extend(true, {}, data);
            //获得范围值
            var start = this.thisPage * this.pageSize - this.pageSize;
            var end = this.thisPage * this.pageSize;
            this.rowNum = data.Rows.length;
            if (end <= 0 || end > this.rowNum) { end = this.rowNum; }

            //从数据表装取出范围中的数据
            outputDT.Rows = outputDT.Rows.slice(start, end);
            return outputDT;
        },
        //绑定单击事件（抽象）
        bindClickEvent: function (thisObj) {
            $("[pageIndex='" + this.PageCountPanel + "']").click(function () { thisObj.bind(null, $(this).attr('index')); });
        },
        //生成分页器
        create: function (thisObj) {
            if (thisObj.data.Tables[0].Rows.length > this.minPageCount) {
                thisObj.absoluteLay.find('span').remove();
            } else {
                return;
            }

            //先创建分页容器
            var pagePanel = $('<ul class="PageCount" ></ul>');
            //加入总页数显示
            //pagePanel.append("<li><span>共：</span></li><li><span>" + this.pageCount + "</span></li><li><span>页</span></li>");

            var pageItems = $('<li></li>');

            //开始页面跳转按钮的循环
            for (var i = 0; i < this.pageCount; i++) {
                var j = i + 1;

                //如果页数大于八页，就开始一些复杂的逻辑判断，但如果没有大于八页，就直接输出八页
                if (this.pageCount > 8) {

                    //如果当前页面在五页之内时，便在下标等于7的时候，也就是刚好循环输出了6项页标时，退出循环并标出最后一页
                    if (this.thisPage <= 5) {

                        if (i >= 7) {
                            pageItems.append('<b>...</b><a  pageIndex="' + this.PageCountPanel + '" index="' + this.pageCount + '" > ' + this.pageCount + '</a>');
                            break;
                        }

                        //判断是否循环到当前页面，到了当前页面便给上一个当前页面的标识
                        if (j == this.thisPage) {
                            pageItems.append('<a  pageIndex="' + this.PageCountPanel + '" class="selectedA" index="' + j + '" > ' + j + '</a>');
                        }
                        else {
                            pageItems.append('<a  pageIndex="' + this.PageCountPanel + '" index="' + j + '" > ' + j + '</a>');
                        }
                    } else {
                        //如果不在五页之内，先将第一页标识出来，再将当前页减去2，从当前页-2的位置往前循环五项，循环完毕后，标出最后一页
                        pageItems.append('<a  pageIndex="' + this.PageCountPanel + '" index="1" >1</a><b>...</b>');

                        var d = this.thisPage - 2;
                        for (var b = 0; b <= 4; b++) {


                            if (d == this.thisPage) {
                                pageItems.append('<a  pageIndex="' + this.PageCountPanel + '" class="selectedA" index="' + d + '" > ' + d + '</a>');
                            }
                            else {
                                pageItems.append('<a  pageIndex="' + this.PageCountPanel + '" index="' + d + '" > ' + d + '</a>');
                            }


                            if (d == this.pageCount)
                            { break; }
                            d++;
                        }

                        if (d == this.pageCount)
                        { break; }

                        pageItems.append('<b>...</b><a  pageIndex="' + this.PageCountPanel + '" index="' + this.pageCount + '" > ' + this.pageCount + '</a>');
                        break;
                    }
                }
                else {//没有大于八页
                    if (j == this.thisPage) {
                        pageItems.append('<a  pageIndex="' + this.PageCountPanel + '" class="selectedA" index="' + j + '"> ' + j + '</a>');
                    }
                    else {
                        pageItems.append('<a  pageIndex="' + this.PageCountPanel + '" index="' + j + '" > ' + j + '</a>');

                    }
                }
            }
            //将循环好的项目返回去界面
            $("#" + this.PageCountPanel).empty();
            $("#" + this.PageCountPanel).append(pagePanel.append(pageItems));
            //绑定跳转事件
            this.bindClickEvent(thisObj);
        }
    }

    //绑定搜索事件
    this.searchBox.bind('focus', this.search);
    this.searchBox.bind('keyup', this.search);

    /**
    *绑定层的单击事件，以阻止冒泡
    */
    this.absoluteLay.click(function (event) {
        //阻止冒泡
        event.stopPropagation();
    });

    /*
    *绑定主元素的单击事件
    *单击主元素就弹出游戏选择层
    */
    this.element.click(function (event) {
        if (typeof (self.data) == 'undefined') {
            return;
        }
        //先获得层，就在主体控件的旁边
        var lay = self.absoluteLay;

        //绑定document.click事件，目的是当鼠标点击页面任何位置（除本层外）就将本层隐藏
        var thisObj = lay;
        function hideClick() {
            $(thisObj).fadeOut(300);
            //隐藏后再将本事件（document.click）注销，避免事件堆积
            $(document).unbind('click', hideClick);
        }

        if (lay.css('display') != 'block') {
            //先将层显示出来方便获取/控制器位置
            lay.css('display', 'block')
            .css('left', $(this).position().left + "px")
            .css('top', ($(this).position().top + ($(this).height() || 30) + 2) + "px");

            //再将层隐藏,再以动画的形式显示出来
            lay.css('display', 'none').fadeIn(300);
            $(document).click(hideClick);
        } else {
            hideClick();
        }
        //一定要阻止冒泡不然此层会现实后又消失，原因是单击事件会最终落到刚刚绑定的那个document.click之中
        event.stopPropagation();
    });

    /**
    * 获取当前控件值集合
    */
    this.getValues = function () {
        this.values[0].value = this.element.attr('value');
        if (this.values[0].value == '') {
            this.values[0].value = null;
        }
        return this.values;
    }

}
//廖力增加于2013-9-23
jmreport.toolbarControls.register('CheckComboBox', jmreport.toolbarControls.controlTypes.checkBoxList);


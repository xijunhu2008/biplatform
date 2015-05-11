
/**
* 单个下拉框控件
*/
jmreport.toolbarControls.controlTypes['comboBoxOne'] = function (config) {
    //初始化
    jmreport.toolbarControls.controlTypes.initControl.call(this, config);
    //生成控件id
    this.controlId = (+new Date / Math.random()).toString().replace('.', '');
    this.state = 'loading'; //默认需要拉取数据
    this.element = this.appendToContainer($('<select></select>'));
    //载入控件主体 
    this.dummyElement = this.appendToContainer($('<div value="" id="jmreport_mControl_' + this.controlId + '" class="jmreport-CheckBoxList" ></div>'));
    //右边的结构
    this.rightSide = $('<div class="jmreport-CheckBoxList-right" ></div>').appendTo(this.dummyElement);
    //左边的结构
    this.leftSide = $('<div class="jmreport-CheckBoxList-left" ></div>').appendTo(this.dummyElement);
    //正在载入的图标
    $('<img src="' + jmreport.root + 'static/img/loading.gif" style="margin-top:6px" />').appendTo(this.leftSide);
    //弹出来的层
    this.absoluteLay = $('<div class="jmreport-CheckBoxList-absoluteLay" ></div>').appendTo('#jmreport-page-content');

    if (this.config.config.Width) {
        this.element.width(this.config.config.Width);
    }

    var self = this;
    this.changeEvent = function () { self.raiseValueChange(); };

    /*
    *绑定假体控件的数据
    */
    this.dummyElement.click(function (event) {
        if (typeof (self.data) == 'undefined') {
            return;
        }
        event = event || window.event;
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

    //搜索框所激发的方法
    this.search = function () {
        //取出其搜索值
        var sStr = $(this).val();
        if ($.trim(sStr) != '') {
            var request = 0;
            //将搜索值放在正则表达式中
            var reg = new RegExp(sStr, 'g');
            var tempSpan = self.absoluteLay.find("span");
            for (var i = 0; i < tempSpan.length; i++) {
                ///查找是否匹配
                ///如果匹配就显示不匹配就隐藏
                if (reg.test($(tempSpan[i]).attr('title'))) {
                    $(tempSpan[i]).css('display', '');
                    request++;
                } else {
                    $(tempSpan[i]).css('display', 'none');
                }
            }
        } else {
            //如果搜索值为空的话，就直接显示所有

            var tempSpan = self.absoluteLay.find("span");
            for (var i = 0; i < tempSpan.length; i++) {
                tempSpan[i].style.display = '';
            }
        }
    }

    /**
    * 绑定数据
    */
    this.bind = function (data) {
        if (data.Message || data.Tables[0].Rows.length == 0) {
            this.leftSide.html('没有取到数据哦！');
            return;
        }
        this.data = data;
        this.element.html('');
        this.absoluteLay.empty();
        this.leftSide.html('');

        var layTitle = $('<div class="title one" ></div>').appendTo(this.absoluteLay);
        //搜索框
        this.searchBox = $('<input type="text" class="search" placeholder="搜索" />').appendTo(layTitle);
        $(layTitle).click(function (event) {
            //阻止冒泡
            event.stopPropagation();
        });
        //绑定搜索事件
        this.searchBox.bind('focus', this.search);
        this.searchBox.bind('keyup', this.search);

        //有数据才绑定
        if (data.Tables && data.Tables.length > 0 && data.Tables[0].Rows && data.Tables[0].Rows.length > 0) {
            var tb = data.Tables[0];
            for (var i = 0; i < tb.Rows.length; i++) {
                var row = tb.Rows[i];
                var v = row.ItemArray[0].Value;
                if (!v) {
                    v = '';
                }
                var text = row.ItemArray[1].Value;
                var opt = $('<option></option>').html(text).attr('value', v).appendTo(this.element);
                var duOpt = $('<span class="item one" title="' + text + '" ></span>').html(text).attr('value', v).appendTo(this.absoluteLay);
                //默认值处理
                if (this.defaultValues && this.defaultValues.length > 0) {
                    var dv = this.defaultValues[0];
                    if (v == dv || text == dv) {
                        self.absoluteLay.children().removeAttr("selected");
                        self.element.find('option').removeAttr("selected");
                        opt.attr('selected', true);
                        duOpt.attr('selected', 'selected');
                        self.leftSide.html(opt.html());
                    }
                }
                //项目单击处理
                duOpt.click(function () {
                    //更改select的状态
                    self.element.find('option').removeAttr("selected");
                    var opt = self.element.find('option[value="' + $(this).attr('value') + '"]');
                    opt.attr('selected', 'selected');

                    //更改层的状态
                    self.absoluteLay.children().removeAttr("selected");
                    $(this).attr('selected', 'selected');
                    self.leftSide.html($(this).html());

                    //触发change 事件
                    self.element.change();
                    //当值发生改变的时候
                    self.onValueChange();
                });
                //没有默认值就默认选中第一个
                if (self.leftSide.html() == '') {
                    $(this.absoluteLay.children()[1]).attr('selected', 'selected');
                    self.leftSide.html($(this.absoluteLay.children()[1]).html());
                }
            }
        }
        this.absoluteLay.css('min-width', (this.dummyElement.width() - 2) + "px")
        this.element.unbind('change', this.changeEvent);
        if (this.valueChangeHandles && this.valueChangeHandles.length > 0) {
            //触发改变事件
            this.raiseValueChange();
        }
        this.element.bind('change', this.changeEvent);
        //在展开时标识是否载入过

        //绑定完成的时候触发
        this.finishDataBind();
    };
    /**
    * 获取当前控件值集合
    */
    this.getValues = function () {
        var vitem = this.values[0];
        var curoption = this.absoluteLay.find('span[selected=selected]');
        if (!curoption.length) return [];
        vitem.value = curoption.attr('value');//this.element.val();
        var text = curoption.text();//this.element.find('option:selected').text();
        var textitem = { key: vitem.key + 'Text', value: text };
        var num = vitem.key.match(/\d?$/);
        if (num) {
            var textitem2 = { value: text };
            textitem2.key = vitem.key.replace(num, '') + "Text" + num;
            return [textitem, textitem2, vitem];
        }
        return [textitem, vitem];
    }
}
jmreport.toolbarControls.register('ComboBoxOne', jmreport.toolbarControls.controlTypes.comboBoxOne);


/**
* 水平排列选项控件
*/
jmreport.toolbarControls.controlTypes['horizontalListBox'] = function (config) {
    //初始化
    jmreport.toolbarControls.controlTypes.initControl.call(this, config);
    this.state = 'loading'; //默认需要拉取数据
    this.element = this.appendToContainer($('<ul class="jmreport-horizontallistbox"></ul>'));

    var self = this;
    this.changeEvent = function () { self.raiseValueChange(); };
    this.htmlItems = [];
    /**
    * 绑定数据
    */
    this.bind = function (data) {
        if (data.HasError || data.Tables[0].Rows.length == 0) {
            return;
        }
        this.element.html('');
        this.items = [];
        //有数据才绑定
        if (data.Tables.length > 0 && data.Tables[0].Rows.length > 0) {
            var tb = data.Tables[0];
            var self = this;
            //值是否为字符串
            var valueTypeIsString = tb.Columns[0].DataType.indexOf('string') != -1 || tb.Columns[0].DataType.indexOf('String') != -1;
            this.allSelectBut = $('<li>全选</li>').html(text).attr('class', 'allSelectBut').appendTo(this.element);

            for (var i = 0; i < tb.Rows.length; i++) {
                var row = tb.Rows[i];
                var v = row.ItemArray[0].Value;
                var text = row.ItemArray[1].Value;
                var attrvalue = valueTypeIsString ? "'" + v + "'" : v;
                var item = $('<li></li>').html(text).attr('data-value', attrvalue).appendTo(this.element);
                item.click(function () {
                    self.select(this);
                });
                this.items.push(item);
                //默认值处理
                if (this.defaultValues && this.defaultValues.length > 0) {
                    var dv = this.defaultValues[0];
                    if (v == dv || text == dv) {
                        item.toggleClass('selected', true);
                    }
                }
                //没有默认值就选中第一个
                else if (i == 0) {
                    item.toggleClass('selected', true);
                }
                this.htmlItems.push(item);
            }

            //全选事件
            this.allSelectBut.click(function () {
                for (var i = 0; i < self.htmlItems.length; i++) {
                    if ($(this).attr('isSelectAll')) {
                        if (i == 0) { self.htmlItems[i].toggleClass('selected', true); } else {
                            self.htmlItems[i].removeAttr('class');
                        }
                    } else {
                        self.htmlItems[i].toggleClass('selected', true);
                    }
                }
                if ($(this).attr('isSelectAll')) {
                    $(this).removeAttr('isSelectAll').attr('class', 'allSelectBut');
                } else {
                    $(this).attr('isSelectAll', 'true').attr('class', 'allSelectBut selected');
                }
            });
        }
        this.element.unbind('change', this.changeEvent);
        if (this.valueChangeHandles && this.valueChangeHandles.length > 0) {
            //触发改变事件
            this.raiseValueChange();
        }
        this.element.bind('change', this.changeEvent);

        //绑定完成的时候触发
        self.finishDataBind();
    };
    /**
    * 选择一个项
    */
    this.select = function (v) {
        if (typeof v == 'string') {
            if (this.items) {
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    if (item.attr('data-value') == v) {
                        item.toggleClass('selected', true);
                    }
                }
            }
        }
        else if (typeof v == 'object') {
            var item = $(v);
            var selected = item.hasClass('selected');
            //如果当前是选择的，则取消，如果被选择的只有一个，则不能消选 ，最少选一个
            if (selected) {
                var selecteditems = this.element.find('li[class*=selected]');
                if (selecteditems.length < 2) {
                    return;
                }
            }
            item.toggleClass('selected', !selected);
        }

        //在这里检测这些按钮是不是被全了
        //如果是的就将全选按钮亮起
        //不是就将全选按钮暗下去
        var selectCount = 0;
        for (var i = 0; i < self.htmlItems.length; i++) {
            if ($(self.htmlItems[i]).attr('class') == 'selected') {
                selectCount++;
            }
        }
        if (self.htmlItems.length == selectCount) {
            $(self.allSelectBut).attr('isSelectAll', 'true').attr('class', 'allSelectBut selected');
        } else {
            $(self.allSelectBut).removeAttr('isSelectAll').attr('class', 'allSelectBut');
        }

        //当值发生改变的时候
        self.onValueChange();
    }
    /**
    * 获取当前控件值集合
    */
    this.getValues = function () {
        var par = '';
        var selecteditems = [];
        for (var i = 0; i < self.htmlItems.length; i++) {
            if ($(self.htmlItems[i]).attr('class') == 'selected') {
                selecteditems.push(self.htmlItems[i]);
            }
        }

        $(selecteditems).each(function (i, item) {
            par += $(item).attr('data-value') + ',';
        });
        this.values[0].value = par.trim(',');
        return this.values;
    }
}
jmreport.toolbarControls.register('HorizontalListBox', jmreport.toolbarControls.controlTypes.horizontalListBox);

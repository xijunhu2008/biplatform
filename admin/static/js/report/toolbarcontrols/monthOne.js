/**
    * 月份选择控件
    */
jmreport.toolbarControls.controlTypes['monthOne'] = function (config) {
    //初始化
    jmreport.toolbarControls.controlTypes.initControl.call(this, config);

    this.element = this.appendToContainer($('<input type="text" />'));
    this.element.attr('readonly', 'readonly')
    this.selecter = $('<div class="jmreport-toobarMonthOne-selecter"></div>').bind('mouseup', function () {
        return false;
    }).hide().appendTo('body');

    var self = this;
    var yearheader = $('<div class="yearheader"></div>').appendTo(this.selecter);
    $('<a href="#" class="pre">上一年</a>').click(function () {
        self.year -= 1;
        //self.select(self.month);
        self.getVal();
        return false;
    }).appendTo(yearheader);
    this.thisYearDisplay = $('<span class="thisyear" >当年</span>').appendTo(yearheader);
    $('<a href="#" class="next">下一年</a>').click(function () {
        self.year += 1;
        //self.select(self.month);
        self.getVal();
        return false;
    }).appendTo(yearheader);
    var selecterbody = $('<div class="monthbody"></div>').appendTo(this.selecter);
    for (var i = 1; i < 13; i++) {
        $('<a class="month" href="#" data-month="' + i + '">' + i + '</a>').click(function () {
            self.select($(this).attr('data-month'));
            self.hide();
            return false;
        }).appendTo(selecterbody);
    }

    if (this.config.config.Width) {
        this.element.width(this.config.config.Width);
    }


    //绑定焦点获取事件，当控件获得焦点时，显示月份选择框
    this.element.bind('mouseup', function () {
        self.show();
        return false;
    });

    $(document).bind('mouseup', function () {
        self.hide();
    });

    //显示选择框
    this.show = function () {
        var pos = this.element.offset();
        pos.top += this.element.height() + 4;
        this.selecter.css(pos);
        this.selecter.show();
        this.selecter.animate({ opacity: 1 });
    };

    this.hide = function () {
        this.selecter.animate({ opacity: 0 }, function () {
            self.selecter.hide();
        });
    }

    /**
    * 选中月，并获得一串完整的年、月字符串
    */
    this.getVal = function () {
        this.selecter.find('a[class*=current]').toggleClass('current', false);
        //选中当前月
        this.selecter.find('a[data-month=' + this.month + ']').toggleClass('current', true);

        if (this.month.toString().length < 2) {
            this.month = '0' + this.month;
        }
        this.thisYearDisplay.html(this.year + '年' + this.month + '月');
        return this.year + '' + this.month;
    }

    /**
    * 选中指定的月
    */
    this.select = function (m) {
        this.month = m;
        this.element.val(this.getVal(m));
    }

    //设定默认值
    var defaultvalue = config.getDefaultDate(this);
    if (defaultvalue.length > 0) {
        var date = parseDate(defaultvalue[0]);
        this.year = date.getFullYear();
        this.select(date.getMonth() + 1);
    }
    else {
        var date = new Date();
        this.year = date.getFullYear();
        this.select(date.getMonth() + 1);
    }

    /**
    * 获取当前控件值集合
    */
    this.getValues = function () {
        this.values[0].value = this.element.val();
        return this.values;
    }

    this.element.change(function () {
        //当值发生改变的时候
        self.onValueChange();
    });
    //绑定完成的时候触发
    this.finishDataBind();
}
jmreport.toolbarControls.register('MonthOne', jmreport.toolbarControls.controlTypes.monthOne);

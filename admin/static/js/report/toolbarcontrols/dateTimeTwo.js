
/**
* 双日期先择控件
*/
jmreport.toolbarControls.controlTypes['dateTimeTwo'] = function (config) {
    //初始化
    jmreport.toolbarControls.controlTypes.initControl.call(this, config);

    this.element1 = this.appendToContainer($('<input type="text" />'));
    this.appendToContainer($('<label>至</label>'));
    this.element2 = this.appendToContainer($('<input type="text" />'));

    var self = this;
    var option1 = {
        changeMonth: true,
        numberOfMonths: 2,
        onClose: function (selectedDate) {
            self.element2.datepicker("option", "minDate", selectedDate);
        }
    };
    var option2 = {
        changeMonth: true,
        numberOfMonths: 2,
        onClose: function (selectedDate) {
            self.element1.datepicker("option", "maxDate", selectedDate);
        }
    };

    this.element1.datepicker(option1).datepicker('option', jmreport.lans.datePicker['zh']);
    this.element2.datepicker(option2).datepicker('option', jmreport.lans.datePicker['zh']);
    //设定默认值
    var defaultvalue = config.getDefaultDate(this);
    if (defaultvalue.length > 0) {
        this.element1.val(defaultvalue[0]);
        //option2.minDate = defaultvalue[0];
        if (defaultvalue.length > 1) {
            this.element2.val(defaultvalue[1]);
            //option1.maxDate = defaultvalue[1];
        }
        else {
            this.element2.val(formatDate(null, 'yyyy-MM-dd'));
        }
    }
    else {
        this.element1.val(formatDate(null, 'yyyy-MM-dd'));
        this.element2.val(formatDate(null, 'yyyy-MM-dd'));
    }


    /**
    * 获取当前控件值集合
    */
    this.getValues = function () {
        this.values[0].value = this.element1.val();
        this.values[1].value = this.element2.val();
        return this.values;
    }

    /*
    *获取收藏报表的时候应该获取的相对时间
    */
    this.getReViewValue = function () {
        this.values[0].value = "D" + getComparDays(this.element1.val(), formatDate(new Date(), 'yyyy-MM-dd'));
        this.values[1].value = "D" + getComparDays(this.element2.val(), formatDate(new Date(), 'yyyy-MM-dd'));
        return this.values;
    }

    this.element1.change(function () {
        //当值发生改变的时候
        self.onValueChange();
    });
    this.element2.change(function () {
        //当值发生改变的时候
        self.onValueChange();
    });
    //绑定完成的时候触发
    this.finishDataBind();
}
jmreport.toolbarControls.register('DateTimeTwo', jmreport.toolbarControls.controlTypes.dateTimeTwo);

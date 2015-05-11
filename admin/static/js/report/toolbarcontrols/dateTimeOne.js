/**
* 单日期先择控件
*/
jmreport.toolbarControls.controlTypes['dateTimeOne'] = function (config) {
    //初始化
    jmreport.toolbarControls.controlTypes.initControl.call(this, config);

    this.element = this.appendToContainer($('<input type="text" />'));

    if (this.config.config.Width) {
        this.element.width(this.config.config.Width);
    }

    this.element.datepicker({
        changeMonth: true
    }).datepicker('option', jmreport.lans.datePicker['zh']);

    //设定默认值
    var defaultvalue = config.getDefaultDate(this);
    if (defaultvalue.length > 0) {
        this.element.val(defaultvalue[0]);
    }
    else {
        this.element.val(formatDate(null, 'yyyy-MM-dd'));
    }

    /**
    * 获取当前控件值集合
    */
    this.getValues = function () {
        this.values[0].value = this.element.val();
        return this.values;
    }

    /*
    *获取收藏报表的时候应该获取的相对时间
    */
    this.getReViewValue = function () {
        this.values[0].value = "D" + getComparDays(this.element.val(), formatDate(new Date(), 'yyyy-MM-dd'));
        return this.values;
    }

    var self = this;
    this.element.change(function () {
        //当值发生改变的时候
        self.onValueChange();
    });
    //绑定完成的时候触发
    this.finishDataBind();
}
jmreport.toolbarControls.register('DateTimeOne', jmreport.toolbarControls.controlTypes.dateTimeOne);

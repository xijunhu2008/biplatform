/**
* 单日期先择控件
*/
jmreport.toolbarControls.controlTypes['dateTimePickerOne'] = function (config) {
    //初始化
    jmreport.toolbarControls.controlTypes.initControl.call(this, config);

    this.element = this.appendToContainer($('<input type="text" />'));

    if (this.config.config.Width) {
        this.element.width(this.config.config.Width);
    }

    //配置控件语言
    $.timepicker.setDefaults($.timepicker.regional['zh-CN']);

    //将jquery ui 插件应用到控件之上
    this.element.datetimepicker({
        showSecond: true,
        dateFormat: 'yy-mm-dd',
        timeFormat: 'hh:mm:ss',
        stepHour: 1,
        stepMinute: 1,
        stepSecond: 1
    });

    //设置默认时间格式
    config.dateFormat = 'yyyy-MM-dd HH:mm:ss';
    //设定默认值
    var defaultvalue = config.getDefaultDate(this);
    if (defaultvalue.length > 0) {
        this.element.val(defaultvalue[0]);
    }
    else {
        this.element.val(formatDate(null, 'yyyy-MM-dd HH:mm:ss'));
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
jmreport.toolbarControls.register('DateTimePickerOne', jmreport.toolbarControls.controlTypes.dateTimePickerOne);

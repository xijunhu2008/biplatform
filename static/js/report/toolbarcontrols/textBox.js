
/*
*一个简单的文本框
*廖力增加于2013-9-16
*/
jmreport.toolbarControls.controlTypes['textBox'] = function (config) {
    //初始化
    jmreport.toolbarControls.controlTypes.initControl.call(this, config);

    //载入控件
    this.element = this.appendToContainer($('<input type="text" />'));
    //如果配置中有配置宽度
    if (this.config.config.Width) {
        //给它配置中的宽度
        this.element.width(this.config.config.Width);
    }
    //如果配置中有配置默认值
    if (this.defaultValues.length > 0) {
        //给它配置中的默认值
        this.element.val(this.defaultValues[0]);
    }

    //获取当前控件的值
    this.getValues = function () {
        var vitem = this.values[0];
        vitem.value = this.element.val();

        var textitem = { key: vitem.key + 'Text', value: vitem.value };
        var num = vitem.key.match(/\d?$/);
        if (num) {
            var textitem2 = { value: vitem.value };
            textitem2.key = vitem.key.replace(num, '') + "Text" + num;
            return [textitem, textitem2, vitem];
        }
        return [textitem, vitem];
    }
    this.element.change(function () {
        //当值发生改变的时候
        self.onValueChange();
    });
    //绑定完成的时候触发
    this.finishDataBind();
}
//廖力增加于2013-9-16
jmreport.toolbarControls.register('TextBox', jmreport.toolbarControls.controlTypes.textBox);

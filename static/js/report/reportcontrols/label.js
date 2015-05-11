/**
* 文本显示控件
*/
jmreport.reportControls.controlTypes['label'] = function (config) {
    jmreport.reportControls.controlTypes.initControl.call(this, config); //初始化

    this.title.hide();

    var that = this;

    /**
    * 绑定数据
    */
    this.bind = function () {
        if (!this.data) return;
        var dt = this.data.Tables[0];
        if (dt.Rows.length <= 0) {
            this.log('暂无数据哦，亲！');
            return;
        }

        //通过参数配置样式
        var styleStr = this.styleHandler.get();
        this.control.attr('style', styleStr);
        var content = $('<span class="jmreport-control-label"></span>');
        content.html(dt.Rows[0].ItemArray[0].Value);
        this.control.empty();
        content.appendTo(this.control);
        //完成渲染调用此方法
        //此方法位于jmreport.reportControls.js
        this.drawCompleteCallBack();
    }

    /*
    *样式处理
    */
    this.styleHandler = {
        get: function () {
            var resultStyle = "";
            if (that.config.config.ControlPara) {
                var configArr = that.config.config.ControlPara.split('|');
                for (var i in configArr) {
                    if (configArr[i]) {
                        resultStyle += this.styleSwitch(configArr[i]) + ";";
                    }
                } 
            }
            return resultStyle;
        }
        ,
        styleSwitch: function (str) {
            var strArr = str.split('=');
            var resultStr = "";
            switch (strArr[0]) {
                case 'FontSize':
                    resultStr = " font-size:" + strArr[1] + "px";
                    break;
                case 'FontWeight':
                    resultStr = " font-weight:" + strArr[1];
                    break;
                case 'Foreground':
                    resultStr = " color:" + strArr[1].replace('#FF', '#');
                    break;
                case 'TextWrapping':
                    if (strArr[1] == 'Wrap') {
                        resultStr = " white-space:normal";
                    } else {
                        resultStr = " white-space:nowrap";
                    }
                    break;
            }
            return resultStr;
        }
    }

}             //--end label
jmreport.reportControls.register('Title', jmreport.reportControls.controlTypes.label);

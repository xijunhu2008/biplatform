/**
* 图片框
*/
jmreport.reportControls.controlTypes['imageBox'] = function (config) {
    jmreport.reportControls.controlTypes.initControl.call(this, config); //初始化
    this.title.hide();
    var that = this;
    /**
    * 绑定数据
    */
    this.bind = function () {
        if (!this.data) return;
        var dt = this.data[0];
        if (dt.data.length <= 0) {
            this.log('暂无数据哦，亲！');
            return;
        }

        $('<img src="' + this.config.config.linkpageid + '" />').appendTo(this.control);

        //完成渲染调用此方法
        //此方法位于jmreport.reportControls.js
        this.drawCompleteCallBack();
    }
}             //--end imageBox
jmreport.reportControls.register('ImageBox', jmreport.reportControls.controlTypes.imageBox);

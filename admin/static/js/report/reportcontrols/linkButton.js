//LinkButton
/**
* 文本显示控件
*/
jmreport.reportControls.controlTypes['linkButton'] = function (config) {
    jmreport.reportControls.controlTypes.initControl.call(this, config); //初始化

    this.title.hide();

    var that = this;

    /**
    * 绑定数据
    */
    this.bind = function () {
        var dt = this.data.Tables[0];
        if (dt.Rows.length <= 0) {
            this.log('暂无数据哦，亲！');
            return;
        }

        //通过参数配置样式
        var content = $('<a href="' + this.linkHandler(this.config.config.LinkPageID) + '"  class="jmreport-control-linkButton" ></a>').attr('target', "_blank");
        content.html(this.config.config.Title);
        this.control.empty();
        content.appendTo(this.control);
        //完成渲染调用此方法
        //此方法位于jmreport.reportControls.js
        this.drawCompleteCallBack();
    }
}//--end linkButton
jmreport.reportControls.register('LinkButton', jmreport.reportControls.controlTypes.linkButton);

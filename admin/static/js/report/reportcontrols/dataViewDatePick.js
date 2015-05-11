/**
* 图片框
*/
jmreport.reportControls.controlTypes['dataViewDatePick'] = function (config) {
    jmreport.reportControls.controlTypes.initControl.call(this, config); //初始化
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

        var option = {
            theme: true,
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            editable: true
        }

        option.events = this.createData(dt);

        this.control.fullCalendar(option);

        //完成渲染调用此方法
        //此方法位于jmreport.reportControls.js
        this.drawCompleteCallBack();
    }

    //将数据变成fullCalendar可接受的样子
    this.createData = function (data) {
        var resultArr = [];

        for (var i = 0; i < data.Rows.length; i++) {
            var modal = jQuery.extend(true, {}, this.templet.event);
            modal.start = parseDate(data.Rows[i].Date);
            modal.title = data.Rows[i].Value;
            resultArr.push(modal);
        }
        return resultArr;
    }

    //模版类，所有类型的报表模版均在此
    this.templet = {
        event: { title: 'title', start: new Date() }
    }
}
//--end imageBox
jmreport.reportControls.register('DataViewDatePick', jmreport.reportControls.controlTypes.dataViewDatePick);

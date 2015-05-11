/**
* 图表控件
*/
jmreport.reportControls.controlTypes['eprChart'] = function (config) {
    jmreport.reportControls.controlTypes.initControl.call(this, config); //初始化


    /**
    *通过图表类型的判断给相应类型的图表予样式
    **/
    this.chartStyle = {
        typeMapping : { 'bar': 'column', 
                        "stackedbar100": "column", 
                        "stackedbar": 'column', 
                        'radar': 'line', 
                        'horizontalbar': 'bar',
                        'horizontalstackedbar':'bar',
                        'horizontalstackedbar100':'bar',
                        'stackedarea':'area',
                        'stackedarea100':'area',
                        'doughnut':'pie',
                        'range':'line',
                        'splinerange':'spline'
                        }
        ,
        decide:function(t){
            //判断是否为堆积柱子、百分百堆积，或者非百分百堆积
            if (new RegExp('^(stackedbar{1,1})([100]{0,1})').test(t) 
            //判断是否为雷达图
             || t == 'radar' 
            //判断是否为水平柱
             || t == 'horizontalbar'
            //判断是否为水平堆积柱，或者百分百水平堆积柱
             || new RegExp('^(horizontalstackedbar{1,1})([100]{0,1})').test(t)
             //判断是否为堆积区域图，或者百分百堆积区域图
             || new RegExp('^(stackedarea{1,1})([100]{0,1})').test(t)
             //环状图
             || t == 'doughnut'
             //带状图
             || t == 'range'
             //平滑带状图
             || t == 'splinerange'
             //气泡图
             || t == 'bubble') {
                return t;
            }
            return false;
        }
        ,
        //独特的数据格式，比如带状图
        spData:function(isTypeStyle,series){
            switch(isTypeStyle){
                case'splinerange':
                case'range':
                    //如果是带状图，就要将series中的两条数据合并为一条
                    //然后插入到series中
                    var newItem = [{name:'范围',data:[],type: "area"+isTypeStyle}];
                    for(var i=0;i<series[0].data.length;i++){
                        newItem[0].data.push([series[0].data[i],series[1].data[i]]);
                    }
                    series = newItem.concat(series);
                break;
                case "bubble":
                    var newItem = [{name:series[1].name,data:[],type: isTypeStyle}];
                    for(var i=0;i<series[0].data.length;i++){
                        newItem[0].data.push([series[0].data[i],series[1].data[i]]);
                    }
                    series = newItem;
                break;
            }
            return series;
        }
        ,
        //通过不同的图形，给与不同的图形样式
        set:function(isTypeStyle,chart){
         //如果需要堆积，就将其设置为堆积的样子
            switch (isTypeStyle) {
                case 'stackedarea':
                case 'stackedarea100':
                case 'horizontalstackedbar100':
                case 'horizontalstackedbar':
                case 'stackedbar100':
                case 'stackedbar':
                    chart.plotOptions["series"] = {
                        stacking: 'normal',
                        groupPadding: 0.02, //设置一下间距，让柱子大一些，避免文字溢出
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || '#454545',
                            borderRadius: 5,
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            padding:5,
                            shadow:true
                        },
                        zIndex: -1
                    }
                    //如果是百分比堆积柱状图的话就更改一下堆积设置
                    if (new RegExp('^(horizontalstackedbar{1,1}|stackedarea{1,1}|stackedbar{1,1})([100]{1,1})').test(isTypeStyle)) {
                        chart.plotOptions["series"].stacking = "percent";
                    }
                    //如果是横向堆积的话就要注意一下x轴
                    if (new RegExp('^(horizontalstackedbar{1,1})([100]{0,1})').test(isTypeStyle)) {
                        chart.xAxis.labels.align = 'right';
                    }
                    break;
                case 'radar':
                    //如果是雷达图，便设置图形样式头尾合并，此属性需要highcharts-more.js支持
                    chart['chart'].polar = true;
                    chart.xAxis.tickmarkPlacement = 'on';
                    chart.xAxis.lineWidth = 0;
                    chart.yAxis.lineWidth = 0;
                    chart.yAxis.gridLineInterpolation = 'polygon';
                    chart.yAxis.min = 0;
                    //如果配置中未给定具体图表的高度，就给一个默认高度
                    //if (!this.config.config.Height) { this.config.config.Height = 500; this.control.height(this.config.config.Height); }
                    break;
                case 'horizontalbar':
                    //如果是水平柱状图
                    //就要将x轴(在水品柱状图中看上去像y轴)的标签对齐方向设为右边
                    //否则标签会混乱
                    chart.xAxis.labels.align = 'right';
                    break;
                case 'doughnut':
                    //环状图
                    chart.plotOptions["series"] = {
                        innerSize:'50%'
                    }
                    break;
                }
                return chart;
        }
    }

    /**
    * 生成图形参数
    */
    this.createSeries = function (data, chart) {

        var types = this.config.config.DefaultChartType ? this.config.config.DefaultChartType.split(';') : ['line'];

        //检查是否为双y轴设置
        //是的话则多添加一个y轴
        if(this.config.config.IsAxis2Y){
            //复制一个一模一样的chart.yAxis[0]出来，并添加到yAxis中去
            var yAxisTow = jQuery.extend(true, {}, chart.yAxis[0]);
            yAxisTow['opposite'] = true;
            chart.yAxis.push(yAxisTow);
        }

        //设置新图标与老图表的图形映射关系
        var typemapping = this.chartStyle.typeMapping;
        //声明数据容器
        chart.series = [];
        var legendVisible = this.config.config.ChartLegendVisibility == 'true';
        var fieldIndex = 1;

        //已经将类型名称转换过后的类型数组
        var typeses = [];
        //判断是否要堆积
        var isTypeStyle = false;
        for (var i = 0; i < types.length; i++) {
            var t = types[i].toLowerCase();
            //需要单独设置样式的图形在此判断
            isTypeStyle = this.chartStyle.decide(t);
            if (typemapping[t]) { t = typemapping[t]; }
            typeses.push(t);
        }

        //图形 参数
        var series = {
            name: '',
            showInLegend: legendVisible,
            data: []
        };

        //给一些特殊的图形设置样式
        if (isTypeStyle) {
           chart = this.chartStyle.set(isTypeStyle,chart);
        } else {
            //将柱状图放在最下面，以防遮住在同样区域内的折线图
            chart.plotOptions["column"] = { zIndex: -1 }
        }

        //取第一列为X轴列
        series.xField = data.Columns[0];
        series["xArr"] = [];
        var lastType = '';
        for (var j = fieldIndex; j < data.Columns.length; j++) {
            var c = data.Columns[j];
            //如果为数字，则设为线条的y轴
            if (this.typeNameIsNumber(c.DataType)) {
                //series.yField = c;
                series.name = c.DisplayName;
                //如果是堆积柱状图，那么应该所有的项目都是柱状图，强制所有图形都为柱状图
                if (isTypeStyle && new RegExp('^(stackedbar{1,1})([100]{0,1})').test(isTypeStyle)) {
                    series.xArr.push({ yField: c, type: 'column' });
                } else {
                    //type有时候不会对应每一列，那么如果type已经循环到底了，
                    //列还未循环完毕的话，就用其最后一个type为剩下的所有列赋予其图形样式
                    if (typeses[j - 1]) {
                        series.xArr.push({ yField: c, type: typeses[j - 1] });
                        //记录上一个图形样式
                        lastType = typeses[j - 1];
                    } else {
                        series.xArr.push({ yField: c, type: lastType });
                    }
                }
                fieldIndex++;
            }
        }


        chart.xAxis.categories = [];
        //x轴标签时间格式化
        var xformat = this.config.config.DefaultLabelFormat || 'yyyy-MM-dd';
        // 强制设置highchart中的chart.xAxis.dateTimeLabelFormats格式化属性，使之可以在chart.xAxis.labels.formatter方法中用this.dateTimeLabelFormat取到
        chart.xAxis.dateTimeLabelFormats = { millisecond: xformat, second: xformat, minute: xformat, hour: xformat, day: xformat, week: xformat, month: xformat, year: xformat };

        //是否为日期格式
        //已经注销判断，因为有些字段明明是事件格式，非要把写成system.String,无从判断
        //series.xIsDate = series.xField.DataType.toLowerCase().indexOf('datetime') >= 0 ;

        //如果是日期格式便设置默认的格式化方法
        //廖力修改于2013/9/17
        //if (series.xIsDate) {
        chart.xAxis.labels.formatter = function () {
            //使用formatDate方法将.net格式的时间格式化
            var val = formatDate(parseDate(this.value), this.dateTimeLabelFormat);
            if(val.indexOf('NaN') == -1){
                return val;
            }else{return this.value}
        }
        //}

        //计算X轴标签显示个数，如果大于20个则跳过某些
        var labelstep = 1;

        //如果大于二十条数据就跳过某些label 免得x轴拥挤
        if (data.Rows.length > 10) {
            //算出跳数
            labelstep = Math.floor(data.Rows.length / 10);
            //将跳数应用于labels.step之上
            //廖力修改于2013/9/17
            chart.xAxis.labels.step = labelstep;
            //设置一下rotation将这些lable压至一行，否则labels们就会呈阶梯状,让人费解
            chart.xAxis.labels.rotation = 0.1;
        }

        //获取数据
        var result = {};
        //alert(t + "_" + series.type);
        result = this.GraphiceData.get(data, series, chart, typeses);


        //将返回数据赋予chart 和chart.series;
        chart = result.chart;
        //this.chartStyle.spData为整合一些特殊数据所用，比如带状图
        chart.series = this.chartStyle.spData(isTypeStyle, chart.series.concat(result.data));

        return chart;
    }
    /**
    *获取数据方式的json类
    */
    this.GraphiceData = {
        /**
        *获得highCharts图标数据的标准格式
        *
        *@method GraphiceData.get
        *@param {json} [data] 从后端取来的数据
        *@param {json} [series] highcharts的数据配置模型
        *@param {json} [chart] highcharts的报表配置模型
        *@return {json} 包含被修改过的chart参数和已经准备好的series
        */
        get: function (data, series, chart, types) {
            //在result中定义要返回的图表配置对象和拼好的数据
            var result = { chart: null, data: [] };

            //首先，根据已经整理好的堆积参数“series.xArr”的数量和值 整理堆积图的数据
            for (var i = 0; i < series.xArr.length; i++) {
                var ser = series.xArr[i];
                //建立一个series的数组模型
                var iItem = { name: ser.yField.DisplayName, field: ser.yField, xIsDate: series.xIsDate, data: [], showInLegend: series.showInLegend, type: ser.type,yAxis:0 };

                //如果当前已经循环到第二项之后了，并且y轴有多个，就启用第二y轴
                if(i>0 && chart.yAxis.length > 1){iItem.yAxis = 1;iItem.step = "left"}
                //然后再循环data里的数据，iItem即series的数组模型会根据series.xArr中当前的循环项整理要堆积的数据
                for (var j = 0; j < data.Rows.length; j++) {
                    var items = data.Rows[j].ItemArray;
                    for (var k = 0; k < items.length; k++) {
                        var item = items[k];
                        if (item.ColumnName == ser.yField.Name) {
                            if (ser.type == 'pie') {
                                //第三列为饼图的图例
                                iItem.data.push([items[2].Value, Number(item.Value)]);
                            }
                            else {
                                iItem.data.push(Number(item.Value));
                            }
                        }
                    }
                }
                //整理完成后压入result.data 然后进入下一个series.xArr项目的数据整理
                result.data.push(iItem);
            }

            //下面是从 data.Rows里整理出X轴的display值
            for (var j = 0; j < data.Rows.length; j++) {
                var items = data.Rows[j].ItemArray;

                for (var k = 0; k < items.length; k++) {
                    var item = items[k];
                    if (item.ColumnName == series.xField.Name) {//x轴值	
                        chart.xAxis.categories.push(item.Value);
                    }
                }
            }

            //以上各种循环的目的是为了达到数据为以下格式
            //chart.xAxis.categories = ["逆战","生化战场","战争前线","烈焰行动","使命召唤","NBA2K","剑灵","天堂2","炫舞2","刀剑2","就要K歌","自由足球","发行线"];
            //chart.series=[{"name":"月流失用户（万）","data":[485.45,74.35,74.48,2.94,0.9,188.77,8.34,11.37,123.02,0.02,167.04,1.46,931.18],"showInLegend":true,"type":"column"},
            //              {"name":"月留存用户（万）","data":[468.62,23.87,37.26,1.29,0.01,230.62,0.3,9.79,66.57,0.07,59.02,0.03,915.3],"showInLegend":true,"type":"column"}];

            result.chart = chart;
            return result;
        }
    }

    /**
    * 绑定数据
    */
    this.bind = function () {
        var dt = this.data.Tables[0];
        if (dt.Rows.length <= 0) {
            this.log('暂无数据哦，亲！');
            return;
        }

        /*图形配置*/
        var self = this;
        var option = {
            chart: {
                polar: false,
                zoomType: 'xy'
                    ,
                style: {
                    //为解决图表无法resize
                    position: 'absolute'
                }
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                type: 'datetime',
                //设置x轴线的样式
                gridLineWidth: 0,
                lineColor: '#454545',
                tickColor: '#454545',
                tickmarkPlacement: 'on',
                labels: {
                    align: 'center',
                    formatter: function () {
                        return this.value;
                    }
                }
            },
            yAxis: [{
                title: {
                    text: ''
                },
                //设置y轴线的样式
                minorTickInterval: 'auto',
                lineColor: '#454545',
                gridLineWidth: 0,
                lineWidth: 1,
                tickWidth: 1,
                tickColor: '#454545',
            }],
            tooltip: {
                shared: true,
                crosshairs: true
            }
                ,
            plotOptions: {
                //图形事件,包含所有类型、如果只想为特定类型绑定事件，该级项目的名称“series”可对应替换成类型名称
                series: {
                    cursor: "pointer",
                    events: {
                        click: function (e) {
                            //关联页面
                            var page = self.config.config.LinkPageID;
                            if (page) {
                                //如果配置了多个，就弹出菜单
                                var ps = page.split(';');
                                if (ps.length > 1 || (ps.length == 1 && ps[0].indexOf('|') >= 0)) {
                                    //菜单关联参数
                                    var arg = {
                                        field: e.point.series.options.field.Name,
                                        date: e.point.category,
                                        x: e.x,
                                        y: e.y
                                    };
                                    self.clickMenu.create(arg, self, ps);
                                }
                                else {
                                    self.report.page.openPopPage(page);
                                }
                            }
                        }
                    }
                }
                , pie: {
                    allowPointSelect: true,
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                },
                spline: {
                    pointPadding: 0,
                    borderWidth: 0,
                    marker: {
                        radius: 1
                    }
                },
                line: {
                    pointPadding: 0,
                    borderWidth: 0,
                    marker: {
                        radius: 1
                    }
                }
            }
        };

        option = this.createSeries(dt, option); //生成图序列

        //获取图例位置
        var legendPosition = this.config.config.ChartLegendPosition ? this.config.config.ChartLegendPosition.toLowerCase() : 'right';
        //设置图例
        option.legend = {
            layout: legendPosition == 'left' || legendPosition == 'right' ? 'vertical' : 'horizontal',
            align: legendPosition,
            verticalAlign: 'top'
        };
        this.control.highcharts(option);


        //为解决图表无法resize
        //关于highcharts放入table内无法resize的问题，查出原因如下

        //已知window.resize时会调用所有图表中的reDraw()方法重新绘制
        //reDraw()方法中包含获取父级元素宽、高的代码。
        //当窗口缩小时，其中图表reDraw时，受它本身影响，父级被支撑，然所获得父级之纬度信息又与它本身相同，简而言之，就是互相被卡住了。

        //解决方法：
        //使其子元素于父元素之内时，无法支撑父元素的维度信息，使其父元素不受其子元素维度信息影响，自由伸展
        //这样父级纬度信息是不受其子元素所支撑的，故可使子元素获得当前正确的父元素的维度信息
        //生成图表项目时,给父元素'overflow:hidden;position:relative;width:99%'
        //给子元素‘position:absolute;’
        this.control.css('width', '99%').css('overflow', 'hidden');
        this.control.find('tspan:contains(Highcharts.com)').hide();
    }
}          //--end eprchart
//现二种表格合二为一
jmreport.reportControls.register('ChartXY', jmreport.reportControls.controlTypes.eprChart);
jmreport.reportControls.register('ChartXYTab', jmreport.reportControls.controlTypes.eprChart);

/**
* 新的图表控件
*应用高级配置的图表控件
*/
jmreport.reportControls.controlTypes['advanceEprChart'] = function (config) {
    jmreport.reportControls.controlTypes.initControl.call(this, config); //初始化
    //将this变成self,方便在类中使用
    var self = this;
    /**
    * 绑定数据方法
    *第一步，通过数据取得正确的Series
    *第二步，通过数据获得正确y轴列
    *第三步，通过图表类型和config适配正确的样式和行为
    *第四步，配置事件
    *第五步，输出图表
    */
    this.bind = function () {
        if (!this.data) { return; }
        var data = this.data.Tables[0];
        if (data.Rows.length <= 0) {
            this.log('暂无数据哦，亲！');
            return;
        }
        //在所有动作之前，取出高级配置
        this.advanceConfig = JSON.parse(this.config.config.AdvanceConfig);

        //建立模型
        this.resultModal = { highChartStyle: null, series: null, categories: null, events: null };

        //第一步，通过数据取得正确的Series 
        this.resultModal.series = this.getSeries(data);

        //为第一步侦错，如果第一步没有取到数据，说明列的数据类型配置错误
        if (this.resultModal.series.length == 0) { throw "数据存在，但图表无法正确被应用，请检查SQL中的数据类型是否配置正确。"; }

        //第二步，获得y轴列
        this.resultModal.categories = this.getCategories(data);

        //第三步，获得样式配置
        this.resultModal.highChartStyle = this.styleHandler.get(data);

        //第四步，获得事件模型
        this.resultModal.events = this.getEvent();

        //第五步，输出图表
        var option = this.resultModal.highChartStyle;
        option.series = this.resultModal.series;
        option.xAxis.categories = this.resultModal.categories;
        option.plotOptions.series['events'] = this.resultModal.events;

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
        //将配置输入绘制图形
        this.control.highcharts(option);

        //        //配置导出按钮
        //        //导出图片功能已经去除，廖力 2013年11月27日
        //        //        if (this.downLoadPng) {
        //        //            this.downLoadPng.click(function () {
        //        //                self.control.highcharts().exportChart();
        //        //            });
        //        //        }

        //判断一下是否能获取到其图表，毕竟调皮的ie7获取不到
        if (typeof (self.control.highcharts()) != "undefined") {
            //特殊的尺寸控制，比如控制柱形的最大宽度
            //$(window).unbind('resize', this.drawControl);
            //$(window).resize(this.drawControl);
            this.drawControl();
            //特殊的时间绑定，比如饼图的浮动图例显示tooltip
            this.speEvent(data);
        }


        this.control.find('tspan:contains(Highcharts.com)').remove();
        //把svg设为透明，为显示水印用
        self.control.find('svg > rect').attr('fill', 'transparent');
        //完成渲染调用此方法
        //此方法位于jmreport.reportControls.js
        this.drawCompleteCallBack();
    }

    /**
    * 获取当前控件的html 
    */
    this.getHtml = function (ImageHeight, ImageWidth) {
        //var svg = this.control.highcharts().getSVG();
        //控制svg大小 by skyfang
        var chart = this.control.highcharts();
        if (ImageHeight != null && ImageWidth != null)
            var svg = chart.getSVG({ chart: { width: 885, height: 300} });
        else
            var svg = chart.getSVG();
        return svg;
    }


    //绘制
    this.drawControl = function () {
        var maxWidth = 95;

        for (var i = 0; i < self.control.highcharts().series.length; i++) {
            var series = self.control.highcharts().series[i];
            if (typeof (series.data[0]) != "undefined") {
                if (typeof (series.data[0].pointWidth) != "undefined") {
                    for (var j = 0; j < series.data.length; j++) {
                        //此处为修改BUG:49233706(TAPDID)--2014.01.20
                        if (typeof (series.data[j].graphic) != "undefined") {
                            if (typeof (series.data[j].graphic.width) != "undefined") {
                                if (series.data[j].graphic.width > maxWidth) {
                                    series.data[j].pointWidth = maxWidth;
                                    series.barW = maxWidth;
                                    series.data[j].graphic.width = maxWidth;
                                    $(series.data[j].graphic.element).attr('width', maxWidth);
                                    series.options["pointWidth"] = maxWidth;
                                }
                            }
                        }
                    }
                }
            }
        }

        //设置maring后需要在里面腾出空间

        self.control.highcharts().redraw();

        //检测tooltip的高度是否超出了图形的高度导致看不见，碰到这样的情况就要显示滚动条
        var tooltip = self.control.find("div.highcharts-tooltip");
        $(tooltip).mouseover(function () {
            if (tooltip) {
                tooltip.css('visibility', 'visible');
                var tHeight = Number(tooltip.css('top').replace('px', '')) + tooltip[0].scrollHeight;
                if (tHeight > self.control.height()) {
                    var width = self.control.find("g.highcharts-tooltip").find('rect')[0].width.animVal.value;
                    tooltip.css('height', self.control.height() - Number(tooltip.css('top').replace('px', '')) + 'px').css("width", width + 20 + 'px').css('overflow-y', 'auto');
                }
            }
            tooltip.unbind('mouseover');
        });
    }

    //特殊的自定义事件
    this.speEvent = function () {
        var config = self.config.config;
        //饼图的图例显示tooltip
        if (self.control.highcharts().series[0]) {
            if (self.control.highcharts().series[0].options.type == "pie" && config.ShowItemLabels == 'true') {
                self.control.find('.highcharts-legend text').each(function (index, element) {
                    $(element).hover(function () {
                        self.control.highcharts().tooltip.refresh(self.control.highcharts().series[0].data[index]);
                    }, function () {
                        self.control.highcharts().tooltip.hide();
                    })
                });
            } else {
                //如果需要显示说明，就绑定一个事件，
                //检查对应列属否有小说明如果有的话就
                //如果有的话就显示tooltip
                self.control.find('.highcharts-legend text').each(function (index, element) {
                    var dataClumns = self.data.Tables[0].Columns;
                    for (var i = 0; i < dataClumns.length; i++)
                        if ($.trim(dataClumns[i].DisplayName) == $.trim($(this).text()) && $.trim(dataClumns[i].Description) != "") {
                            (function (element, self, Description) {
                                $(element).hover(function (e) {
                                    //创建一个tooltip
                                    self.htmlTooltip = $('<span class="jmreport-chart-TextTooltip"></span>').appendTo(self.control.parent().parent().parent());
                                    self.htmlTooltip.css('top', e.clientY);
                                    self.htmlTooltip.css('left', e.clientX+10);
                                    self.htmlTooltip.html(Description);
                                }, function () {
                                    $(self.htmlTooltip).remove();
                                })
                            }).call(this, element, self, $.trim(dataClumns[i].Description));
                        }
                });
            }
        }
    }

    /*
    *类型处理类
    */
    this.typeMapping = {
        list: {
            'line': 'line',
            'bar': 'column',
            "stackedbar100": "column",
            "stackedbar": 'column',
            'radar': 'line',
            'horizontalbar': 'bar',
            'horizontalstackedbar': 'bar',
            'horizontalstackedbar100': 'bar',
            'stackedarea': 'area',
            'stackedarea100': 'area',
            'doughnut': 'pie',
            'range': 'line',
            'splinerange': 'spline'
        },
        //传入一个老类型，输出一个新类型
        get: function (type) {
            //从配置文件中取出类型
            return this.list[type.toLowerCase()];
        },
        //传入高级配置，在其中添加解析为highcharts的类型字段
        advanceConfigFactory: function (advanceConfig) {
            //循环高级配置中的列配置
            for (var i = 0; i < advanceConfig.ChartMappings.length; i++) {
                //将高级配置中的列取出来与本对象中的类型映射进行匹配
                //在将匹配结果存于高级配置中去以便回头试用
                //其在高级配置的ChartMappings里面为"HighChartType"
                advanceConfig.ChartMappings[i]["HighChartType"] = this.get(advanceConfig.ChartMappings[i]["ChartType"]);
            }
            return advanceConfig;
        }
    }

    //获得x轴行配置
    //返回x轴配置信息
    this.getXconfig = function (data) {
        //将高级配置提取出来
        //并在高级配置中的 "ChartType" 中加入 "HighChartType"
        this.advanceConfig = this.typeMapping.advanceConfigFactory(this.advanceConfig);
        //上一步进行后 this.advanceConfig 中就有了"HighChartType"了

        //x轴所有的类型和显示配置
        var xAxises = []
        var lastConfigMapping = [];
        var tempIndex = 0;
        //填充模版
        //使用高级配置中的ChartMappings列表匹配data中的列，为其设置属性
        for (var i = 0; i < this.advanceConfig.ChartMappings.length; i++) {
            for (var j = 0; j < data.Columns.length; j++) {
                //1.如果匹配成功
                if (data.Columns[j].Name == this.advanceConfig.ChartMappings[i].DataColumn) {
                    //2.取得模版
                    var xAxis = jQuery.extend(true, {}, this.templet.xAxis);
                    //3.取得列
                    var clumn = data.Columns[j];
                    //4.取得高级配置中被匹配成功的列信息
                    var config = this.advanceConfig.ChartMappings[i];

                    //5.设置属性

                    //列的显示名
                    //如果高级配置中有配置显示名
                    //就用高级配置中的显示名，
                    //没有的话取其数据中的，再不济就取字段名
                    if (config.DisplayName != '') {
                        xAxis.name = config.DisplayName;
                    } else if (clumn.DisplayName != '') {
                        xAxis.name = clumn.DisplayName;
                    } else {
                        xAxis.name = clumn.Value;
                    }

                    //列的epr配置
                    xAxis.eprChartMapping = config;
                    //列的层级关系
                    xAxis.index = config.sep;
                    //列对应的轴
                    xAxis.yAxis = Number(config.YAxis.replace('Y', '')) - 1;
                    //列的图形类型
                    xAxis.type = config.HighChartType;
                    //是否显示小标签
                    xAxis.showLabel = config.DynNamicCharactConfig.IsShowLabel;
                    //是否显示小点
                    xAxis.isShowNote = config.DynNamicCharactConfig.IsShowNote;

                    xAxises.push(xAxis);
                }
            }
        }
        return xAxises;
    }

    //获取highCharts数据x轴列
    this.getSeries = function (data) {
        //在result中定义要返回的图表配置对象和拼好的数据
        var resultSeries = [];

        //获得x轴的配置信息
        var xConfig = this.getXconfig(data);
        //计算X轴标签显示个数，如果大于多少个则跳过某些
        var labelstep = this.styleHandler.getLabelStep(data.Rows.length);

        for (var i = 0; i < xConfig.length; i++) {
            //建立一个series的数组模型
            var iItem = xConfig[i];

            //当前步进,用于计算跳数的步进
            var stepIndex = 0;

            //从数据中匹配刚才得到的列配置，
            //并往列配置中加入匹配到的数据列中的数据
            for (var j = 0; j < data.Rows.length; j++) {
                var items = data.Rows[j].ItemArray;
                for (var k = 0; k < items.length; k++) {
                    var dataItem = items[k];
                    //如果匹配成功，将该数据加入至列中
                    if (dataItem.ColumnName == iItem.eprChartMapping.DataColumn) {
                        //取出能显示label的模版
                        var lableData = jQuery.extend(true, {}, this.templet.lableData);
                        //获得点样式
                        var resultModal = this.styleHandler.getPointStyle(dataItem, data, items, iItem, lableData, labelstep, stepIndex);
                        iItem = resultModal.iItem;
                        lableData = resultModal.lableData;
                        labelstep = resultModal.labelstep;
                        stepIndex = resultModal.stepIndex;
                        iItem.data.push(lableData);
                    }
                }
            }
            //整理完成后压入result.data 然后进入下一个series.xArr项目的数据整理
            resultSeries.push(iItem);
        }
        //成功配置Series，并返回
        return this.spData(resultSeries);
    }

    //独特的数据格式，比如带状图
    this.spData = function (series) {
        //获得当前图形是否为需要单独设置样式的特殊图形
        var isSpeStyle = this.styleHandler.getConfigSpeStyle();
        switch (isSpeStyle) {
            case 'splinerange':
            case 'range':
                //如果是带状图，就要将series中的两条数据合并为一条
                //然后插入到series中
                var newItem = [{ name: '范围', data: [], type: "area" + isSpeStyle}];
                for (var i = 0; i < series[0].data.length; i++) {
                    newItem[0].data.push([this.getSeriesData(series[0].data[i]), this.getSeriesData(series[1].data[i])]);
                }
                series = newItem.concat(series);
                break;
            case "bubble":
                //气泡图
                var newItem = [{ name: series[1].name, data: [], type: isSpeStyle}];
                for (var i = 0; i < series[0].data.length; i++) {
                    newItem[0].data.push([this.getSeriesData(series[0].data[i]), this.getSeriesData(series[0].data[i])]);
                }
                series = newItem;
                break;
        }
        return series;
    }


    //因为Series.data[]有两种形式，一种是复杂的形式，有很多设置,另一种是数字
    this.getSeriesData = function (obj) {
        if (typeof (obj) == 'object') {
            return obj.y;
        } else {
            return obj;
        }
    }



    //获得highChartsY轴列
    this.getCategories = function (data) {
        var resultCategories = [];
        //下面是从 data.Rows里整理出X轴的display值

        for (var j = 0; j < data.Rows.length; j++) {
            var items = data.Rows[j].ItemArray;
            for (var k = 0; k < items.length; k++) {
                var item = items[k];
                if (item.ColumnName == data.Columns[0].Name) {//x轴值	
                    resultCategories.push(item.Value);
                }
            }
        }

        //返回结果
        return resultCategories;
    }



    //解析配置，获得highCharts样式结构
    this.styleHandler = {
        getPointStyle: function (dataItem, data, items, iItem, lableData, labelstep, stepIndex) {
            var resultModal = { iItem: null, lableData: null, labelstep: 0, stepIndex: 0 };

            //当前label是否显示
            if (iItem.showLabel) {
                lableData.dataLabels.enabled = true;
                //给堆积模版设置默认值
                //因为堆积图需要全部都显示或者不显示
                self.templet.stackSeries.dataLabels.enabled = true;
                self.templet.highCharts.yAxis.stackLabels = true;
            } 
            //如果不显示线条节点上的标记点
            if(!iItem.isShowNote){
                //如果不是散点图,就不要将点标为零
                //标为零的话点就不见了
                if (iItem.type != 'scatter') {
                    lableData.marker["radius"] = 0;
                }
            }
            //如果需要跳数,便计算当前值是否需要跳过
            if (labelstep != data.Rows.length && iItem.showLabel == true) {
                //如果到了该跳数的范围里，或者其值为零的话
                if (stepIndex != 0 || Number(dataItem.Value) == 0) {
                    lableData.dataLabels.enabled = false;
                    lableData.marker["radius"] = 2;
                }
                stepIndex++;
                if (stepIndex == labelstep) { stepIndex = 0; }
            }
            //设置y值
            //此处判断数据是否为空，避免填写空数据
            if (dataItem.Value != null) {
                lableData.y = Number(dataItem.Value);
            } else {
                lableData.y = null;
            }
            lableData.name = items[0].Value;
            //如果是饼图，就要设置x值
            if (iItem.type == 'pie' && !items[2]) { throw '图表数据格式错误,图形可能无法正确生成，请联系管理员检查！'; }
            if (iItem.type == 'pie' && items[2]) { lableData.x = items[2].Value; lableData.name = items[2].Value; }

            resultModal.iItem = iItem;
            resultModal.labelstep = labelstep;
            resultModal.lableData = lableData;
            resultModal.stepIndex = stepIndex;

            return resultModal;
        },
        getLabelStep: function (dataRowsLength) {
            //如果大于十条数据就跳过某些label 免得x轴拥挤
            if (dataRowsLength > 10) {
                //算出跳数
                return Math.floor(dataRowsLength / 10);
            }
            return dataRowsLength;
        },
        get: function (data) {
            /*
            *1.获得模版
            */
            //获得主要模版
            var chartTemplet = jQuery.extend(true, {}, self.templet.highCharts);

            /*
            *2.解决特殊图形的样式配置
            */
            //判断所有列中是否出现了特殊图形
            var isSpeStyle = this.getConfigSpeStyle();
            //给一些特殊的图形设置样式
            if (isSpeStyle) {
                chartTemplet = this.setSpeStyle(isSpeStyle, chartTemplet);
            }

            /*
            *3.解决X轴样式配置
            *标签类型 文本= 0 日期=1 数值 = 2 
            */
            
            //配置x轴跳数
            //计算X轴标签显示个数，如果大于20个则跳过某些
            var labelstep = this.getLabelStep(data.Rows.length);

            //大于一千跳数据就转换成跳动指针的样子
            if (data.Rows.length > 1000) {
                //设置跳数
                chartTemplet.xAxis.tickInterval = labelstep;
            } else {
                //如果大于十条数据就跳过某些label 免得x轴拥挤
                if (data.Rows.length != labelstep) {
                    //将跳数应用于labels.step之上
                    //廖力修改于2013/9/17
                    chartTemplet.xAxis.labels.step = labelstep;
                    //设置一下rotation将这些lable压至一行，否则labels们就会呈阶梯状,让人费解
                    chartTemplet.xAxis.labels.rotation = 0.1;
                }
            }
            var options = {
                //模版中的轴
                axis: chartTemplet.xAxis,
                //配置中的轴
                config: self.advanceConfig.XAxisClass,
                //axis
                axisName:"x"
            }
            //配置轴样式
            chartTemplet.xAxis = this.axisStyle(options);

            /*
            *4.配置Y轴样式
            */
//            if ($.trim(self.advanceConfig.Y2AxisClass.Title) != '') {
                //复制一个一模一样的chart.yAxis[0]出来，并添加到yAxis中去
                var yAxisTow = jQuery.extend(true, {}, chartTemplet.yAxis[0]);
                yAxisTow['opposite'] = true;
                chartTemplet.yAxis.push(yAxisTow);

                options = {
                    //模版中的轴
                    axis: chartTemplet.yAxis[1],
                    //配置中的轴
                    config: self.advanceConfig.Y2AxisClass,
                    //axis
                    axisName:"y2"
                }
                //配置轴样式
                chartTemplet.yAxis[1] = this.axisStyle(options);
//            }
            options = {
                //模版中的轴
                axis: chartTemplet.yAxis[0],
                //配置中的轴
                config: self.advanceConfig.Y1AxisClass,
                //axis
                axisName:"y1"
            }
            //配置轴样式
            chartTemplet.yAxis[0] = this.axisStyle(options);


            /*
            *5.配置图例
            */
            //获取图例位置 顶部=0 底部 = 1  左侧 =2 右侧 =3
            var legendPosition = self.advanceConfig.Position;

            //设置图例
            chartTemplet.legend = {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'top',
                borderWidth: 0,
                padding: 5
            }
            switch (legendPosition) {
                case 0:
                    chartTemplet.legend.align = 'center';
                    break;
                case 1:
                    chartTemplet.legend.align = 'center';
                    chartTemplet.legend.verticalAlign = 'bottom';
                    break;
                case 2:
                    chartTemplet.legend.layout = 'vertical';
                    break;
                case 3:
                    chartTemplet.legend.align = 'right';
                    chartTemplet.legend.layout = 'vertical';
                    break;
            }



            //如果配置中未给定具体图表的高度，就给一个默认高度
            if (self.advanceConfig.Hight == 0) {
                self.advanceConfig.Hight = 350;
                self.control.height(self.advanceConfig.Hight); 
            }

            //如果高度小于350，那就要设置一下饼图的属性
            if (self.advanceConfig.Hight < 350) {
                chartTemplet.plotOptions.pie.size = (self.advanceConfig.Hight / 100) * 78;
            }

            return chartTemplet;
        },
        /*
        *轴样式设置
        */
        axisStyle: function (option) {

            //设置轴的标题
            if ($.trim(option.config.Title) != '') {
                option.axis.title.text = option.config.Title;
            }

            //设置格式和旋转角度
            var axis = (function (axis) {
                var _thatChart = self;


                //解决格式问题
                axis.labels.formatter = function () {
                    //给加上‘前缀’，‘后缀’的方法
                    var priPostFac = function (str) {
                        return $.trim(option.config.Prifix) + str + $.trim(option.config.Postfix);
                    }
                    //标签类型 文本= 0 日期=1 数值 = 2 
                    switch (option.config.Type) {
                        case 0: //文本
                            return priPostFac(this.value);
                        case 1: //日期
                            var val = parseDate(this.value);
                            if (val.toString() == "Invalid Date") { return priPostFac(this.value); }
                            if (option.config.Format != '') {
                                return priPostFac(formatDate(val, option.config.Format));
                            } else {
                                return priPostFac(this.value);
                            }
                        case 2: //数字
                            var tempValue = this.value;
                            
                            //2.判断是否有数字转换
                            //中文
                            var lan = 'none';
                            if (option.config.NumberConvertCH) {
                                lan = 'ch';
                            } //英文
                            else if (option.config.NumberConvertEN) {
                                lan = 'en';
                            }
                            var modal = formatBigNumber(tempValue, lan);

                            //1.小数位
                            if (Number(option.config.Decimal) != 0 && tempValue.toString().indexOf('.') != -1) {
                                modal.num = Number(modal.num).toFixed(option.config.Decimal);
                            }

                            return priPostFac(modal.num+modal.str);
                    }
                }

                //旋转角度
                if (option.config.Rotation) {
                    if(option.axisName == 'x' || option.axisName == 'y2' ){
                        axis.labels.align = 'left';
                    }
                    axis.labels.rotation = option.config.Rotation;
                }
                return axis;
            }).call(self, option.axis);

            return axis;
        },
        //判断配置中是否出现过特殊图形
        getConfigSpeStyle: function () {
            //循环ChartMappings 看是否出现了特殊图形
            //找到第一个特殊图形就返回
            for (var i = 0; i < self.advanceConfig.ChartMappings.length; i++) {
                var item = self.advanceConfig.ChartMappings[i];
                //发现是特殊图形，立刻返回结果
                if (this.getIsSpeStyle(item.ChartType)) {
                    return this.getIsSpeStyle(item.ChartType);
                }
            }
            //找不到就返回false
            return false;
        },
        //遍历类型,检查是否为特殊图形
        getIsSpeStyle: function (type) {
            var t = type.toLowerCase();
            //需要单独设置样式的图形在此判断
            return this.decide(t);
        },
        decide: function (t) {
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
        },
        //通过不同的图形，给与不同的图形样式
        setSpeStyle: function (isTypeStyle, chart) {
            //如果需要堆积，就将其设置为堆积的样子
            switch (isTypeStyle) {
                case 'stackedarea':
                case 'stackedarea100':
                case 'horizontalstackedbar100':
                case 'horizontalstackedbar':
                case 'stackedbar100':
                case 'stackedbar':
                    chart.plotOptions["series"] = self.templet.stackSeries;

                    //如果是百分比堆积柱状图的话就更改一下堆积设置
                    if (new RegExp('^(horizontalstackedbar{1,1}|stackedarea{1,1}|stackedbar{1,1})([100]{1,1})').test(isTypeStyle)) {
                        chart.plotOptions["series"].stacking = "percent";
                    }
                    //如果是横向堆积的话就要注意一下x轴
                    if (new RegExp('^(horizontalstackedbar{1,1})([100]{0,1})').test(isTypeStyle)) {
                        chart.xAxis.labels.align = 'right';
                    }

                    //如果是区域图就配置一种特殊的样式
                    if (new RegExp('^(stackedarea{1,1})([100]{0,1})').test(isTypeStyle)) {
                        chart.plotOptions["series"].dataLabels['y'] = 20;
                    }
                    break;
                case 'radar':
                    //如果是雷达图，便设置图形样式头尾合并，此属性需要highcharts-more.js支持
                    chart['chart'].polar = true;
                    chart.xAxis.tickmarkPlacement = 'on';
                    chart.xAxis.lineWidth = 0;
                    chart.yAxis[0].minorTickInterval = 'auto';
                    chart.yAxis[0].gridLineInterpolation = 'polygon';
                    chart.yAxis[0].lineWidth = 0;
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
                        innerSize: '50%'
                    }
                    break;
            }
            return chart;
        }
    }

    //获得事件模型
    this.getEvent = function () {
        return this.templet.events;
    }

    //模版类，所有类型的报表模版均在此
    this.templet = {
        //x轴项目
        xAxis: { name: "", eprChartMapping: "", data: [], showInLegend: true, type: "", yAxis: 0, index: 0, showLabel: false,isShowNote:false},
        //带label的图
        lableData: {
            dataLabels: {
                //此处勿轻易配置，
                //这种样式需要在默认的时候没有，
                //别处指定它有就有，
                //如果此处配置有或没有，
                //在别处会造成代码灵活性下降!
                //2013-11-14 廖力
                //enabled:false,
                crop: false,
                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || '#000'
            },
            marker: {
                enabled: true,
                radius: 3,
                lineWidth: 1,
                states: {
                    hover: {
                        enabled: true,
                        radius: 5
                    }
                }
            },
            y: 0
        },
        //堆积图样式模版
        stackSeries: {
            stacking: 'normal',
            groupPadding: 0.1, //设置一下间距，让柱子大一些，避免文字溢出
            zIndex: -1,
            dataLabels: {
                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || '#000'
            }
        },
        //事件模版
        events: {
            click: function (e) {
                //                //关联页面
                //                var page = self.config.config.LinkPageID;
                //                if (page) {
                //                    //如果配置了多个，就弹出菜单
                //                    var ps = page.split(';');
                //                    if (ps.length > 1 || (ps.length == 1 && ps[0].indexOf('|') >= 0)) {
                //                        //菜单关联参数
                //                        var arg = {
                //                            field: e.point.series.options.field.Name,
                //                            date: e.point.category,
                //                            x: e.pageX || e.clientX,
                //                            y: e.pageY || e.clientY
                //                        };
                //                        self.clickMenu.create(arg, self, ps);
                //                    }
                //                    else {
                //                        var par = '{"name":"' + row.ItemArray[0].ColumnName + '","value":"' + row.ItemArray[0].Value + '"}';
                //                        self.report.page.openPopPage(page, _title, undefined, par);
                //                    }
                //                }
            }
        },
        //highCharts静态模版
        highCharts: {
            colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
            chart: {
                polar: false,
                zoomType: 'xy',
                spacing: [30, 30, 25, 30],
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
                startOnTick: false,
                ordinal: false,
                labels: {
                    align: 'center',
                    formatter: function () { }
                },
                title: {
                    text: ''
                }
            },
            yAxis: [{
                title: {
                    text: ''
                },
                //设置y轴线的样式
                minorTickInterval: 0,
                lineColor: '#fff',
                stackLabels: {
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || '#000'
                    }
                },
                labels: {
                    align:'right',
                    formatter: function () { }
                },
            }],
            tooltip: {
                shared: true,
                crosshairs: true,
                useHTML: true
            }
                ,
            plotOptions: {
                //图形事件,包含所有类型、如果只想为特定类型绑定事件，该级项目的名称“series”可对应替换成类型名称
                series: {
                    cursor: "pointer",
                    groupPadding: 0.1,
                    dataLabels: {
                        formatter: function () {
                            return formatNumber(this.y);
                        }
                    }
                }
                 , pie: {
                     allowPointSelect: true,
                     dataLabels: {
                         enabled: false,
                         format: '{point.x}:{point.percentage:.1f} %',
                         connectorColor: '#cccccc',
                         connectorPadding: 2,
                         connectorWidth: 1,
                         distance: 10,
                         color: "#545454",
                         y: -10
                     },
                     states: {
                         hover: {
                             enabled: false
                         }
                     }
                 },
                spline: {
                    pointPadding: 0,
                    borderWidth: 0,
                    turboThreshold: 2000,
                    marker: {
                        radius: 0
                    }
                },
                line: {
                    pointPadding: 0,
                    borderWidth: 0,
                    turboThreshold: 2000,
                    marker: {
                        radius: 0
                    }
                }
            }
        }
    }
}                                                                                                                                                 //--end eprchart
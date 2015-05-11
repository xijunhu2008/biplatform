﻿/**
 * 图表控件
 * config:{
            "interval": 1,
            "height": 0,
            "series": [
                        {"type":"line","pointMark":false,"label":false,"animation": false},
                        {"type":"column","pointMark":false,"label":false,"animation": false}
                      ],
            "isAxis2Y": 0,
            "yTitle": "",
            "y2Title": "",
            "xFormat": "yyyy-MM-dd",
            "xRotation": 0,
            "legendPosition": "right",
            "animation": false
        }
 *
 **/
jmreport.reportControls.controlTypes['eprChart'] = function (config) {

    //如果有高级配置，就直接实例化高级配置的图形对象
    if (typeof (config.config.AdvanceConfig) != "undefined" && $.trim(config.config.AdvanceConfig) != '') {
        return new jmreport.reportControls.controlTypes.advanceEprChart(config);
    }

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


        /*
        *判断大数据
        **1.数据需要超过两千行
        **2.返回数据的第一行第一列必须为日期，本身为字符串没关系，格式一定要是日期
        *满足以上条件，图形样式就会变成：
        **1.无论用户选择图形为什么类型，一律为line
        **2.切换成highStock样式，可以拖拉查看显示范围
        **3.时间将会设置成时间戳，精确显示数据
        *不满足以上条件：
        **1.超过两千行直接截断，并使用用户的默认设置显示数据。
        */
        if (data.Rows.length > 2000) {
            if (isDateString(data.Rows[0].ItemArray[0].Value)) {
                this.isBigData = true;
            } else {
                data.Rows = data.Rows.slice(0, 2000);
            }
        }

        //建立模型
        this.resultModal = { highChartStyle: null, series: null, categories: null, events: null };

        //第一步，通过数据取得正确的Series 
        this.resultModal.series = this.getSeries(data);

        //为第一步侦错，如果第一步没有取到数据，说明列的数据类型配置错误
        if (this.resultModal.series.length == 0) { throw "数据存在，但图表无法正确被应用，请检查SQL中的数据类型是否配置正确。"; }

        if (!this.isBigData) {
            //第二步，获得y轴列
            this.resultModal.categories = this.getCategories(data);
        } else {
            this.resultModal.categories = undefined;
        }

        //第三步，获得样式配置
        this.resultModal.highChartStyle = this.styleHandler.get(data);

        //第四步，获得事件模型
        this.resultModal.events = this.getEvent();

        //第五步，输出图表
        var option = this.resultModal.highChartStyle;
        option.series = this.resultModal.series;
        if (!this.isBigData) {
            option.xAxis.categories = this.resultModal.categories;
        }
        option.plotOptions.series['events'] = this.resultModal.events;

        //指定y起始值
        if (typeof this.config.config.ControlConfig.yMin != 'undefined') {
            option.yAxis[0].min = this.config.config.ControlConfig.yMin;
        }

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
        if (this.isBigData) {
            this.control.highcharts('StockChart', option);
        } else {
            this.control.highcharts(option);
        }

        //配置导出按钮
        //导出图片功能已经去除，廖力 2013年11月27日
        //        if (this.downLoadPng) {
        //            this.downLoadPng.click(function () {
        //                self.control.highcharts().exportChart();
        //            });
        //        }

        //判断一下是否能获取到其图表，毕竟调皮的ie7获取不到
        if (typeof (self.control.highcharts()) != "undefined") {
            //特殊的尺寸控制，比如控制柱形的最大宽度
            //$(window).unbind('resize', this.drawControl);
            //$(window).resize(this.drawControl);
            this.drawControl();
            //特殊的时间绑定，比如饼图的浮动图例显示tooltip
            this.speEvent(data);
        }


        this.control.find('text:contains(Highcharts.com)').remove();
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
        var config = self.config.config.ControlConfig;
        //饼图的图例显示tooltip
        if (self.control.highcharts().series[0]) {
            if (self.control.highcharts().series[0].options.type == "pie" && config.series[0].label == true) {
                self.control.find('.highcharts-legend text').each(function (index, element) {
                    $(element).hover(function () {
                        self.control.highcharts().tooltip.refresh(self.control.highcharts().series[0].data[index]);
                    }, function () {
                        self.control.highcharts().tooltip.hide();
                    })
                });
            } else {
                var getDescText = function (str) {
                    if (str.indexOf('|') != -1) {
                        return str.split('|')[0];
                    }
                    return str;
                }
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
                                    self.htmlTooltip.css('left', e.clientX + 10);
                                    self.htmlTooltip.html(getDescText(Description));
                                }, function () {
                                    $(self.htmlTooltip).remove();
                                })
                            }).call(this, element, self, $.trim(dataClumns[i].Description));
                        }
                });
            }
        }
    }

    //获取highCharts数据x轴列
    this.getSeries = function (data,cateogries) {
        //在result中定义要返回的图表配置对象和拼好的数据
        var resultSeries = [];

        //获得x轴的配置信息
        var xConfig = this.getXconfig(data);

        //计算X轴标签显示个数，如果大于多少个则跳过某些
        var labelstep = this.styleHandler.getLabelStep(data.Rows.length);

        //首先，根据已经整理好的堆积参数“series.xArr”的数量和值 整理堆积图的数据
        for (var i = 0; i < xConfig.length; i++) {
            //建立一个series的数组模型
            var iItem = xConfig[i];

            if (iItem.isThisDisplay == true) {
                //当前步进,用于计算跳数的步进
                var stepIndex = 0;
                //然后再循环data里的数据，iItem即series的数组模型会根据series.xArr中当前的循环项整理要堆积的数据
                for (var j = 0; j < data.Rows.length; j++) {
                    var items = data.Rows[j].ItemArray;
                    for (var k = 0; k < items.length; k++) {
                        var item = items[k];
                        if (item.ColumnName == iItem.yField.Name) {

                            //取出能显示label的模版
                            var lableData = jQuery.extend(true, {}, this.templet.lableData);
                            //获得点样式
                            var resultModal = this.styleHandler.getPointStyle(item, data, items, iItem, lableData, labelstep, stepIndex);
                            iItem = resultModal.iItem;
                            lableData = resultModal.lableData;
                            labelstep = resultModal.labelstep;
                            stepIndex = resultModal.stepIndex;

                            //如果X库为数字
                            //if (iItem.xIsNumber && typeof (lableData.name) == 'string') {
                            //    lableData.name = Number(lableData.name);
                            //}

                            iItem.data.push(lableData);
                        }
                    }
                }
                //整理完成后压入result.data 然后进入下一个series.xArr项目的数据整理
                resultSeries.push(iItem);
            }
        }
        //成功配置Series，并返回
        return this.spData(resultSeries);
    }

    //独特的数据格式，比如带状图
    this.spData = function (series) {
        //获得当前图形是否为需要单独设置样式的特殊图形
        var isSpeStyle = this.styleHandler.getIsSpeStyle();
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

    //获得x轴行配置
    //返回x轴配置信息
    this.getXconfig = function (data) {
        var config = this.config.config.ControlConfig;
        var types = this.typeMapping.get();
        //获得当前图形是否为需要单独设置样式的特殊图形
        var isSpeStyle = this.styleHandler.getIsSpeStyle();

        fieldIndex = 1;
        //x轴所有的类型和显示配置
        var series = []
        var lastType = [];
        var tempIndex = 0;
        //var xIsNumber = this.typeNameIsNumber(data.Columns[0].DataType);

        //检查上个点是否显示了label
        var lastIsShowLabel = false;
        //填充模版
        for (var j = fieldIndex; j < data.Columns.length; j++) {
            //取得模版
            var serie = jQuery.extend(true, {}, this.templet.xAxis);
            //取得列
            var c = data.Columns[j];
            //如果为数字，则设为线条的y轴
            if (this.typeNameIsNumber(c.DataType)) {
                serie.name = c.DisplayName || c.Name;
                serie.yField = c;
                serie.field = c
                serie.isThisDisplay = true;
                serie.index = c.Index;
                //serie.xIsNumber = xIsNumber;

                //如果是堆积柱状图，那么应该所有的项目都是柱状图，强制所有图形都为柱状图
                if (isSpeStyle && new RegExp('^(stackedbar{1,1})([100]{0,1})').test(isSpeStyle)) {
                    serie.type = 'column';
                    //如果分组
                    if (types[j - 1] && types.type == 'bar') {
                        serie.stack = 0;
                    } else {
                        serie.stack = 1;
                    }
                } else {
                    //type有时候不会对应每一列，那么如果type已经循环到底了，
                    //列还未循环完毕的话，就用其最后一个type为剩下的所有列赋予其图形样式
                    var t = types[j - 1];
                    if (t) {
                        serie.type = t.type;
                        serie.animation = t.animation;
                        //记录上一个图形样式
                        lastType = t;
                    } else {
                        serie.type = lastType.type;
                    }
                }

                //如果是雷达图，全部设置为area
                if (isSpeStyle == 'radar') { xAxis.type = 'area'; }

                //用IsAxis2Y来判断循环到第几个来使用第二个y轴
                if (config.isAxis2Y && tempIndex >= Number(config.isAxis2Y)) {
                    serie.yAxis = 1;
                }


                //此处设置的属性是 本条数据线是否需要将标签显示出来
                //这里将会遇见一些麻烦
                //比如，在后台中设置一个堆积类图形的时候，
                //后台的设置当中并没有针对所有数据线配置showPointMarks
                //后台认为堆积类图形的数据线共用一个showPointMarks就好
                //也许在银光版本中是不错的做法，但是这js版本中便会出现缺陷
                //此处为缺陷，日后需要改进 : 廖力 2013/10/29
                if (config.series[tempIndex] && config.series[tempIndex].label) {
                    serie.showLabel = true;
                    lastIsShowLabel = true;
                }

                fieldIndex++;
                tempIndex++;
            }
            series.push(serie);
        }
        return series;
    }

    //获得highChartsY轴列
    this.getCategories = function (data) {
        var resultCategories = [];
        var distict = {};
        //下面是从 data.Rows里整理出X轴的display值
        var col = data.Columns[0];
        //var isnumber = this.typeNameIsNumber(col.DataType);
        for (var j = 0; j < data.Rows.length; j++) {
            var items = data.Rows[j].ItemArray;
            for (var k = 0; k < items.length; k++) {
                var item = items[k];
                if (item.ColumnName == col.Name) {//x轴值	
                    if (!distict[item.Value]) {
                        resultCategories.push(item.Value);
                        distict[item.Value] = 1;
                    }
                }
            }
        }

        //返回结果
        return resultCategories;
    }

    //类型处理类
    this.typeMapping = {
        list: {
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
            'splinerange': 'spline',
            'funnel': 'funnel'
        },
        getSourceType: function () {
            //从配置文件中取出类型
            return self.config.config.ControlConfig.series || [{"type":'line'}];
        },
        //传入一组老类型，输出一组新类型
        get: function (types) {
            //从配置文件中取出类型
            types = types || this.getSourceType();
            return types;
        }
    }

    //解析配置，获得highCharts样式结构
    this.styleHandler = {
        //设置点样式
        getPointStyle: function (item, data, items, iItem, lableData, labelstep, stepIndex) {
            var resultModal = { iItem: null, lableData: null, labelstep: 0, stepIndex: 0 };

            //当前label是否显示
            if (iItem.showLabel) {
                lableData.dataLabels.enabled = true;
                //给堆积模版设置默认值
                //因为堆积图需要全部都显示或者不显示
                self.templet.stackSeries.dataLabels.enabled = true;
                self.templet.highCharts.yAxis.stackLabels = true;
            } else {
                //如果不是散点图,就不要将点标为零
                //标为零的话点就不见了
                if (iItem.type != 'scatter') {
                    lableData.marker["radius"] = 0;
                }
            }
            //如果需要跳数,便计算当前值是否需要跳过
            if (labelstep != data.Rows.length && iItem.showLabel == true) {
                //如果到了该跳数的范围里，或者其值为零的话
                if (stepIndex != 0 || Number(item.Value) == 0) {
                    lableData.dataLabels.enabled = false;
                    lableData.marker["radius"] = 2;
                }
                stepIndex++;
                if (stepIndex == labelstep) { stepIndex = 0; }
            }
            if (!self.isBigData) {
                if (item.Value != null) {
                    lableData.y = item.Value?Number(item.Value):0;
                } else {
                    lableData.y = null;
                }
                lableData.name = items[0].Value;

                //如果是饼图，就要设置x值
                if (iItem.type == 'pie' && !items[2]) { throw '图表数据格式错误,图形可能无法正确生成，请联系管理员检查！'; }
                if (iItem.type == 'pie' && items[2]) { lableData.x = items[2].Value; lableData.name = items[2].Value; }
            } else {
                lableData.y = item.Value ? Number(item.Value) : 0;
                lableData.x = +new Date(parseDate(items[0].Value));
            }

            resultModal.iItem = iItem;
            resultModal.labelstep = labelstep;
            resultModal.lableData = lableData;
            resultModal.stepIndex = stepIndex;


            if (iItem.field.Description && typeof (iItem.field.Description.split('|')[1]) != 'undefined' && iItem.field.Description.split('|')[1] != '') {
                lableData.description = iItem.field.Description;
                lableData.items = items;
                //使用列说明解析器
                self.descriptionReader(iItem.field.Description, function (name) {
                    //处理页面名称
                }, function (link, name, paramMapping, toolbarMapping) {
                    lableData.events.click = function (e) {
                        self.templet.events.pointClick(e, items, data.Columns, link, name, paramMapping, toolbarMapping);
                    }
                    lableData.events.mouseOver = function (e) {
                        var mouseOverIcon = "url(" + oap.rootUrl + "Content/themes/base/Images/in.ani),url(" + oap.rootUrl + "Content/themes/base/Images/in.gif),pointer";
                        try {
                            $(this.series.tracker.element).css("cursor", mouseOverIcon);
                            $(this.series.markerGroup.element).css("cursor", mouseOverIcon);
                            $(this.series.stateMarkerGraphic.element).css("cursor", mouseOverIcon);
                        } catch (e) {
                            //柱状图无法设置以上属性的时候，直接设置group中的元素样式
                            $(this.series.group.element).css("cursor", mouseOverIcon);
                        }
                    }
                });
            }


            return resultModal;
        }
        ,
        getLabelStep: function (dataRowsLength) {
            //如果大于十条数据就跳过某些label 免得x轴拥挤
            if (dataRowsLength > 10) {
                //算出跳数
                return Math.floor(dataRowsLength / 10);
            }
            return dataRowsLength;
        },
        get: function (data) {
            var config = self.config.config.ControlConfig;
            //获得主要模版
            var chartTemplet = jQuery.extend(true, {}, self.templet.highCharts);
            if (self.isBigData) {
                chartTemplet.plotOptions.spline.turboThreshold = 99999999;
                chartTemplet.plotOptions.line.turboThreshold = 99999999;
                chartTemplet.rangeSelector = {
                    enabled: true,
                    selected: 1,
                    inputEnabled: true
                };
            }
            //获得当前图形是否为需要单独设置样式的特殊图形
            var isSpeStyle = this.getIsSpeStyle();

            //给一些特殊的图形设置样式
            if (isSpeStyle) {
                chartTemplet = this.setSpeStyle(isSpeStyle, chartTemplet);
            }

            //x轴标签时间格式化
            var xformat = config.xFormat || 'yyyy-MM-dd';
            // 强制设置highchart中的chart.xAxis.dateTimeLabelFormats格式化属性，使之可以在chart.xAxis.labels.formatter方法中用this.dateTimeLabelFormat取到
            chartTemplet.xAxis.dateTimeLabelFormats = { millisecond: xformat, second: xformat, minute: xformat, hour: xformat, day: xformat, week: xformat, month: xformat, year: xformat };

            //计算X轴标签显示个数，如果大于20个则跳过某些
            var labelstep = this.getLabelStep(data.Rows.length);

            if (!self.isBigData) {
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
                chartTemplet.tooltip.formatter = function () {
                    var s = '';
                    if (this.x != null) {
                        s += '<b>' + this.x + '</b>：<br/>'
                    }
                    jmreport.tooltipEvents = {};
                    var eventKey = +new Date();
                    $('.noclipIcon').remove();
                    $.each(this.points, function (i, point) {
                        if (point.point.description) {
                            //使用列说明解析器
                            self.descriptionReader(point.point.description, function (name) {
                                //处理页面名称
                            }, function (link, name, paramMapping, toolbarMapping) {
                                s += '' + point.series.name + ':<b>' + Number(point.y).toFixed(2) + '[透]</b><br/>';

                                var image = $('<img class="noclipIcon" onclick=jmreport.tooltipEvents["' + eventKey + '"]() src="' + oap.rootUrl + 'Content/themes/base/Images/noclip.png" />').appendTo(self.container);
                                var positionElement = null;
                                if (point.point.graphic) {
                                    positionElement = point.point.graphic.element;
                                } else
                                    if (point.series.markerGroup.element) {
                                        positionElement = point.series.markerGroup.element;
                                    }
                                image.css('top', $(positionElement).offset().top - 20 + 'px');
                                image.css('left', $(positionElement).offset().left - 20 + 'px');

                                jmreport.tooltipEvents[eventKey] = function () {
                                    var par = self.poppageParaCreator(point.point.items, paramMapping, toolbarMapping);
                                    self.report.page.openPopPage(link, name, undefined, par.par, par.isSendToolbar);
                                }
                            });
                        } else {
                            s += '' + point.series.name + ':<b>' + Number(point.y).toFixed(2) + '</b><br/>';
                        }
                    });

                    return s;
                }
            } else {
                chartTemplet.xAxis.type = "datetime";
                chartTemplet.xAxis.tickInterval = 24 * 3600 * 1000;


                chartTemplet.tooltip.formatter = function () {
                    var s = '<b>' + formatDate(new Date(this.x), "yyyy年MM月dd HH:mm:ss") + '</b>';

                    $.each(this.points, function (i, point) {
                        s += '<br/>' + point.series.name + ':<b>' + Number(point.y).toFixed(2) + '</b>';
                    });

                    return s;
                }
            }

            //x轴标题
            if (config.xTitle) {
                chartTemplet.xAxis.title = {
                    text: config.xTitle
                }
            }


            //检查是否为双y轴设置
            //是的话则多添加一个y轴
            if (config.isAxis2Y) {
                //复制一个一模一样的chart.yAxis[0]出来，并添加到yAxis中去
                var yAxisTow = jQuery.extend(true, {}, chartTemplet.yAxis[0]);
                yAxisTow['opposite'] = true;
                chartTemplet.yAxis.push(yAxisTow);

                //判断是否有第二条y轴单位
                //有的话就设置第二条y轴标题
                if (config.y2Title) {
                    chartTemplet.yAxis[1]['title'] = {
                        text: config.y2Title
                    }
                }
            }

            //判断是否有y轴单位
            //有的话就设置y轴标题
            if (config.yTitle) {
                chartTemplet.yAxis[0]['title'] = {
                    text: config.yTitle
                }
            }

            //设置label旋转
            if (!self.isBigData) {
                if (config.xRotation) {
                    chartTemplet.xAxis.labels.align = 'left';
                    chartTemplet.xAxis.labels.rotation = config.xRotation;
                }
            } else {
                chartTemplet.xAxis.labels.align = 'left';
                chartTemplet.xAxis.labels.rotation = 60;
            }

            /*//设置鼠标悬浮label
            if (config.showLabels == false) {
                chartTemplet.tooltip.shared = false;
                chartTemplet.tooltip.crosshairs = false;
                chartTemplet.tooltip.enabled = false;
            }*/

            //获取图例位置
            var legendPosition = config.legendPosition ? config.legendPosition : 'right';

            var vAlign = 'top';
            if (legendPosition == 'bottom') {
                vAlign = "bottom";
                legendPosition = "center";
            }
            //设置图例
            chartTemplet.legend = {
                layout: legendPosition == 'left' || legendPosition == 'right' ? 'vertical' : 'horizontal',
                align: legendPosition,
                verticalAlign: vAlign,
                borderWidth: 0,
                padding: 5
            }
            if (vAlign == 'top' && legendPosition != 'right') {
                chartTemplet.legend.margin = 25;
            }

            //此处在‘Highcharts JS v3.0.7’下运行正常，
            //但是遇到低版本的Highcharts会遇到图例溢出的问题
            if (vAlign == 'top' && legendPosition == 'right') {
                chartTemplet.legend.y = -25;
                chartTemplet.legend.margin = 0;
            }

            //禁用/启用动画
            chartTemplet.plotOptions.series.animation = chartTemplet.chart.animation = config.animation;

            //如果配置中未给定具体图表的高度，就给一个默认高度
            if (config.height <= 0) { config.height = 350; self.control.height(config.height); }

            //如果高度小于350，那就要设置一下饼图的属性
            if (config.height < 350) {
                chartTemplet.plotOptions.pie.size = (config.height / 100) * 78;
            }

            return chartTemplet;
        },
        //遍历类型,检查是否为特殊图形
        getIsSpeStyle: function () {
            var resultStr = false;
            var types = self.typeMapping.getSourceType();
            for (var i = 0; i < types.length; i++) {
                if (!types[i] || !types[i].type) continue;
                var t = types[i].type.toLowerCase();
                //需要单独设置样式的图形在此判断
                resultStr = this.decide(t);
            }
            return resultStr;
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
        xAxis: { name: "", field: "", isThisDisplay: "", xIsDate: "", data: [], showInLegend: true, type: "", sourceType: '', yAxis: 0, index: 0, showLabel: false },
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
            y: 0,
            events: {
                click: function () { },
                mouseOver: function () { },
                mouseOut: function () { }
            }
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
            //点连接
            pointClick: function (e, items, columns, link, name, paramMapping, toolbarMapping) {
                var par = self.poppageParaCreator(items, paramMapping, toolbarMapping);
                self.report.page.openPopPage(link, name, undefined, par.par, par.isSendToolBar);
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
                    formatter: function () {
                        if (!self.isBigData) {
                            //将一种看上去像时间，但是需要将其当作字符串对待的时间格式筛选出来(1989-11-13~1989-11-13)
                            var isDateReg = new RegExp('^[0-9]{4,4}\-[0-9]{2,2}\-[0-9]{2,2}[\~]{1,1}[0-9]{4,4}\-[0-9]{2,2}\-[0-9]{2,2}');
                            if (isDateReg.test(this.value.toString())) {
                                return this.value;
                            }

                            //判断是否是一个时间的正则表达式,写得有点长，但是应该是比较好读的
                            isDateReg = new RegExp('^[0-9]{4,4}\-[0-9]{2,2}\-[0-9]{2,2}|^[0-9]{2,2}\-[0-9]{2,2}%|^[0-9]{2,2}\-[0-9]{2,2}\-[0-9]{2,2}%|^([0-9]{2,2}\:[0-9]{2,2}){1,1}|^([0-9]{2,2}\:[0-9]{2,2}\:[0-9]{2,2}){1,1}');
                            if (isDateReg.test(this.value.toString())) {
                                var val = parseDate(this.value);
                                if (val.toString() == "Invalid Date") { return this.value; }
                                return formatDate(val, this.dateTimeLabelFormat);
                            } else { return this.value }
                        } else {
                            return formatDate(new Date(this.value), "yyyy年MM月dd");
                        }
                    }
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
                }
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
}                                                                                                                                                                                   //--end eprchart
//现二种表格合二为一
jmreport.reportControls.register('JMChart', jmreport.reportControls.controlTypes.eprChart);

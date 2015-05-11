/**
* 表格套图线控件
*/
jmreport.reportControls.controlTypes['gridSparkLine'] = function (config) {
    //继承表格属性
    if (!jmreport.reportControls.controlTypes.gridViewData) { alert('在使用“jmreport.reportControls.gridSparkLine”之前请引入“jmreport.reportControls.gridViewData”!'); }
    jmreport.reportControls.controlTypes.gridViewData.call(this, config);
    var self = this;
    /**
    * 重写表格生成
    */
    this.createTable = function (dt, columns) {
        //生成列
        if (!columns) columns = this.createGridHeader(dt);

        var tb = $('<table cellspacing="0" cellpadding="0" border="0" class="jmreport-gridViewData jmreport-gridSparkLine"></table>');
        var head = $('<tr></tr>').appendTo($('<thead></thead>').appendTo(tb));
        for (var i = 0; i < columns.length; i++) {
            //第四列和第6列不显示，需组合到第五列和第七列
            if (i == 3 || i == 5) continue;
            var column = columns[i];
            var str = column.DisplayName;
            //如果有详细描述,就放入详细描述小图标
            if ($.trim(column.Description) != '') {
                str += "<span class='cDescription' title='" + column.Description + "' >?<span>";
            }
            $('<th></th>').appendTo(head).html(str);
        }
        $('<th>查看明细</th>').appendTo(head);
        var body = $('<tbody></tbody>').appendTo(tb);

        var rowlen = dt.Rows.length;

        for (var i = 0; i < rowlen; i++) {
            var row = dt.Rows[i];
            var tr = $('<tr></tr>').appendTo(body);
            var collen = columns.length;
            for (var j = 0; j < collen; j++) {
                //第四列和第6列不显示，需组合到第五列和第七列
                if (j == 3 || j == 5) continue;
                var column = columns[j];
                var td = $('<td></td>').appendTo(tr);
                var rowitemlen = row.ItemArray.length;
                for (var k = 0; k < rowitemlen; k++) {
                    var item = row.ItemArray[k];
                    if (item.ColumnName == column.Name) {
                        //第三列为图表列
                        if (j == 2 && item.Value) {
                            var series = [{
                                name: column.DisplayName,
                                showInLegend: false,
                                data: []
                            }];
                            var categories = [];

                            //今天的数据
                            var todayData = '';
                            //昨天的数据
                            var yestodayData = '';
                            //上周的数据
                            var lastWeekData = '';

                            if (item.Value.indexOf('❻') != -1 && item.Value.indexOf('❽') != -1) {
                                todayData = item.Value.split('❻')[0];
                                yestodayData = item.Value.split('❻')[1].split('❽')[0];
                                lastWeekData = item.Value.split('❻')[1].split('❽')[1];
                            }
                            else if (item.Value.indexOf('❻') != -1 && item.Value.indexOf('❽') == -1) {
                                todayData = item.Value.split('❻')[0];
                                yestodayData = item.Value.split('❻')[1];
                            } else {
                                todayData = item.Value;
                            }

                            var d = todayData;

                            //,分隔数据为行,|分隔为列,第一列为时间，第二列为日期
                            var ds = d.split(',');
                            var hlen = ds.length;
                            for (var h = 0; h < hlen; h++) {
                                if (!ds[h]) continue;
                                var rs = ds[h].split('|');
                                categories.push(rs[0]);
                                //categories.push(parseDate("2013-09-18 " + rs[0]));
                                series[0].data.push(Number(rs[1]));
                            }
                            var container = $('<div class="chart"></div>').appendTo(td);
                            container.width(220);
                            container.height(50);
                            td.width(220);
                            this.renderLine(container, categories, series, false);

                            var outputModal = this.createChartData.get(todayData, yestodayData, lastWeekData);
                            categories = outputModal.categories;
                            series = outputModal.series;

                            //给缩略图形绑定事件
                            var self = this;
                            (function (categories, series, container) {
                                container.find('svg').click(function () {
                                    self.popPageChart(categories, series, self);
                                });
                            })(categories, series, container);

                            break;
                        }
                        //如果值为空就填上空格，以免表格塌陷
                        if (item.Value == '') { item.Value = "&nbsp;"; }
                        var v = item.Value;
                        if (j == 4) {
                            v = '<b>' + row.ItemArray[3].Value + '</b><br /><span>' + v + '</span>';
                        }
                        else if (j == 6) {
                            v = '<b>' + row.ItemArray[5].Value + '</b><br /><span>' + v + '</span>';
                        }
                        //判断该项目是否为总汇项目,判断该项目是否有combinType值
                        if (!item.combinType) {
                            td.html(v);
                        }
                        else {
                            td.html("<div>" + v + "</div>");
                            td.attr('class', 'combin');
                        }
                        if (j == collen - 1) {
                            var watchDetail = $('<td></td>').appendTo(tr);
                            var self = this;
                            (function (categories, series) {
                                $('<a href="#"></a>').appendTo(watchDetail).click(function () {
                                    self.popPageChart(categories, series, self);
                                }).html('查看明细')
                            })(categories, series);
                        }
                        break;
                    }
                }
            }
        }
        return tb;
    };

    /**
    * 创建明细的图表数据
    */
    this.createChartData = {
        //获得最大值最小值当前值
        findMark: function (today) {
            var todayArr = today.split(',');
            var orderArr = [];
            var resultModal = { maxIndex: 0, minIndex: 0, nowIndex: todayArr.length - 1 };
            for (var i = 0; i < todayArr.length; i++) {
                if (!todayArr[i]) continue;
                var temp = todayArr[i].split('|');
                orderArr.push({ data: Number(temp[1]), index: i });
            }
            //先排倒序
            orderArr = orderArr.sort(function (a, b) {
                return b.data - a.data;
            });
            //记录下最大值
            resultModal.maxIndex = orderArr[0].index;
            //正序
            orderArr = orderArr.sort(function (a, b) {
                return a.data - b.data;
            });
            //记录下最小值
            resultModal.minIndex = orderArr[0].index;

            return resultModal;
        }
        ,
        get: function (today, yestoday, lastweek) {
            var resultModal = { categories: [], series: [] };
            var marks = this.findMark(today);
            var todayArr = today.split(',');
            var yestodayArr = yestoday.split(',');
            var lastweekArr = lastweek.split(',');

            var todayX = jQuery.extend(true, {}, self.templet.xAxis);
            var yestodayX = jQuery.extend(true, {}, self.templet.xAxis);
            var lastweekX = jQuery.extend(true, {}, self.templet.xAxis);
            todayX.name = '今天';
            //创造categories和今天的数据
            for (var i = 0; i < todayArr.length; i++) {
                if (!todayArr[i]) continue;
                var temp = todayArr[i].split('|');
                resultModal.categories.push(temp[0]);

                if (i == marks.maxIndex || i == marks.minIndex || i == marks.nowIndex) {
                    //获得主要模版
                    var itemTemplet = jQuery.extend(true, {}, self.templet.lableData);

                    itemTemplet.dataLabels = self.styleHandler.getLabelStyle(i, marks);

                    itemTemplet.y = Number(temp[1]);
                    todayX.data.push(itemTemplet);
                } else {
                    todayX.data.push(Number(temp[1]));
                }
            }

            yestodayX.name = '昨天';
            //创造昨天的数据
            for (var i = 0; i < yestodayArr.length; i++) {
                if (!yestodayArr[i]) continue;
                var temp = yestodayArr[i].split('|');
                yestodayX.data.push(Number(temp[1]));
            }

            lastweekX.name = '上周';
            //创造上周的数据
            for (var i = 0; i < lastweekArr.length; i++) {
                if (!lastweekArr[i]) continue;
                var temp = lastweekArr[i].split('|');
                lastweekX.data.push(Number(temp[1]));
            }
            resultModal.series.push(todayX);
            resultModal.series.push(yestodayX);
            resultModal.series.push(lastweekX);
            return resultModal;
        }
    }

    /**
    * 展开图表
    */
    this.popPageChart = function (categories, series, self) {
        var popPage = $('<div class="jmreport-poppage"></div>');
        popPage.appendTo('body');
        //弹出窗口
        popPage.dialog({
            autoOpen: false,
            modal: true,
            width: '800',
            height: '450',
            title: '查看明细'
        });
        popPage.dialog('open');
        popPage.css('margin', '20px');
        //在窗口中绘制图形
        self.renderLine(popPage, categories, series, true);
    }

    /**
    * 展示线图到列
    */
    this.renderLine = function (container, categories, series, isDetail) {
        //取出模版
        var chart = this.styleHandler.get(categories, series, isDetail);
        //加入数据
        chart.series = series;
        chart.xAxis.categories = categories;
        //创建图形
        container.highcharts(chart);
        container.find('tspan:contains(Highcharts.com)').hide();
    }

    /*
    *图表的样式控制器
    */
    this.styleHandler = {
        getLabelStep: function (dataRowsLength) {
            //如果大于十条数据就跳过某些label 免得x轴拥挤
            if (dataRowsLength > 5) {
                //算出跳数
                return Math.floor(dataRowsLength / 5);
            }
            return dataRowsLength;
        },
        getLabelStyle: function (i, marks) {
            var label = '';
            if (i == marks.maxIndex) {
                label = '最大值';
            }

            if (i == marks.minIndex) {
                if (label != '') { label += '/'; }
                label += '最小值';
            }

            if (i == marks.nowIndex) {
                if (label != '') { label += '/'; }
                label += '当前值';
            }

            label += '：'

            var dataLabels = {
                enabled: true,
                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || '#000000',
                format: label + '{y}',
                crop: false
            };
            return dataLabels;
        }
        ,
        get: function (categories, series, isDetail) {
            //获得主要模版
            var chartTemplet = jQuery.extend(true, {}, self.templet.chartTemplet);
            //是否显示详情
            if (isDetail) {
                chartTemplet.xAxis.tickLength = 5;
                chartTemplet.xAxis.lineWidth = 1;
                chartTemplet.xAxis.labels.formatter = function () { return this.value; };

                chartTemplet.yAxis.tickLength = 5;
                chartTemplet.yAxis.lineWidth = 0;
                chartTemplet.yAxis.gridLineWidth = 1;
                chartTemplet.yAxis.labels.formatter = function () { return this.value; };

                //如果大于十条数据就跳过某些label 免得x轴拥挤
                if (categories.length > 5) {
                    //设置一下rotation将这些lable压至一行，否则labels们就会呈阶梯状,让人费解
                    chartTemplet.xAxis.labels.rotation = 0.1;
                }

                //设置跳数
                chartTemplet.xAxis.tickInterval = this.getLabelStep(categories.length);

                //设置图例
                chartTemplet.legend = {
                    layout: 'center',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0,
                    padding: 0
                }

                //放大
                chartTemplet.chart.zoomType = 'xy';
                chartTemplet.tooltip.shared = true;
                chartTemplet.tooltip.crosshairs = true;
                chartTemplet.tooltip.enabled = true;
            }
            return chartTemplet;
        }
    }

    /*
    *模版控制类
    */
    this.templet = {
        //带label的图
        lableData: {
            dataLabels: {
                enabled: true
            },
            marker: {
                enabled: true,
                radius: 2,
                states: {
                    hover: {
                        enabled: true,
                        radius: 5
                    }
                }
            },
            y: 54.4
        },
        //x轴项目
        xAxis: { name: "", data: [], showInLegend: true },
        chartTemplet: {
            colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
            chart: {
                type: 'spline'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                title: {
                    text: ''
                },
                tickLength: 0,
                lineWidth: 0,
                type: 'datetime',
                tickmarkPlacement: 'on',
                startOnTick: false,
                ordinal: false,
                tickInterval: 99999,
                labels: {
                    formatter: function () {
                        return '';
                    }
                }
            },
            yAxis: {
                title: {
                    text: ''
                },
                tickLength: 0, //不显示标签
                lineWidth: 0, //轴不显示
                gridLineWidth: 0, //不显示背影线条
                labels: {
                    formatter: function () {
                        return '';
                    }
                }
            },
            plotOptions: {
                spline: {
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    marker: {
                        enabled: false,
                        radius: 0
                    }
                }
            },
            tooltip: {
                shared: false,
                crosshairs: false,
                enabled: false
            }
        }
    }
}


//表格套图线控件
jmreport.reportControls.register('GridSparkLine', jmreport.reportControls.controlTypes.gridSparkLine);

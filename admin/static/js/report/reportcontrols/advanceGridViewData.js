/**
* 新的表格控件
*/
jmreport.reportControls.controlTypes['advanceGridViewData'] = function (config) {
    jmreport.reportControls.controlTypes.initControl.call(this, config); //初始化

    this.selecter = null;

    /**
    * 绑定数据
    */
    this.bind = function (data, pageIndex) {
        if (this.data == null || this.data.Tables == null || this.data.Tables[0].Rows.length <= 0) {
            this.log('暂无数据哦，亲！');
            return;
        }

        /*
        *第一步：分页配置
        */
        //通过配置获得分页器
        //获得 “页面级分页器” 或者 “数据库级分页器”
        if (!this.selecter) {
            this.selecter = this.getPageSelecter();
        }

        //初始化分页器
        this.selecter.init(this);

        if (pageIndex && this.config.config.isServerPager) {
            //设置当前页
            this.selecter.thisPage = pageIndex;
        } else {
            this.selecter.thisPage = pageIndex || 1;
        }

        //向页面中加入分页控件
        this.selecter.create(this);

        //当前页的列表显示范围
        var dt = this.selecter.getDataScope(this.data.Tables[0]);

        //获得高级配置
        if (!this.advanceConfig) {
            this.advanceConfig = JSON.parse(this.config.config.AdvanceConfig);
        }


        /*
        *第二步：生成数据
        */
        //1.生成列
        var columns = this.createGridHeader(dt);
        //2.配置行合并
        dt = this.tableRowSpan.init(columns, dt);

        //3.判断用户是否想要总汇
        var combinList = this.combins.getCombinList(this.advanceConfig.ChartMappings);
        if (combinList.length != 0) {
            //开始计算总汇数据 并在表格的最后一行加入总汇数据
            dt.Rows.push(this.combins.init(combinList, this.data.Tables[0]));
        }

        //4.生成表格对象
        tb = this.createTable(dt, columns);
        var tableContent = $('<div></div>');
        tb.appendTo(tableContent.appendTo(this.control));


        /*
        *第三步：调整样式
        */
        //table的自动调整大小事件的方法
        function tableResize(tb, thisObj) {
            this.doFunc = function () {

                thisObj.scrollController = function () { };
                //表格的高度不应该被自由控制，应该由行的设置，或分页设置来规范其高度.
                //可以在此设置一下content div的高度
                tableContent.height(tb.height());
                $(thisObj.control).parent().height("auto");
                $(thisObj.control).parent().css("min-height", "0px");
                $(thisObj.control).height("auto");
                $(thisObj.control).css("min-height", "auto");

                //保存一下内部表格，包括分页器的总高度
                thisObj.allInsertHeight = thisObj.control.parent().height()

                //判断内部表格的宽度超过外部div的宽度就有可能已经显示出滚动条了
                //在这种情况下要预留出滚动条的高度
                if (tb.width() > thisObj.control.width()) {
                    tableContent.css('overflow', 'hidden');
                    thisObj.control.css('overflow', 'hidden');
                    thisObj.control.css('overflow-x', 'scroll');
                    thisObj.control.css('position', 'relative');
                    //如果大于的话，说明有底部滚动条，
                    //有底部滚动条就需要启动滚动条设置器
                    //在用户屏幕还没有滚动到该表格最下面的时候
                    //底部滚动条跟随用户屏幕
                    thisObj.tb = tb;
                    thisObj.tableContent = tableContent;
                    thisObj.scrollController = thisObj.onScrolling;
                    thisObj.scrollController();
                } else {
                    tableContent.css('overflow', '');
                    thisObj.control.css('overflow', '');
                    thisObj.control.css('overflow-x', '');
                    thisObj.control.css('position', '');
                }
            }
        }


        var tableResize = new tableResize(tb, this);
        tableResize.doFunc();
        this.resizeController = tableResize.doFunc;

        //判断表格收折(0:无收折功能,1:有收折功能且默认收起,2:有收折功能且默认展开)
        if (this.advanceConfig.FoldingTable != 0) {
            var self = this;
            this.title.attr('title', '展开/关闭');
            switch (this.advanceConfig.FoldingTable) {
                case 1:
                    tableContent.slideUp(500);
                    this.title.attr('class', 'content-control-title fold down');
                    //第一次载入之后就不要再动了
                    this.advanceConfig.FoldingTable = 2;
                    break;
                case 2:
                    this.title.attr('class', 'content-control-title fold up');
                    break;
            }
            this.title.unbind('click');
            this.title.click(function () {
                tableContent.slideToggle(500, function () {
                    if ($(this).css('display') == 'none') {
                        self.title.attr('class', 'content-control-title fold down');
                    } else {
                        self.title.attr('class', 'content-control-title fold up');
                    }
                    self.drawCompleteCallBack();
                });
                tableResize.doFunc();
            });
        }


        //完成渲染调用此方法
        //此方法位于jmreport.reportControls.js
        this.drawCompleteCallBack();
    }
    /**
    //滚动跟随器会绑定的方法
    */
    this.onScrolling = function () {
        var control = this.control, tb = this.tb, tableContent = this.tableContent;
        var maxHeight = $(tb).height();
        //如果用户的屏幕最底部到页面最上面的距离>=当前控件的高度+50 使其跟随屏幕
        if ($(window).height() + $(window).scrollTop() >= this.control.parent().offset().top + 20
        && //并且用户的屏幕最底部没有超出表格显示的最大显示范围
        this.control.parent().offset().top + maxHeight > $(window).height() + $(window).scrollTop()) {
            var height = ($(window).height() + $(window).scrollTop()) - this.control.parent().offset().top;
            $(tableContent).height(height);
            $(control).height(height);
            control.parent().height(this.allInsertHeight);
            return;
        }

        //如果用户的屏幕最底部超出了表格显示的最大显示范围
        if (this.control.parent().offset().top + maxHeight <= $(window).height() + $(window).scrollTop()) {
            $(tableContent).height(maxHeight);
            $(control).height("auto");
            control.parent().height("auto");
            return;
        }

        $(tableContent).height(maxHeight);
        $(control).height("auto");
        control.parent().height("auto");
    }

    /*
    *设置单列行合并
    */
    this.tableRowSpan = {
        //通过一份dt.rows创建一个新的,空的dt.rows单元
        cleateMasterRow: function (row) {
            //新的dt.rows元素的容器
            var newRow = {};
            //新的dt.rows.ItemArray的容器
            var newItemArray = [];
            //开始创建newItemArray
            for (var i = 0; i < row.ItemArray.length; i++) {
                var tempItem = row.ItemArray[i];

                //填写ItemArray的item
                newItemArray[i] = {
                    ColumnName: tempItem.ColumnName,
                    Value: ""
                }
                //将外部的值也给上
                newRow[tempItem.ColumnName] = "";
            }
            //返回新创建的模版
            newRow["ItemArray"] = newItemArray;
            //建立设置值的方法
            newRow.setValue = function (name, value) {
                //先设置ItemArray
                for (var i = 0; i < this.ItemArray.length; i++) {
                    if (name == this.ItemArray[i].ColumnName) {
                        //填上ItemArray对应下标的value
                        this.ItemArray[i].Value = value;
                        break;
                    }
                }
                //再设置外部值
                this[name] = value;
            }
        },
        init: function (column, dt) {
            //声明一个行模型
            var rowModal = {};
            //先拷贝一份dt.rows
            if (dt.Rows.length == 0) { return; }
            //建立行模型
            rowModal = this.cleateMasterRow(dt.Rows[0]);
            //开始遍历行列，查找可以合并的单列行
            for (var i = 0; i < column.length; i++) {
                //如果这列标明需要合并相同值
                if (column[i].advanceConfigMapping && column[i].advanceConfigMapping.GridCharactConfig.IsSameValueCombined) {
                    var lastItem = null;
                    for (var j = 0; j < dt.Rows.length; j++) {
                        if (dt.Rows[j].ItemArray[i])
                            dt.Rows[j].ItemArray[i]["isSameAsLastOne"] = false;
                        dt.Rows[j].ItemArray[i]["combileCount"] = 0;
                        //如果上一个对象不为空
                        if (lastItem) {
                            //如果上一个对象的值和当前对象值相同
                            if (lastItem.Value == dt.Rows[j].ItemArray[i].Value) {
                                dt.Rows[j].ItemArray[i]["isSameAsLastOne"] = true;
                                lastItem["combileCount"]++;
                            } else {
                                lastItem = dt.Rows[j].ItemArray[i];
                            }
                        } else {
                            lastItem = dt.Rows[j].ItemArray[i];
                        }
                    }
                }
            }
            return dt;
        },
        //处理行合并
        rowSpanHandler: function (td, item) {
            if (item["combileCount"] && item["combileCount"] != 0) {
                td.attr('rowspan', item["combileCount"] + 1);
            }
            return td;
        },
        //判断以上是否为相同值
        isSameValue: function (item) {
            if (item["isSameAsLastOne"] && item["isSameAsLastOne"] != false) {
                return true;
            }
            return false;
        }
    }

    /**
    * 排序方法
    */
    this.sortColumn = function (thisElem) {
        //获得数据先
        data = this.data.Tables[0];
        //获得要排序的列
        var jmreport_tableSortBy = $(thisElem).attr('name');
        //获得排序方式，如果没有就是 undefined
        var sortStyleStr = $(thisElem).attr('sortStyle');

        //识别内容内省，并将其内容替换为可排序的内容
        var regArr = [
        //日期类型的排序转换
                {reg: '^([0-9]{4,4})\-([0-9]{2,2})\-([0-9]{2,2})$', func: function (str) { return Number(str.replace(new RegExp('-', 'g'), '')); } },
        //末尾有百分号的排序转换
                {reg: '^\-{0,1}([0-9]{1,}\.{0,1}[0-9]{0,})%$', func: function (str) { return Number(str.replace('%', '')); } }
            ]

        //遍历regArr中的正则表达式，查找是否有匹配的项目
        //若有匹配的项目就将值换成相应的数字，以方便排序
        //replaceToSortString
        var rtss = function (str) {
            str = str.toString();
            for (var i = 0; i < regArr.length; i++) {
                if (new RegExp(regArr[i].reg).test(str)) {
                    return regArr[i].func(str);
                }
            }
            return Number(str);
        }

        //建立顺序 和 倒序的方法映射
        var sortStyle = {
            asc: function (a, b) {
                var numOne = rtss(a[jmreport_tableSortBy]);
                var numTow = rtss(b[jmreport_tableSortBy]);
                if (isNaN(numOne) && isNaN(numTow)) {
                    return a[jmreport_tableSortBy].localeCompare(b[jmreport_tableSortBy]);
                } else {
                    return numOne - numTow;
                }
            },
            desc: function (b, a) {
                var numOne = rtss(a[jmreport_tableSortBy]);
                var numTow = rtss(b[jmreport_tableSortBy]);
                if (isNaN(numOne) && isNaN(numTow)) {
                    return a[jmreport_tableSortBy].localeCompare(b[jmreport_tableSortBy]);
                } else {
                    return numOne - numTow;
                }
            }
        }

        //判断是否取到排序类型
        //如果没取到排序类型,或者取到的排序类型为'asc'
        //表示这次的排序方式是正序，否则是倒序
        if (!sortStyleStr || sortStyleStr == 'desc') {
            data.Rows = data.Rows.sort(sortStyle.asc);
            sortStyleStr = 'asc';
        } else {
            data.Rows = data.Rows.sort(sortStyle.desc);
            sortStyleStr = 'desc';
        }

        //循环data.Columns里的项目，告诉相应的列，现在的排序方式是正序还是倒序
        for (var i = 0; i < data.Columns.length; i++) {
            if (data.Columns[i].Name == jmreport_tableSortBy) {
                data.Columns[i]['sortStyle'] = sortStyleStr;
            } else {
                data.Columns[i]['sortStyle'] = undefined;
            }
        }
        //重新赋予this.data.Tables[0]值
        this.data.Tables[0] = data;
        //清空控件
        this.control.empty();
        //直接再重新bind一下，刷新数据
        this.bind();
    }

    /**
    *总汇类及 它的方法
    */
    this.combins = {
        getCombinList: function (chartMappings) {
            var outputList = [];
            for (var i = 0; i < chartMappings.length; i++) {
                if (chartMappings[i].GridTotalsRowType != 0 && chartMappings[i].CharactType == 2) {
                    var type = 'count';
                    //表格汇总行(0表示无，1表示Count,2表示Sum,3表示Max,4表示Min,5表示Avg)
                    switch (chartMappings[i].GridCharactConfig.GridTotalsRowType) {
                        case 1:
                            type = 'count';
                            break;
                        case 2:
                            type = 'sum';
                            break;
                        case 3:
                            type = 'max';
                            break;
                        case 4:
                            type = 'min';
                            break;
                        case 5:
                            type = 'avg';
                            break;
                    }
                    outputList.push({ columnName: chartMappings[i].DataColumn, combinType: type });
                }
            }
            return outputList;
        },
        //通过一份dt.rows创建一个新的,空的dt.rows单元
        cleateMasterRow: function (row) {
            //新的dt.rows元素的容器
            var newRow = {};
            //新的dt.rows.ItemArray的容器
            var newItemArray = [];
            //开始创建newItemArray
            for (var i = 0; i < row.ItemArray.length; i++) {
                var tempItem = row.ItemArray[i];

                //填写ItemArray的item
                newItemArray[i] = {
                    ColumnName: tempItem.ColumnName,
                    Value: ""
                }
                //将外部的值也给上
                newRow[tempItem.ColumnName] = "";
            }

            //返回新创建的模版
            newRow["ItemArray"] = newItemArray;
            //建立设置值的方法
            newRow.setValue = function (name, value, combinType) {
                //先设置ItemArray
                for (var i = 0; i < this.ItemArray.length; i++) {
                    if (name == this.ItemArray[i].ColumnName) {
                        //填上ItemArray对应下标的value
                        this.ItemArray[i].Value = value;
                        //告诉设置一个combinType值以表示该字段是以什么类型的总汇得出结果的
                        this.ItemArray[i].combinType = combinType;
                        break;
                    }
                }
                //再设置外部值
                this[name] = value;
            }

            //输出建立好的行模型
            return newRow;
        }
			, //总汇的方法
        //columnsCondition : 总汇条件 [{columnName:"name",combinType:type},{columnName:"name",combinType:type},{columnName:"name",combinType:type}]
        //dt:数据表格
        init: function (columnsCondition, dt) {
            //声明一个行模型
            var rowModal = {};
            //先拷贝一份dt.rows
            if (dt.Rows.length == 0) { return; }
            //建立行模型
            rowModal = this.cleateMasterRow(dt.Rows[0]);
            //开始统计，先遍历columnsCondition中的项目，一个条件一个条件地统计
            for (var i in columnsCondition) {
                //取得当前要统计的列名后，开始循环dt.rows统计数据
                for (var j = 0; j < dt.Rows.length; j++) {
                    var row = dt.Rows[j];
                    //计算value是填写空字符串还是数字字符串
                    if (isNaN(parseFloat(rowModal[columnsCondition[i].columnName]))) { rowModal[columnsCondition[i].columnName] = "0" }
                    //总汇行的目标列
                    var combinedValue = parseFloat(rowModal[columnsCondition[i].columnName]);
                    //td中将被总汇的列
                    var Value = parseFloat(row[columnsCondition[i].columnName]);
                    //将以上两个变量传入方法并得出结果
                    var result = this.combinStyle[$.trim(columnsCondition[i].combinType)](combinedValue, Value, j, dt.Rows.length);
                    //将得出的结果加入总汇行
                    rowModal.setValue(columnsCondition[i].columnName, result, $.trim(columnsCondition[i].combinType));
                }
            }
            return rowModal;
        }
			, //总汇的类型：
        combinStyle: {//合计方法
            sum: function (combinedValue, Value, j, maxLength) { return combinedValue + Value; }
							, //求最大值方法
            max: function (combinedValue, Value, j, maxLength) { if (combinedValue < Value) { return Value; } else { return combinedValue; } }
							, //求最小值方法
            min: function (combinedValue, Value, j, maxLength) { if (j == 0) { return Value; } if (combinedValue > Value) { return Value; } else { return combinedValue; } }
							, //求计数
            count: function (combinedValue, Value, j, maxLength) { return j + 1; }
            , //平均数
            avg: function (combinedValue, Value, j, maxLength) { if (j + 1 != maxLength) { return combinedValue + Value; } return (combinedValue + Value) / maxLength }
        }
    }

    /**
    * 生成表格
    */
    this.createTable = function (dt, columns) {
        //获得嵌套列的树状结构
        if (!columns) columns = this.createGridHeader(dt);

        var tb = $('<table cellspacing="0" cellpadding="0" border="0" class="jmreport-gridViewData"></table>');
        var head = $('<thead></thead>').appendTo(tb);
        var thisObj = this;

        if (dt.Rows.length == 2000) {
            head.append("<tr class='jmreport-max-data-alt' ><th colspan='" + dt.Columns.length + "' > 查询耗时(ms)：" + dt.SearchTime + ",注意，此次查询数据量可能已超过两千条，数据只展示到第两千条，若要查看完整数据，请点击表格右上方导出。 </th></tr>");
        }

        /**
        * 生成Thead中的内容
        *
        *@[columns]{json}由createGridHeader方法创建的列的对象
        *@[thObj]{json}由jquery创建的'<thead></thead>'
        */
        var createThead = function (columns, thObj) {
            //先将一对行加入到thead之中
            var tr = $('<tr></tr>').appendTo(thObj);
            //此数组目的是为了保存下一个将被循环的行的所有列
            var childNode = [];
            //此计数器为计数当前行内，有多少有效列
            var cCount = 0;
            //生成head,从树状结构中循环当前行的列
            for (var i = 0; i < columns.length; i++) {
                //生辰th将被保存的变量
                var th;

                //有效列、无效列 说明：
                //有效列：父级列的分支列
                //无效列:父级分支下已经没有分支了（children）,
                //       但是要填充一个无效列站位，否则循环输出会遇到表格塌陷


                //如果columns中不包含recount,表示当前列为有效列
                //因为无效列需要记录rowspan的计数为recount,故只
                //有无效列才有recount
                //所以无效列在该次循环中不需要创建th
                if (!columns[i]['recount']) {
                    //创建真正的th列到页面中,并显示其显示值
                    th = $('<th></th>').appendTo(tr).html(columns[i].DisplayName);
                    //如果th大于2就说明要设置colspan属性
                    if (columns[i].children.length >= 2) {
                        //设置colspan属性为当前columns节点的子节点的数量
                        th.attr('colspan', columns[i].children.length);
                    }
                }
                //判断下一行循环中，有效列、无效列
                if (columns[i].children.length > 0) {
                    //如果该列的子列存在，表示该列的下一行循环
                    //中的子列均为有效列，将该列的子分支（columns[i].children）
                    //合并入下一行将循环的列
                    childNode = childNode.concat(columns[i].children);
                    //以证明该列的下一行的子列将会是有效列，故需要设置一个样式，
                    //将本列的下边缘设置上边框
                    th.attr('class', ' cos');
                    //将计数器累计一下，以证明本次循环中的行中有有效列
                    cCount++;
                } else {
                    //如果没有子分支，表示下一行循环时，该项目为无效列
                    var recount = 1;
                    //计数器将记录该项目一共无效了多少行(recount)
                    if (columns[i]['recount']) { recount = columns[i]['recount'] + 1; th = columns[i]['realNode']; }
                    //除了其他的默认属性以外，要将其对应的html对象记录起来(realNode)
                    childNode.push({
                        advanceConfigMapping: columns[i].advanceConfigMapping,
                        DisplayName: columns[i].DisplayName,
                        Description: columns[i].Description,
                        Name: columns[i].Name,
                        sortStyle: columns[i]["sortStyle"],
                        children: [],
                        realNode: th,
                        recount: recount
                    });
                }
            }
            //如果计数器中存在数值，表明下一行循环中存在有效列
            if (cCount != 0) {
                //将本行记录的下一行所有的有效、无效列(childNode)传入，递归执行
                //返回最后一行的所有列
                childNode = createThead(childNode, thObj);
            }
            else {
                //如果已经不存在有效列了，说明循环已经进行到了最底层
                //那么childNode中保存的将都是无效列，我们就将这些最终
                //列绑定上一些必须要绑定的属性，样式，和事件
                for (var i = 0; i < childNode.length; i++) {
                    var item = childNode[i];
                    //如果有高级配置就配置以下宽度
                    if (item.advanceConfigMapping) {
                        var advanceConfigMapping = item.advanceConfigMapping;
                        if (advanceConfigMapping.ColumnWidth != '') {
                            item.realNode.css('width', advanceConfigMapping.ColumnWidth + '%');
                        }
                    }
                    //绑定跨行
                    if (item.recount >= 2) {
                        item.realNode.attr('rowspan', item.recount);
                    }
                    //绑定排序事件
                    item.realNode.attr('name', item.Name).click(function () {
                        //制作一个闭包，解决this的传递问题
                        (function (thisElem) {
                            thisObj.sortColumn.apply(thisObj, arguments);
                        })(this);
                    });
                    //更换换行符\n
                    var mulLine = undefined;
                    if (item.realNode.html().indexOf('\n') != -1) {
                        var tepmStr = item.realNode.html().replace('\n', '^');
                        var trpmArr = tepmStr.split('^');
                        item.realNode.html('');
                        $('<p>' + trpmArr[0] + '</p>').appendTo(item.realNode);
                        mulLine = $('<p>' + trpmArr[1] + '</p>').appendTo(item.realNode);
                        item.realNode.attr('class', 'jmreport-mulLineTh');
                    }
                    //如果有详细描述,就放入详细描述小图标
                    if ($.trim(item.Description) != '') {
                        if (!new RegExp('^([\[\{\"]{1,1})').test(item.Description)) {
                            var tempStr = "<span class='cDescription' title='" + item.Description + "' >?<span>";
                            if (!mulLine) {
                                item.realNode.html(item.realNode.html() + tempStr);
                            } else {
                                $(tempStr).appendTo(mulLine);
                            }
                        }
                    }
                    //如果该列上有排序方式，就将排序方式标识到该列的sortStyle属性中去
                    //columns[i]['sortStyle']为undefined的就不标识了
                    if (item.sortStyle) {
                        if (item.sortStyle == "asc") {
                            item.realNode.html(item.realNode.html() + "&nbsp;&nbsp;↑");
                        } else { item.realNode.html(item.realNode.html() + "&nbsp;&nbsp;↓"); }
                        item.realNode.attr('sortStyle', columns[i]['sortStyle']);
                    }
                    //判断该列是否要计算百分比
                    //只要出现‘率’字符，或者‘%’百分号字符，标识该列需要计算百分比
                    if (item.DisplayName.indexOf('率') != -1 || item.DisplayName.indexOf('%') != -1) {
                        //设置‘是否显示百分比’属性为true,
                        //此属性将在下面判断，并显示相应的类似进度条的元素
                        item['isDisplayPre'] = true;
                    }
                }
            }
            //返回所有嵌套列中最后一列
            return childNode;
        }

        var childNode = createThead(columns, head);

        var body = $('<tbody></tbody>').appendTo(tb);

        //如果分页有效(不等于零)就用分页,否则就表示用户并没有分页，便试用总行数
        var rowLength = 0;
        if (this.selecter.pageSize != 0) {
            if (dt.Rows.length > this.selecter.pageSize) {
                rowLength = dt.Rows.length;
            } else {
                rowLength = this.selecter.pageSize;
            }
        } else {
            rowLength = dt.Rows.length;
        }



        for (var i = 0; i < rowLength; i++) {
            var tr = $('<tr></tr>').appendTo(body);

            //如果数据不存在了，表示要填入空白行
            if (!dt.Rows[i]) {
                for (var j = 0; j < childNode.length; j++) {
                    var column = childNode[j];
                    var td = $('<td>&nbsp;</td>').appendTo(tr);
                }
                continue;
            }
            var row = dt.Rows[i];

            //数据存在的情况下填充数据行
            for (var j = 0; j < childNode.length; j++) {
                var column = childNode[j];
                var td = $('<td></td>').appendTo(tr);
                for (var k = 0; k < row.ItemArray.length; k++) {
                    var item = row.ItemArray[k];
                    if (item.ColumnName == column.Name) {
                        var advanceConfigMapping = 'undefined';
                        //将高级配置拿出来
                        if (column.advanceConfigMapping) {
                            advanceConfigMapping = column.advanceConfigMapping;
                        }

                        //配置表格背景颜色类型
                        //如果类型是0就什么颜色都没有1就是隔行换色3就是日期的周末显示

                        //这在每行第一列中判断
                        if (k == 0) {
                            switch (thisObj.advanceConfig.ColumnBackColor) {
                                case 0:
                                    break;
                                case 1:
                                    if (i % 2) {
                                        tr.attr('class', 'alt-row');
                                    }
                                    break;
                                case 2:
                                    //先判断是否为日期
                                    if (isDateString(item.Value)) {
                                        //再判断是否为周末
                                        if (isWeekend(item.Value)) {
                                            var str = "";
                                            if (tr.attr('class')) { str = tr.attr('class'); }
                                            tr.attr('class', str + ' weekend-row');
                                        }
                                    }
                                    break;
                            }
                        }

                        if (item.Value && advanceConfigMapping) {
                            //1.处理其中的数值
                            td.append(thisObj.advanceStyleHandler.dataFormatter(item.Value, advanceConfigMapping));
                            //如果不是总汇项目就继续运行
                            if (!item.combinType) {
                                //2.处理连接属性
                                td = thisObj.advanceStyleHandler.linkHandler(td, advanceConfigMapping);
                                //3.处理其格子的样式
                                td = thisObj.advanceStyleHandler.tdStyleGetter(td, item.Value, advanceConfigMapping);
                                //4.处理单列的行合并
                                td = this.tableRowSpan.rowSpanHandler(td, item);
                            } else {
                                //总汇的话有它自己专用的样式
                                td = thisObj.advanceStyleHandler.combileStyle(td, item);
                            }
                        }
                        else if (item.Value) {
                            td.append(item.Value);
                        } else {//如果值为空就填上空格，以免表格塌陷
                            td.html("&nbsp;");
                        }

                        //判断相同值
                        //如果以上有被设置合并，并且有相同值，那么这一行这一列就失效了，直接移除,w
                        if (this.tableRowSpan.isSameValue(item)) { td.remove(); }
                    }
                }
            }
        }
        return tb;
    }

    /*
    *高级配置样式处理器
    */
    this.advanceStyleHandler = {
        dataFormatter: function (value, adConfig) {
            var tempValue = value;
            //给加上‘前缀’，‘后缀’的方法
            var priPostFac = function (str) {
                return $.trim(adConfig.GridCharactConfig.Prifix) + str + $.trim(adConfig.GridCharactConfig.Postfix);
            }
            //列类型判断，0为文本，1为日期，2为数值
            switch (adConfig.CharactType) {
                case 0:
                    return priPostFac(value);
                case 1:
                    var val = parseDate(value);
                    if (val.toString() == "Invalid Date") {
                        return priPostFac(value);
                    }
                    if (adConfig.GridCharactConfig.Format != '') {
                        return priPostFac(formatDate(val, adConfig.GridCharactConfig.Format));
                    } else {
                        return priPostFac(value);
                    }
                case 2:
                    //如果是数值
                    //1.处理小数点
                    if (Number(adConfig.GridCharactConfig.Decimal) != 0 && value.toString().indexOf('.') != -1) {
                        value = Number(value).toFixed(Number(adConfig.GridCharactConfig.Decimal));
                    }
                    //2.千分为分隔符
                    if (adConfig.GridCharactConfig.IsThousandSeparator) {
                        if (tempValue < 0) {
                            value = value.toString().replace('-', '');
                        }
                        value = thousandsSplit(value);
                        if (tempValue < 0) {
                            value = '-' + value;
                        }
                    }
                    //3.是否勾选百分号
                    if (adConfig.GridCharactConfig.IsPercent) {
                        value = value + "%";
                    }
                    //4.是否有上下箭头
                    if (adConfig.GridCharactConfig.IsUpDownArrows) {
                        if (tempValue > 0) {
                            value = value + "↑";
                        } else {
                            value = value + "↓";
                        }
                    }
                    return priPostFac(value);
            }
        },
        combileStyle: function (td, item) {
            /**
            *总汇类别，以及对应的显示值
            */
            var getCombinsCHS = { sum: "总和", max: "最大值", min: "最小值", count: "数量", avg: "平均值" }

            var viewText = td.html();
            td.html('');
            td.html("<div class='combinLable' >" + getCombinsCHS[item.combinType] + "：</div><div>" + viewText + "</div>");
            td.attr('class', 'combin');
            return td
        }
        ,
        /*格子样式处理器*/
        tdStyleGetter: function (td, value, adConfig) {

            //如果设置为数字类型，就作以下处理
            if (adConfig.CharactType == 2) {
                //如果显示百分号，就显示其百分比横向柱状图
                if (adConfig.GridCharactConfig.IsPercent) {
                    //将其中百分号替换成空后再次验证其结果是否为数字
                    var value = Number(value.toString().replace('%', ''));
                    if (!isNaN(value)) {
                        var barColor = "";
                        var fontColor = "";
                        var wValue = value;
                        //如果小于零，就让柱状图变成红色，
                        //并且将value上的负号去掉以方便给柱状图值.
                        if (value < 0) {
                            wValue = value.toString().replace('-', '');

                            //如果区分正负柱状图颜色
                            if (adConfig.GridCharactConfig.IsColorSep) {
                                barColor = 'background-color:#fbd0bd';
                                fontColor = 'color:#ed561b';
                            }
                        }
                        var viewText = td.html();
                        td.html('');

                        var agentDiv = $("<div class='displayAgent' ></div>").appendTo(td);
                        agentDiv.append("<div class='preValue' style='" + fontColor + "' >" + viewText + "</div>");
                        $("<div class='DisplayPre' style='width:0%;" + barColor + "' ><div>").appendTo(agentDiv).animate({ width: wValue + "%" }, 1000);
                        td.attr('class', 'DisplayPre');
                    }
                }
            }

            //判断文字对齐类型
            switch (adConfig.GridCharactConfig.Alignment) {
                case 0:
                    td.css('text-align', 'left');
                    break;
                case 1:
                    td.css('text-align', 'right');
                    break;
                case 2:
                    td.css('text-align', 'center');
                    break;
            }

            return td;
        },
        //连接处理器
        linkHandler: function (td, adConfig) {
            //判断连接类型
            // 内部链接 = 0 ；外部链接 =1
            if (adConfig.LinkType == 1) {
                var viewText = td.html();
                td.html('');
                $('<a href="' + adConfig.LinkAdress + '" >' + viewText + '</a>')
                    .attr('target', "_blank")
                    .appendTo(td);
            }

            if (adConfig.LinkType == 0) {

            }
            return td;
        }
    }


    /**
    *构建分页适配器抽象类
    */
    this.pageSelecter = function () {
        //每页显示的数量
        this.pageSize = 0;
        //总行数
        this.rowNum = 0;
        //总页数
        this.pageCount = 0;
        //当前为第几页
        this.thisPage = 1;
        this.PageCountPanel = '';
    }
    this.pageSelecter.prototype = {
        //计算总页数
        cumputPageCount: function () {
            var p = this.rowNum / this.pageSize;
            if (p.toString().indexOf('.') != -1) {
                p = Number(p.toString().split('.')[0]) + 1;
            }
            return p;
        },
        //获得数据范围（抽象）
        getDataScope: null,
        //初始化分页器（抽象）
        init: null,
        //绑定单击事件（抽象）
        bindClickEvent: null,
        //生成分页器
        create: function (thisObj) {
            var psize = thisObj.config.pagesize;
            //刷新分页器
            if (psize && psize > 0) {
                thisObj.control.empty();
            } else { return; }

            //先创建分页容器
            var pagePanel = $('<ul class="PageCount" ></ul>');
            //加入总页数显示
            //pagePanel.append("<li><span>共：</span></li><li><span>" + this.pageCount + "</span></li><li><span>页</span></li>");

            var pageItems = $('<li></li>');

            //开始页面跳转按钮的循环
            for (var i = 0; i < this.pageCount; i++) {
                var j = i + 1;

                //如果页数大于八页，就开始一些复杂的逻辑判断，但如果没有大于八页，就直接输出八页
                if (this.pageCount > 8) {

                    //如果当前页面在五页之内时，便在下标等于7的时候，也就是刚好循环输出了6项页标时，退出循环并标出最后一页
                    if (this.thisPage <= 5) {

                        if (i >= 7) {
                            pageItems.append('<span>...</span><a  pageIndex="' + this.PageCountPanel + '" index="' + this.pageCount + '" > ' + this.pageCount + '</a>');
                            break;
                        }

                        //判断是否循环到当前页面，到了当前页面便给上一个当前页面的标识
                        if (j == this.thisPage) {
                            pageItems.append('<a  pageIndex="' + this.PageCountPanel + '" class="selectedA" index="' + j + '" > ' + j + '</a>');
                        }
                        else {
                            pageItems.append('<a  pageIndex="' + this.PageCountPanel + '" index="' + j + '" > ' + j + '</a>');
                        }
                    } else {
                        //如果不在五页之内，先将第一页标识出来，再将当前页减去2，从当前页-2的位置往前循环五项，循环完毕后，标出最后一页
                        pageItems.append('<a  pageIndex="' + this.PageCountPanel + '" index="1" >1</a><span>...</span>');

                        var d = this.thisPage - 2;
                        for (var b = 0; b <= 4; b++) {


                            if (d == this.thisPage) {
                                pageItems.append('<a  pageIndex="' + this.PageCountPanel + '" class="selectedA" index="' + d + '" > ' + d + '</a>');
                            }
                            else {
                                pageItems.append('<a  pageIndex="' + this.PageCountPanel + '" index="' + d + '" > ' + d + '</a>');
                            }


                            if (d == this.pageCount)
                            { break; }
                            d++;
                        }

                        if (d == this.pageCount)
                        { break; }

                        pageItems.append('<span>...</span><a  pageIndex="' + this.PageCountPanel + '" index="' + this.pageCount + '" > ' + this.pageCount + '</a>');
                        break;
                    }
                }
                else {//没有大于八页
                    if (j == this.thisPage) {
                        pageItems.append('<a  pageIndex="' + this.PageCountPanel + '" class="selectedA" index="' + j + '"> ' + j + '</a>');
                    }
                    else {
                        pageItems.append('<a  pageIndex="' + this.PageCountPanel + '" index="' + j + '" > ' + j + '</a>');

                    }
                }
            }
            //将循环好的项目返回去界面
            $("#" + this.PageCountPanel).empty();
            $("#" + this.PageCountPanel).append(pagePanel.append(pageItems));
            //绑定跳转事件
            this.bindClickEvent(thisObj);
        }
    }

    /**
    *构建页面级分页的原型, 继承分页对象
    */
    this.selecterOfpage = function () { }
    this.selecterOfpage.prototype = new this.pageSelecter();

    //重写方法
    //页面级分页的加载方法
    this.selecterOfpage.prototype.init = function (thisObj) {
        if (this.PageCountPanel) {
            $('#' + this.PageCountPanel).remove();
        }
        //如果没有this.config.config.PageSize信息,或者它等于零时，视为用户不想分页
        var psize = thisObj.config.pagesize;
        if (!psize || psize == "0") { psize = thisObj.data.Tables[0].Rows.length; }
        //初始化分页器
        //设置页大小
        this.pageSize = Number(psize);
        //设置总行数
        this.rowNum = thisObj.data.Tables[0].Rows.length;
        //设置PageCountPanel容器id
        this.PageCountPanel = (+new Date / Math.random()).toString().replace('.', '');
        //设置总页数
        this.pageCount = this.cumputPageCount();
        if (thisObj.config.pagesize && Number(thisObj.config.pagesize) > 0) {
            $(thisObj.control.parent()).append('<div class="PageCountPanel" id=' + this.PageCountPanel + ' ></div>');
        }
    }

    //重写方法
    //页面级分页获取数据范围的方法
    this.selecterOfpage.prototype.getDataScope = function (dt) {
        //复制对象
        var outputDT = jQuery.extend(true, {}, dt);
        //获得范围值
        var start = this.thisPage * this.pageSize - this.pageSize;
        var end = this.thisPage * this.pageSize;
        this.rowNum = dt.Rows.length;
        if (end <= 0 || end > this.rowNum) { end = this.rowNum; }

        //从数据表装取出范围中的数据
        var rows = dt.Rows.slice(start, end);
        outputDT.Rows = rows;
        return outputDT;
    }

    //重写方法
    //页面级分页单击的方法
    this.selecterOfpage.prototype.bindClickEvent = function (thisObj) {
        $("[pageIndex='" + this.PageCountPanel + "']").click(function () { thisObj.bind(null, $(this).attr('index')); });
        $(thisObj.control).parent().height($(thisObj.control).parent().height());
    }

    /**
    *构建数据库级分页的原型, 继承分页对象
    */
    this.selecterOfDataBase = function () { }
    this.selecterOfDataBase.prototype = new this.pageSelecter();

    //重写方法
    //数据库级分页的加载方法
    this.selecterOfDataBase.prototype.init = function (thisObj) {
        if (this.PageCountPanel) {
            $('#' + this.PageCountPanel).remove();
        }
        psize = thisObj.config.pagesize;
        //初始化分页器
        //设置页大小
        this.pageSize = Number(psize);
        //设置总行数
        this.rowNum = thisObj.config.config.RowCount;
        //设置PageCountPanel容器id
        this.PageCountPanel = (+new Date / Math.random()).toString().replace('.', '');
        //设置总页数
        this.pageCount = this.cumputPageCount();
        //放入分页器
        $(thisObj.control.parent()).append('<div class="PageCountPanel" id=' + this.PageCountPanel + ' ></div>');
    }

    //重写方法
    //数据库级分页获取数据范围的方法
    this.selecterOfDataBase.prototype.getDataScope = function (dt) {
        return dt;
    }

    //重写方法
    //数据库级分页单击的方法
    this.selecterOfDataBase.prototype.bindClickEvent = function (thisObj) {
        $("[pageIndex='" + this.PageCountPanel + "']").click(function () {
            thisObj.getPageData(thisObj.selecter.rowNum, thisObj.selecter.pageSize, $(this).attr('index'));
            $(thisObj.control).parent().height($(thisObj.control).parent().height());
        });
    }

    /**
    *通过配置返回分页对象
    */
    this.getPageSelecter = function () {
        //获得是否启用数据库级分页的信息
        var usingServer = this.config.config.isServerPager;
        if (usingServer) {
            //数据库级分页器
            return new this.selecterOfDataBase();
        } else {
            //页面级分页器
            return new this.selecterOfpage();
        }
    }

    /**廖力修改 结束-2013/12/4**/

    /**
    * 生成表格头信息
    */
    this.createGridHeader = function (data) {
        var columns = [];
        var self = this;
        //先循环所有列项目，每个列项目单独切割'_'
        for (var i = 0; i < data.Columns.length; i++) {
            var item = data.Columns[i];
            //开始递归，本递归会产生一个树结构
            //其分支在数组中每个对象的.children属性之下
             
            columns = addChild(columns, item.DisplayName, data.Columns[i]);
        }

        //增加子栏目
        function addChild(columns, str, obj) {
            var arr = str.split('_');
            //查找在columns里是否有相同的displayName
            var cItem = undefined;
            for (var j = 0; j < columns.length; j++) {
                if (columns[j].DisplayName == arr[0] && columns[j].children.length != 0) {
                    cItem = columns[j];
                    break;
                }
            }
            //如果没找到就创建
            if (!cItem) {
                //创建项目
                cItem = {
                    Name: 'parentNode',
                    DisplayName: arr[0],
                    Description: 'parentNode',
                    children: []
                }

                //如果本级别就是最后一层
                //就将属性给全了
                if (!arr[1]) {
                    //在这个地方需要循环高级配置，
                    //检查是否有它的列属性要显示的
                    var isFindAdConfigMappingConfig = false;
                    for (var i = 0; i < self.advanceConfig.ChartMappings.length; i++) {
                        var adConfigMappingConfig = self.advanceConfig.ChartMappings[i];
                        if (adConfigMappingConfig.DataColumn == obj.Name) {
                            //数据名
                            cItem['Name'] = obj.Name;
                            //显示名
                            if ($.trim(adConfigMappingConfig.DisplayName) != "") {
                                cItem['DisplayName'] = adConfigMappingConfig.DisplayName;
                            } else {
                                cItem['DisplayName'] = arr[0];
                            }
                            //描述
                            if ($.trim(adConfigMappingConfig.DisplayName) != "") {
                                cItem['Description'] = adConfigMappingConfig.ColumnMark;
                            } else {
                                cItem['Description'] = obj.Description;
                            }
                            //高级配置
                            cItem['advanceConfigMapping'] = adConfigMappingConfig;
                            //排序类型
                            cItem['sortStyle'] = obj['sortStyle'];
                            //是否找到了相应的高级配置
                            isFindAdConfigMappingConfig = true;
                        }
                    }

                    //在没有找到高级配置的情况下就使用它本身的属性
                    if (!isFindAdConfigMappingConfig) {
                        cItem['Name'] = obj.Name;
                        cItem['DisplayName'] = arr[0];
                        cItem['Description'] = obj.Description;
                        cItem['advanceConfigMapping'] = 'undefined';
                        cItem['sortStyle'] = obj['sortStyle'];
                    }
                }

                columns.push(cItem);
            }

            //判断是否可以再嵌套
            if (arr[1]) {
                //设置要嵌套的字符串
                //该字符串会在当前的字符串数组中剔除第一位
                //传入从第二位开始的字符
                var inputStr = '';
                for (var j = 1; j < arr.length; j++) {
                    if (inputStr != '') {
                        inputStr += '_'
                    }
                    inputStr += arr[j];
                }
                //将要检索的数组，以及要送去检查的字符串传入方法
                //返回一个数组，这个数组包含和之前在该节点之下创建过的，和新的被创建的列对象
                cItem.children = addChild(cItem.children, inputStr, obj);
            }
            //返回一个对象，该对象的结构类似树
            //其分支在数组中每个对象的.children属性之下
            return columns;
        }
        //返回列的树结构
        return columns;
    }
}                                                //--end datagridview
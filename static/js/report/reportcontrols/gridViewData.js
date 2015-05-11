/**

* 单日期先择控件

*/

jmreport.reportControls.controlTypes['gridViewData'] = function (config) {

    //如果有高级配置，就直接实例化高级配置的表格对象

    if (typeof (config.config.AdvanceConfig) != "undefined" && $.trim(config.config.AdvanceConfig) != '') {

        return new jmreport.reportControls.controlTypes.advanceGridViewData(config);

    }



    jmreport.reportControls.controlTypes.initControl.call(this, config); //初始化



    this.selecter = null;

    self = this;

    /**

    * 绑定数据

    */

    this.bind = function (data, pageIndex) {  

        if (!this.data || this.data.length <= 0) {

            this.log('暂无数据哦，亲！');

            return;

        }

        this.data = this.data[0];



        //通过配置获得分页器

        //获得 “页面级分页器” 或者 “数据库级分页器”

        if (!this.selecter) {

            this.selecter = this.getPageSelecter();

        }



        //如果返回行数大于500，并且当前不是数据库级分页，也没有设置分页

        if (this.data.data.length > 500 && !this.config.config.isServerPager && Number(this.config.pagesize) == 0) {

            this.config.pagesize = 500;

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

        var dt = this.selecter.getDataScope(this.data);



        //判断用户是否想要总汇

        var columnsCondition = this.combins.findIsAnyCombie(this.config.config,this.data);

        if (columnsCondition.length != 0) {

            //开始计算总汇数据 并在表格的最后一行加入总汇数据

            dt.data = dt.data.concat(this.combins.init(columnsCondition, this.data));

        }



        //生成列

        var columns = this.createGridHeader(dt);

        //生成表格对象

        this.tableContent = $('<div></div>');

        var tb = this.createTable(dt, columns);

        tb.appendTo(this.tableContent.appendTo(this.control));



        //table的自动调整大小事件的方法

        function tableResize(tb, thisObj) {

            this.doFunc = function () {

                thisObj.scrollController = function () { };

                //表格的高度不应该被自由控制，应该由行的设置，或分页设置来规范其高度.

                //可以在此设置一下content div的高度

                thisObj.tableContent.height(tb.height());                

                $(thisObj.control).parent().height("auto");

                

                $(thisObj.control).parent().css("min-height", "auto");

                $(thisObj.control).height("auto");

                $(thisObj.control).css("min-height", "auto");



                //保存一下内部表格，包括分页器的总高度

                thisObj.allInsertHeight = thisObj.control.parent().height()

                thisObj.tb = tb;

                

                //判断内部表格的宽度超过外部div的宽度就有可能已经显示出滚动条了

                //在这种情况下要预留出滚动条的高度

                if (tb.width() > thisObj.control.width()) {

                    thisObj.tableContent.css('overflow', 'hidden');

                    thisObj.control.css('overflow', 'hidden');

                    thisObj.control.css('overflow-x', 'scroll');

                    thisObj.control.css('position', 'relative');

                    //如果大于的话，说明有底部滚动条，

                    //有底部滚动条就需要启动滚动条设置器

                    //在用户屏幕还没有滚动到该表格最下面的时候

                    //底部滚动条跟随用户屏幕

                    thisObj.scroll.scrollBarX.call(thisObj);

                } else {

                    thisObj.tableContent.css('overflow', '');

                    thisObj.control.css('overflow', '');

                    thisObj.control.css('overflow-x', '');

                    thisObj.control.css('position', '');

                }

                thisObj.scroll.tableHeadFllowResize.call(thisObj);

            }

        }



        //从新设置窗口大小时使用的方法

        var tableResize = new tableResize(tb, this);

        tableResize.doFunc();

        this.resizeController = tableResize.doFunc;



        var thisObj = this;

        //开始滚动时使用的方法

        this.startScrollController = function () {

            thisObj.scroll.stopScrollBarX.call(thisObj);

            thisObj.scroll.clearFllowingHead.call(thisObj);

        }

        //结束滚动时使用的方法

        this.stopScrollController = function () {

            if (tb.width() > thisObj.control.width()) {

                //如果大于的话，说明有底部滚动条，

                //有底部滚动条就需要启动滚动条设置器

                //在用户屏幕还没有滚动到该表格最下面的时候

                //底部滚动条跟随用户屏幕

                thisObj.scroll.scrollBarX.call(thisObj);

            }

            thisObj.scroll.tableHeadFllowScroll.call(thisObj);

        }



        //完成渲染调用此方法

        //此方法位于jmreport.reportControls.js

        this.drawCompleteCallBack();

    }





    /*

    *滚动控制对象

    */

    this.scroll = {

        stopScrollBarX: function () {

            var control = this.control, tb = this.tb, tableContent = this.tableContent;

            var maxHeight = tb[0].offsetHeight;



            tableContent[0].style.height = maxHeight + 'px';

            control[0].style.height = "auto";

            control.parent()[0].style.height = "auto";

        },

        //控制横向滚动条的出现和消失

        scrollBarX: function () {

            /*var control = this.control, tb = this.tb, tableContent = this.tableContent;

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

            control.parent().height("auto");*/

        },

        //窗口大小发生改变的时候,改变浮动表头的大小,

        //将他们内部的格子宽度分别和原表头的宽度标为一致

        tableHeadFllowResize: function () {

            var control = this.control, tb = this.tb, tableContent = this.tableContent;

            if (this.floatingHead && tb[0].childNodes[1].childNodes.length != 0) {

                var oldNode = tb[0].childNodes[1].childNodes[0].childNodes;

                var newNode = $(this.floatingHead).find('tfoot td div');

                for (var i = 0; i < oldNode.length; i++) {

                    $(newNode[i]).width(oldNode[i].offsetWidth);

                }

                $(this.floatingHead).width($(tableContent).width());

            }

        }, //创建浮动表头

        createFllowingHead: function (head, childNode, tableContent, control) {

            this.floatingHead = '<table cellspacing="0" cellpadding="0" border="0" class="jmreport-gridViewData" style="display:none;z-index:999;border-bottom:1px solid #ccc;left:0px;top:0px;" ><thead>' + head[0].innerHTML + "</thead>";

            //加入宽度控制脚

            this.floatingHead += '<tfoot>';

            for (var i = 0; i < childNode.length; i++) {

                this.floatingHead += '<td><div></div></td>';

            }

            this.floatingHead += "</tfoot></table>";

            this.floatingHead = $(this.floatingHead);

            tableContent.append(this.floatingHead);

        },

        //表头跟随滚动的方法

        tableHeadFllowScroll: function () {

            var control = this.control, tb = this.tb, tableContent = this.tableContent;

            if ($(tableContent).offset().top < $(window).scrollTop()) {

                if (this.floatingHead.css('visibility') == 'hidden') { this.floatingHead[0].style.visibility = "visible"; }

                if (this.floatingHead.css('display') == 'none') { this.floatingHead[0].style.display = "block"; }

                this.floatingHead.css('top', $(window).scrollTop() - $(tableContent).offset().top + 'px');

            } else {

                if (this.floatingHead) {

                    this.floatingHead[0].style.visibility = "hidden";

                }

            }

        },

        //清除随滚动条运动的头部

        clearFllowingHead: function () {

            if (this.floatingHead) {

                if (this.floatingHead.css('display') == 'block') {

                    this.floatingHead[0].style.visibility = "hidden";

                }

            }

        }

    }



    /**

    * 排序方法

    */

    this.sortColumn = function (thisElem) {

        //获得数据先

        data = this.data;

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

            if (!str) return 0;

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

            data.data = data.data.sort(sortStyle.asc);

            sortStyleStr = 'asc';

        } else {

            data.data = data.data.sort(sortStyle.desc);

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

    * 生成Thead中的内容

    *

    *@[columns]{json}由createGridHeader方法创建的列的对象

    *@[thObj]{json}由jquery创建的'<thead></thead>'

    */

    this.createThead = function (columns, thObj) {

        var thisObj = this;

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

                th = $('<th></th>').appendTo(tr).html(columns[i].displayname);

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

                    datatype: columns[i].datatype,

                    displayname: columns[i].displayname,

                    description: columns[i].description,

                    name: columns[i].name,

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

            childNode = this.createThead(childNode, thObj);

        }

        else {

            //如果已经不存在有效列了，说明循环已经进行到了最底层

            //那么childNode中保存的将都是无效列，我们就将这些最终

            //列绑定上一些必须要绑定的属性，样式，和事件

            for (var i = 0; i < childNode.length; i++) {

                var item = childNode[i];

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
                //     0  console.log(item.description);
                if ($.trim(item.description) != '') {

                    if (!new RegExp('^([\[\{\"]{1,1})').test(item.description)) {

                        var tempStr = "<span class='cDescription' title='" + item.description.split('|')[0] + "' >?<span>";

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

                if (item.displayname.indexOf('率') != -1 || item.displayname.indexOf('%') != -1) {

                    //设置‘是否显示百分比’属性为true,

                    //此属性将在下面判断，并显示相应的类似进度条的元素

                    item['isDisplayPre'] = true;

                }

            }

        }

        //返回所有嵌套列中最后一列

        return childNode;

    }



    /**

    * 生成表格

    */

    this.createTable = function (dt, columns) {



        //获得嵌套列的树状结构

        if (!columns) { columns = this.createGridHeader(dt); }

        var tableClass = "jmreport-gridViewData";

        if (dt.old_data.length > 300) {

            tableClass = "jmreport-gridViewData-bigData";

        }

        var tb = $('<table border="0" cellpadding="0" cellspacing="0"  class="' + tableClass + '" ></table>');

        var head = $('<thead></thead>').appendTo(tb);





        if (this.data.data.length >= 500) {

            head.append("<tr class='jmreport-max-data-alt' ><th colspan='" + dt.fields.length + '</th></tr>');// + "' > 查询耗时(ms)：" + dt.SearchTime + ",注意，此次查询数据量可能已超过五百条，数据将折页显示，若要查看完整数据，请点击表格右上方导出。 </th></tr>");

        }



        //依据头部结构制造头部

        var childNode = this.createThead(columns, head);



        //依据已经生成好的头部生成一个浮动头

        this.scroll.createFllowingHead.call(this, head, childNode, this.tableContent, this.control);



        var body = $('<tbody></tbody>');



        this.getTbody(body, dt, childNode);



        body.appendTo(tb);

        return tb;

    }



    //获得tbody

    this.getTbody = function (body, dt, childNode) {



        //大数据使用的生成方法

        //大于三百行就属于大数据,强行使用简陋表格

        var bigData = function () {

            var thisObj = this;

            //开始下标

            var startIndex = 0;

            //结束下标

            var endIndex = 30;

            //每次分批加载的大小

            var lengthCount = 30;

            //是否结束加载了

            var isEnd = false;

            var tempData = jQuery.extend(true, {}, dt);

            //分步显示数据

            var loadDataByStep = function () {

                var tempInterval = setInterval(function () {

                    //放完数据了，自动退出计时

                    if (isEnd) { clearInterval(tempInterval); return; }

                    //判断结束下标是否超出数组范围

                    if (dt.data[endIndex]) {

                        tempData.data = dt.data.slice(startIndex, endIndex);

                    } else {

                        //如果超出数组范围就使用最后一次设置的开始位置，到数组的最后一个index取到最后一组数据

                        tempData.data = dt.data.slice(startIndex, dt.data.length);

                        isEnd = true;

                    }



                    var bodyHtml = "";

                    //如果分页有效(不等于零)就用分页,否则就表示用户并没有分页，便试用总行数

                    var rowLength = 0;

                    if (thisObj.selecter.pageSize != 0) {

                        rowLength = thisObj.selecter.pageSize;

                    } else {

                        rowLength = tempData.data.length;

                    }

                    for (var i = 0; i < rowLength; i++) {

                        var tr = '<tr>';



                        //如果数据不存在了，表示要填入空白行

                        if (!tempData.data[i]) {

                            for (var j = 0; j < childNode.length; j++) {

                                var column = childNode[j];

                                tr += '<td>&nbsp;</td>';

                            }

                            continue;

                        }

                        var row = tempData.data[i];



                        //数据存在的情况下填充数据行

                        for (var j = 0; j < childNode.length; j++) {

                            var column = childNode[j];

                            var td = '<td>';



                            var itemValue = row[column.name];



                            if (itemValue == null) {

                                itemValue = "&nbsp;";

                            }



                            td += itemValue;

                            tr += td + '</td>';

                        }

                        bodyHtml += tr + '</tr>';

                    }

                    body.append(bodyHtml);

                    thisObj.resizeController();

                    thisObj.drawCompleteCallBack();



                    startIndex += lengthCount;

                    endIndex += lengthCount;

                }, 5);

            }

            loadDataByStep();

        }



        //小数据使用的生成表格的方法

        smallData = function () {

            var thisObj = this;

            //如果分页有效(不等于零)就用分页,否则就表示用户并没有分页，便使用总行数

            var rowLength = 0;

            if (this.selecter.pageSize != 0) {

                rowLength = this.selecter.pageSize;

                if (dt.data.length - rowLength > 1) {

                    rowLength = dt.data.length;

                }

            } else {

                rowLength = dt.data.length;

            }

            for (var i = 0; i < rowLength; i++) {

                var tr = $('<tr></tr>').appendTo(body);



                //如果数据不存在了，表示要填入空白行

                if (!dt.data[i]) {

                    for (var j = 0; j < childNode.length; j++) {

                        var column = childNode[j];

                        var td = $('<td>&nbsp;</td>').appendTo(tr);

                    }

                    continue;

                }

                var row = dt.data[i];



                //数据存在的情况下填充数据行

                for (var j = 0; j < childNode.length; j++) {

                    var column = childNode[j];

                    var td = $('<td></td>').appendTo(tr);

                    for (var k in row) {

                        var item = row[k];

                        if (k == column.name) {

                            var tdcontent = td;

                            //如果不是总汇行就可以绑定连接

                            //总会行绑定连接没有意义

                            if (!row.combinType) {

                                //单列简单页面连接

                                var page = thisObj.config.config.linkpageid;



                                //绑定有内部连接的单列

                                if (page && k == 0) {

                                    tdcontent = this.linkHandle.singleLink(page, tdcontent, row, column, td, thisObj);

                                }



                                //老多列绑定

                                if (new RegExp('^([\[\{\"]{1,1})').test(column.description)) {

                                    var link = JSON.parse(column.description);

                                    tdcontent = this.linkHandle.multiLink(link[0].page, item, tdcontent, row, column, td, thisObj);

                                }



                                //新多列绑定 2.0

                                //使用列说明解析器

                                this.descriptionReader(column.description, function (name) {

                                    tdcontent.attr('title', '点击打开：【' + name + '】');

                                }, function (link, name, paramMapping, toolbarMapping) {

                                    tdcontent = thisObj.linkHandle.multiLink(link, item, tdcontent, row, column, td, thisObj, name, paramMapping, toolbarMapping);

                                });

                            }

                            //判断第一列的值是日期还是其他格式的

                            //如果是日期就使用日期颜色填充

                            //如果非日期就隔行加色

                            //如果现在循环到的是第一列

                            //就用第一列的值进行判断

                            if (k == 0) {

                                //先判断是否为日期

                                if (isDateString(item)) {

                                    //再判断是否为周末

                                    if (isWeekend(item)) {

                                        var str = "";

                                        if (tr.attr('class')) { str = tr.attr('class'); }

                                        tr.attr('class', str + ' weekend-row');

                                    }

                                }

                                else {

                                    if (i % 2) {

                                        tr.attr('class', 'alt-row');

                                    }

                                }

                            }



                            if (item) {

                                if (isNetNumber(column.datatype)) {

                                    if (!isNaN(Number(item))) {

                                        if (item < 0) {

                                            item = item.toString().replace('-', '');

                                        }

                                        //默认两位小数点展示

                                        if (item.toString().split('.')[1] && item.toString().split('.')[1].length > 2) {

                                            item = Number(item).toFixed(2);

                                        }

                                        item = thousandsSplit(item);



                                        if (item < 0) {

                                            item = '-' + item;

                                        }

                                    }

                                }



                                //判断该项目是否为总汇项目,判断该项目是否有combinType值

                                if (!item.combinType) {

                                    tdcontent.append(item);

                                } else {

                                    td.html(item);

                                    td = this.combins.combileStyle(td, item, k);

                                }

                                //判断该列是否要放入百分比显示

                                if (column['isDisplayPre'] || item.indexOf('%') != -1) {

                                    //将其中百分号替换成空后再次验证其结果是否为数字

                                    var tempValue = Number(item.replace('%', ''));

                                    if (!isNaN(tempValue)) {

                                        var barColor = "";

                                        var fontColor = "";

                                        var wValue = tempValue;

                                        //如果小于零，就让柱状图变成红色，

                                        //并且将value上的负号去掉以方便给柱状图值.

                                        if (tempValue < 0) {

                                            wValue = tempValue.toString().replace('-', '');

                                            barColor = 'background-color:#fbd0bd';

                                            fontColor = 'color:#ed561b';

                                        }

                                        tdcontent.html('');



                                        var agentDiv = $("<div class='displayAgent' ></div>").appendTo(tdcontent);

                                        agentDiv.append("<div class='preValue' style='" + fontColor + "' >" + item + "</div>");

                                        $("<div class='DisplayPre' style='width:" + wValue + "%;" + barColor + "' ><div>").appendTo(agentDiv);

                                        td.attr('class', 'DisplayPre');

                                    }

                                }

                            }

                            else {//如果值为空就填上空格，以免表格塌陷



                                if (row.combinType && k == 0) {

                                    item.combinType = row.combinType;

                                    td = this.combins.combileStyle(td, item, k);

                                } else {

                                    tdcontent.html("&nbsp;");

                                }

                            }

                            break;

                        }

                    }

                }

            }

        }



        if (dt.old_data.length > 300) {

            bigData.call(this);

        } else {

            smallData.call(this);

        }

    }



    /**

    *连接绑定处理器

    */

    this.linkHandle = {

        //多列绑定

        multiLink: function (link, item, tdcontent, row, column, td, thisObj, title, paramMapping, toolbarMapping) {

            //如果是http开头，便是外联

            if (new RegExp('^([http\://]{1,1})').test(link)) {

                tdcontent = $('<a href="' + this.linkHandler(link, row.ItemArray) + '" ></a>')

                                                                .attr('target', "_blank")

                                                                .appendTo(td);

                return tdcontent;

            } else { //不是则为内联

                tdcontent = $('<a href="#"></a>').attr('data-date', item.Value)

                                                                .attr('data-page', link)

                                                                .attr('data-column', column.Name)

                                                                .appendTo(td);

                var par = thisObj.poppageParaCreator(row.ItemArray, paramMapping, toolbarMapping);

                (function (_title, _thisObj, _tdcontent, _par, _page, _isSendToolBar) {

                    _tdcontent.click(function (e) {

                        var thiscontrol = _thisObj;

                        thiscontrol.report.page.openPopPage(_page, _title, undefined, _par, _isSendToolBar);

                        return false;

                    });

                })(title, thisObj, tdcontent, par.par, link, par.isSendToolBar)

                return tdcontent;

            }

        },

        //整表单列绑定

        singleLink: function (page, tdcontent, row, column, td, thisObj) {

            //是否有接列

            var links = [];

            var ps = page.split(';');

            if (ps.length > 0) {

                for (var h = 0; h < ps.length; h++) {

                    var p = ps[h];

                    var pps = p.split('|');

                    //如果只有一个参数，或有三个参数且第三个参数为当前列，则并示此列有外链

                    if (pps.length == 1 || (pps.length == 2 && pps[0] == column.Name) || (pps.length == 3 && pps[2] == column.Name)) {

                        links.push(p);

                    }

                }

            }

            if (links.length > 0) {

                tdcontent = $('<a href="#"></a>').attr('data-date', row.ItemArray[0].Value)

                                                                .attr('data-page', page)

                                                                .attr('data-column', column.Name)

                                                                .appendTo(td);

                var par = '[';

                for (var i = 0; i < row.ItemArray.length; i++) {

                    if (i != 0) {

                        par += ',';

                    }

                    par += '{"name":"' + row.ItemArray[i].ColumnName + '","value":"' + row.ItemArray[i].Value + '"}';

                }

                par += ']';

                (function (_title, _thisObj, _tdcontent, par) {

                    _tdcontent.click(function (e) {

                        var page = $(this).attr('data-page');

                        //如果配置了多个，就弹出菜单

                        var ps = page.split(';');

                        var thiscontrol = _thisObj;

                        if (ps.length > 1 || (ps.length == 1 && ps[0].indexOf('|') >= 0)) {

                            //菜单关联参数

                            var arg = {

                                field: $(this).attr('data-column'),

                                date: $(this).attr('data-date'),

                                x: e.pageX || e.clientX,

                                y: e.pageY || e.clientY

                            };

                            thiscontrol.clickMenu.create(arg, thiscontrol, ps);

                        }

                        else {

                            thiscontrol.report.page.openPopPage(page, _title, undefined, par, true);

                        }



                        return false;

                    });

                })("", thisObj, tdcontent, par)

            }

            return tdcontent;

        }

    }







    /**

    *总汇类及 它的方法

    */

    this.combins = {

        combileStyle: function (td, item, index) {

            /**

            *总汇类别，以及对应的显示值

            */

            var getCombinsCHS = { sum: "总和", max: "最大值", min: "最小值", count: "数量", avg: "平均值" }



            var viewText = td.html();

            td.html('');

            if (index == 0 && viewText == '') {

                td.html(getCombinsCHS[item.combinType] + "：");

            }

            else if (index == 0 && viewText != '') {

                td.html("<div class='combinLable' >" + getCombinsCHS[item.combinType] + "：</div><div>" + viewText + "</div>");

            }

            else {

                td.html("<div>" + viewText + "</div>");

            }

            td.attr('class', 'combin');

            return td;

        },

        //查找列中是否存在任何总汇指令

        findIsAnyCombie: function (config,table) {

            var columnsCondition = [];

            //已配置汇总

            if (config.controlconfig && config.controlconfig.gathers && config.controlconfig.gathers.length) {

                for (var i = 0; i < table.fields.length; i++) {

                    var column = table.fields[i];                    

                    $(config.controlconfig.gathers).each(function (i, g) {

                        if (column.name == g.column) columnsCondition.push({ columnName: column.name, combinType: g.fun });

                    });                                       

                }

                

            }

            return columnsCondition;

        },

        //通过一份dt.rows创建一个新的,空的dt.rows单元

        cleateMasterRow: function (row) {

            //新的dt.rows元素的容器

            var newRow = {};

            

            //开始创建newItemArray

            for (var k in row) {                

                //将外部的值也给上

                newRow[k] = "";

            }



            //建立设置值的方法

            newRow.setValue = function (name, value, combinType) {

                //告诉设置一个combinType值以表示该字段是以什么类型的总汇得出结果的

                this.combinType = combinType;

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

            //先拷贝一份dt.rows

            if (dt.Rows.length == 0) { return; }

            var resultDt = [];

            //开始统计，先遍历columnsCondition中的项目，一个条件一个条件地统计

            for (var i = 0; i < columnsCondition.length;i++) {

                var cc = columnsCondition[i], rowModal=null;

                //建立行模型,如果同一类型且不是同一列，则加到同一行中。

                $(resultDt).each(function (r, m) {

                    if (m.combinType == cc.combinType && m.columnName != cc.columnName) {

                        rowModal = m;

                        return false;

                    }

                });

                if (!rowModal) {

                    rowModal = this.cleateMasterRow(dt.Rows[0]);                

                    rowModal.combinType = cc.combinType;

                    rowModal.columnName = cc.columnName;

                    resultDt.push(rowModal);

                }

                

                //取得当前要统计的列名后，开始循环dt.rows统计数据

                for (var j = 0; j < self.data.Tables[0].Rows.length; j++) {

                    var row = self.data.Tables[0].Rows[j];

                    //总汇行的目标列

                    var value = parseFloat(rowModal[cc.columnName]);

                    //计算value是填写空字符串还是数字字符串

                    if (isNaN(value) || !value) { value = 0; }

                    //td中将被总汇的列

                    var v = parseFloat(row[cc.columnName]);

                    if (isNaN(v) || !v) { v = 0; }

                    //将以上两个变量传入方法并得出结果

                    var result = this.combinStyle[$.trim(cc.combinType)](value, v, j, self.data.Tables[0].Rows.length);

                    //将得出的结果加入总汇行

                    rowModal.setValue(cc.columnName, result, $.trim(cc.combinType));

                }                

            }

            return resultDt;

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

                            pageItems.append('<span>...</span><a href="#" pageIndex="' + this.PageCountPanel + '" index="' + this.pageCount + '" > ' + this.pageCount + '</a>');

                            break;

                        }



                        //判断是否循环到当前页面，到了当前页面便给上一个当前页面的标识

                        if (j == this.thisPage) {

                            pageItems.append('<a href="#"  pageIndex="' + this.PageCountPanel + '" class="selectedA" index="' + j + '" > ' + j + '</a>');

                        }

                        else {

                            pageItems.append('<a href="#"  pageIndex="' + this.PageCountPanel + '" index="' + j + '" > ' + j + '</a>');

                        }

                    } else {

                        //如果不在五页之内，先将第一页标识出来，再将当前页减去2，从当前页-2的位置往前循环五项，循环完毕后，标出最后一页

                        pageItems.append('<a href="#"  pageIndex="' + this.PageCountPanel + '" index="1" >1</a><span>...</span>');



                        var d = this.thisPage - 2;

                        for (var b = 0; b <= 4; b++) {





                            if (d == this.thisPage) {

                                pageItems.append('<a href="#"  pageIndex="' + this.PageCountPanel + '" class="selectedA" index="' + d + '" > ' + d + '</a>');

                            }

                            else {

                                pageItems.append('<a href="#"  pageIndex="' + this.PageCountPanel + '" index="' + d + '" > ' + d + '</a>');

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

                        pageItems.append('<a href="#"  pageIndex="' + this.PageCountPanel + '" class="selectedA" index="' + j + '"> ' + j + '</a>');

                    }

                    else {

                        pageItems.append('<a href="#"  pageIndex="' + this.PageCountPanel + '" index="' + j + '" > ' + j + '</a>');



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

        if (!psize || psize == "0") { psize = 0; }//thisObj.data.Tables[0].Rows.length

        //初始化分页器

        //设置页大小

        this.pageSize = Number(psize);

        //设置总行数

        this.rowNum = thisObj.data.data.length;

        //设置PageCountPanel容器id

        this.PageCountPanel = (+new Date / Math.random()).toString().replace('.', '');

        //设置总页数

        this.pageCount = this.cumputPageCount();

        if (this.pageSize > 0) {

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

        this.rowNum = dt.data.length;

        if (end <= 0 || end > this.rowNum) { end = this.rowNum; }



        //从数据表装取出范围中的数据

        var rows = dt.data.slice(start, end);

        outputDT.old_data = dt.data;

        outputDT.data = rows;

        return outputDT;

    }



    //重写方法

    //页面级分页单击的方法

    this.selecterOfpage.prototype.bindClickEvent = function (thisObj) {

        $("[pageIndex='" + this.PageCountPanel + "']").click(function () {

            thisObj.bind(null, $(this).attr('index'));

            return false;

        });

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


        //先循环所有列项目，每个列项目单独切割'_'

        for (var i = 0; i < data.fields.length; i++) {

            var item = data.fields[i];

            //开始递归，本递归会产生一个树结构

            //其分支在数组中每个对象的.children属性之下

            columns = addChild(columns, item.name, item);            

        }



        //增加子栏目

        function addChild(columns, str, obj) {

            //处理多层表头

            if (str == "") {

                str = " / ";

            }

            var arr = str.split('/');

            //查找在columns里是否有相同的displayName

            var cItem = undefined;

            for (var j = 0; j < columns.length; j++) {

                if (columns[j].displayname == arr[0] && columns[j].children.length != 0) {

                    cItem = columns[j];

                    break;

                }

            }

            //如果没找到就创建

            if (!cItem) {

                var mapping = data.getColumnMapping(arr[0]);

                var name = mapping ? mapping.displayname || arr[0] : arr[0];

                var des = mapping ? mapping.description || obj.description : obj.description;

                //创建项目

                cItem = {

                    name: 'parentNode',

                    displayname: name,

                    description: des,

                    children: []

                }



                //如果本级别就是最后一层

                //就将属性给全了

                if (!arr[1]) {

                    cItem['name'] = obj.name;

                    cItem['displayname'] = name;

                    cItem['description'] = des;

                    cItem['sortStyle'] = obj['sortStyle'];

                    cItem['datatype'] = obj['datatype'];

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

                        inputStr += '/'

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

}                                                                                                                                                                                                                                                                                                                //--end datagridview



//在末尾给表格控件注册

jmreport.reportControls.register('GridViewData', jmreport.reportControls.controlTypes.gridViewData);

//jmreport.reportControls.register('RadGridViewData', jmreport.reportControls.controlTypes.gridViewData);


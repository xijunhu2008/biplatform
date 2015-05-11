
/**
* 报表控件
*/
jmreport.reportControls = {
    controlTypes: {},
    controls: {},
    colorRecorder: -1,
    /**
    * 注入一个控件
    */
    register: function (name, control) {
        this.controls[name] = control;
    },
    /**
    * 根据名称生成控件
    */
    create: function (opt) {
        opt = new this.controlConfig(opt); //先实例化基础类
        var control = this.controls[opt.config.controlname];
        if (!control) {
            control = this.controls['base'];
            var result = new control(opt);
            result.getData = function () {

            };
            result.error("创建控件失败:" + opt.config.controlname);
            return result;
        }
        return new control(opt);
    },
    /**
    * 基础配置类
    */
    controlConfig: function (opt) {
        this.config = opt;
        /**
        * 获取并分解控件参数串
        */
        this.getControlParam = function (key) {
            return this.config.controlconfig[key];
        };
        /*
        *设置控件参数串
        */
        this.setControlPara = function (key, value) {
            this.config.controlconfig[key] = value;
        }
        /**
        * 创建顶级菜单
        */
        this.createTopMenu = function (option) {
            var item = this.menuItems[option.name] = $('<li></li>')
                                        .attr('title', option.title)
                                        .appendTo(this.menuContent);
            if (option.handler) {
                item.click(option.handler);
            }
            if (option.css) {
                item.toggleClass(option.css, true);
            }
            return item;
        };

        //创建更多菜单
        this.createMoreMenu = function (obj, option) {
            if (!obj.moreMenuContent) {
                obj.moreMenuContent = $('<div class="moreMenu-content" ></div>').appendTo(obj);
                $('<div class="moreMenu-icon" ></div>').appendTo(obj.moreMenuContent);
                this.moreMenu = $('<ul class="moreDir-moreMenu" ></ul>').appendTo(obj.moreMenuContent);
            }
            var item = this.menuItems[option.name] = $('<li></li>')
                                        .html(option.title)
                                        .appendTo(this.moreMenu);
            if (option.handler) {
                item.click(option.handler);
            }
            if (option.css) {
                item.attr('style', option.css);
            }
            return item;
        };
    },
    //创建菜单
    //即每个控件右边的小按钮
    //将在initData中调用
    createMenu: function (control) {
        this.menuItems = {};
        this.menuContent.empty();
        var self = this;



        ////添加至收藏夹的按钮
        ////window.isSinglePage属性位于Views/Home/Page.cshtml页面中
        ////该属性为辨认本页面是否为单独页面以展示
        ////如果是单独页面展示,并且系统选项中配置了隐藏
        ////便不需要"添加至收藏夹"按钮
        //if (typeof (window.isSinglePage) == 'undefined' && oap.systemOptions.config.controlMenu.addCollectionDisplay == 1) {
        //    this.config.createTopMenu.call(this, {
        //        name: 'appendToCollection',
        //        title: '收藏并分享到邮件或微信',
        //        css: 'content-control-plus',
        //        handler: function () {
        //            //此处为将控件添加至收藏夹代码
        //            if (!$(this).attr('disable')) {
        //                jmreport.currentPage.mail.chartAppendToCollection(self);
        //            }
        //        }
        //    });
        //}

        ////如果用户在跨域系统配置中设置了显示此按钮
        ////就将此按钮显示，点击时传入数据
        ////导入文件
        //if (oap.systemOptions.config.controlMenu.dataResv) {
        //    this.config.createTopMenu.call(this, {
        //        name: 'refresh',
        //        title: '导入文件',
        //        css: 'content-control-upLoaddata',
        //        handler: function () {
        //            oap.systemOptions.dataResvCallback(jmreport.currentPage.config,jmreport.currentPage.getParams(), self.config, self.data);
        //        }
        //    });
        //}

        //如果打开调试模式
        //导出文件
        this.config.createTopMenu.call(this, {
            name: 'refresh',
            title: '导出文件(.xls)',
            css: 'content-control-downLoadxls',
            handler: function () {
                self.exportData(".xls");
            }
        });
/*
        //更多操作
        var moreMenu = this.config.createTopMenu.call(this, {
            name: 'moreDir',
            title: '更多操作',
            css: 'content-control-moreDir'
        });

        //刷新控件
        this.config.createMoreMenu.call(this, moreMenu, {
            name: 'downLoadCsv',
            title: '刷新控件',
            handler: function () {
                self.getData();
            }
        });
        //导出数据csv
        this.config.createMoreMenu.call(this, moreMenu, {
            name: 'downLoadCsv',
            title: '导出数据(.csv)',
            handler: function () {
                self.exportData(".csv");
            }
        });*/
    }
}

/**
* 生成控件
*/
jmreport.reportControls.init = function () {
    /**
    * 初始化报表控件
    */
    jmreport.reportControls.controlTypes['initControl'] = function (config) {
        //建立颜色表
        this.colorArr = ['#42b2bd', '#ff9655', '#42b2bd'];
        //选取一个颜色不重复
        if (jmreport.reportControls.colorRecorder == (this.colorArr.length - 1)) { jmreport.reportControls.colorRecorder = -1; }
        jmreport.reportControls.colorRecorder++;

        if (config.config.controlconfig) {
            if (typeof config.config.controlconfig == 'string') {
                try {
                    config.config.controlconfig = JSON.parse(config.config.controlconfig);
                }
                catch (e) {
                    message.error("控件配置参数出错。" + e.message);
                }
            }
        }
        else {
            config.config.controlconfig = config.config.controlconfig || {};
        }

        //开始配置报表
        this.config = config;
        this.container = $('<div class="single-chart-content" ></div>').attr('data-type', config.ControlName).css('border-top', '3px solid ' + this.colorArr[jmreport.reportControls.colorRecorder]);

        var that = this;
        //创造菜单栏
        this.menu = $('<div class="content-control-menu"></div>').appendTo(this.container);
        //创建菜单项目
        this.menuContent = $('<ul class="content-control-menuContent"></ul>').appendTo(this.menu);
        //创建标题
        this.title = $('<span class="content-control-title"></span>').appendTo(this.menu);
        this.title.html(config.config.displayname);
        //创建控件的容器
        this.control = $('<div></div>').appendTo($('<div class="content-control-item"></div>').appendTo(this.container));

        if (this.config.config.controlconfig.height == 'auto') {
            this.config.config.controlconfig.height = 350;
        }
        if (this.config.config.controlconfig.height > 0) {
            this.control.height(this.config.config.controlconfig.height);
        }
        //宽度设置被注销于2014年2月21日
        //by v_liliao
        //        if (this.config.config.width > 0) {
        //            this.control.width(this.config.config.width);
        //        }

        //滚条控制器
        this.scrollController = function () { };
        //滚动开始控制器
        this.startScrollController = function () { };
        //滚动停止控制器
        this.stopScrollController = function () { };
        //尺寸控制器
        this.resizeController = function () { };

        /*
        *表格的高级/普通配置的属性设置
        */
        if (typeof (config.config.controlconfig.advanceconfig) != "undefined" && $.trim(config.config.controlconfig.advanceconfig) != '') {
            this.advanceConfig = JSON.parse(config.config.controlconfig.advanceconfig);
            //如果是表格控件
            //就将器分页属性调往低级配置中
            //因为getdata方法中的分页属性用的是低级配置中的
            if (config.config.controlname == "GridViewData") {
                if (typeof (this.advanceConfig.PagingColumns) != 'undefined' && Number(this.advanceConfig.PagingColumns) != 0) {
                    config.pagesize = this.advanceConfig.PagingColumns;
                }
            }
        } else {
            if (config.config.controlname == "GridViewData") {
                config.pagesize = config.config.controlconfig.pageSize;
                if (typeof (config.pagesize) == "undefined") {
                    config.pagesize = 0;
                }
            }
        }

        /**
        * 生成菜单
        */
        this.createMenu = function () {
            //生成菜单
            jmreport.reportControls.createMenu.call(this);
        };

        /**
        * 生成控件标题
        */
        this.createTitle = function () {
            var title = config.config.title || config.config.displayname;
            if (title && this.params) {
                for (var i = 0; i < this.params.length; i++) {
                    var p = this.params[i];
                    title = title.replace(p.Key || p.ColumnName, p.Value);
                }
            }
            this.title.html(title);
        }

        /**
        * 添加到父容器中
        */
        this.appendTo = function (container) {
            this.container.appendTo(container);
        }

        /**
        * 获取当前控件的html 
        */
        this.getHtml = function () {
            return this.control.html();
        }

        /**
        * 显示加载中动画
        */
        this.startLoading = function () {
            if ($(this).find('.jmreport-loading').length == 0) {
                var modal = $('<div class="jmreport-loading-modal"></div>').appendTo(this.control);
                $('<div class="jmreport-loading"></div>').appendTo(this.control);
            }
        }

        //当控件完成渲染时会调用此方法
        if (this.config.config.controlLoadCompletedCallBack) {
            this.drawCompleteCallBack = this.config.config.controlLoadCompletedCallBack;
        } else {
            this.drawCompleteCallBack = function () { };
        }

        /**
        * 数据错误处理器
        */
        this.dataErrorController = {
            //如果数据为空
            //这里主要截获程序错误
            isDataNull: function (data, ex) {
                if (!data || data == null) {
                    that.log(ex || '获取数据出错');
                    this.onErrorSystemAction();
                    return true;
                }
                else {
                    return false;
                }
            }
        ,
            //如果tables或者rows为零
            //这里主要截获未查出的数据
            DataLength: function (data) {
                //判断是否有表
                if (!data || data.length == 0) {
                    that.log("暂无数据哦，亲！");
                    this.onErrorSystemAction();
                    return true;
                }
                //判断是否有行
                else if (!data[0].data || data[0].data.length == 0) {
                    that.log("暂无数据哦，亲！");
                    this.onErrorSystemAction();
                    return true;
                }
                return false;
            }
        ,
            //这里主要截获sql的执行错误
            //错误信息为后端程序返回
            isDataHasError: function (data) {
                if (!data.msg) {
                    return false;
                } else {
                    that.log("不好意思，数据出错啦。" + data.msg);
                    this.onErrorSystemAction();
                    return true;
                }
            }
        ,
            onErrorSystemAction: function () {
                that.drawCompleteCallBack();
                that.isDataError = true;
            }
        }

        /**
        * 向服务端请求页面数据
        */
        this.getPageData = function (totleRowCount, pageSize, pageIndex) {
            this.startLoading();

            var opt = {};
            opt.sqlid = this.config.config['controlsqlid'];
            opt.dbid = this.config.config['dbdatasourceid'];
            opt.logic = this.config.config['logicname'];
            opt.logicParams = this.config.config['logicpara'];
            opt.bindname = this.config.config['bindingsourcename'];
            //不要限制最大行数
            opt.MaxCount = 2000;
            //获得数据范围
            var dataScope = this.computDataScope(pageIndex, pageSize, totleRowCount);
            //开始的下标
            opt.RowsForm = dataScope.rowsForm;
            //结束的下标
            opt.PageSize = pageSize;
            //frameworkid为0表示为框架页
            opt.isFramework = this.report.page.config.isframework;
            //获取查询参数
            opt.params = this.params = this.report.page.getParams();
            var self = this;


            //总行数
            //this.params.push({ ColumnName: ":TotleRowCount", Value: totleRowCount });
            //每页大小
            //this.params.push({ ColumnName: ":PageSize", Value: pageSize });
            //当前第几页
            //this.params.push({ ColumnName: ":PageIndex", Value: pageIndex });

            //回调函数
            var callback = function (self, pageIndex) {
                this.func = function (data, ex) {
                    //判断数据是否为空
                    if (self.dataErrorController.isDataNull(data, ex)) { return; }

                    if (typeof data == 'string') {
                        data = JSON.parse(data);
                    }
                    //如果是同环比的数据，就不应该使用数据库级分页
                    //因为如果是同环比的数据，它返回的行数比要请求的行数大
                    //故作需将之前设置的数据库级级分页设置回来
                    if (data.Tables[0].Rows.length > pageSize) {
                        self.config.config["isServerPager"] = false;
                        pageIndex = undefined;
                    }

                    //判断行列倒置
                    //判断，如果在
                    //第一页就让查出数据比目标数据短,
                    //而页的总大小又确实比每页大小大
                    //那就是行列倒置
                    if (pageIndex == 1 && data.Tables[0].Rows.length < pageSize && Number(self.config.config["RowCount"]) > Number(pageSize)) {
                        self.config.config["isServerPager"] = false;
                        pageIndex = undefined;
                        self.config.setControlPara('pagesize', '0');
                    }

                    //initData方法需要保证:
                    //在有一定sql的错误上也能执行的效果.
                    //因其中构建了控件菜单，
                    //并对该控件的this.data进行了赋值.
                    //若在data中确实存在sql错误，
                    //将会在下一句代码中执行处理并中断此数据显示逻辑.
                    data = self.initData(data);

                    //判断数据是否有错误
                    if (self.dataErrorController.isDataHasError(data)) { return; }

                    //判断是否有表或者是否有行
                    if (self.dataErrorController.DataLength(data)) { return; }

                    if (self.bind) {
                        self.bind(data, pageIndex)
                    }
                    if (self.report.page.controlBindComplete) {
                        self.report.page.controlBindComplete.call(self);
                    }
                }
            }
            //拉取完总行数，拉取数据
            //前三个参数为：总行数，每页大小，当前页标
            jmreport.proxy.reportData.getPageData(opt, new callback(this, pageIndex).func);
        }

        /**
        * 计算页范围
        */
        this.computDataScope = function (pageIndex, pageSize, totleRowCount) {
            var start = pageIndex * pageSize - pageSize;
            var end = pageIndex * pageSize;
            if (end <= 0 || end > totleRowCount) { end = totleRowCount; }
            return { rowsForm: start, rowsTo: end };
        }

        /**
        * 向服务端请求数据
        */
        this.getData = function (isLoadingLayer) {
            if (!isLoadingLayer) {
                this.startLoading();
            }
            //sqlid,dbid,logic,logicParams,params,bindname,framework,callback
            var opt = {};
            opt.id = this.config.config.id;
            opt.dbid = this.config.config['datasourceid'];
            opt.appId = jmreport.app.id;
            opt.serverLabel = this.config.config['dataserverlabel'];
            //frameworkid为0表示为框架页
            opt.isFramework = this.report.page.config.isFramework;
            //获取查询参数
            this.params = opt.condition = this.condition = this.report.page.getParams();

            var logic = this.config.getControlParam('logic');
            if (logic) {
                opt.logic = logic;
            }

            var self = this;

            //就直接调用接口，全部查询出来
            jmreport.proxy.reportData.getData(opt, function (data, ex) {
                //判断数据是否为空
                if (self.dataErrorController.isDataNull(data, ex)) { return; }

                if (typeof data == 'string') {
                    data = JSON.parse(data);
                }

                //initData方法需要保证:
                //在有一定sql的错误上也能执行的效果.
                //因其中构建了控件菜单，
                //并对该控件的this.data进行了赋值.
                //若在data中确实存在sql错误，
                //将会在下一句代码中执行处理并中断此数据显示逻辑.
                data = self.initData(data);

                //判断数据是否有错误
                if (self.dataErrorController.isDataHasError(data)) { return; }

                //判断是否有表或者是否有行
                //即判断数据确实为空的情况
                if (self.dataErrorController.DataLength(data)) { return; }

                if (self.bind) {
                    self.bind(data)
                }
                if (self.report.page.controlBindComplete) {
                    self.report.page.controlBindComplete.call(self);
                }
            });
        }

        /**
        * 请求导出数据
        */
        this.exportData = function (exportDataType) {
            var opt = {};
            opt.id = this.config.config.id;
            opt.dbid = this.config.config['datasourceid'];
            opt.appId = jmreport.app.id;
            opt.serverLabel = this.config.config['dataserverlabel'];
            //frameworkid为0表示为框架页
            opt.isFramework = this.report.page.config.isframework;
            //获取查询参数
            opt.condition = this.condition = this.report.page.getParams();

            var logic = this.config.getControlParam('logic');
            if (logic) {
                opt.logic = logic;
            }
            //var self = this;
            var title = this.title.html();
            jmreport.proxy.reportData.exportData(exportDataType, title, opt);
        }

        /*
        *请求在线处理数据
        */
        this.onlineEdit = function () {
            //准备基本参数
            var opt = {};
            opt.sqlid = this.config.config['controlsqlid'];
            opt.dbid = this.config.config['dbdatasourceid'];
            opt.logic = this.config.config['logicname'];
            opt.logicParams = this.config.config['logicpara'];
            opt.bindname = this.config.config['bindingsourcename'];
            //frameworkid为0表示为框架页
            opt.framework = this.report.page.config.framworkid == '0';
            //获取查询参数
            opt.params = this.params = this.report.page.getParams();
            opt.filter = this.filter = this.report.page.getFilterParams();

            //提交请求，去往在线编辑页面
            jmreport.proxy.reportData.onlineEdit(opt);
        }

        /**
        * 绑定数据
        */
        this.initData = function (data) {
            //清空控件
            this.control.html('');

            //初始化设置数据
            if (data.length > 0) {                
                for (var i = 0; i < data.length; i++) {
                    var dt = data[i];
                    //通过逻辑类初始化数据
                    if(this.config.config.controlconfig && this.config.config.controlconfig.logic) {
                        dt = jmreport.logic.run(this.config.config.controlconfig.logic, dt);
                    }
                    //绑定一个获取列的函数，方便后面调用
                    dt.getColumn = function (name) {
                        for (var j = 0; j < this.fields.length; j++) {
                            var c = this.fields[j];
                            if (c.name == name) {
                                return c;
                            }
                        }
                        return null;
                    };
                    //通过名称获取列映射信息
                    dt.getColumnMapping = function (name) {
                        if (this.mappings) {
                            for (var j = 0; j < this.mappings.length; j++) {
                                var mapping = this.mappings[j];
                                if (name == mapping.name) {
                                    return mapping;
                                }
                            }
                        }
                        return null;
                    }; 
                    var fields = dt.fields;
                    //dt.fields = [];
                    for(var k=0;k<fields.length;k++) {
                        var f = fields[k];
                        f.displayname = f.name;
                        var m=dt.getColumnMapping(f.name);
                        if(m) {
                           f.displayname = m.displayname || f.name;
                           if(m.datatype && m.datatype != 'null') f.datatype = m.datatype; 
                        }
                    }                       
                }                
            }

            this.data = data;
            //重置控件标题
            this.createTitle();
            //创建菜单子项目
            this.createMenu();

            //有错误就不进行定时刷新
            if (!data.msg) {
                //设置定时器，定时刷新
                var interval = this.config.getControlParam('interval');
                if (interval && interval != 0) {
                    //this.dataTimeOuter.init(this, interval);
                }
            }

            return data;
        }

        /*
        *计时获取数据类
        */
        this.dataTimeOuter = {
            dataTimeout: null,
            init: function (self,interval) {
                //设置定时获取数据
                if (this.dataTimeout) {
                    clearTimeout(this.dataTimeout);
                    this.dataTimeout = null;
                }
                var time = Number(interval || self.config.getControlParam('interval')) * 1000;
                this.dataTimeout = setTimeout(function () {
                    self.getData(true);
                }, time);
            }
        }

        //数据处理器
        this.dataHandler = {
            //通过传入dataTable获取Discription
            getColumnDiscription: function (dataTable) {
                //创建返回容器
                var resultArr = [];
                //循环在Table.Columns里检查每列
                for (var i = 0; i < dataTable.fields.length; i++) {
                    //如果有列说明就是要返回的数据
                    if (dataTable.fields[i].description) {
                        var discriptionModal = { name: '', discription: '' };
                        discriptionModal.name = dataTable.fields[i].displayname;
                        discriptionModal.discription = dataTable.fields[i].description;
                        //压入resultArr栈
                        resultArr.push(discriptionModal);
                    }
                }
                //返回resultArr
                return resultArr;
            }
        }

        /**
        * 显示异常信息
        */
        this.error = function (err) {
            this.control.html(err);
        }

        /**
        * 显示异常信息
        */
        this.log = function (log) {
            //构造log
            this.control.html("<p class='log' >" + log + "</p>");
        }

        /**
        * 判断类型名称是否为数值类型
        * 主要用于数据列的判断
        */
        this.typeNameIsNumber = function (name) {
            if (!name) return false;
            name = name.toLowerCase();
            return name.indexOf('double') != -1
					|| name.indexOf('float') != -1
					|| name.indexOf('int') != -1
					|| name.indexOf('int16') != -1
					|| name.indexOf('int32') != -1
					|| name.indexOf('int64') != -1
					|| name.indexOf('decimal') != -1
                    || name.indexOf('single') != -1;
        }

        /**
        *左键菜单的json类
        */
        this.clickMenu = {
            //创建左键菜单 接收highcharts的event对象 和 控件的this对象
            create: function (e, thisObj, ps) {
                //如果eprChart_Context存在，就将之前生成的左键菜单移除。
                if ($(".eprChart_Context")) { $(".eprChart_Context").remove(); }
                //向body中加入左键菜单
                var menu = $('<ul class="eprChart_Context" id="eprChart_Context_' + thisObj.controlId + '"" ></ul>').appendTo('body');

                for (var i = 0; i < ps.length; i++) {
                    var p = ps[i];
                    var ms = p.split('|');
                    //如果至少指定了三个，则第三个表示关联的列名，只有点到当前列才显示
                    if (ms.length > 2 && ms[2] != e.field) {
                        continue;
                    }
                    var link = $('<a></a>').appendTo($('<li></li>').appendTo(menu));
                    //记录当前日期和绑定的字段
                    link.attr('data-date', e.date);
                    link.attr('data-field', e.field);

                    if (ms.length >= 2) {
                        link.html(ms[0]);
                        link.attr('href', ms[1]);
                    }
                    else {
                        link.html(ms[0]);
                        link.attr('href', ms[0]);
                    }
                    //弹出页面
                    link.click(function () {
                        var page = $(this).attr('href');
                        var title = $(this).html();
                        var pars = {};
                        pars.date = $(this).attr('data-date');
                        pars.field = $(this).attr('data-field');
                        jmreport.currentPage.openPopPage(page, title, pars);
                        $(".eprChart_Context").remove();
                        return false;
                    });
                }


                //给左键菜单定位
                var conMen = $("#eprChart_Context_" + thisObj.controlId);
                //var sh = $('body').scrollTop();
                conMen.css('left', e.x)
                    .css('top', e.y + $(document).scrollTop())
                    .css('display', 'none').fadeIn(100, function () {
                        var unbindClick = function () {
                            if ($(".eprChart_Context")) {
                                $(".eprChart_Context").stop().fadeOut(100, function () {
                                    $(".eprChart_Context").remove();
                                    //移除左键菜单之后，将绑定在document之上的单击事件也解除
                                    $(document).unbind("click", unbindClick);
                                });
                            }
                        }
                        //当document捕获到单击事件的时候就将左键菜单从dom中彻底移除
                        $(document).click(unbindClick);
                    });
            }
        }

        /**
        *连接处理器
        */
        this.linkHandler = function (link, row) {
            var paras = this.report.page.getParams();
            //如果需要替换连接中本行某列的值
            if (row) {
                for (var i in row) {
                    var name = ":" + row[i].ColumnName;
                    if (link.indexOf(name) != -1) {
                        var tempreg = new RegExp(name, "g");
                        link = link.replace(tempreg, row[i].Value)
                    }
                }
            }
            for (var i in paras) {
                if (new RegExp('^\:').test(paras[i].ColumnName)) {
                    if (link.indexOf(paras[i].ColumnName) != -1) {
                        var tempreg = new RegExp(paras[i].ColumnName, "g");
                        link = link.replace(tempreg, paras[i].Value)
                    }
                } else {
                    var name = ":" + paras[i].ColumnName;
                    if (link.indexOf(name) != -1) {
                        var tempreg = new RegExp(name, "g");
                        link = link.replace(tempreg, paras[i].Value)
                    }
                }
            }
            return link;
        }

        /*
        *列说明分析器
        */
        this.descriptionReader = function (description, nameCall, linkCall) {
            if (new RegExp('[|]{1,1}', 'g').test(description)) {
                var params = description.split('|');
                //定义变量
                var name = '', link = null, paramMapping = null, toolbarMapping = null;
                for (var b = 1; b < params.length; b++) {
                    //如果是多列绑定的页面名称
                    if (params[b].indexOf("linkPageName") != -1) {
                        name = params[b].replace('linkPageName=', '');
                        if (nameCall) {
                            nameCall(name);
                        }
                    }
                }
                for (var b = 1; b < params.length; b++) {
                    //如果是多列绑定的列参数映射
                    if (params[b].indexOf("linkPagePara") != -1) {
                        paramMapping = params[b].replace('linkPagePara=', '');
                    }
                }
                for (var b = 1; b < params.length; b++) {
                    //如果是toolbar的参数映射
                    if (params[b].indexOf("linkToolBarPara") != -1) {
                        toolbarMapping = params[b].replace('linkToolBarPara=', '');
                    }
                }
                for (var b = 1; b < params.length; b++) {
                    //如果是多列绑定
                    if (params[b].indexOf("linkPageId") != -1) {
                        link = params[b].replace('linkPageId=', '')
                        if (linkCall) {
                            linkCall(link, name, paramMapping, toolbarMapping);
                        }
                    }
                }
            }
        }

        /*
        *透视图参数映射和解析器
        *传入数据行和参数列映射列
        *返回一个组装好的条件
        */
        this.poppageParaCreator = function (items, paramMapping, toolbarMapping) {
            var isSendToolBar = true;
            var par = '[';

            // 如果：
            // 列映射和toolbar映射同时存在：一切按映射来
            // 列映射存在，toolbar映射不存在：映射列，并且不传递任何toolbar参数
            // 列映射不存在，toolbar映射存在:映射toolbar参数，传递整行参数
            // 都不存在：传递所有toolbar参数和行参数

            // toolbar映射格式
            //             被映射页的参数：当前页的toolbar参数
            // linkToolBarPara=value2:value1
            if (toolbarMapping) {
                var pars = jmreport.currentPage.getParams();
                if (pars && pars.length > 0) {
                    for (var i = 0; i < pars.length; i++) {
                        var isMappted = false;
                        for (var p = 0; p < toolbarMapping.split(',').length; p++) {
                            if ($.trim(toolbarMapping.split(',')[p].split(':')[0]) == $.trim(pars[i].ColumnName.replace(':',''))) {
                                var columnName = toolbarMapping.split(',')[p].split(':')[1];
                                if (isMappted || par != "[") { par += ','; }
                                par += '{"name":"' + columnName + '","value":"' + pars[i].Value + '"}';
                                var isMappted = true;
                                isSendToolBar = false;
                            }
                        }
                    }
                }
            }

            //如果有映射,开始配置映射
            /*
            *配置规则：
            *1.如果用户配置了列映射，就只传递映射的列和值到透视页面去，并且包括列映射中用户配置好的默认值。
            *2.如果用户配置了列映射，toolbar参数就不传递了。
            *3.如果用户不配置列映射，传递所有列到透视页中去，并且传递所有toolbar参数。
            */
            if (paramMapping) {
                //1.先匹配里面的列
                for (var i = 0; i < items.length; i++) {

                    var columnName = items[i].ColumnName;
                    var isMappted = false;
                    for (var p = 0; p < paramMapping.split(',').length; p++) {
                        if ($.trim(paramMapping.split(',')[p].split(':')[0]) == $.trim(items[i].ColumnName)) {
                            columnName = paramMapping.split(',')[p].split(':')[1];
                            if (isMappted || par != "[") { par += ','; }
                            par += '{"name":"' + columnName + '","value":"' + items[i].Value + '"}';
                            var isMappted = true;
                        }
                    }
                }
                //2.再匹配里面的常量
                for (var p = 0; p < paramMapping.split(',').length; p++) {
                    var mappingColumnName = paramMapping.split(',')[p].split(':')[0];
                    var isMappted = false;
                    for (var i = 0; i < items.length; i++) {
                        var columnName = items[i].ColumnName;
                        if ($.trim(mappingColumnName) == $.trim(columnName)) {
                            var isMappted = true;
                        }
                    }
                    if (!isMappted) {
                        if (par != "[") {
                            par += ',';
                        }
                        par += '{"name":"' + mappingColumnName + '","value":"' + paramMapping.split(',')[p].split(':')[1] + '"}';
                    }
                }
                isSendToolBar = false;
            } else {
                for (var i = 0; i < items.length; i++) {
                    //如果没有映射，列上的所有参数全部传递。
                    if (i != 0) {
                        par += ',';
                    }
                    par += '{"name":"' + columnName + '","value":"' + items[i].Value + '"}';
                }
            }
            par += ']';
            return { par: par, isSendToolBar: isSendToolBar };
        }

    } //--end initControl
    jmreport.reportControls.register('base', jmreport.reportControls.controlTypes.initControl);
};
//初始化工具栏控件
jmreport.reportControls.init();

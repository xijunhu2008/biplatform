/**
* epr专用脚本
*/
epr = {
    /**
    * 当前用户帐号
    */
    account: 'fefeding',
    /**
    * 当前语言环境：例如 zh-CN,en-US
    */
    lan: 'zh-CN',
    //业务信息缓存
    apps: {},

    /**
    * 缓存
    */
    cache: {},
    /**
    * 是否启用服务器级分页 true:试用，false:不使用
    */
    isServerPager:false,
    /**
    * 当前业务信息
    */
    app: {
        'ProductionId': '',
        'ProductionCode': '',
        //页面信息缓存
        pages: {}
    },
    /** 
    * 加载业务信息
    */
    loadApp: function (id, callback) {
        if (this.apps[id]) {
            this.app = this.apps[id];
        }
        if (this.app && id == this.app.ProductionId && this.app.ProductionCode) {
            callback(this.app);
            return;
        }
        jmreport.proxy.production.get(id, function (app, err) {
            if (app) {
                if (typeof app == 'string') {
                    app = JSON.parse(app);
                }
                app.ProductionId = app.ID || app.appId;
                jmreport.apps[app.ProductionId] = app;
                jmreport.app = app;
                app.pages = {};
                if (callback) callback();
            }
        });
    }
}

/**
* 报表页面实例
* 解析和展示页面
*/
jmreport.page = function (pageid, opt) {
    opt = opt || {};
    //页面绑定到的容器
    this.contentContainer = opt.content || $('#jmreport-page-content');
    this.toolbarContainer = opt.toolbar || $('#jmreport-page-toolbar');
    this.titleContainer = opt.title || $('#jmreport-page-title');
    this.noticeContainer = $('#jmreport-page-notice');
    this.completeCallback = opt.completeCallback || function () { };

    if (!jmreport.currentPage) {
        $(window).bind('resize', function () {
            jmreport.currentPage.rebind();
        });
    }
    var self = this;
    //页面id
    this.pageId = pageid;
    //获取初始化参数
    this.params = getUrlParams();
    //加载页面
    this.load = function () {
        if (!jmreport.app.pages) jmreport.app.pages = {};
        //如果当前页面信息已存在则，直接处理
        if (jmreport.app.pages[this.pageId]) {
            this.initPage(jmreport.app.pages[this.pageId]);
            this.completeCallback();
            return;
        }
        var self = this;
        //var waiting = message.showWaiting('页面加载中...');
        //获取页面配置
        jmreport.proxy.page.getById(this.pageId, function (p, ex) {
            //waiting.close();
            if (p) {
                //缓存当前页面
                jmreport.app.pages[self.pageId] = p;
                self.initPage(p, self.completeCallback);
            }
            else {
                message.error(ex || '加载页面失败');
            }
            self.completeCallback();
        });
    };

    /*
    *创建页面头部的标题
    */
    this.createPageTitle = function (page) {
        var self = this;
        this.titleContainer.empty();

        this.pageRefresh = $('<ul class="jmreport-pageMenu" ><li class="jmreport-pageMenu-icon refresh" ></li><li class="jmreport-pageMenu-content" >页面刷新</li></ul>')
        var createTitle = function () {
            var titleStr = top.$('#selpro').find('span').html() || '';
            var parentMenuArr = top.$('a.menu.menu-current');

            //产生页面标题
            for (var i = 0; i < parentMenuArr.length; i++) {
                titleStr += (titleStr ? '>' : '') + $.trim($(parentMenuArr[i]).text());
            }
            titleStr += (titleStr ? '>' : '') + page.PageName;
            self.pageRefresh.appendTo(self.titleContainer);
            $('<div class="jmreport-pageTitle" >' + titleStr + '</div>').appendTo(self.titleContainer);
        }
        setTimeout(createTitle, 1000);
    }

    /*
    *公告处理器
    */
    this.notice = {
        noticeInterval: null,
        contents: [],
        buttons: [],
        intervalIndex: 0,
        intervalDelay: 5000,
        init: function (data) {
            if (this.noticeInterval) {
                clearInterval(this.noticeInterval);
            }
            //创建数据容器
            this.contents = [];
            this.buttons = [];
            for (var i = 0; i < data.length; i++) {
                var tempPoint = "";
                if (i == 0) {
                    tempPoint = 'class="alt-point"';
                }
                this.contents.push($("<li content-index='" + i + "' ><a target='_blank' href=" + data[i].Url + " >" + data[i].Title + "</a></li>"));
                this.buttons.push($('<li ' + tempPoint + ' button-index="' + i + '"  ></li>'));
            }

            //将内容放置到页面上去
            this.appendItems();

            //设置定时切换跑马灯
            this.runNotice();

            //给跑马灯绑定事件
            this.bindEvents();
        },
        appendItems: function () {
            //获取控件容器
            var noticeContent = $(self.noticeContainer).find('.notice-right-content');
            var buttonContent = $(self.noticeContainer).find('.little-point');
            noticeContent.empty();
            buttonContent.empty();
            // 循环将内容放置入页面之中
            for (var i = 0; i < this.contents.length; i++) {
                this.contents[i].appendTo(noticeContent);
                this.buttons[i].appendTo(buttonContent);
            }
        },
        runNotice: function () {
            var self = this;
            var tempRun = function () {
                self.runFunction.call(self);
            }
            this.noticeInterval = setInterval(tempRun, this.intervalDelay);
        },
        runFunction: function () {
            if (this.intervalIndex > this.contents.length - 1) {
                this.intervalIndex = 0;
            }
            var noticeContent = $(self.noticeContainer).find('.notice-right-content');

            noticeContent.animate({ "top": 0 - this.intervalIndex * 40 }, 500);

            for (i in this.buttons) {
                this.buttons[i].removeAttr('class');
            }
            this.buttons[this.intervalIndex].attr('class', 'alt-point');

            this.intervalIndex++;
        },
        bindEvents: function () {
            var that = this;
            //内容
            for (var i in this.contents) {
                //鼠标放在内容上时
                this.contents[i].mouseover(function () { clearInterval(that.noticeInterval); });
                //鼠标移出内容上时
                this.contents[i].mouseout(function () { that.runNotice(); });
            }

            //小图标
            for (i in this.buttons) {

                //鼠标移动上小图标
                this.buttons[i].mouseover(function () {
                    clearInterval(that.noticeInterval);
                    for (i in that.buttons) {
                        that.buttons[i].removeAttr('class');
                    }
                    $(this).attr('class', 'alt-point');

                    var noticeContent = $(self.noticeContainer).find('.notice-right-content');
                    noticeContent.stop();
                    noticeContent.animate({ "top": 0 - Number($(this).attr('button-index')) * 40 }, 500);
                });

                //鼠标离开小图标
                this.buttons[i].mouseout(function () {
                    that.runNotice();
                });
            }
        }
    }

    /**
    * 初始化页面信息
    */
    this.initPage = function (page, completeCallback) {
        this.config = page; //获取到页面配置信息
        this.createPageTitle(page);

        var self = this;

        //获取公告
        jmreport.proxy.reportData.getNoticeData(function (data) {
            self.notice.init(data);
        });


        //绑定页面刷新按钮
        this.pageRefresh.click(function () {
            self.getData();
        });

        this.reports = [];
        var eprTabsContent;
        this.contentContainer.html('');

        //给每一个页面上的控件里添加一个加载完成事件
        var createControlCompleteCallBack = function (configArr, callback) {
            for (var i = 0; i < configArr.Controls.length; i++) {
                configArr.Controls[i]['controlLoadCompletedCallBack'] = callback;
            }
            return configArr;
        }

        if (page.Reports && page.Reports.length > 0) {
            var container = this.contentContainer;
            var len = page.Reports.length;
            if (len > 1) {
                eprTabsContent = $('<div class="jmreport-tabs-content" ></div>').appendTo(this.contentContainer);
                container = $('<ul></ul>').appendTo(eprTabsContent);
            }
            for (var i = 0; i < len; i++) {
                var reportContainer = container;
                var r = page.Reports[i];
                //如果指定了过滤报表，且返回false,则不生成些报表，主要用于邮件截图时指定的单一控件显示
                if (typeof this.selectReportHandler == 'function' && this.selectReportHandler(r) == false) {
                    continue;
                }
                var id = 'reports-' + i;
                //如果有多个则按tab显示
                if (len > 1) {
                    $('<li><a href="#' + id + '" data-tag-item = "data-tag-item" data-index="' + i + '">' + r.TabName + '</a></li>').appendTo(container);
                    reportContainer = $('<div id="' + id + '" class="jmreport-content-tabitem"></div>').appendTo(eprTabsContent);
                }
                //给每一个页面上的控件里添加一个加载完成事件
                r = createControlCompleteCallBack(r, completeCallback);
                var report = new this.report(reportContainer, r);
                report.index = i;
                report.page = this;
                this.reports.push(report);
                report.render(); //展示
                if (!this.currentReport) this.currentReport = report;
            }
            if (len > 1) {
                eprTabsContent.tabs({
                    //每一个选项卡上绑定一个单击事件，每单击一下就运行一下window.resize
                    activate: function (event, ui, a) {
                        var index = $(ui.newTab.context).attr('data-index');
                        var report = jmreport.currentPage.reports[index];
                        if (report) {
                            jmreport.currentPage.currentReport = report;
                            report.rebind();
                        }
                    }
                });
            }
        }



        this.toolbar = new this.toolbar(this.toolbarContainer, page.Toolbar);
        this.toolbar.page = this;
        //当工具栏完成绑定后，拉取数据
        this.toolbar.completeCallback = function () {
            if (this.page.config.Toolbar && this.page.config.Toolbar.IsDefaultSearch) {
                this.page.getData(); //拉取数据
            }
        };
        this.toolbar.render();
        //如果需要展示后的回调，则执行
        if (this.renderCallback) {
            this.renderCallback();
        }
    };

    /**
    * 生成查询参数
    */
    this.getParams = function () {
        return this.toolbar.getParams();
    };
    /**
     * 获取过滤参数
     */
    this.getFilterParams = function () {
        return this.toolbar.getFilterParams();
    };
    /**
    * 拉取数据
    */
    this.getData = function () {
        if (this.reports) {
            for (var i = 0; i < this.reports.length; i++) {
                this.reports[i].getData();
            }
        }

    };

    /**
    * 重新绑定控件数据
    */
    this.rebind = function () {
        if (this.currentReport) {
            this.currentReport.rebind();
            /*for (var i = 0; i < this.reports.length; i++) {
            this.reports[i].rebind();
            }*/
        }
    }

    /**
    * 打开弹窗页面
    */
    this.openPopPage = function (page, title, pars, titlePar) {
        page = $.trim(page.toLowerCase());
        //如果有绑定打开页面委托，则直接调用委托
        //而且委托返回false的话，不再调用后面的打开页面处理，否则查用后面的打开页面

        if (this.openPageHandler) {
            var r = this.openPageHandler.call(this, page, title, pars);
            if (r === false) {
                return;
            }
        }
        if (page.indexOf('http://') == 0 || page.indexOf('https://') == 0) {
            window.open(page);
        }
        else {
            /**
            * 弹窗页面
            */
            if (!this.popPage) {
                this.popPage = $('<div class="jmreport-poppage"></div>');
                this.popPage.css('overflow', "hidden");
                $('<iframe></iframe>').appendTo(this.popPage);
                this.popPage.appendTo('body');
                this.popPage.dialog({
                    autoOpen: false,
                    modal: true,
                    width: '80%',
                    height: ($(window).height() / 10) * 9
                });
            }
            //poppageUrl变量在Views/Home/Index.cshtml 页面中被绑定
            var url = top.poppageUrl + '?app=' + jmreport.app.ID + '&page=' + page;
            //组合现有参数
            var pars = this.getParams();
            if (pars && pars.length > 0) {
                for (var i = 0; i < pars.length; i++) {
                    url += '&' + pars[i].ColumnName + '=' + encodeURIComponent(pars[i].Value);
                }
            }
            if (titlePar) {
                url += '&pagePar=' + titlePar;
            }
            this.popPage.find('iframe').attr('src', url);

            this.popPage.dialog({
                height: ($(window).height() / 10) * 9,
                title: title,
                closeOnEscape: true
            });
            this.popPage.dialog('open');
            $(".ui-widget-overlay").bind("click", function () {
                $(".ui-dialog-titlebar-close").click();
            });
            //修复窗口随浏览器滚动等问题
            $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-draggable.ui-resizable').css('position', 'fixed').css('top','5%');
        }
    };
    /**
    * 打开弹窗页面
    */
    this.closePopPage = function () {
        if (this.popPage) {
            this.popPage.hide();
        }
    };

    /**
    * 工具栏
    * 生成工具栏参数控件
    */
    this.toolbar = function (target, config) {
        this.target = target;
        this.config = config;

        //如果不显示工具栏，则直接隐藏
        if (config.IsShowToolbar == false) {
            this.target.hide();
        }

        //当前工具栏状态
        this.state = 'initing';
        /**
        * 展示工具栏
        */
        this.childrenPageParFinder = function (c) {
            if (getUrlParams()[c.ToolbarPara]) {
                c.DefalutValue = $.trim(window.decodeURI(getUrlParams()[c.ToolbarPara]));
            }
            if (getUrlParams().pagePar) {
                var jsonPar = JSON.parse($.trim(window.decodeURI(getUrlParams().pagePar)));
                if (c.ToolbarPara == ':' + jsonPar.name) {
                    c.DefalutValue = jsonPar['value'];
                }
            }
            return c;
        }
        this.render = function () {
            this.target.html('');
            this.controls = [];
            var controlcontainer = $('<div class="controls"></div>').appendTo(this.target);
            if (this.config.Controls && this.config.Controls.length > 0) {
                this.panels = {};
                for (var i = 0; i < this.config.Controls.length; i++) {
                    var c = this.config.Controls[i];
                    c = this.childrenPageParFinder(c);
                    c.toolbar = this;
                    var seq = Math.floor(c.Seq / 10);

                    //在这里制造控件
                    var toolControl = jmreport.toolbarControls.create(c);

                    if (!toolControl) {
                        message.error('获取工具栏控件:' + c.Control.ControlName + ' 失败');
                        continue;
                    }
                    toolControl.toolbar = this;
                    this.controls.push(toolControl);

                    var container = this.panels[seq];
                    if (!container) {
                        container = $('<ul class="jmreport-controls" ></ul>').appendTo(controlcontainer);
                        this.panels[seq] = container;
                    }

                    if (c.Width >= 0) {
                        toolControl.appendTo($('<li class="jmreport-controls-item" ></li>').appendTo(container));
                    }

                    if (toolControl.state != 'completed') {
                        //绑定数据完成回调
                        toolControl.bindComplete = function () {
                            this.toolbar.complete();
                        };
                        //获取数据
                        toolControl.getData();
                    }
                }
            }
            var self = this;
            this.button = $('<li class="jmreport-controls-submit" >查询</li>')
						.appendTo(container)
						.click(function () {
						    jmreport.proxy.abort(); //中止所有请求，重新拉取数据
						    self.page.getData();
						    return false;
						});
            //调用回调，如果所有控件都无需拉取数据，则直接回调
            this.complete();
        };

        /**
        * 生成查询参数
        */
        this.getParams = function () {
            var pars = [];
            pars.push({ ColumnName: 'sys_appid', Value: jmreport.app.ProductionId });
            pars.push({ ColumnName: 'sys_appname', Value: jmreport.app.ProductionName });
            pars.push({ ColumnName: 'sys_appcode', Value: jmreport.app.ProductionCode });
            pars.push({ ColumnName: 'sys_local', Value: jmreport.lan.replace('-', '_') });
            pars.push({ ColumnName: 'sys_user', Value: jmreport.account });
            pars.push({ ColumnName: 'sys_permission', Value: jmreport.account });

            //如果页面有附带固定参数，则加入查询参数中
            if (this.page.params) {
                for (var k in this.page.params) {
                    if (k.indexOf(':') == 0) {
                        pars.push({ ColumnName: k, Value: this.page.params[k] });
                    }
                }
            }

            var controls = this.controls;
            if (controls && controls.length > 0) {
                for (var i = 0; i < controls.length; i++) {
                    var c = controls[i];
                    //获取阀值参数
                    //var shieldedValue = c.config.getControlParam('ShieldedValue');
                    var vs = c.getValues();
                    for (var j = 0; j < vs.length; j++) {
                        var v = vs[j];
                        var p = null;
                        //先查找是否有相同key的参数，有的话直接覆盖
                        for (var h = 0; h < pars.length; h++) {
                            if (pars[h].ColumnName == v.key) {
                                p = pars[h];
                                break;
                            }
                        }
                        if (p) {
                            p.Value = v.value;
                        }
                        else {
                            p = { ColumnName: v.key, Value: v.value };
                            pars.push(p);
                        }

                        //如果当前值等于阀值，则直接去除当前值
                        /*if (shieldedValue == p.Value) {
                            p.Value = '';
                        }*/
                    }
                }
            }
            return pars;
        };

        /**
         * 获取过滤参数信息
         */
        this.getFilterParams = function () {
            var ps = [];
            var controls = this.controls;
            if (controls && controls.length > 0) {
                for (var i = 0; i < controls.length; i++) {
                    var c = controls[i];
                    //获取阀值参数
                    var shieldedValue = c.config.getControlParam('ShieldedValue');
                    if (shieldedValue == undefined) continue;
                    var vs = c.getValues();
                    if (vs && vs.length > 0) {
                        for (var j = 0; j < vs.length; j++) {
                            ps.push({
                                key: vs[j].key,
                                value: shieldedValue
                            });
                        }                        
                    }
                }
            }
            return ps;
        };

        /**
        * 当前工具栏数据绑定完成回调
        */
        this.complete = function () {
            if (this.state != 'completed') {
                for (var i = 0; i < this.controls.length; i++) {
                    var c = this.controls[i];
                    if (c.state != 'completed') {
                        return false;
                    }
                }
                this.state = 'completed';
                //如果数据绑定完成，则回调
                if (this.completeCallback) {
                    this.completeCallback();
                }
            }
        }
    };

    /**
    * 报表
    * 每个页面可以有多个报表对象
    */
    this.report = function (target, config) {
        this.config = config;
        this.target = target;
        target.html('');
        this.grid = $('<table cellpadding="0" cellspacing="0" class="jmreport-template"></table>').appendTo(target);
        /**
        * 拉取数据
        */
        this.getData = function () {
            if (this.controls) {
                for (var i = 0; i < this.controls.length; i++) {
                    this.controls[i].getData();
                }
            }
        }
        /**
        * 重新绑定当前控件数据
        */
        this.rebind = function () {
            if (this.controls) {
                for (var i = 0; i < this.controls.length; i++) {
                    var c = this.controls[i];
                    if (c.bind) {
                        c.bind();
                    }
                }
            }
        }

        /**
        * 展示当前报表
        * 解析模板为html对象
        */
        this.render = function () {
            this.grid.html('');
            //如果外面外挂了展示函数，直接返回并调用
            if (this.page.renderReport) {
                this.page.renderReport.call(this);
                return;
            }
            //解析列
            var colMatches = this.config.Template.Content.match(/\<ColumnDefinition\s+[\s\S]*?\/\>/ig);
            var numberReg = /\d+/;
            var cols = [];
            //按xaml解析出列对象
            var totalWidth = 0;
            if (colMatches) {
                for (var i = 0; i < colMatches.length; i++) {
                    var colxaml = colMatches[i];
                    var widthms = numberReg.exec(colxaml);
                    var w = 'auto';
                    if (widthms) {
                        w = widthms[0];
                        totalWidth += Number(w);
                    }
                    cols.push({ width: w });
                }
            }
            else {
                cols.push({ width: 'auto' }); //默认加入一列
            }


            //解析行
            var rowMatches = this.config.Template.Content.match(/\<RowDefinition\s+[\s\S]*?\/\>/ig);
            this.rows = [];
            if (rowMatches) {
                //按xaml解析出行对象
                for (var i = 0; i < rowMatches.length; i++) {
                    var roxaml = rowMatches[i];
                    var row = $('<tr></tr>');
                    this.rows.push(row);
                    var heightms = numberReg.exec(roxaml);
                    if (heightms) {
                        row.css('height', heightms[0] + '%');
                    }
                    row.columns = [];
                    for (var j = 0; j < cols.length; j++) {
                        var td = $('<td  valign="top"></td>');

                        var w = cols[j]['width'];
                        if (totalWidth > 0 && Number(w)) {
                            w = w / totalWidth * 100;
                        }
                        td.attr('data-width', w);
                        row.columns.push(td);
                        td.appendTo(row);
                    }
                    row.appendTo(this.grid);
                }
            }

            this.renderControl(); //解析控件	
        };

        /**
        * 根据控件配置生成控件对象
        */
        this.createControl = function (controlconfig) {
            var control = jmreport.reportControls.create(controlconfig);
            if (control == null) {
                message.error('加载报表控件: ' + controlconfig.Control.ControlName + ' 失败');
                return;
            }
            if (!this.controls) this.controls = [];
            this.controls.push(control);
            control.report = this;
            return control;
        }

        /**
        * 解析当前模板中的控件，并填 充控件
        */
        this.renderControl = function () {
            //解析控件对象
            var controlsMathces = this.config.Template.Content.match(/\<Border\s+[\s\S]*?\/\>/ig);

            var numberReg = /\d+/;
            //名称获取正则
            var controlNameAttrReg = /Name\s*=\s*"[^"]*"/i;
            var controlNameReg = /"[^"]*"/i;
            //行索引获取正则
            var controlRowAttrReg = /Grid\.Row\s*=\s*"\d+"/i;
            //列索引获取正则
            var controlColmunAttrReg = /Grid\.Column\s*=\s*"\d+"/i;
            //列跨度正则
            var controlColumnSpanAttrReg = /Grid\.ColumnSpan\s*=\s*"\d+"/i;
            //行跨度正则
            var controlRowSpanAttrReg = /Grid\.RowSpan\s*=\s*"\d+"/i;


            //this.controls = [];
            if (controlsMathces) {
                for (var i = 0; i < controlsMathces.length; i++) {
                    var controlXaml = controlsMathces[i];

                    //获取名称
                    var name = '';
                    var namems = controlNameAttrReg.exec(controlXaml);
                    if (namems) {
                        namems = controlNameReg.exec(namems[0]);
                        if (namems) {
                            name = namems[0].trim('"');
                        }
                    }

                    //获取行索引
                    var rowindex = 0;
                    var rowms = controlRowAttrReg.exec(controlXaml);
                    if (rowms) {
                        rowms = numberReg.exec(rowms[0]);
                        if (rowms) {
                            rowindex = Number(rowms[0]);
                        }
                    }
                    //获取列索引
                    var colindex = 0;
                    var colms = controlColmunAttrReg.exec(controlXaml);
                    if (colms) {
                        colms = numberReg.exec(colms[0]);
                        if (colms) {
                            colindex = Number(colms[0]);
                        }
                    }
                    //获取列跨度
                    var colspan = 0;
                    var colms = controlColumnSpanAttrReg.exec(controlXaml);
                    if (colms) {
                        colms = numberReg.exec(colms[0]);
                        if (colms) {
                            colspan = Number(colms[0]);
                        }
                    }
                    //获取行跨度
                    var rowspan = 0;
                    var rowms = controlRowSpanAttrReg.exec(controlXaml);
                    if (rowms) {
                        rowms = numberReg.exec(rowms[0]);
                        if (rowms) {
                            rowspan = Number(rowms[0]);
                        }
                    }

                    var controlconfig = null;
                    for (var j = 0; j < this.config.Controls.length; j++) {
                        var c = this.config.Controls[j];
                        if (c && name == c.BindingSourceName) {
                            controlconfig = c;
                            break;
                        }
                    }
                    if (controlconfig == null) continue;
                    //生成控件
                    var control = this.createControl(controlconfig);

                    var row = rowindex < this.rows.length ? this.rows[rowindex] : null;
                    //如果索引在行列内，则加入到列，并更新行列跨度
                    if (row && colindex < row.columns.length) {
                        var col = row.columns[colindex];
                        if (rowspan) {
                            col.attr('rowspan', rowspan);
                            //如果为多个跨度，则把另外跨度的行中的对应列去除
                            if (rowspan > 1) {
                                for (var c = 1; c < rowspan; c++) {
                                    var trindex = rowindex + c;
                                    if (this.rows.length <= trindex) break;
                                    var cprow = this.rows[trindex];
                                    //被跨度的行中的列移除掉
                                    var reC = c;
                                    if (cprow) {
                                        if (colspan) {
                                            for (var c = 0; c < colspan; c++) {
                                                var tdindex = colindex + c;
                                                if (cprow.columns.length <= tdindex) break;
                                                var cpcol = cprow.columns[tdindex];
                                                //被跨度的列移除掉
                                                if (cpcol) {
                                                    cpcol.remove();
                                                }
                                            }
                                        }
                                    }
                                    c = reC;
                                }
                            }
                        }
                        if (colspan) {
                            //获取配置的宽度
                            var w = Number(col.attr('data-width')) || 0;
                            //如果为多个跨度，则把另外跨度的列宽增加到当前列
                            if (colspan > 1) {
                                for (var c = 1; c < colspan; c++) {
                                    var tdindex = colindex + c;
                                    if (row.columns.length <= tdindex) break;
                                    var cpcol = row.columns[tdindex];
                                    //被跨度的列移除掉
                                    if (cpcol) {
                                        var cw = Number(cpcol.attr('data-width'));
                                        if (cw) w += cw;
                                        cpcol.remove();
                                    }
                                }
                            }
                            col.css('width', w + '%');
                            col.attr('colspan', colspan);
                        }
                        control.appendTo(col);
                        //col.appendTo(row);
                    }
                    //插入表格
                    else {
                        control.appendTo(this.grid);
                    }
                }
            }
        }
    }
}

/**
* epr基础辅助类
*/
jmreport.helper = {};

/**
* 转为数字单位
* 亿，千万，百万，万
*/
jmreport.helper.convertUnit = function (num) {
    if (typeof num == 'string') num = Number(num);
    //亿
    if (num >= 100000000) {
        num = num / 100000000;
        num = num.toFixed(2) + '<em>亿</em>';
    }
    else if (num >= 10000000) {
        num = num / 10000000;
        num = num.toFixed(2) + '<em>千万</em>';
    }
    else if (num >= 1000000) {
        num = num / 1000000;
        num = num.toFixed(2) + '<em>百万</em>';
    }
    else if (num >= 10000) {
        num = num / 10000;
        num = num.toFixed(2) + '<em>万</em>';
    }
    return num;
}
/**
* 前端模板
*/
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
jmreport.helper.tmpl = function (str, data) {
    var cache = jmreport.cache['jmreport.template.caches'] || (jmreport.cache['jmreport.template.caches'] = {});
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        jmreport.helper.tmpl(document.getElementById(str).innerHTML) :

    // Generate a reusable function that will serve as a template
    // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

    // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

    // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn(data) : fn;
};
jmreport.lans = {
	/**
	 * 日期控件语言包
	 */
	datePicker: {
		'zh':{
				closeText: '关闭',
				prevText: '&#x3C;上月',
				nextText: '下月&#x3E;',
				currentText: '今天',
				monthNames: ['一月','二月','三月','四月','五月','六月',
				'七月','八月','九月','十月','十一月','十二月'],
				monthNamesShort: ['一月','二月','三月','四月','五月','六月',
				'七月','八月','九月','十月','十一月','十二月'],
				dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
				dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
				dayNamesMin: ['日','一','二','三','四','五','六'],
				weekHeader: '周',
				dateFormat: 'yy-mm-dd',
				firstDay: 1,
				isRTL: false,
				showMonthAfterYear: true,
				yearSuffix: '年'
			}
	}
}
/**
 * 易点报表服务代理实例
 */
jmreport.proxy = {
    requestParams: '',
    //请求缓存
    ajaxCache: [],
    /**
    * 请求后台epr代理服务程序
    */
    request: function (cmd, par, callback) {
        if (typeof par == 'function') {
            callback = par;
            par = null;
        }
        if (!par) par = {};
        if (!par.par) {
            par.par = JSON.stringify({
                'UserName': jmreport.account,
                'Localication': jmreport.lan,
                'ProductionId': jmreport.app.ProductionId || jmreport.app.appId || jmreport.app.ID,
                'ProductionType': jmreport.app.ProductionType,
                'ProductionCode': jmreport.app.ProductionCode,
                'IsFramework': jmreport.currentPage && jmreport.currentPage.config ? jmreport.currentPage.config.FramworkId == '0' : false
            });
        }
        var ajax = $.ajax({
            type: 'post',
            data: par,
            url: oap.rootUrl + 'Servers/ReportData.ashx?cmd=' + cmd + '&culture=' + (jmreport.lan || oap.lan.name) + this.requestParams,
            success: function (r) {
                if (r) {
                    //表示登录失效
                    if (r == -1) {
                        window.location.reload();
                        return;
                    }
                    try {
                        callback(r);
                    }
                    catch (e) {
                        message.error(e.message);
                        callback(null, e);
                    }
                }
                else {
                    callback(null, r);
                }
            },
            error: function (e) {
                if (e && e.statusText == "abort") {
                    if (window.console && window.console.log) window.console.log(e);
                    return;
                }
                callback(null, e);
            }
        });
        this.ajaxCache.push(ajax);
    }, //--end request
    /**
    * 中断请求，如果指定index则中断某个，否则中断全部
    */
    abort: function (index) {
        if (typeof (index) !== 'undefined') {
            var ajax = this.ajaxCache.length > index ? this.ajaxCache[index] : null;
            if (ajax) {
                if (ajax.status !== 200 && ajax.readyState !== 4) {
                    ajax.abort();
                }
            }
            this.ajaxCache.splice(index, 1);
        }
        else {
            for (var i = this.ajaxCache.length - 1; i >= 0; i--) {
                this.abort(i);
            }
        }
    },
    /**
    * epr页面服务类
    */
    page: {
        "class": 'TX.OAPServer.Bll.MenuAndPageApp',
        /**
        * 通过ID获取页面
        */
        getById: function (id, callback) {
            jmreport.proxy.request('getpage', { 'pageid': id, 'appid': jmreport.app.ID || jmreport.app.appId }, function (p, e) {
                if (p) {
                    p = JSON.parse(p);
                }
                callback(p, e);
            });
        }
    }, //--end page
    menu: {
        /**
        * 获取业务对应的菜单
        */
        getAppMenu: function (app, callback) {
            jmreport.proxy.request('getmenu', { 'app': app }, function (m, e) {
                if (m) {
                    m = JSON.parse(m);
                }
                callback(m, e);
            });
        }
    },
    /**
    * 数据请求类
    */
    reportData: {
        "class": 'TX.OAPServer.Bll.ReportDataApp',
        getData: function (sqlid, dbid, logic, logicParams, params,filter, bindname, framework, callback) {
            var par = {};
            if (filter) {
                var fs = filter;
                filter = '';
                for (var i = 0; i < fs.length; i++) {
                    filter += fs[i].key + ';' + fs[i].value + '|';
                }
            }
            var dataPar = {
                'BindingSourceName': bindname,
                'CacheTimeout': 3600,
                'DataParamType': 0,
                'IsRunLogic': true,
                'DataSourceId': dbid,
                'FilterCondition': params,
                'ControlCodition': filter,
                'LogicCodintion': logicParams,
                'LogicName': logic,
                'SqlId': sqlid,
                'MaxCount': 2000
            };
            par.datapar = JSON.stringify(dataPar);
            //serverPar = encodeURIComponent(JSON.stringify(serverPar));
            //dataPar = encodeURIComponent(JSON.stringify(dataPar));

            jmreport.proxy.request('getdata', par, callback);
        },
        //获取总行数
        getDataRowCount: function (TotleRowCount,pageSize, pageIndex, sqlid, dbid, logic, logicParams, params, bindname, framework, callback) {
            var par = {};
            var dataPar = {
                'BindingSourceName': bindname,
                'CacheTimeout': 3600,
                'DataParamType': 0,
                'IsRunLogic': true,
                'DataSourceId': dbid,
                'FilterCondition': params,
                'LogicCodintion': logicParams,
                'LogicName': logic,
                'SqlId': sqlid,
                'MaxCount': 2000,
                'PageIndex': pageIndex,
                'PageSize': pageSize,
                'TotleRowCount': totleRowCount
            };
            par.datapar = JSON.stringify(dataPar);
            jmreport.proxy.request('getdatabypage', par, callback);
        },
        exportData: function (exportDataType, title, sqlid, dbid, logic, logicParams, params, bindname, framework, callback) {
            var par = {};
            //构造数据参数
            var dataPar = JSON.stringify({
                'BindingSourceName': bindname,
                'CacheTimeout': 3600,
                'DataParamType': 0,
                'IsRunLogic': true,
                'DataSourceId': dbid,
                'FilterCondition': params,
                'LogicCodintion': logicParams,
                'LogicName': logic,
                'SqlId': sqlid,
                'MaxCount': 2000
            });
            //构造验证参数
            par = JSON.stringify({
                'UserName': jmreport.account,
                'Localication': jmreport.lan,
                'ProductionId': jmreport.app.ProductionId || jmreport.app.appId || jmreport.app.ID,
                'ProductionType': jmreport.app.ProductionType,
                'ProductionCode': jmreport.app.ProductionCode,
                'IsFramework': jmreport.currentPage && jmreport.currentPage.config ? jmreport.currentPage.config.FramworkId == '0' : false
            });



            //post提交，请求数据导出
            //构建一个临时表单来提交参数，导出数据
            if (!this.form) {
                var action = oap.rootUrl + 'Servers/ReportData.ashx?cmd=exportdata';
                this.form = $('<form target="_blank" method="post" style="display:none;" action="' + action + '"></form>').appendTo('body');
                this.parinput = $('<input type="text" name="par" />').appendTo(this.form);
                this.titleinput = $('<input type="text" name="title" />').appendTo(this.form);
                var tempDataType = $('<input type="text" name="exportdatatype" />').appendTo(this.form);
                this.dataparinput = $("<input type='text' name='dataPar' />").appendTo(this.form);
            }
            this.dataparinput.val(dataPar);
            this.parinput.val(par);
            this.titleinput.val(title);
            $(tempDataType).val(exportDataType);
            this.form.submit();
            this.form.remove();
            this.form = undefined;
        }, //--end reportData
        getNoticeData: function (callback) {
            $.ajax({
                type: "POST",
                url: oap.rootUrl + 'Home/GetPublishes',
                data: null,
                contentType: "application/x-www-form-urlencoded;charset=UTF-8",
                async: false, // 同步  true 异步。默认是异步
                error: function (datas) {
                    if (window.console && window.console.info) {
                        window.console.info('获取公告失败');
                    }
                },
                success: function (success) {
                    var data = $.parseJSON(success);
                    callback(data);
                }
            });
        }
    },
    /**
    * 业务数据请求类
    */
    production: {
        "class": 'TX.OAPServer.Bll.ProductionApp',
        /**
        * 通过业务id获取业务信息
        */
        get: function (id, callback) {
            jmreport.proxy.request('getproduction', { appid: id }, callback);
        }
    }//--end production
};
/**
 * 工具栏控件
 */
jmreport.toolbarControls = {
    controlTypes: {},
    controls: {},
    /**
    * 注入一个控件
    */
    register: function (name, control) {
        this.controls[name] = control;
    },
    /**
    * 根据名称生成工具栏控件
    */
    create: function (opt) {
        opt = new this.controlConfig(opt); //先实例化基础类
        var control = this.controls[opt.config.Control.ControlName];
        if (control) {
            return new control(opt);
        }
    },
    /**
    * 工具栏控件基础配置类
    */
    controlConfig: function (opt) {
        this.config = opt;
        /**
        * 获取并分解控件参数串
        */
        this.getControlParam = function (key) {
            if (!this.params) {
                this.params = {};
                if (this.config.ControlPara) {
                    var ps = this.config.ControlPara.split('|');
                    var plen = ps.length;
                    for (var i = 0; i < plen; i++) {
                        var p = ps[i];
                        if (!p) continue;
                        var ar = p.split('=');
                        if (ar.length >= 2) {
                            this.params[ar[0].toLowerCase()] = ar[1];
                        }
                    }
                }
            }
            key = key.toLowerCase();
            return this.params[key];
        };
        /**
        * 获取配置默认日期值
        */
        this.getDefaultDate = function (control) {
            var isDateReg = new RegExp('^[0-9]{4,4}\-[0-9]{2,2}\-[0-9]{2,2}|^[0-9]{2,2}\-[0-9]{2,2}|^([0-9]{2,2}\:)');
            if (isDateReg.test(this.config.DefalutValue)) {
                var val = parseDate(this.config.DefalutValue);
                if (val.toString() != "Invalid Date") { return [this.config.DefalutValue]; }
            }
            var format = this.dateFormat || 'yyyy-MM-dd';
            var now = new Date();
            if (control.defaultValues) {
                //var ds = defaultvalue.split(/,|;/);
                var dates = [];
                if (control.defaultValues.length > 0) {
                    for (var i = 0; i < control.defaultValues.length; i++) {
                        var d = control.defaultValues[i];
                        if (!d) continue;
                        var ts = d.split('-');
                        if (ts.length > 0) {
                            var v = ts.length > 1 ? Number(ts[1]) : 0;
                            //毫秒数
                            var datevalue = now.valueOf();
                            switch (ts[0].toLowerCase()) {
                                case 'm':
                                    {//月 
                                        v = v * 30 * 24 * 60 * 60 * 1000;
                                        break;
                                    }
                                case 'h':
                                    {//时
                                        v = v * 60 * 60 * 1000;
                                        break;
                                    }
                                case 's':
                                    {//秒
                                        v = v * 1000;
                                        break;
                                    }
                                case 'y':
                                    {//年
                                        v = v * 365 * 12 * 30 * 24 * 60 * 60 * 1000;
                                        break;
                                    }
                                case 'd':
                                    {//天
                                        v = v * 24 * 60 * 60 * 1000;
                                        break;
                                    }
                            }
                            datevalue -= v;
                            var curdate = new Date(datevalue);
                            dates.push(formatDate(curdate, format));
                        }
                        else {
                            dates.push(d);
                        }
                    }
                }
                return dates;
            }
            else {
                return [formatDate(now, format)];
            }
        }
    }
}

/**
 * 生成工个栏控件
 */
jmreport.toolbarControls.init = function () {
    /**
    * 初始化工具栏控件
    */
    jmreport.toolbarControls.controlTypes['initControl'] = function (config) {
        /**
        * 将控件加入容器，并包裹'jmreport-toolbar-singl-item'元素的方法
        */
        this.appendToContainer = function (obj) {
            var item = $('<div  class="jmreport-toolbar-singl-item" ></div>').appendTo(this.container);
            return obj.appendTo(item);
        }

        this.config = config;
        //默认状态为已完成，表示无需拉取数据	
        this.state = 'completed';
        this.container = $('<div class="jmreport-toolbar-singl" ></div>');
        this.label = this.appendToContainer($('<label class="jmreport-toolbar-lable"></label>').html(config.config.DisplayName));

        /**
        * 获取当前控件值集合
        */
        this.getValues = function () {
            return this.values;
        };

        /**
        * 添加到父容器中
        */
        this.appendTo = function (container) {
            this.container.appendTo(container);
        };

        /**
        * 绑定值改变事件监听
        * 主要用于控件联动
        */
        this.bindValueChange = function (target, fun) {
            if (!this.valueChangeHandles) {
                this.valueChangeHandles = [];
            }
            this.valueChangeHandles.push({
                target: target,
                callback: fun
            });
        };

        /**
        * 触发当前值改变事件
        */
        this.raiseValueChange = function () {
            if (this.valueChangeHandles) {
                for (var i = 0; i < this.valueChangeHandles.length; i++) {
                    var handle = this.valueChangeHandles[i];
                    handle.callback.call(handle.target,true);
                }
            }
        };
        /**
        * 显示异常信息
        */
        this.error = function (err) {
            this.container.html(err);
        }

        /**
        * 显示异常信息
        */
        this.log = function (log) {
            this.container.html(log);
        }

        /**
        * 向服务端请求数据
        */
        this.getData = function (isChangeIn) {
            //this.startLoading();
            //sqlid,dbid,logic,logicParams,params,bindname,framework,callback
            var sqlid = this.config.config['ControlSqlId'];
            var dbid = this.config.config['DbDataSourceId'];
            var logic = this.config.config['LogicName'];
            var logicParams = this.config.config['LogicPara'];
            var bindname = this.config.config['BindingSourceName'];
            //frameworkid为0表示为框架页
            var framework = this.toolbar.page.config.FramworkId == '0';
            //获取查询参数
            this.params = this.toolbar.page.getParams();
            this.filter = this.toolbar.page.getFilterParams();
            var self = this;

            jmreport.proxy.reportData.getData(sqlid, dbid, logic, logicParams, this.params,this.filter, bindname, framework, function (data, ex) {
                if (data) {
                    if (typeof data == 'string') {
                        data = JSON.parse(data);
                    }
                    self.bind(data, isChangeIn);
                    //通知页面完成当前控件的数据拉取
                    self.state = 'completed';
                    self.bindComplete();
                }
                else {
                    this.error(ex || '获取数据出错');
                }
            });
        };

        /**
        *向服务器请求导出数据
        **/
        this.exportData = function () { 
            
        }

        this.requires = []; //控件依赖项
        this.defaultValues = []; //默认值
        this.values = [];
        //获取所依赖的控件对象
        var toolbar = this.toolbar || this.config.config.toolbar;

        //解析工具栏控件标识参数
        if (config.config.ToolbarPara) {
            var ps = config.config.ToolbarPara.split(';');
            for (var i = 0; i < ps.length; i++) {
                var key = ps[i];
                //如果页面中已有默认参数，则此为默认值,此值优于配置中的默认值
                var defaultValue = toolbar.page.params ? toolbar.page.params[key] : '';
                this.values.push({ key: key, value: defaultValue });
                //默认值
                if (defaultValue) {
                    this.defaultValues.push(defaultValue);
                }
            }
        }

        //默认值处理
        if (config.config.DefalutValue) {
            var dvs = config.config.DefalutValue.split(';');
            for (var i = 0; i < dvs.length; i++) {
                var v = dvs[i];
                if (!v) continue;
                //表示所依赖的控件值
                if (v.indexOf(':') == 0) {
                    for (var j = 0; j < toolbar.controls.length; j++) {
                        var c = toolbar.controls[j];
                        for (var k = 0; k < c.values.length; k++) {
                            //如果为当前控件的依赖
                            if (c.values[k].key == v) {
                                //绑定其触发值改变监听
                                c.bindValueChange(this, this.getData);
                                this.requires.push(c);
                                break;
                            }
                        }
                    }
                }
                else {
                    this.defaultValues.push(v);
                }
            }
        }
    }

};
//初始化工具栏控件
jmreport.toolbarControls.init();﻿
/*
*一个多选下拉框
*廖力增加于2013-9-23
*/
jmreport.toolbarControls.controlTypes['checkBoxList'] = function (config) {
    //初始化
    jmreport.toolbarControls.controlTypes.initControl.call(this, config);
    //生成控件id
    this.controlId = (+new Date / Math.random()).toString().replace('.', '');
    this.state = 'loading'; //默认需要拉取数据
    //载入控件主体 
    this.element = this.appendToContainer($('<div value="" id="jmreport_mControl_' + this.controlId + '" class="jmreport-CheckBoxList" ></div>'));
    //右边的结构
    this.rightSide = $('<div class="jmreport-CheckBoxList-right" > > </div>').appendTo(this.element);
    //左边显示所选游戏的结构
    this.leftSide = $('<div class="jmreport-CheckBoxList-left" ></div>').appendTo(this.element);
    //弹出来的层
    this.absoluteLay = $('<div class="jmreport-CheckBoxList-absoluteLay" ><div class="title" ><a onclick="$(document).click();" >【关闭】</a></div>').appendTo('body');
    //默认给所选游戏为'请点击此处选择..'
    this.leftSide.append('<span style="color:#ABADB3" title="请点击此处选择.." >请点击此处选择..</span> ');
    //转存this
    var self = this;

    //如果配置中有配置宽度
    if (this.config.config.Width) {
        //给它配置中的宽度
        this.leftSide.css('max-width', this.config.config.Width + 'px');
    }

    /**
    * 绑定数据
    */
    this.bind = function (data) {
        //有数据才绑定
        if (data.Tables.length > 0 && data.Tables[0].Rows.length > 0) {
            var valueTypeIsString = tb.Columns[0].DataType.indexOf('string') != -1 || tb.Columns[0].DataType.indexOf('String') != -1;
            for (var i = 0; i < data.Tables[0].Rows.length; i++) {
                //data.Tables[0].Rows[i].ItemArray[0].Value;这是数据名
                //data.Tables[0].Rows[i].ItemArray[1].Value;这是显示名
                var span = $("<span><input jmreport_con_id='" + this.controlId + "' type='checkbox' displayValue='" + data.Tables[0].Rows[i].ItemArray[1].Value
                                    + "' dataType='" + (valueTypeIsString ? 'string' : 'number')
                                    + "' value='" + data.Tables[0].Rows[i].ItemArray[0].Value + "' />"
                                    + data.Tables[0].Rows[i].ItemArray[1].Value + "</span>").appendTo(this.absoluteLay);
            }

            //创建单选框的点击事件
            this.absoluteLay.find('input[type=checkbox]').click(function () {
                self.comboBoxClick(this);
            });

            //处理默认值
            if (this.defaultValues && this.defaultValues.length > 0) {
                //取得默认值数组
                var items = this.defaultValues[0];
                items = items.split(',');
                //循环选择默认值中出现的项目
                for (var i = 0; i < items.length; i++) {
                    var items = this.absoluteLay.find('input[value=' + items[i].trim("'") + ']');
                    for (var j = 0; j < items.length; j++) {
                        $(items[j]).attr('checked', 'checked');
                        self.comboBoxClick(items[j]);
                    }
                }
            } else {
                var items = this.absoluteLay.find('input[type=checkbox]');
                $(items[0]).attr('checked', 'checked');
                self.comboBoxClick(items[0]);
            }
        }
    };

    //多选框单击
    this.comboBoxClick = function (thisObj) {
        //查找到所有属于这个控件的checkBox
        var items = $("[jmreport_con_id=" + $(thisObj).attr('jmreport_con_id') + "]");
        var str = "";
        var values = "";
        //在结果中查找被选中的checkBox
        for (var i = 0; i < items.length; i++) {
            if (items[i].checked) {
                if (str != '') { str += "，"; values += ","; }
                str += $(items[i]).attr('displayValue');

                //如果是
                if ($(items[i]).attr("dataType") == 'number') {
                    values += $(items[i]).val();
                } else { values += "'" + $(items[i]).val() + "'"; }
            }
        }
        //生成文本
        //正常情况下，将所收集到的显示名称填入
        var inHtml = "<label>" + str + "</label>";
        //但是如果没有收集到任何的显示名称，表示用户并没选择任何一个checkbox,
        //就将显示框里的值都设为默认的“请点击此处选择..”
        if (str == '') { inHtml = '<span style="color:#ABADB3" >请点击此处选择..</span> '; str = '请点击此处选择..'; } else { str = "选中值为：" + str; }
        //填充以上准备好的字符
        var displayDiv = $("#jmreport_mControl_" + $(thisObj).attr('jmreport_con_id')).find('.jmreport-CheckBoxList-left');
        displayDiv.html(inHtml);
        displayDiv.attr('title', str);
        //给控件主体绑定自定义属性'value' 将真实的收集到的数据赋值上去
        $("#jmreport_mControl_" + $(thisObj).attr('jmreport_con_id')).attr('value', values);
    }

    /**
    *绑定层的单击事件，以阻止冒泡
    */
    this.absoluteLay.click(function (event) {
        //阻止冒泡
        event.stopPropagation();
    });

    /*
    *绑定主元素的单击事件
    *单击主元素就弹出游戏选择层
    */
    this.element.click(function (event) {
        //先获得层，就在主体控件的旁边
        var lay = self.absoluteLay;
        //先将层显示出来方便获取/控制器位置
        lay.css('display', 'block')
            .css('left', $(this).position().left + "px")
            .css('top', ($(this).position().top + ($(this).height() || 24)) + "px");

        //再将层隐藏,再以动画的形式显示出来
        lay.css('display', 'none').slideDown(300);

        //绑定document.click事件，目的是当鼠标点击页面任何位置（除本层外）就将本层隐藏
        var thisObj = lay;
        function hideClick() {
            $(thisObj).slideUp(300);
            //隐藏后再将本事件（document.click）注销，避免事件堆积
            $(document).unbind('click', hideClick);
        }
        $(document).click(hideClick);

        //一定要阻止冒泡不然此层会现实后又消失，原因是单击事件会最终落到刚刚绑定的那个document.click之中
        event.stopPropagation();
    });

    /**
    * 获取当前控件值集合
    */
    this.getValues = function () {
        this.values[0].value = this.element.attr('value');
        return this.values;
    }

}
//廖力增加于2013-9-23
jmreport.toolbarControls.register('CheckComboBox', jmreport.toolbarControls.controlTypes.checkBoxList);

﻿
/**
* 单个下拉框控件
*/
jmreport.toolbarControls.controlTypes['comboBoxOne'] = function (config) {
    //初始化
    jmreport.toolbarControls.controlTypes.initControl.call(this, config);
    this.state = 'loading'; //默认需要拉取数据
    this.element = this.appendToContainer($('<select></select>'));

    if (this.config.config.Width) {
        this.element.width(this.config.config.Width);
    }

    var self = this;
    this.changeEvent = function () { self.raiseValueChange(); };
    /**
    * 绑定数据
    */
    this.bind = function (data, isChangeIn) {
        if (data.HasError || data.Tables[0].Rows.length == 0) {
            return;
        }
        this.element.html('');
        //有数据才绑定
        if (data.Tables && data.Tables.length > 0 && data.Tables[0].Rows && data.Tables[0].Rows.length > 0) {
            var tb = data.Tables[0];
            for (var i = 0; i < tb.Rows.length; i++) {
                var row = tb.Rows[i];
                var v = row.ItemArray[0].Value;
                var text = row.ItemArray[1].Value;
                var opt = $('<option></option>').html(text).attr('value', v).appendTo(this.element);
                //默认值处理

                if (this.defaultValues && this.defaultValues.length > 0) {
                    var dv = this.defaultValues[0];
                    if (v == dv || text == dv) {
                        opt.attr('selected', true);
                    }
                }
            }
        }
        this.element.unbind('change', this.changeEvent);
        if (!isChangeIn) {
            //触发改变事件
            this.raiseValueChange();
        }
        this.element.bind('change', this.changeEvent);
    };
    /**
    * 获取当前控件值集合
    */
    this.getValues = function () {
        var vitem = this.values[0];
        vitem.value = this.element.val();
        var text = this.element.find('option:selected').text();
        var textitem = { key: vitem.key + 'Text', value: text };
        var num = vitem.key.match(/\d?$/);
        if (num) {
            var textitem2 = { value: text };
            textitem2.key = vitem.key.replace(num, '') + "Text" + num;
            return [textitem, textitem2, vitem];
        }
        return [textitem, vitem];
    }
}
jmreport.toolbarControls.register('ComboBoxOne', jmreport.toolbarControls.controlTypes.comboBoxOne);
﻿/**
* 单日期先择控件
*/
jmreport.toolbarControls.controlTypes['dateTimeOne'] = function (config) {
    //初始化
    jmreport.toolbarControls.controlTypes.initControl.call(this, config);

    this.element = this.appendToContainer($('<input type="text" />'));

    if (this.config.config.Width) {
        this.element.width(this.config.config.Width);
    }

    this.element.datepicker({
        changeMonth: true
    }).datepicker('option', jmreport.lans.datePicker['zh']);

    //设定默认值
    var defaultvalue = config.getDefaultDate(this);
    if (defaultvalue.length > 0) {
        this.element.val(defaultvalue[0]);
    }
    else {
        this.element.val(formatDate(null, 'yyyy-MM-dd'));
    }

    /**
    * 获取当前控件值集合
    */
    this.getValues = function () {
        this.values[0].value = this.element.val();
        return this.values;
    }
}
jmreport.toolbarControls.register('DateTimeOne', jmreport.toolbarControls.controlTypes.dateTimeOne);
﻿
/**
* 双日期先择控件
*/
jmreport.toolbarControls.controlTypes['dateTimeTwo'] = function (config) {
    //初始化
    jmreport.toolbarControls.controlTypes.initControl.call(this, config);

    this.element1 = this.appendToContainer($('<input type="text" />'));
    this.appendToContainer($('<label>至</label>'));
    this.element2 = this.appendToContainer($('<input type="text" />'));

    var self = this;
    var option1 = {
        changeMonth: true,
        numberOfMonths: 2,
        onClose: function (selectedDate) {
            self.element2.datepicker("option", "minDate", selectedDate);
        }
    };
    var option2 = {
        changeMonth: true,
        numberOfMonths: 2,
        onClose: function (selectedDate) {
            self.element1.datepicker("option", "maxDate", selectedDate);
        }
    };

    this.element1.datepicker(option1).datepicker('option', jmreport.lans.datePicker['zh']);
    this.element2.datepicker(option2).datepicker('option', jmreport.lans.datePicker['zh']);
    //设定默认值
    var defaultvalue = config.getDefaultDate(this);
    if (defaultvalue.length > 0) {
        this.element1.val(defaultvalue[0]);
        //option2.minDate = defaultvalue[0];
        if (defaultvalue.length > 1) {
            this.element2.val(defaultvalue[1]);
            //option1.maxDate = defaultvalue[1];
        }
        else {
            this.element2.val(formatDate(null, 'yyyy-MM-dd'));
        }
    }
    else {
        this.element1.val(formatDate(null, 'yyyy-MM-dd'));
        this.element2.val(formatDate(null, 'yyyy-MM-dd'));
    }


    /**
    * 获取当前控件值集合
    */
    this.getValues = function () {
        this.values[0].value = this.element1.val();
        this.values[1].value = this.element2.val();
        return this.values;
    }
}
jmreport.toolbarControls.register('DateTimeTwo', jmreport.toolbarControls.controlTypes.dateTimeTwo);
﻿/**
* 单日期先择控件
*/
jmreport.toolbarControls.controlTypes['dateTimePickerOne'] = function (config) {
    //初始化
    jmreport.toolbarControls.controlTypes.initControl.call(this, config);

    this.element = this.appendToContainer($('<input type="text" />'));

    if (this.config.config.Width) {
        this.element.width(this.config.config.Width);
    }

    //配置控件语言
    $.timepicker.setDefaults($.timepicker.regional['zh-CN']);

    //将jquery ui 插件应用到控件之上
    this.element.datetimepicker({
        showSecond: true,
        dateFormat: 'yy-mm-dd',
        timeFormat: 'hh:mm:ss',
        stepHour: 1,
        stepMinute: 1,
        stepSecond: 1
    });

    //设置默认时间格式
    config.dateFormat = 'yyyy-MM-dd HH:mm:ss';
    //设定默认值
    var defaultvalue = config.getDefaultDate(this);
    if (defaultvalue.length > 0) {
        this.element.val(defaultvalue[0]);
    }
    else {
        this.element.val(formatDate(null, 'yyyy-MM-dd HH:mm:ss'));
    }

    /**
    * 获取当前控件值集合
    */
    this.getValues = function () {
        this.values[0].value = this.element.val();
        return this.values;
    }
}
jmreport.toolbarControls.register('DateTimePickerOne', jmreport.toolbarControls.controlTypes.dateTimePickerOne);
﻿
/**
* 水平排列选项控件
*/
jmreport.toolbarControls.controlTypes['horizontalListBox'] = function (config) {
    //初始化
    jmreport.toolbarControls.controlTypes.initControl.call(this, config);
    this.state = 'loading'; //默认需要拉取数据
    this.element = this.appendToContainer($('<ul class="jmreport-horizontallistbox"></ul>'));

    if (this.config.config.Width) {
        this.element.width(this.config.config.Width);
    }

    var self = this;
    this.changeEvent = function () { self.raiseValueChange(); };

    /**
    * 绑定数据
    */
    this.bind = function (data, isChangeIn) {
        if (data.HasError || data.Tables[0].Rows.length == 0) {
            return;
        }
        this.element.html('');
        this.items = [];
        //有数据才绑定
        if (data.Tables.length > 0 && data.Tables[0].Rows.length > 0) {
            var tb = data.Tables[0];
            var self = this;
            //值是否为字符串
            var valueTypeIsString = tb.Columns[0].DataType.indexOf('string') != -1 || tb.Columns[0].DataType.indexOf('String') != -1;
            for (var i = 0; i < tb.Rows.length; i++) {
                var row = tb.Rows[i];
                var v = row.ItemArray[0].Value;
                var text = row.ItemArray[1].Value;
                var attrvalue = valueTypeIsString ? "'" + v + "'" : v;
                var item = $('<li></li>').html(text).attr('data-value', attrvalue).appendTo(this.element);
                item.click(function () {
                    self.select(this);
                });
                this.items.push(item);
                //默认值处理
                if (this.defaultValues && this.defaultValues.length > 0) {
                    var dv = this.defaultValues[0];
                    if (v == dv || text == dv) {
                        item.toggleClass('selected', true);
                    }
                }
                //没有默认值就全选
                else {
                    item.toggleClass('selected', true);
                }
            }
        }
        this.element.unbind('change', this.changeEvent);
        if (!isChangeIn) {
            //触发改变事件
            this.raiseValueChange();
        }
        this.element.bind('change', this.changeEvent); 
    };
    /**
    * 选择一个项
    */
    this.select = function (v) {
        if (typeof v == 'string') {
            if (this.items) {
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    if (item.attr('data-value') == v) {
                        item.toggleClass('selected', true);
                    }
                }
            }
        }
        else if (typeof v == 'object') {
            var item = $(v);
            var selected = item.hasClass('selected');
            //如果当前是选择的，则取消，如果被选择的只有一个，则不能消选 ，最少选一个
            if (selected) {
                var selecteditems = this.element.find('li[class*=selected]');
                if (selecteditems.length < 2) {
                    return;
                }
            }
            item.toggleClass('selected', !selected);
        }
    }
    /**
    * 获取当前控件值集合
    */
    this.getValues = function () {
        var par = '';
        var selecteditems = this.element.find('li[class*=selected]');

        selecteditems.each(function (i, item) {
            par += $(item).attr('data-value') + ',';
        });
        this.values[0].value = par.trim(',');
        return this.values;
    }
}
jmreport.toolbarControls.register('HorizontalListBox', jmreport.toolbarControls.controlTypes.horizontalListBox);﻿/**
    * 月份选择控件
    */
jmreport.toolbarControls.controlTypes['monthOne'] = function (config) {
    //初始化
    jmreport.toolbarControls.controlTypes.initControl.call(this, config);

    this.element = this.appendToContainer($('<input type="text" />'));
    this.element.attr('readonly', 'readonly')
    this.selecter = $('<div class="jmreport-toobarMonthOne-selecter"></div>').bind('mouseup', function () {
        return false;
    }).hide().appendTo('body');

    var self = this;
    var yearheader = $('<div class="yearheader"></div>').appendTo(this.selecter);
    $('<a href="#" class="pre">上一年</a>').click(function () {
        self.year -= 1;
        //self.select(self.month);
        self.getVal();
        return false;
    }).appendTo(yearheader);
    this.thisYearDisplay = $('<span class="thisyear" >当年</span>').appendTo(yearheader);
    $('<a href="#" class="next">下一年</a>').click(function () {
        self.year += 1;
        //self.select(self.month);
        self.getVal();
        return false;
    }).appendTo(yearheader);
    var selecterbody = $('<div class="monthbody"></div>').appendTo(this.selecter);
    for (var i = 1; i < 13; i++) {
        $('<a class="month" href="#" data-month="' + i + '">' + i + '</a>').click(function () {
            self.select($(this).attr('data-month'));
            self.hide();
            return false;
        }).appendTo(selecterbody);
    }

    if (this.config.config.Width) {
        this.element.width(this.config.config.Width);
    }


    //绑定焦点获取事件，当控件获得焦点时，显示月份选择框
    this.element.bind('mouseup', function () {
        self.show();
        return false;
    });

    $(document).bind('mouseup', function () {
        self.hide();
    });

    //显示选择框
    this.show = function () {
        var pos = this.element.offset();
        pos.top += this.element.height() + 4;
        this.selecter.css(pos);
        this.selecter.show();
        this.selecter.animate({ opacity: 1 });
    };

    this.hide = function () {
        this.selecter.animate({ opacity: 0 }, function () {
            self.selecter.hide();
        });
    }

    /**
    * 选中月，并获得一串完整的年、月字符串
    */
    this.getVal = function () {
        this.selecter.find('a[class*=current]').toggleClass('current', false);
        //选中当前月
        this.selecter.find('a[data-month=' + this.month + ']').toggleClass('current', true);

        if (this.month.toString().length < 2) {
            this.month = '0' + this.month;
        }
        this.thisYearDisplay.html(this.year + '年' + this.month + '月');
        return this.year + '' + this.month;
    }

    /**
    * 选中指定的月
    */
    this.select = function (m) {
        this.month = m;
        this.element.val(this.getVal(m));
    }

    //设定默认值
    var defaultvalue = config.getDefaultDate(this);
    if (defaultvalue.length > 0) {
        var date = parseDate(defaultvalue[0]);
        this.year = date.getFullYear();
        this.select(date.getMonth() + 1);
    }
    else {
        var date = new Date();
        this.year = date.getFullYear();
        this.select(date.getMonth() + 1);
    }

    /**
    * 获取当前控件值集合
    */
    this.getValues = function () {
        this.values[0].value = this.element.val();
        return this.values;
    }
}
jmreport.toolbarControls.register('MonthOne', jmreport.toolbarControls.controlTypes.monthOne);
﻿/**
* 月份选择控件
*/
jmreport.toolbarControls.controlTypes['halfaYearOne'] = function (config) {
    //初始化
    jmreport.toolbarControls.controlTypes.initControl.call(this, config);

    this.element = this.appendToContainer($('<input type="text" />'));
    this.element.attr('readonly', 'readonly')
    this.selecter = $('<div class="jmreport-toobarhalfaYearOne-selecter"></div>').bind('mouseup', function () {
        return false;
    }).hide().appendTo('body');

    var self = this;
    var yearheader = $('<div class="yearheader"></div>').appendTo(this.selecter);
    $('<a href="#" class="pre">上一年</a>').click(function () {
        self.year -= 1;
        self.getVal();
        return false;
    }).appendTo(yearheader);
    this.thisYearDisplay = $('<span class="thisyear" >当年</span>').appendTo(yearheader);
    $('<a href="#" class="next">下一年</a>').click(function () {
        self.year += 1;
        self.getVal();
        return false;
    }).appendTo(yearheader);
    var selecterbody = $('<div class="monthbody"></div>').appendTo(this.selecter);
    $('<a class="month" href="#" data-month="1">上半年</a>').click(function () {
        self.select($(this).attr('data-month'));
        self.hide();
        return false;
    }).appendTo(selecterbody);
    $('<a class="month" href="#" data-month="7">下半年</a>').click(function () {
        self.select($(this).attr('data-month'));
        self.hide();
        return false;
    }).appendTo(selecterbody);

    if (this.config.config.Width) {
        this.element.width(this.config.config.Width);
    }


    //绑定焦点获取事件，当控件获得焦点时，显示月份选择框
    this.element.bind('mouseup', function () {
        self.show();
        return false;
    });

    $(document).bind('mouseup', function () {
        self.hide();
    });

    //显示选择框
    this.show = function () {
        var pos = this.element.offset();
        pos.top += this.element.height() + 4;
        this.selecter.css(pos);
        this.selecter.show();
        this.selecter.animate({ opacity: 1 });
    };

    this.hide = function () {
        this.selecter.animate({ opacity: 0 }, function () {
            self.selecter.hide();
        });
    }

    /**
    * 选中月，并获得一串完整的年、月字符串
    */
    this.getVal = function () {
        this.selecter.find('a[class*=current]').toggleClass('current', false);
        //选中当前月
        this.selecter.find('a[data-month=' + this.month + ']').toggleClass('current', true);

        if (this.month.toString().length < 2) {
            this.month = '0' + this.month;
        }
        this.thisYearDisplay.html(this.year + '年' + this.month + '月');
        return this.year + '' + this.month;
    }

    /**
    * 选中指定的月
    */
    this.select = function (m) {
        this.month = m;
        this.element.val(this.getVal(m));
    }

    //设定默认值
    var defaultvalue = config.getDefaultDate(this);
    if (defaultvalue.length > 0) {
        var date = parseDate(defaultvalue[0]);
        this.year = date.getFullYear();
        this.select(date.getMonth() + 1);
    }
    else {
        var date = new Date();
        this.year = date.getFullYear();
        this.select(date.getMonth() + 1);
    }

    /**
    * 获取当前控件值集合
    */
    this.getValues = function () {
        this.values[0].value = this.element.val();
        return this.values;
    }
}
jmreport.toolbarControls.register('HalfaYearOne', jmreport.toolbarControls.controlTypes.halfaYearOne);
﻿
/*
*一个简单的文本框
*廖力增加于2013-9-16
*/
jmreport.toolbarControls.controlTypes['textBox'] = function (config) {
    //初始化
    jmreport.toolbarControls.controlTypes.initControl.call(this, config);

    //载入控件
    this.element = this.appendToContainer($('<input type="text" />'));
    //如果配置中有配置宽度
    if (this.config.config.Width) {
        //给它配置中的宽度
        this.element.width(this.config.config.Width);
    }
    //如果配置中有配置默认值
    if (this.defaultValues.length > 0) {
        //给它配置中的默认值
        this.element.val(this.defaultValues[0]);
    }

    //获取当前控件的值
    this.getValues = function () {
        var vitem = this.values[0];
        vitem.value = this.element.val();

        var textitem = { key: vitem.key + 'Text', value: vitem.value };
        var num = vitem.key.match(/\d?$/);
        if (num) {
            var textitem2 = { value: vitem.value };
            textitem2.key = vitem.key.replace(num, '') + "Text" + num;
            return [textitem, textitem2, vitem];
        }
        return [textitem, vitem];
    }
}
//廖力增加于2013-9-16
jmreport.toolbarControls.register('TextBox', jmreport.toolbarControls.controlTypes.textBox);

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
        var control = this.controls[opt.config.Control.ControlName];
        if (!control) {
            control = this.controls['base'];
            var result = new control(opt);
            result.getData = function () {

            };
            result.error("创建控件失败:" + opt.config.Control.ControlName);
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
            if (!this.params) {
                this.params = {};
                if (this.config.ControlPara) {
                    var ps = this.config.ControlPara.split('|');
                    var plen = ps.length;
                    for (var i = 0; i < plen; i++) {
                        var p = ps[i];
                        if (!p) continue;
                        var ar = p.split('=');
                        if (ar.length >= 2) {
                            this.params[ar[0].toLowerCase()] = ar[1];
                        }
                    }
                }
            }
            key = key.toLowerCase();
            return this.params[key];
        };
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
                item.toggleClass(option.css, true);
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

        //刷新
        this.config.createTopMenu.call(this, {
            name: 'refresh',
            title: '刷新',
            css: 'content-control-refesh',
            handler: function () {
                self.getData();
            }
        });
        //更多操作
        var moreMenu = this.config.createTopMenu.call(this, {
            name: 'moreDir',
            title: '更多操作',
            css: 'content-control-moreDir'
        });
        //显示sql
        this.config.createMoreMenu.call(this, moreMenu, {
            name: 'displaySql',
            title: '显示sql代码',
            handler: function () {
                var popPage = $('<div class="jmreport-poppage">' + self.data.Tables[0].Sql + '</div>');
                popPage.appendTo('body');
                popPage.dialog({
                    autoOpen: false,
                    modal: true,
                    width: '800',
                    height: '450',
                    title: '查看SQL语句   -   ' + self.config.config.Title,
                    fixed: true
                });
                popPage.dialog('open');
                $(".ui-widget-overlay").bind("click", function () {
                    $(".ui-dialog-titlebar-close").click();
                });
                //设置样式
                popPage.css('padding', '20px').css('margin', '0px').css('overflow-y', 'scroll');
                //修复窗口随浏览器滚动等问题
                $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-draggable.ui-resizable').css('position','fixed');
            }
        });
        //导出数据
        this.config.createMoreMenu.call(this, moreMenu, {
            name: 'downLoadCsv',
            title: '导出数据(.csv)',
            handler: function () {
                self.exportData(".csv");
            }
        });
        //导出数据
        this.config.createMoreMenu.call(this, moreMenu, {
            name: 'downLoadCsv',
            title: '导出数据(.xls)',
            handler: function () {
                self.exportData(".xls");
            }
        });
        //图表导出图片 
        //导出图片功能已经去除，廖力 2013年11月27日
        //        if (new RegExp('^(ChartXY){1,1}').test(this.config.config.Control.ControlName)) {
        //            this.downLoadPng = this.config.createMoreMenu.call(this, moreMenu, {
        //                name: 'downLoadPng',
        //                title: '下载图片(.png)'
        //            });
        //        }
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
        this.colorArr = ['#1D766F', '#1D766F', '#1D766F'];
        //选取一个颜色不重复
        if (jmreport.reportControls.colorRecorder == (this.colorArr.length - 1)) { jmreport.reportControls.colorRecorder = -1; }
        jmreport.reportControls.colorRecorder++;

        //开始配置报表
        this.config = config;
        this.container = $('<div class="single-chart-content" ></div>').attr('data-type', config.config.Control.ControlName).css('border-top', '3px solid ' + this.colorArr[jmreport.reportControls.colorRecorder]);

        var that = this;
        //创造菜单栏
        this.menu = $('<div class="content-control-menu"></div>').appendTo(this.container);
        //创建菜单项目
        this.menuContent = $('<ul class="content-control-menuContent"></ul>').appendTo(this.menu);
        //创建标题
        this.title = $('<span class="content-control-title"></span>').appendTo(this.menu);
        this.title.html(config.config.Title);
        //创建控件的容器
        this.control = $('<div></div>').appendTo($('<div class="content-control-item"></div>').appendTo(this.container));

        if (this.config.config.Height == 'auto') {
            this.config.config.Height = 350;
        }
        if (this.config.config.Height > 0) {
            this.control.height(this.config.config.Height);
        }
        if (this.config.config.width > 0) {
            this.control.width(this.config.config.width);
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
            var title = config.config.Title;
            if (title && this.params) {
                for (var i = 0; i < this.params.length; i++) {
                    var p = this.params[i];
                    title = title.replace(p.ColumnName, p.Value);
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
            var modal = $('<div class="jmreport-loading-modal"></div>').appendTo(this.control);
            $('<div class="jmreport-loading"></div>').appendTo(this.control);
        }

        //当控件完成渲染时会调用此方法
        if (this.config.config.controlLoadCompletedCallBack) {
            this.drawCompleteCallBack = this.config.config.controlLoadCompletedCallBack;
        } else {
            this.drawCompleteCallBack = function () { };
        }

        /**
        * 向服务端请求页面数据
        */
        this.getPageData = function (TotleRowCount, pageSize, pageIndex) {

            var sqlid = this.config.config['ControlSqlId'];
            var dbid = this.config.config['DbDataSourceId'];
            var logic = this.config.config['LogicName'];
            var logicParams = this.config.config['LogicPara'];
            var bindname = this.config.config['BindingSourceName'];
            //frameworkid为0表示为框架页
            var framework = this.report.page.config.FramworkId == '0';
            //获取查询参数
            this.params = this.report.page.getParams();
            var self = this;

            //拉取完总行数，拉取数据
            //前三个参数为：总行数，每页大小，当前页标
            jmreport.proxy.reportData.getDataRowCount(TotleRowCount, pageSize, pageIndex, sqlid, dbid, logic, logicParams, this.params, bindname, framework, function (data, ex) {
                if (data) {
                    if (typeof data == 'string') {
                        data = JSON.parse(data);
                    }
                    data = self.initData(data);
                    if (data == null) { return; }
                    if (self.data.Tables && self.data.Tables.length > 0) {
                        if (self.bind) self.bind(data, pageIndex);
                    }
                    else {
                        self.log('暂无数据哦，亲！');
                    }
                }
                else {
                    self.error(ex || '获取数据出错');
                }
                if (self.report.page.controlBindComplete) {
                    self.report.page.controlBindComplete.call(self);
                }
            });
        }

        /**
        * 向服务端请求数据
        */
        this.getData = function () {

            this.startLoading();
            //sqlid,dbid,logic,logicParams,params,bindname,framework,callback
            var sqlid = this.config.config['ControlSqlId'];
            var dbid = this.config.config['DbDataSourceId'];
            var logic = this.config.config['LogicName'];
            var logicParams = this.config.config['LogicPara'];
            var bindname = this.config.config['BindingSourceName'];
            //frameworkid为0表示为框架页
            var framework = this.report.page.config.FramworkId == '0';
            //获取查询参数
            this.params = this.report.page.getParams();
            this.filter = this.report.page.getFilterParams();

            var self = this;

            //检查config中是否存在分页
            var psize = this.config.getControlParam('pagesize');
            var configPage = false;
            if (!psize || psize == "0") { configPage = true; }
            //如果用服务器级分页
            //并且是gridView,并且配置了分页
            //就先去拉取总行数
            //拉取完总行数就去拉取第一页的数据
            if (jmreport.isServerPager == true && this.config.config.Control.ControlName == "GridViewData" && configPage) {

                //在配置中告诉控件，当前是使用数据库级分页的
                this.config.config["isServerPager"] = true;

                //查询总行数
                jmreport.proxy.reportData.getDataRowCount(sqlid, dbid, logic, logicParams, this.params, bindname, framework, function (data, ex) {
                    if (data) {
                        if (typeof data == 'string') {
                            data = JSON.parse(data);
                        }
                        //记录总行数
                        this.config.config["RowCount"] = data.RowCount;
                        //传入总行数，页大小，当前第几页进去
                        self.getPageData(data.RowCount, psize, 1);

                    }
                    else {
                        self.error(ex || '获取数据出错');
                    }
                    if (self.report.page.controlBindComplete) {
                        self.report.page.controlBindComplete.call(self);
                    }
                });
            } else {
                //如果不是服务器级别的分页
                //或者不是gridView
                //就直接调用接口，全部查询出来
                jmreport.proxy.reportData.getData(sqlid, dbid, logic, logicParams, this.params,this.filter, bindname, framework, function (data, ex) {
                    if (data) {
                        if (typeof data == 'string') {
                            data = JSON.parse(data);
                        }
                        data = self.initData(data);
                        if (data == null) { return; }
                        if (self.data.Tables && self.data.Tables.length > 0) {
                            if (self.bind) self.bind(data);
                        }
                        else {
                            self.log('暂无数据哦，亲！');
                        }
                    }
                    else {
                        self.error(ex || '获取数据出错');
                    }
                    if (self.report.page.controlBindComplete) {
                        self.report.page.controlBindComplete.call(self);
                    }
                });
            }
        }

        /**
        * 请求导出数据
        */
        this.exportData = function (exportDataType) {
            //sqlid,dbid,logic,logicParams,params,bindname,framework,callback
            var sqlid = this.config.config['ControlSqlId'];
            var dbid = this.config.config['DbDataSourceId'];
            var logic = this.config.config['LogicName'];
            var logicParams = this.config.config['LogicPara'];
            var bindname = this.config.config['BindingSourceName'];
            //frameworkid为0表示为框架页
            var framework = this.report.page.config.FramworkId == '0';
            //获取查询参数
            this.params = this.report.page.getParams();
            //var self = this;
            var title = this.title.html();
            jmreport.proxy.reportData.exportData(exportDataType, title, sqlid, dbid, logic, logicParams, this.params, bindname, framework);
        }

        /**
        * 绑定数据
        */
        this.initData = function (data) {
            //清空控件
            this.control.html('');
            if (data.Message) {
                this.error(data.Message);
                return null;
            }
            //初始化设置数据
            if (data.Tables && data.Tables.length > 0) {
                for (var i = 0; i < data.Tables.length; i++) {
                    var dt = data.Tables[i];
                    //绑定一个获取列的函数，方便后面调用
                    dt.getColumn = function (name) {
                        for (var j = 0; j < this.Columns.length; j++) {
                            var c = this.Columns[j];
                            if (c.Name == name) {
                                return c;
                            }
                        }
                        return null;
                    };
                    //通过名称获取列映射信息
                    dt.getColumnMapping = function (name) {
                        if (dt.ColumnMapping) {
                            for (var j = 0; j < dt.ColumnMapping.length; j++) {
                                var mapping = dt.ColumnMapping[j];
                                if (name == mapping.ColumnName) {
                                    return mapping;
                                }
                            }
                        }
                        return null;
                    };
                    for (var k = 0; k < dt.Rows.length; k++) {
                        var row = dt.Rows[k];
                        for (var h = 0; h < row.ItemArray.length; h++) {
                            var item = row.ItemArray[h];
                            row[item.ColumnName] = item.Value;
                        }
                    }
                }
            }

            this.data = data;
            //重置控件标题
            this.createTitle();
            //创建菜单子项目
            this.createMenu();

            return data;
        }

        //数据处理器
        this.dataHandler = {
            //通过传入dataTable获取Discription
            getColumnDiscription: function (dataTable) {
                //创建返回容器
                var resultArr = [];
                //循环在Table.Columns里检查每列
                for (var i = 0; i < dataTable.Columns.length; i++) {
                    //如果有列说明就是要返回的数据
                    if (dataTable.Columns[i].Description) {
                        var discriptionModal = { name: '', discription: '' };
                        discriptionModal.name = dataTable.Columns[i].DisplayName;
                        discriptionModal.discription = dataTable.Columns[i].Description;
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
            this.control.html(log);
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
        this.linkHandler = function (link) {
            var paras = this.report.page.getParams();
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

    } //--end initControl
    jmreport.reportControls.register('base', jmreport.reportControls.controlTypes.initControl);
};
//初始化工具栏控件
jmreport.reportControls.init();




﻿/**
* 单日期先择控件
*/
jmreport.reportControls.controlTypes['gridViewData'] = function (config) {
    jmreport.reportControls.controlTypes.initControl.call(this, config); //初始化

    this.selecter = null;

    /**
    * 绑定数据
    */
    this.bind = function (data, pageIndex) {
        if (this.data.Tables[0].Rows.length <= 0) {
            this.log('暂无数据哦，亲！');
            return;
        }
        //假设每页显示两条数据 可随时注销
        //this.config.config.PageSize = "2";
        //假设需要进行总汇操作 
        //this.config.config.combinCondition = [{ columnName: "北京", combinType: "sum" }, { columnName: "广东", combinType: "min" }, { columnName: "上海", combinType: "max" }, { columnName: "天津", combinType: "count"}];

        //通过配置获得分页器
        //获得 “页面级分页器” 或者 “数据库级分页器”
        if (!this.selecter) {
            this.selecter = this.getPageSelecter();
        }

        //在页面级分页的情况下，如果没有传送当前页进来，表示这是第一次载入
        //如果是数据库级分页，每次都需要从新加载
        //初始化分页器
        if (!pageIndex || this.config.getControlParam('isServerPager')) {
            this.selecter.init(this);
        };
        //设置当前页
        this.selecter.thisPage = pageIndex || 1;
        //向页面中加入分页控件
        this.selecter.create(this);

        //当前页的列表显示范围
        var dt = this.selecter.getDataScope(this.data.Tables[0]);

        //判断用户是否想要总汇
        if (this.config.config.combinCondition) {
            //开始计算总汇数据 并在表格的最后一行加入总汇数据
            dt.Rows.push(this.combins.init(this.config.config.combinCondition, this.data.Tables[0]));
        }

        //生成列
        var columns = this.createGridHeader(dt);
        //生成表格对象
        var tb = this.createTable(dt, columns);
        tb.appendTo(this.control);

        //table的自动调整大小事件的方法
        function tableResize(tb, thisObj) {
            this.doFunc = function () {
                //判断内部表格的宽度超过外部div的宽度就有可能已经显示出滚动条了
                //在这种情况下要预留出滚动条的高度
                if (tb.width() > thisObj.control.width()) {
                    thisObj.control.parent().css('overflow-x', 'scroll');
                    thisObj.control.css('overflow', 'hidden');
                } else {
                    thisObj.control.parent().css('overflow-x', '');
                    thisObj.control.css('overflow', '');
                }
                //可以在此设置一下content div的高度，外部容器的高度 = 内部表格的净高度 + 表格每行的padding * 行数
                thisObj.control.height(tb.height());
            }
        }

        /*if (typeof this.tableResize != 'undefined') {
        $(window).unbind('resize', this.tableResize.doFunc);
        }*/
        this.tableResize = new tableResize(tb, this);
        this.tableResize.doFunc();
        //$(window).bind('resize',this.tableResize.doFunc);

        //完成渲染调用此方法
        //此方法位于jmreport.reportControls.js
        this.drawCompleteCallBack();
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
    * 生成表格
    */
    this.createTable = function (dt, columns) {
        //获得嵌套列的树状结构
        if (!columns) columns = this.createGridHeader(dt);

        var tb = $('<table cellspacing="0" cellpadding="0" border="0" class="jmreport-gridViewData"></table>');
        var head = $('<thead></thead>').appendTo(tb);
        var thisObj = this;

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
            rowLength = this.selecter.pageSize;
        } else {
            rowLength = dt.Rows.length;
        }
        for (var i = 0; i < rowLength; i++) {
            var tr = $('<tr></tr>').appendTo(body);
            if (i % 2) {
                tr.attr('class', 'alt-row');
            }
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
                        var tdcontent = td;
                        //单列简单页面连接
                        var page = thisObj.config.config.LinkPageID;

                        //绑定有内部连接的单列
                        if (page && k == 0) {
                            tdcontent = this.linkHandle.singleLink(page, tdcontent, row, column, td, thisObj);
                        }

                        //多列绑定
                        if (new RegExp('^([\[\{\"]{1,1})').test(column.Description)) {
                            var link = JSON.parse(column.Description);
                            //如果是http开头，便是外联
                            if (new RegExp('^([http\://]{1,1})').test(link[0].page)) {
                                tdcontent = $('<a href="' + this.linkHandler(link[0].page,row.ItemArray) + '" ></a>')
                                                                .attr('target', "_blank")
                                                                .appendTo(td);
                            } else { //不是则为内联
                                tdcontent = $('<a href="#"></a>').attr('data-date', item.Value)
                                                                .attr('data-page', link[0].page)
                                                                .attr('data-column', column.Name)
                                                                .appendTo(td);
                                var par = '{"name":"' + item.ColumnName + '","value":"' + item.Value + '"}';
                                (function (_title, _thisObj, _tdcontent, _par, _page) {
                                    _tdcontent.click(function (e) {
                                        var thiscontrol = _thisObj;
                                        thiscontrol.report.page.openPopPage(_page, _title, undefined, _par);
                                        return false;
                                    });
                                })("", thisObj, tdcontent, par, link[0].page)
                            }
                        }

                        if (item.Value) {
                            //判断该项目是否为总汇项目,判断该项目是否有combinType值
                            if (!item.combinType) {
                                tdcontent.append(item.Value);
                            } else {
                                td.html('');
                                td.append("<div>" + item.Value + "</div>");
                                td.attr('class', 'combin');
                            }
                            //判断该列是否要放入百分比显示
                            if (column['isDisplayPre'] || item.Value.indexOf('%') != -1) {
                                //将其中百分号替换成空后再次验证其结果是否为数字
                                var tempValue = Number(item.Value.replace('%', ''));
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
                                    tdcontent.append("<div class='preValue' style='" + fontColor + "' >" + item.Value + "</div>");
                                    $("<div class='DisplayPre' style='width:0%;" + barColor + "' ><div>").appendTo(td).animate({ width: wValue + "%" }, 1000);
                                    tdcontent.attr('class', 'DisplayPre');
                                }
                            }
                        }
                        else {//如果值为空就填上空格，以免表格塌陷
                            tdcontent.html("&nbsp;");
                        }
                        break;
                    }
                }
            }
        }
        return tb;
    }

    /**
    *连接绑定处理器
    */
    this.linkHandle = {
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
                var par = '{"name":"' + row.ItemArray[0].ColumnName + '","value":"' + row.ItemArray[0].Value + '"}';
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
                            thiscontrol.report.page.openPopPage(page, _title, undefined, par);
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
                    var result = this.combinStyle[$.trim(columnsCondition[i].combinType)](combinedValue, Value, j);
                    //将得出的结果加入总汇行
                    rowModal.setValue(columnsCondition[i].columnName, result, $.trim(columnsCondition[i].combinType));
                }
            }
            return rowModal;
        }
			, //总汇的类型：
        combinStyle: {//合计方法
            sum: function (combinedValue, Value, j) { return combinedValue + Value; }
							, //求最大值方法
            max: function (combinedValue, Value, j) { if (combinedValue < Value) { return Value; } else { return combinedValue; } }
							, //求最小值方法
            min: function (combinedValue, Value, j) { if (j == 0) { return Value; } if (combinedValue > Value) { return Value; } else { return combinedValue; } }
							, //求计数
            count: function (combinedValue, Value, j) { return j + 1; }
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
            var psize = thisObj.config.getControlParam('pagesize');
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
        var psize = thisObj.config.getControlParam('pagesize');
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
        if (thisObj.config.getControlParam('pagesize') && Number(thisObj.config.getControlParam('pagesize')) > 0) {
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
        psize = thisObj.config.getControlParam('pagesize');
        //初始化分页器
        //设置页大小
        this.pageSize = Number(psize);
        //设置总行数
        this.rowNum = thisObj.config.getControlParam('RowCount');
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
        $("[pageIndex='" + this.PageCountPanel + "']").click(function () { thisObj.getPageData(this.rowNum, this.pageSize, $(this).attr('index')); });
    }

    /**
    *通过配置返回分页对象
    */
    this.getPageSelecter = function () {
        //获得是否启用数据库级分页的信息
        var usingServer = this.config.getControlParam('isServerPager');
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
                if (columns[j].DisplayName == arr[0]) {
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
                    cItem['Name'] = obj.Name;
                    cItem['DisplayName'] = arr[0];
                    cItem['Description'] = obj.Description;
                    cItem['sortStyle'] = obj['sortStyle'];
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
}                                                                           //--end datagridview

//在末尾给表格控件注册
jmreport.reportControls.register('GridViewData', jmreport.reportControls.controlTypes.gridViewData);
jmreport.reportControls.register('RadGridViewData', jmreport.reportControls.controlTypes.gridViewData);﻿/**
* 图表控件
*/
jmreport.reportControls.controlTypes['eprChart'] = function (config) {
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
        var data = this.data.Tables[0];
        if (data.Rows.length <= 0) {
            this.log('暂无数据哦，亲！');
            return;
        }

        //建立模型
        this.resultModal = { highChartStyle: null, series: null, categories: null, events: null };

        //第一步，通过数据取得正确的Series
        this.resultModal.series = this.getSeries(data);

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
        //将配置输入绘制图形
        this.control.highcharts(option);

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
            this.speEvent();
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
        self.control.css('width', '99%').css('overflow', 'hidden');
        self.control.find('tspan:contains(Highcharts.com)').remove();

        //完成渲染调用此方法
        //此方法位于jmreport.reportControls.js
        this.drawCompleteCallBack();
    }

    /**
    * 获取当前控件的html 
    */
    this.getHtml = function () {
        //var svg = this.control.find('.highcharts-container').html();
        // var m = svg.match(/\<svg[^\>]*?\>[\s\S]*?\<\/svg\>/);
        //if (m) {
        //    svg = m[0].toString();
        //}
        //return svg;
        var svg = this.control.highcharts().getSVG();
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
                        if (series.data[j].graphic.width) {
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

        //设置maring后需要在里面腾出空间

        self.control.highcharts().redraw();
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
            }
        }
    }

    //获取highCharts数据x轴列
    this.getSeries = function (data) {
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
        var config = this.config.config;
        types = this.typeMapping.get();
        var sType = this.typeMapping.getSourceType();
        var showPointMarks = config.ShowPointMarks.split(';');
        //获得当前图形是否为需要单独设置样式的特殊图形
        var isSpeStyle = this.styleHandler.getIsSpeStyle();

        fieldIndex = 1;
        //x轴所有的类型和显示配置
        var xAxises = []
        var lastType = [];
        var tempIndex = 0;
        //填充模版
        for (var j = fieldIndex; j < data.Columns.length; j++) {
            //取得模版
            var xAxis = jQuery.extend(true, {}, this.templet.xAxis);
            //取得列
            var c = data.Columns[j];
            //如果为数字，则设为线条的y轴
            if (this.typeNameIsNumber(c.DataType)) {
                xAxis.name = c.DisplayName;
                xAxis.yField = c;
                xAxis.field = c
                xAxis.isThisDisplay = true;
                xAxis.index = c.Index;

                //如果是堆积柱状图，那么应该所有的项目都是柱状图，强制所有图形都为柱状图
                if (isSpeStyle && new RegExp('^(stackedbar{1,1})([100]{0,1})').test(isSpeStyle)) {
                    xAxis.type = 'column';
                    //如果分组
                    if (sType[j - 1] == 'Bar') {
                        xAxis.stack = 0;
                    } else {
                        xAxis.stack = 1;
                    }
                } else {
                    //type有时候不会对应每一列，那么如果type已经循环到底了，
                    //列还未循环完毕的话，就用其最后一个type为剩下的所有列赋予其图形样式
                    if (types[j - 1]) {
                        xAxis.type = types[j - 1];
                        xAxis.sourceType = sType[j - 1];
                        //记录上一个图形样式
                        lastType = [types[j - 1], sType[j - 1]];
                    } else {
                        xAxis.type = lastType[0];
                        xAxis.sourceType = lastType[1];
                    }
                }

                //如果是雷达图，全部设置为area
                if (isSpeStyle == 'radar') { xAxis.type = 'area'; }

                //用IsAxis2Y来判断循环到第几个来使用第二个y轴
                if (config.IsAxis2Y && tempIndex >= Number(config.IsAxis2Y)) {
                    xAxis.yAxis = 1;
                }

                //此处设置的属性是 本条数据线是否需要将标签显示出来
                //这里将会遇见一些麻烦
                //比如，在后台中设置一个堆积类图形的时候，
                //后台的设置当中并没有针对所有数据线配置showPointMarks
                //后台认为堆积类图形的数据线共用一个showPointMarks就好
                //也许在银光版本中是不错的做法，但是这js版本中便会出现缺陷
                //此处为缺陷，日后需要改进 : 廖力 2013/10/29
                if (showPointMarks[tempIndex] == 'true') {
                    xAxis.showLabel = true;
                }

                fieldIndex++;
                tempIndex++;
            }
            xAxises.push(xAxis);
        }
        return xAxises;
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
            'splinerange': 'spline'
        },
        getSourceType: function () {
            //从配置文件中取出类型
            return self.config.config.DefaultChartType ? self.config.config.DefaultChartType.split(';') : ['line'];
        },
        //传入一组老类型，输出一组新类型
        get: function (types) {
            //从配置文件中取出类型
            var types = this.getSourceType();
            //将类型适配成highCharts类型
            var typeses = [];
            for (var i = 0; i < types.length; i++) {
                var t = types[i].toLowerCase();
                if (this.list[t]) { t = this.list[t]; }
                typeses.push(t);
            }
            return typeses;
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
            //设置y值
            lableData.y = Number(item.Value);
            //如果是饼图，就要设置x值
            if (iItem.type == 'pie') { lableData.x = items[2].Value; lableData.name = items[2].Value; }

            resultModal.iItem = iItem;
            resultModal.labelstep = labelstep;
            resultModal.lableData = lableData;
            resultModal.stepIndex = stepIndex;

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
            var config = self.config.config;
            //获得主要模版
            var chartTemplet = jQuery.extend(true, {},self.templet.highCharts);
            //获得当前图形是否为需要单独设置样式的特殊图形
            var isSpeStyle = this.getIsSpeStyle();

            //给一些特殊的图形设置样式
            if (isSpeStyle) {
                chartTemplet = this.setSpeStyle(isSpeStyle, chartTemplet);
            }

            //x轴标签时间格式化
            var xformat = config.DefaultLabelFormat || 'yyyy-MM-dd';
            // 强制设置highchart中的chart.xAxis.dateTimeLabelFormats格式化属性，使之可以在chart.xAxis.labels.formatter方法中用this.dateTimeLabelFormat取到
            chartTemplet.xAxis.dateTimeLabelFormats = { millisecond: xformat, second: xformat, minute: xformat, hour: xformat, day: xformat, week: xformat, month: xformat, year: xformat };

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


            //检查是否为双y轴设置
            //是的话则多添加一个y轴
            if (config.IsAxis2Y) {
                //复制一个一模一样的chart.yAxis[0]出来，并添加到yAxis中去
                var yAxisTow = jQuery.extend(true, {}, chartTemplet.yAxis[0]);
                yAxisTow['opposite'] = true;
                chartTemplet.yAxis.push(yAxisTow);
            }

            //设置label旋转
            if (config.LabelRotationAngle) {
                chartTemplet.xAxis.labels.align = 'left';
                chartTemplet.xAxis.labels.rotation = config.LabelRotationAngle;
            }

            //设置鼠标悬浮label
            if (config.ShowItemLabels == 'false') {
                chartTemplet.tooltip.shared = false;
                chartTemplet.tooltip.crosshairs = false;
                chartTemplet.tooltip.enabled = false;
            }

            //获取图例位置
            var legendPosition = config.ChartLegendPosition ? config.ChartLegendPosition.toLowerCase() : 'right';

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
            chartTemplet.plotOptions.series.animation = chartTemplet.chart.animation = self.config.config.EnableAnimations != 'false';

            //如果配置中未给定具体图表的高度，就给一个默认高度
            if (self.config.config.Height == 0) { self.config.config.Height = 350; self.control.height(self.config.config.Height); }

            if (self.config.config.Height < 350) {
                chartTemplet.plotOptions.pie.size = (self.config.config.Height / 100) * 78;
            }

            return chartTemplet;
        },
        //遍历类型,检查是否为特殊图形
        getIsSpeStyle: function () {
            var resultStr = false;
            var types = self.typeMapping.getSourceType();
            for (var i = 0; i < types.length; i++) {
                var t = types[i].toLowerCase();
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
                    formatter: function () {
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
}                                        //--end eprchart
//现二种表格合二为一
jmreport.reportControls.register('ChartXY', jmreport.reportControls.controlTypes.eprChart);
jmreport.reportControls.register('ChartXYTab', jmreport.reportControls.controlTypes.eprChart);﻿/**
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
jmreport.reportControls.register('GridSparkLine', jmreport.reportControls.controlTypes.gridSparkLine);﻿/**
* 数据项对比列表控件
*/
jmreport.reportControls.controlTypes['itemCompareList'] = function (config) {
    jmreport.reportControls.controlTypes.initControl.call(this, config); //初始化

    /**
    * 生成对比项
    */
    this.createItem = function (data) {
        var item = $('<ul class="jmreport-itemCompareList-item"></ul>');
        var discriptions = "<span class='cDescription' title='" + data.description + "' >?<span>";
        $('<li class="item-title"></li>').appendTo(item).html(data.title + discriptions).attr('title', data.description);
        var itemvalue = $('<li class="item-value"></li>').appendTo(item).html(data.value);
        //生成底部同环比项
        if (data.compares && data.compares.length > 0) {
            var compareItem = $('<li></li>').appendTo(item);
            for (var i = data.compares.length - 1; i > -1; i--) {
                var c = data.compares[i];
                var itemline = $('<div class="compare-item"></div>').appendTo(compareItem);
                $('<label></label>').appendTo(itemline).html(c.name);
                var vspan = $('<span></span>').appendTo(itemline).html(c.value).attr('title', c.description);
                if (c.value.indexOf('-') != -1) {
                    vspan.toggleClass('red', true);
                }
                else {
                    vspan.toggleClass('green', true);
                }
            }
        }
        return item;
    }

    /**
    * 绑定数据
    */
    this.bind = function () {
        this.control.empty();
        var dt = this.data.Tables[0];
        if (dt.Rows.length <= 0) {
            this.log('暂无数据哦，亲！');
            return;
        }
        var container = $('<ul class="jmreport-itemCompareList"></ul>');
        for (var i = 0; i < dt.Rows.length; i++) {
            var row = dt.Rows[i];
            var data = {
                date: row.ItemArray[0].Value
            };
            //第二列表示项标题对应的列映射信息
            var titlcolumn = dt.getColumnMapping(row.ItemArray[1].Value);
            if (!titlcolumn) {
                titlcolumn = dt.getColumnMapping(row.ItemArray[2].ColumnName);
            }
            data.title = titlcolumn.DisplayName;
            data.description = titlcolumn.Description;
            data.value = jmreport.helper.convertUnit(row.ItemArray[2].Value);
            if (this.config.config.BaseUnitsX) data.value += this.config.config.BaseUnitsX;
            data.compares = [];
            //如果超过三列，则后面为同环比数据
            if (row.ItemArray.length > 3) {
                for (var j = 3; j < row.ItemArray.length; j++) {
                    var item = row.ItemArray[j];
                    var column = dt.getColumn(item.ColumnName);
                    data.compares.push({
                        name: column.DisplayName || column.Name,
                        description: column.Description,
                        value: item.Value
                    });
                }
            }

            //生成每一个元素
            var item = this.createItem(data);
            var itemcontainer = $('<li></li>').appendTo(container);
            if (i == dt.Rows.length - 1) {
                itemcontainer.toggleClass('last', true);
            }
            item.appendTo(itemcontainer);
        }
        container.appendTo(this.control);
        container.css('height', 'auto');
        container.parent().css('height', 'auto');

        //完成渲染调用此方法
        //此方法位于jmreport.reportControls.js
        this.drawCompleteCallBack();
    }
}
jmreport.reportControls.register('OneTextItemCompareList', jmreport.reportControls.controlTypes.itemCompareList);﻿/**
* 文本显示控件
*/
jmreport.reportControls.controlTypes['label'] = function (config) {
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
        var styleStr = this.styleHandler.get();
        this.control.attr('style', styleStr);
        var content = $('<span class="jmreport-control-label"></span>');
        content.html(dt.Rows[0].ItemArray[0].Value);
        this.control.empty();
        content.appendTo(this.control);
        //完成渲染调用此方法
        //此方法位于jmreport.reportControls.js
        this.drawCompleteCallBack();
    }

    /*
    *样式处理
    */
    this.styleHandler = {
        get: function () {
            var resultStyle = "";
            if (that.config.config.ControlPara) {
                var configArr = that.config.config.ControlPara.split('|');
                for (var i in configArr) {
                    if (configArr[i]) {
                        resultStyle += this.styleSwitch(configArr[i]) + ";";
                    }
                } 
            }
            return resultStyle;
        }
        ,
        styleSwitch: function (str) {
            var strArr = str.split('=');
            var resultStr = "";
            switch (strArr[0]) {
                case 'FontSize':
                    resultStr = " font-size:" + strArr[1] + "px";
                    break;
                case 'FontWeight':
                    resultStr = " font-weight:" + strArr[1];
                    break;
                case 'Foreground':
                    resultStr = " color:" + strArr[1].replace('#FF', '#');
                    break;
                case 'TextWrapping':
                    if (strArr[1] == 'Wrap') {
                        resultStr = " white-space:normal";
                    } else {
                        resultStr = " white-space:nowrap";
                    }
                    break;
            }
            return resultStr;
        }
    }

}             //--end label
jmreport.reportControls.register('Title', jmreport.reportControls.controlTypes.label);﻿/**
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
        var dt = this.data.Tables[0];
        if (dt.Rows.length <= 0) {
            this.log('暂无数据哦，亲！');
            return;
        }

        $('<img src="' + this.config.config.LinkPageID + '" />').appendTo(this.control);

        //完成渲染调用此方法
        //此方法位于jmreport.reportControls.js
        this.drawCompleteCallBack();
    }
}             //--end imageBox
jmreport.reportControls.register('ImageBox', jmreport.reportControls.controlTypes.imageBox);﻿/**
* 图片框
*/
jmreport.reportControls.controlTypes['dataViewDatePick'] = function (config) {
    jmreport.reportControls.controlTypes.initControl.call(this, config); //初始化
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

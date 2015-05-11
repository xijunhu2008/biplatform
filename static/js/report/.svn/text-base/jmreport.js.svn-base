/**
* epr专用脚本
*/
jmreport = {
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
    * 是否启用服务器级分页 true:使用，false:不使用
    */
    isServerPager: true,
    /** 
    * 当前业务信息
    */
    app: {
        'Id': '',
        'Code': '',
        //页面信息缓存
        pages: {}
    },
    noticeInterval: null
    ,
    /** 
    * 邮件处理器
    */
    mail: undefined
    ,
    /** 
    * 公告处理器
    */
    notice: undefined
    ,
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
    },
    /** 
    * 全页数据加载遮罩层
    */
    pageLoadingImg: function (sw) {
        if (sw == 'open') {
            if ($('#jmreport-allPage-loading').css("display") == 'none') {
                $('#jmreport-allPage-loading').fadeIn(200);
            }
        } else {
            $('#jmreport-allPage-loading').fadeOut(200);
        }
    },
    //打开报表页面
    openReportPage: function (pageId, relegation, title, toolbar, content, callback) {
        if (typeof relegation == 'function') {
            callback = relegation;
            relegation = null;
        }
        if (typeof title == 'function') {
            callback = title;
            title = null;
        }
        if (typeof toolbar == 'function') {
            callback = toolbar;
            toolbar = null;
        }
        if (typeof content == 'function') {
            callback = content;
            content = null;
        }
        this.proxy.abort();
        this.currentPage = new this.page(pageId, {
            content: content,
            toolbar: toolbar,
            relegation: relegation,
            title: title,
            completeCallback: callback
        });
        location.href = '#page=' + pageId;
        this.currentPage.load();
    },
    tabIndex: 0
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

    var self = this;
    this.scrollState = { time: '0', state: 'unscroll' };
    this.scrollState.time = +new Date;
    this.scrollInterval = setInterval(function () {
        var now = +new Date;
        //如果上次记录时间比现在记录时间大于400毫秒，就视为停止滚动
        if (now - self.scrollState.time > 1200 && self.scrollState.state == 'scrolling') {
            //停止滚动事件
            jmreport.currentPage.stopScroll();
            self.scrollState = { time: +new Date, state: 'unscroll' };
        }
    }, 600);

    if (!jmreport.currentPage) {
        $(window).bind('resize', function () {
            jmreport.currentPage.resize();
        });
/*
        //这是给触前触后绑定的处理事件
        $(window).bind('scroll', function () {
            if (self.scrollState.state == 'unscroll') {
                //开始滚动事件
                jmreport.currentPage.startScroll();
            }
            self.scrollState = { time: +new Date, state: 'scrolling' };
        });

        //纯滚动事件
        $(window).bind('scroll', function () {
            //纯滚动事件
            jmreport.currentPage.scroll();
        });*/
    }

    //重置tab参数
    jmreport.tabIndex = 0;
    //页面id
    this.pageId = pageid;
    //获取初始化参数
    this.params = getUrlParams();
    //加载页面
    jmreport.pageLoadingImg('open');
    this.load = function () {
        //中断所有ajax请求，载入新的页面
        jmreport.proxy.abortAll();
        if (!jmreport.app.pages) jmreport.app.pages = {};
        //如果当前页面信息已存在则，直接处理
        //        if (jmreport.app.pages[this.pageId]) {
        //            this.initPage(jmreport.app.pages[this.pageId]);
        //            this.completeCallback();
        //            jmreport.pageLoadingImg('close');
        //            return;
        //        }
        var self = this;
        //var waiting = message.showWaiting('页面加载中...');
        //获取页面配置
        jmreport.proxy.page.getById(self.pageId, function (p, ex) {
            jmreport.pageLoadingImg('close');
            //waiting.close();
            if (p) {
                //缓存当前页面
                //                jmreport.app.pages[self.pageId] = p;
                //relegation=1表示为框架
                p.isFramework = opt.relegation == 1;
                self.initPage(p, self.completeCallback);
            }
            else {
                message.error(ex && ex.statusText?ex.statusText:(ex || '加载页面失败'));
            }
            self.completeCallback();
        });
    };

    /*
    *创建页面头部小菜单的对象,
    *以及构造函数
    */
    this.createPageMenu = function () {
        self.pageMenu = $('<ul class="jmreport-pageMenu" ></ul>');
    }
    /*
    *创建页面头部小菜单的方法
    */
    this.createPageMenu.prototype = {
        createItem: function (options) {
            return $('<li><li title="' + options.tooltip + '" class="jmreport-pageMenu-icon ' + options.iconStype + '" ></li><li class="jmreport-pageMenu-content" title="' + options.tooltip + '" >' + options.title + '</li></li>')
                    .click(options.click).appendTo(self.pageMenu);
        }
    }

    /*
    *创建页面头部的标题
    */
    this.createPageTitle = function (page) {
        var self = this;
        this.titleContainer.html("");
       
        //新建菜单构造器
        var pageMenuCreater = new this.createPageMenu();

        ////判断模型说明是否存在造模型说明
        //if (page.Reports && page.Reports.length && page.Reports[0].Description) {
        //    if (oap.systemOptions.config.pageMenu.modalNoteDisplay == 1) {
        //        //构造模型说明
        //        this.modalDiscription = pageMenuCreater.createItem({
        //            title: "指标说明",
        //            tooltip: "指标说明",
        //            iconStype: "discription",
        //            click: function () {
        //                var popPage = $('<div class="jmreport-poppage" style="font-size:16px">' + boldReplace(page.Reports[0].Description) + '</div>');
        //                self.openSingleModal({
        //                    height: 'auto',
        //                    width: '800',
        //                    title: '指标说明',
        //                    pageModal: popPage
        //                });
        //            }
        //        });
        //    }
        //}

        //构造刷新
        //if (!getUrlParams()["dissysteminfo"]) {
            this.pageRefresh = pageMenuCreater.createItem({
                title: "页面刷新",
                tooltip: "页面刷新",
                iconStype: "refresh",
                click: function () {
                    //if (getUrlParams()['setDomain'] && top.reportPage) {
                    //    top.reportPage.reFire(jmreport.currentPage.pageId);
                    //} else {
                        //var link = jmreport.root + "report/page.aspx?app=" + jmreport.app.Id + "#page=" + jmreport.currentPage.pageId;
                        window.location.reload();
                    //}
                }
            });
        //}

        var createTitle = function () {
            var level;
            if (parent.epr) { level = parent; } else if (parent.epr) { level = parent; } else { level = window; }
            var titleStr = level.$('#selpro').find('span').html() || '';
            var parentMenuArr = level.$('a.menu.menu-current');

            //产生页面标题
            for (var i = 0; i < parentMenuArr.length; i++) {
                titleStr += (titleStr ? '&nbsp;&nbsp;/&nbsp;&nbsp;' : '') + $.trim($(parentMenuArr[i]).text());
            }
            titleStr += (titleStr ? '&nbsp;&nbsp;/&nbsp;&nbsp;' : '') + page.displayname;
            
            self.pageMenu.appendTo(self.titleContainer);
            $('<div class="jmreport-pageTitle" >' + titleStr + '</div>').appendTo(self.titleContainer);
            document.title = titleStr.htmlDecode();
        }
        setTimeout(createTitle, 100);
    }

    /**
    * 初始化页面信息
    */
    this.initPage = function (page, completeCallback) {

        this.config = page; //获取到页面配置信息
        this.createPageTitle(page);

        var self = this;

        this.reports = [];
        var reportTabsContent;
        this.contentContainer.slideUp(500, function () {
            self.contentContainer.empty();
            tempFunc.call(self);
        });

        var tempFunc = function () {
            //给每一个页面上的控件里添加一个加载完成事件
            var createControlCompleteCallBack = function (configArr, callback) {
                for (var i = 0; i < configArr.controls.length; i++) {
                    configArr.controls[i]['controlLoadCompletedCallBack'] = callback;
                }
                return configArr;
            }

            if (page.reports && page.reports.length > 0) {
                var container = this.contentContainer;
                var len = page.reports.length;
                if (len > 1) {
                    reportTabsContent = $('<div class="jmreport-tabs-content" ></div>').appendTo(this.contentContainer);
                    container = $('<ul></ul>').appendTo(reportTabsContent);
                }
                for (var i = 0; i < len; i++) {
                    var reportContainer = container;
                    var r = page.reports[i];
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
                    reportTabsContent.tabs({
                        //每一个选项卡上绑定一个单击事件，每单击一下就运行一下window.resize
                        activate: function (event, ui, a) {
                            var index = $(ui.newTab.context).attr('data-index');
                            var report = jmreport.currentPage.reports[index];
                            if (report) {
                                jmreport.currentPage.currentReport = report;
                                report.rebind();

                                //如果已经通过第一次加载，就rebind
                                if (report.fristLoadData) {
                                    report.rebind();
                                } else {
                                    //没有通过第一次加载的就getData
                                    report.getData();
                                }
                            }
                            jmreport.tabIndex = index;
                        }
                    });
                }
            }

            this.toolbar = new this.toolbar(this.toolbarContainer, page);
            this.toolbar.page = this;
            //当工具栏完成绑定后，拉取数据
            this.toolbar.completeCallback = function () {
                //if (this.page.config.Toolbar && this.page.config.Toolbar.IsDefaultSearch) {
                    this.page.getData(); //拉取数据
                //}
            };
            this.toolbar.render();
            
            //如果需要展示后的回调，则执行
            if (this.renderCallback) {
                this.renderCallback();
            }
            this.contentContainer.slideDown(500);
        }
    };

    /**
    * 生成查询参数
    */
    this.getParams = function () {
        return this.toolbar.getParams();
    };
    /*
    *生成预览参数
    */
    this.getReViewParams = function () {
        return this.toolbar.getReViewParams();
    }
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
        if (this.reports && this.reports.length) {
            this.reports[0].getData();
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

    this.resize = function () {
        if (this.currentReport) {
            this.currentReport.resize();
        }
    }

    /*
    *页面开始滚动事件传递
    */
    this.startScroll = function () {
        if (this.currentReport) {
            this.currentReport.startScroll();
        }
    }

    /*
    *页面结束滚动事件传递
    */
    this.stopScroll = function () {
        if (this.currentReport) {
            this.currentReport.stopScroll();
        }
    }

    /*
    *页面滚动事件传递
    */
    this.scroll = function () {
        if (this.currentReport) {
            this.currentReport.scroll();
        }
    }

    /**
    * 打开一个简单的层
    */
    this.openSingleModal = function (options) {
        var level = parent;
        var openbymouse = false;
        if (window.isMainEpr) {
            level = window;
            openbymouse = true;
        }
        if (!options.position) {
            options.position = { x: 'center', y: "center" };
        }
        //创建窗体
        level.eprModal({
            title: options.title,
            content: options.pageModal,
            contentStyle: "",
            width: options.width,
            height: options.height,
            openByMouse: openbymouse,
            openPosition: options.position,
            mouseClose: true
        });
    }

    //初始化透视图插件
    if (typeof (jmreport.poppage) != 'undefined') {
        jmreport.poppage.call(this);
    }

    /**
    * 工具栏
    * 生成工具栏参数控件
    */
    this.toolbar = function (target, config) {
        this.target = target;
        this.config = config;
        /*
        //如果不显示工具栏，则直接隐藏
        if (config.IsShowToolbar == false) {
            this.target.hide();
        } else {
            this.target.show();
        }*/

        //当前工具栏状态
        this.state = 'initing';
        /**
        * 展示工具栏
        */
        this.childrenPageParFinder = function (name, value) {
            //检查是否有被嵌套并被要求保持参数
            if (top.reportPage) {
                //如果不等于空
                if ($.trim(top.reportPage.frameConfig.keepToolBarParAlive) != "") {
                    value = top.reportPage.toolBarAlive.setCacheToToolBar(name, value);
                }
            }

            if (getUrlParams()[name]) {
                value = $.trim(window.decodeURI(getUrlParams()[name]));
            }

            if (typeof (self.params[name]) != 'undefined') {
                value = $.trim(window.decodeURI(self.params[name]));
            }

            /*
            *透视页参数
            */
            if (getUrlParams().pagePar) {
                var jsonPar = JSON.parse($.trim(window.decodeURI(getUrlParams().pagePar)));
                //透视页的多个参数
                //[{name:'aaaa',value:'aaa'},{name:'aaaa',value:'aaa'},...]
                if (typeof (jsonPar.length) == 'number') {
                    for (var i = 0; i < jsonPar.length; i++) {
                        if (name == ':' + jsonPar[i].name) {
                            value = jsonPar[i]['value'];
                        }
                    }
                }
                //透视页的单个参数
                //{name:'aaaa',value:'aaa'}
                else {
                    if (name == ':' + jsonPar.name) {
                        value = jsonPar['value'];
                    }
                }
            }
            return value;
        }
        this.render = function () {
            this.target.html('');
            this.controls = [];
            var controlcontainer = $('<div class="controls"></div>').appendTo(this.target);
            if (this.config.toolbars && this.config.toolbars.length > 0) {
                this.panels = {};
                for (var i = 0; i < this.config.toolbars.length; i++) {
                    var c = this.config.toolbars[i];

                    if (!c.defalutvalue) {
                        c.defalutvalue = '';
                    }
                    //子级页面的参数关联
                    if (c.defalutvalue.indexOf(':') != 0) {
                        c.defalutvalue = this.childrenPageParFinder(c.label, c.defalutvalue);
                    }
                    c.toolbar = this;
                    var seq = Math.floor(c.seq || 0 / 10);

                    //在这里制造控件
                    var toolControl = jmreport.toolbarControls.create(c);

                    if (!toolControl) {
                        message.error('获取工具栏控件:' + c.controlname + ' 失败');
                        continue;
                    }
                    toolControl.toolbar = this;
                    this.controls.push(toolControl);

                    var container = this.panels[seq];
                    if (!container) {
                        container = $('<ul class="jmreport-controls" ></ul>').appendTo(controlcontainer);
                        this.panels[seq] = container;
                    }

                    //if (c.Width >= 0) {
                        toolControl.appendTo($('<li class="jmreport-controls-item" ></li>').appendTo(container));
                    //}

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
						    var report = jmreport.currentPage.reports[jmreport.tabIndex];
						    report.getData();

						    //保存固化参数
						    if (top.reportPage) {
						        if ($.trim(top.reportPage.frameConfig.keepToolBarParAlive) != '') {
						            top.reportPage.toolBarAlive.saveParaToCache(jmreport.currentPage.getParams());
						        }
						    }

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
            pars.push({ Key: 'sys_appid', Value: jmreport.app.id });
            pars.push({ Key: 'sys_appname', Value: jmreport.app.displayname });
            pars.push({ Key: 'sys_appcode', Value: jmreport.app.code });
            pars.push({ Key: 'sys_local', Value: 'zh-CN' });
            pars.push({ Key: 'sys_user', Value: jmreport.account });
            pars.push({ Key: 'sys_permission', Value: jmreport.account });

            //如果页面有附带固定参数，则加入查询参数中
            if (this.page.params) {
                for (var k in this.page.params) {
                    if (k.indexOf(':') == 0) {
                        pars.push({ Key: k, Value: this.page.params[k] });
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
                            if (pars[h].Key == v.key) {
                                p = pars[h];
                                break;
                            }
                        }
                        if (p) {
                            p.Value = v.value;
                        }
                        else {
                            p = { Key: v.key, Value: v.value };
                            pars.push(p);
                        }
                        /*
                        //如果当前值等于阀值，则直接去除当前值
                        if (shieldedValue == p.Value) {
                        p.Value = null;
                        }*/
                    }
                }
            }
            return pars;
        };

        /**
        * 生成预览参数
        */
        this.getReViewParams = function () {
            var pars = [];
            pars.push({ Key: 'sys_appid', Value: jmreport.app.id });
            pars.push({ Key: 'sys_appname', Value: jmreport.app.displayname });
            pars.push({ Key: 'sys_appcode', Value: jmreport.app.code });
            pars.push({ Key: 'sys_local', Value: 'zh-CN' });
            pars.push({ Key: 'sys_user', Value: jmreport.account });
            pars.push({ Key: 'sys_permission', Value: jmreport.account });

            //如果页面有附带固定参数，则加入查询参数中
            if (this.page.params) {
                for (var k in this.page.params) {
                    if (k.indexOf(':') == 0) {
                        pars.push({ Key: k, Value: this.page.params[k] });
                    }
                }
            }

            var controls = this.controls;
            if (controls && controls.length > 0) {
                for (var i = 0; i < controls.length; i++) {
                    var c = controls[i];
                    //获取阀值参数
                    //var shieldedValue = c.config.getControlParam('ShieldedValue');
                    var vs = c.getReViewValue();
                    for (var j = 0; j < vs.length; j++) {
                        var v = vs[j];
                        var p = null;
                        //先查找是否有相同key的参数，有的话直接覆盖
                        for (var h = 0; h < pars.length; h++) {
                            if (pars[h].Key == v.key) {
                                p = pars[h];
                                break;
                            }
                        }
                        if (p) {
                            p.Value = v.value;
                        }
                        else {
                            p = { Key: v.key, Value: v.value };
                            pars.push(p);
                        }
                        /*
                        //如果当前值等于阀值，则直接去除当前值
                        if (shieldedValue == p.Value) {
                        p.Value = null;
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
        //该值用于判断该页是否已经经过第一次加载了
        this.fristLoadData = false;
        target.html('');
        this.grid = $('<table cellpadding="0" cellspacing="0" class="jmreport-template"></table>').appendTo(target);
        /**
        * 拉取数据
        */
        this.getData = function () {
            this.fristLoadData = true;
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
                    if (c.bind && !c.isDataError && c.data) {
                        c.control.empty();
                        c.bind();
                    }
                }
            }
        }

        this.resize = function () {
            if (this.controls) {
                for (var i = 0; i < this.controls.length; i++) {
                    var c = this.controls[i];
                    if (c.bind && !c.isDataError && c.data) {
                        c.resizeController();
                    }
                }
            }
        }

        /*
        *页面开始滚动事件传递
        */
        this.startScroll = function () {
            if (this.controls) {
                for (var i = 0; i < this.controls.length; i++) {
                    var c = this.controls[i];
                    if (c.bind && !c.isDataError && c.data) {
                        c.startScrollController();
                    }
                }
            }
        }

        /*
        *页面结束滚动事件传递
        */
        this.stopScroll = function () {
            if (this.controls) {
                for (var i = 0; i < this.controls.length; i++) {
                    var c = this.controls[i];
                    if (c.bind && !c.isDataError && c.data) {
                        c.stopScrollController();
                    }
                }
            }
        }

        /*
        *页面滚动事件传递
        */
        this.scroll = function () {
            if (this.controls) {
                for (var i = 0; i < this.controls.length; i++) {
                    var c = this.controls[i];
                    if (c.bind && !c.isDataError && c.data) {
                        c.scrollController();
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

            /*
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
            }*/

            /*
            //解析行
            var rowMatches = this.config.Template.Content.match(/\<RowDefinition\s+[\s\S]*?\/\>/ig);
            this.rows = [];
            //默认有一行
            var rowlen = rowMatches ? rowMatches.length : 1;
            //按xaml解析出行对象
            for (var i = 0; i < rowlen; i++) {
                var roxaml = rowMatches ? rowMatches[i] : '';
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
            */
            if (this.config && this.config.content) {
                if (typeof this.config.content == 'string') this.config.content = JSON.parse(this.config.content);
                this.renderControl(); //解析控件	
            }
            
        };

        /**
        * 根据控件配置生成控件对象
        */
        this.createControl = function (controlconfig) {
            var control = jmreport.reportControls.create(controlconfig);
            if (control == null) {
                message.error('加载报表控件: ' + controlconfig.controlname + ' 失败');
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
            /*//解析控件对象
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


            //this.controls = [];*/

            if (this.config.content) {
                for (var i = 0; i < this.config.content.length; i++) {
                    var row = this.config.content[i];
                    var tr = $('<tr></tr>');
                    for (var j = 0; j < row.length;j++) {
                        var cell = row[j];
                        var td = $('<td></td>').attr(cell).appendTo(tr);
                    
                        var controlconfig = null;
                        for (var j = 0; j < this.config.controls.length; j++) {
                            var c = this.config.controls[j];
                            if (c && cell.index == c.controlindex) {
                                controlconfig = c;
                                break;
                            }
                        }
                        if (controlconfig == null) continue;
                        //生成控件
                        var control = this.createControl(controlconfig);
                        control.appendTo(td);
                    }
                    tr.appendTo(this.grid);
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
jmreport.helper.convertUnit = function (inputNum) {
    var num = 0;
    if (typeof inputNum == 'string') { num = Number(inputNum) };
    if (isNaN(num)) { return inputNum; }
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
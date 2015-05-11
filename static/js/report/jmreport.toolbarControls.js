
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
        var control = this.controls[opt.config.controlname];
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
                if (this.config.controlpara) {
                    var ps = this.config.controlpara.split('|');
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
            //多选时间选框默认值的处理（收藏夹的图表预览）
            if (control.values && window.isReviewChart || window.isMailCapture) {
                var values = [];
                var isDate = false;
                for (var i = 0; i < control.values.length; i++) {
                    var obj = control.values[i];
                    if (jmreport.currentPage.params[obj.key] && obj.value) {
                        //如果传入的时间是个具体的时间就跳出循环
                        if (isDateReg.test(jmreport.currentPage.params[obj.key])) {
                            isDate = true;
                            break;
                        }
                        values.push(jmreport.currentPage.params[obj.key]);
                    }
                }
                //如果是具体的时间，就使用页面默认的时间
                if (isDate) {
                    control.defaultValues = this.config.defaultvalue.split(';');
                } else {//不是具体时间就使用传入的时间
                    control.defaultValues = values;
                }
            }

            if (isDateReg.test(this.config.defaultvalue)) {
                var val = parseDate(this.config.defaultvalue);
                if (val.toString() != "Invalid Date") { return [this.config.defaultvalue]; }
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
        this.label = this.appendToContainer($('<label class="jmreport-toolbar-lable"></label>').html(config.config.displayname));

        /**
        * 获取当前控件值集合
        */
        this.getValues = function () {
            return this.values;
        };

        /*
        *获取预览参数，默认情况下和获得参数是一样的
        */
        this.getReViewValue = this.getValues;

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
                    handle.callback.call(handle.target, true);
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
        *初始化数据
        */
        this.initData = function (data, isRaiseValueChange) {
            this.data = data;

            //如果发现是被联动的控件绑定
            //就再检查并初始化一下默认值
            if (isRaiseValueChange) {
                this.config.config.defaultvalue = this.config.config.toolbar.childrenPageParFinder(this.config.config.toolbarpara, this.config.config.defaultvalue);
                this.defaultValueHandler(isRaiseValueChange);
            }
        }

        /**
        * 向服务端请求数据
        */
        this.getData = function (isRaiseValueChange) {
            //this.startLoading();
            //sqlid,dbid,logic,logicParams,params,bindname,framework,callback
            var opt = {};
            opt.id = this.config.config.id;
            opt.dbid = this.config.config['datasourceid'];
            opt.appId = jmreport.app.id;
            opt.serverLabel = this.config.config['dataserverlabel'];
            //frameworkid为0表示为框架页
            opt.isFramework = this.toolbar.config.isFramework;
            opt.maxCount = 200;

            //获取查询参数
            opt.condition = this.condition = this.toolbar.page.getParams();
            var self = this;

            jmreport.proxy.reportData.getData(opt, function (data, ex) {
                if (data) {
                    if (typeof data == 'string') {
                        data = JSON.parse(data);
                    }
                    self.initData(data, isRaiseValueChange);
                    self.bind(self.data);
                    //通知页面完成当前控件的数据拉取
                    self.state = 'completed';
                    self.bindComplete();
                }
                else {
                    self.error(ex || '获取数据出错');
                }
            });
        };

        /**
        *向服务器请求导出数据
        **/
        this.exportData = function () {

        }

        /*
        *当数据绑定完成的时候
        */
        this.finishDataBind = function () {
            //如果有人嵌套了我们页面
            //就通知他们我们控件中，有控件已经载入成功
            //oap.systemOptions.toolbarControlMessage(0);
        }

        /*
        *当用户改变其值的时候
        */
        this.onValueChange = function () {
            //如果有人嵌套了我们页面
            //就通知他们我们控件中，有控件被重新设置了一下值
            //oap.systemOptions.toolbarControlMessage(1);
        }

        this.requires = []; //控件依赖项
        this.defaultValues = []; //默认值
        this.values = [];
        //获取所依赖的控件对象
        var toolbar = this.toolbar || this.config.config.toolbar;

        //解析工具栏控件标识参数
        if (config.config.label) {
            var ps = config.config.label.split(';');
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



        //默认值处理器
        this.defaultValueHandler = function (isRaiseValueChange) {
            //默认值处理
            if (config.config.defaultvalue) {
                var dvs = config.config.defaultvalue.split(';');
                for (var i = 0; i < dvs.length; i++) {
                    var v = dvs[i];
                    if (!v) continue;
                    //表示所依赖的控件值
                    if (v.indexOf('%') == 0 && !isRaiseValueChange) {
                        var lbl = v.trim('%');
                        for (var j = 0; j < toolbar.controls.length; j++) {
                            var c = toolbar.controls[j];
                            for (var k = 0; k < c.values.length; k++) {
                                //如果为当前控件的依赖
                                if (c.values[k].key == lbl) {
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
        //处理第一次
        this.defaultValueHandler();
    }

};
//初始化工具栏控件
jmreport.toolbarControls.init();

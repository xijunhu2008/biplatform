
/**
 * 易点报表服务代理实例
 */
jmreport.proxy = {
    requestParams: '',
    //请求缓存
    ajaxCache: [],
    antiXSS: function (data) {
        var reg = null;
        if (data.indexOf('eval(') != -1) {
            reg = new RegExp('eval', 'g');
            data = data.replace(reg, '此处为自动过滤脚本代码');
        }
        if (data.indexOf('print(') != -1) {
            reg = new RegExp('print', 'g');
            data = data.replace(reg, '此处为自动过滤脚本代码');
        }
        if (data.indexOf('javascript:') != -1) {
            reg = new RegExp('javascript:', 'g');
            data = data.replace(reg, '此处为自动过滤脚本代码');
        }
        if (data.indexOf('alert(') != -1) {
            reg = new RegExp('alert', 'g');
            data = data.replace(reg, '此处为自动过滤脚本代码');
        }
        if (data.indexOf('Sleep(') != -1) {
            reg = new RegExp('Sleep', 'g');
            data = data.replace(reg, '此处为自动过滤脚本代码');
        }
        if (data.indexOf('md5(') != -1) {
            reg = new RegExp('md5', 'g');
            data = data.replace(reg, '此处为自动过滤脚本代码');
        }
        return data;
    },
    /**
    * 请求后台代理服务程序
    */
    request: function (serverName, par, callback) {
        if (typeof par == 'function') {
            callback = par;
            par = null;
        }
        if (!par) par = {};        

        var tempFunc = function (loadlevel) {
            var self = this;
            var ajax = loadlevel.$.ajax({
                type: 'post',
                data: par,
                url: jmreport.site + serverName + '?r=' + (new Date().getTime()),
                success: function (r) {
                    if (r) {
                        if (typeof r == 'string') {
                            r = JSON.parse(r);
                        }
                        console.log(r);
                        //表示登录失效
                        if (r.code == -1) {
                            message.error('登陆已失效，请重新登陆。');
                            return;
                        }
                        else if (r.code == 0) {
                            callback(r.data);
                        }
                        else {
                            callback(null, r.msg || '后台服务异常');
                        }
                    }
                    else {
                        callback(null, '后台服务异常');
                    }
                },
                error: function (e) {
                    if (e && e.statusText == "abort") {
                        if (window.console && window.console.log) window.console.log(e);
                        return;
                    }
                    callback(null, e.message || e.statusText);
                }
            });
            this.ajaxCache.push(ajax);
        }
        //如果有ajax加载frame就用它里面的东西
        tempFunc.call(this, window);
    }, //--end request
    /**
    * 中断请求，如果指定index则中断某个，否则中断全部
    */
    abort: function (index) {
        if (typeof (index) !== 'undefined') {
            var ajax = this.ajaxCache[index];
            if (ajax) {
                if (ajax.status !== 200 && ajax.readyState !== 4) {
                    ajax.abort();
                }
            }
        }
        else {
            for (var i = this.ajaxCache.length - 1; i >= 0; i--) {
                this.abort(i);
            }
        }
    },
    abortAll:function(){
        for (var i = 0; i < this.ajaxCache.length; i++) {
            var ajax = this.ajaxCache[i];
            if (ajax) {
                ajax.abort();
            }
        }
        this.ajaxCache = [];
    },
    /**
    * epr页面服务类
    */
    page: {
        /**
        * 通过ID获取页面
        */
        getById: function (id, callback) {
            jmreport.proxy.request('/page/get/' + id, { 'id': id, 'app': jmreport.app.Id  }, function (p, e) {
                if (p && typeof(p) == 'string') {
                    p = JSON.parse(p);
                }
                callback(p, e);
            });
        }
    }, //--end page
    menu: {
        
    },
   
    /**
    * 数据请求类
    */
    reportData: {
        //组合请求数据参数
        createDataPar: function (opt) {            
            var maxcount = 2000;
            if (opt.maxCount) {
                maxcount = opt.maxCount;
            }
            if (typeof (opt.rowsForm) == 'undefined') { opt.rowsForm = -1; }
            if (typeof (opt.pageSize) == 'undefined') { opt.pageSize = -1; }
            var dataPar = {
                'id': opt.id,
                'cacheTimeout': opt.cacheTimeout || 3600,
                'productionId': opt.appId,
                'dataSourceId': opt.dbid,
                'dataServerLabel': opt.serverLabel,
                'condition': opt.condition,
                'maxCount': maxcount,
                'rowsForm': opt.rowsForm,
                'pageSize': opt.pageSize,
                'isFramework': opt.isFramework
            };
            if (opt.logic) dataPar.logic = opt.logic;
            return JSON.stringify(dataPar);
        },
        getData: function (opt, callback) {
            var par = {'param':this.createDataPar(opt)};
            jmreport.proxy.request('/report/getData', par, callback);
        },
        //获取总行数
        getDataRowCount: function (opt, callback) {
            var par = {};
            par.datapar = this.createDataPar(opt);
            jmreport.proxy.request('ReportData', 'getdatarowcount', par, callback);
        },
        //按当前页获得数据
        getPageData: function (opt, callback) {
            var par = {};
            par.datapar = this.createDataPar(opt);
            jmreport.proxy.request('ReportData', 'getdatabypage', par, callback);
        },
        exportData: function (exportDataType, title, opt, callback) {
            var par = {};
            //构造数据参数
            var dataPar = this.createDataPar(opt);

            //post提交，请求数据导出
            //构建一个临时表单来提交参数，导出数据
            if (!this.form) {
                var action = jmreport.root + 'server/report.aspx?cmd=export';
                this.form = $('<form target="_blank" method="post" style="display:none;" action="' + action + '"></form>').appendTo('body');
                this.parinput = $('<input type="text" name="par" />').appendTo(this.form);
                this.titleinput = $('<input type="text" name="title" />').appendTo(this.form);
                var tempDataType = $('<input type="text" name="exportdatatype" />').appendTo(this.form);
                this.dataparinput = $("<input type='text' name='dataPar' />").appendTo(this.form);
            }
            this.dataparinput.val(dataPar);
            //this.parinput.val(par);
            this.titleinput.val(title);
            //$(tempDataType).val(exportDataType);
            this.form.submit();
            //this.form.remove();
            //this.form = undefined;
        }
        , //--end reportData
        getNoticeData: function (callback) {
            $.ajax({
                type: "GET",
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
    }
};
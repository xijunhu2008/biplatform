<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="list.aspx.cs" Inherits="JM.Report.Web.production.list" %>

<!DOCTYPE html>

<html>
<head>
<meta name="renderer" content="webkit">
<meta name="force-rendering" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="chrome=1,IE=edge">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>业务</title>
		<link rel="shortcut icon" href="../favicon.png" type="image/x-png" />
    <link rel="icon" href="../favicon.png" type="image/x-png" />
    <link href="../static/css/site.css" rel="stylesheet" />
    <link href="../static/css/applist.css" rel="stylesheet" />
    <script src="../static/js/jquery.min.js"></script>
    <script src="../static/js/common.js"></script>

    <!--[if lt IE 8]>
	<script type="text/javascript" src="../static/js/json2.js"></script>
	<![endif]-->
</head>
<body>
    <div id="header">
        <div id="header-inner">
               
                    <div id="logininfo">welcome<span class="user"><%= currentUser.User.NickName %>(<%= currentUser.User.Account %>)</span>
                        <a href="../login.aspx?cmd=logout" ></a>
                    </div>
                   

            <div class="logo">
                <a href="../production/list.aspx">
                    <img alt="" src="../static/img/logo.png" />
                </a>
                <span>REPORT</span>
            </div>
        </div>
    </div>
    <div class="proBody">
    <!--这是左边的结构-->
    <%--<div class="b_left">
        <div class="serchBox" >
                <input id="txtsput" type="text"/>
        </div>
        <div class="shortList" style="display:none" >
            <ul>
                <li>
                    <input type="checkbox" name="shortType" value='MMORPG' onclick="applist.search.shortProduct()" /><span>暂无类型</span>
                </li>
            </ul>
        </div>
        <div class="histroyList" >
            <div class="title">
                常用业务
            </div>
            <ul id="userProList" >
                
            </ul>
        </div>
    </div>--%>
    <!--这是左边的结构 结束-->

    <!--这是中间的结构-->
    <div class="b_center">
         <div class='applist'id="applist">            
        </div>
        <div id="pager">
        </div>
    </div>
    <!--这是中间的结构 结束-->

    <!--这是右边的结构-->
    <%--<div class="b_left">
        <div class="singupProduction" >
            申请业务权限
        </div>
        <div id="notice-content">
            <div class="notice" >
                <div class="title">
                    公告
                </div>
                <div class="notice-border" >
                    <ul class="notice-content" style="top:0px" >
                     <!--此处为公告内容-->
                    </ul>
                </div>
            </div>
            <div class="little-point-content">
                <ul class="little-point">
                    <!--此处为公告的按钮-->
                </ul>
            </div>
        </div>
    </div>--%>
    <!--这是右边的结构 结束-->
</div>
<script type="text/javascript">
    //当前页面处理脚本
    var applist = {
    cache: {},
    //排序方式选择器
        sorttype: {
        _target: null,
        _body: null,
        sortname: '',
        init: function () {
            this._target = $('#slsort');
            this._body = $('#sortoptions');
            this._target.bind('click', function () {
                applist.sorttype.show();
                return false;
            });
            //默认选择第一个
            this.select(this._body.find('li').get(0), 'HasPermission');
        },
        select: function (l, p) {
            if (this.sortname == p) return;
            this.sortname = p;
            this._target.html('<b>' + $(l).text() + '</b><span class="sel-mark"></span>');
            applist.sort(p);
        },
        show: function () {
            this.position();
            this._body.show();
        },
        close: function () {
            this._body.hide();
        }
        },
    //排序
    sort: function (n) {
        if (!this.apps) return;
        try {
            //对应用进行排序
            this.apps.sort(function (x, y) {

                if (n == 'HasPermission') {
                    if ((x[n] == true && y[n] == true) || (x[n] == false && y[n] == false)) {
                        return x['ID'] > y['ID'] ? 1 : -1;
                    }
                    if (x[n] == true) return -1;
                    if (y[n] == true) return 1;
                    return 0;
                }
                else// if (n == 'ProductionName') {
                    if (x[n] > y[n]) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                //}
                return x[n] - y[n];

            });
        }
        catch (ex) { }
        //展示
        this.pager.pagechange();
    },
    //绑定应用
    bind: function (ps) {
        if (ps) {
            var html = "";
            var noimg =  '../static/img/logos/noapping.png';
            var notitle = '无权限';
            var callback = '';
            if (callback) {
                callback += "&app=";
            } else {
                callback = '../report/page.aspx?app=';
            }
            $('#applist').empty();
            var content = $('<ul></ul>').appendTo('#applist');
            for (var i in ps) {
                if (typeof ps[i] != 'object') continue;
                html = '';
                var m = ps[i];
                m.HasPermission = m.Status == 1;//暂写为全有权限
                var url = callback + m.Id;
                var img = '../static/img/logos/' + m.Code + '.png';
                var id = m.ID;
                var name = m.DisplayName;
                if (m.HasPermission == true) {
                    html += '<li>';
                    html += '<a class="pro" title="' + name + '">';
                    html += '<span class="img" ><img alt="' + name + '" src="' + img + '" onerror="this.src=\'' + noimg + '\'" /></span>';
                    html += '<span class="title" >' + name + '</span>';
                    html += '</a>';
                    html += '</li>';
                }
                else {
                    html += '<li class="pro noPermission">';
                    html += '<span class="lock" ></span>';
                    html += '<span class="noPermissionSp" ></span>';
                    html += '<a class="pro" title="' + name + '">';
                    html += '<span class="img" ><img alt="' + name + '" src="' + img + '" onerror="this.src=\'' + noimg + '\'" /></span>';
                    html += '<span class="title" >' + name + '</span>';
                    html += '</a>';
                    html += '</li>';
                }
                var item = $(html).attr('data-url',url).appendTo(content);
                //绑定点击事件
                if (m.HasPermission == true) {
                    //(function (item, name, url, that) { that.clickItem.call(that, item, name, url); })(item, name, url, this);
                    item.click(function () {
                        window.location = $(this).attr('data-url');
                    });
                }
            }
        }
    },
    clickItem: function (item, name, url) {
       item.click(function () {
            //保存常用业务列表
            //if (oap.cookie != null) {
            //    var cookeProList = oap.cookie.getCookie('cookeProList');
            //}
           /*
            if (typeof (cookeProList) != "undefined" && cookeProList != null) {
                cookeProList = JSON.parse(cookeProList);
                var isSame = false;
                for (var i = 0; i < cookeProList.length; i++) {
                    if (cookeProList[i].url == url) {
                        isSame = true;
                    }
                }
                if (!isSame) {
                    if (cookeProList.length > 5) {
                        var list = [];
                        for (var i = 0; i < cookeProList.length; i++) {
                            if (i != 0) {
                                list.push(cookeProList[i]);
                            }
                        }
                        list.push({ name: name, url: url })
                        cookeProList = list;
                    } else {
                        cookeProList.push({ name: name, url: url });
                    }
                    //oap.cookie.SetCookie('cookeProList', JSON.stringify(cookeProList));
                }
            } else {
                cookeProList = [{ name: name, url: url}];
                //oap.cookie.addCookie('cookeProList', JSON.stringify(cookeProList), 30 * 24);
            }*/
            window.location = $(this).attr('data-url');
        });
    },
    //查询
    search: {
        //查询字段
            keyname: 'DisplayName',
            keys: { 0: 'DisplayName', 1: 'Id' },
        //初始化查询
            init: function () {
                $('#txtsput').bind('keyup', function () {
                    applist.search.search($(this).val());
                });
            },
            change: function (n) {
                var pn = this.keys[n];
                if (this.keyname == pn) return;
                this.keyname = pn;
                var fa = $('.frwhere');
                var sa = $('.srwhere');
                fa.attr('class', 'srwhere');
                sa.attr('class', 'frwhere');
                this.search($('#txtsput').val());
            },
        //开始查找
            search: function (n) {
                applist.pager.pageindex = 1;
               /* n = $.trim(n);
                if (n == '' || n == $('#txtsput').attr('placeholder')) {
                    this.data = applist.apps;
                }
                else {*/
                    //n = n.toLowerCase();
                    this.data = [];
                    for (var i in applist.apps) {
                        var app = applist.apps[i];
                        if (typeof app != 'object' || app.Status == 0) continue;
                        this.data.push(app);
                        /*var p = applist.apps[i][this.keyname];
                        if (p) {
                            if (p.toLowerCase().indexOf(n) >= 0) {
                                this.data.push(applist.apps[i]);
                            }
                        }*/
                    }
                //}
                //重新初始化分页
                applist.pager.init(this.data);
                applist.pager.pagechange(1);
            },
            shortProduct: function () {
                var inputs = $('input[name=shortType]');
                var shortNameList = [];
                for (var i = 0; i < inputs.length; i++) {
                    if ($(inputs[i]).attr('checked')) {
                        shortNameList.push($(inputs[i]).val());
                    }
                }
                this.data = [];
                for (var i in applist.apps) {
                    for (var j = 0; j < shortNameList.length; j++) {
                        if (applist.apps[i].ProductionSortName) {
                            if (applist.apps[i].ProductionSortName.toLowerCase() == shortNameList[j].toLowerCase()) {
                                this.data.push(applist.apps[i]);
                            }
                        }
                    }
                }
                if (this.data.length == 0) {
                    this.data = applist.apps;
                }
                //重新初始化分页
                applist.pager.init(this.data);
                applist.pager.pagechange(1);
            }
    },
    //分页
    pager: {
            pageindex: 1,
            countinpage: 24,
            pagecount: 1,
        //显示多少个页码
            showcount: 10,
        //当前显示页码开始
            pagerstart: 1,
            init: function (ps) {
                ps = ps || applist.apps;
                if (ps) {
                    this.pagecount = Math.ceil(ps.length / this.countinpage);
                }
            },
            pagechange: function (p) {
                p = p || this.pageindex;
                if (p < 1) p = 1;
                if (p > this.pagecount) p = this.pagecount;
                this.pageindex = p;
                var dataindex = (p - 1) * this.countinpage;
                var dataend = dataindex + this.countinpage;
                var ps = applist.search.data || applist.apps;
                var data = ps.slice(dataindex, dataend);
                applist.bind(data);
                //显示页码
                this.show();
            },
        //显示换页
            show: function (p) {
                $('#pager').html('');
                //如果只有一页则不用显示
                if (this.pagecount < 2) return;
                p = p || this.pagerstart;
                //不超过最后一个
                if (p + this.showcount > this.pagecount + 1) p = this.pagecount - this.showcount + 1;
                if (p < 1) p = 1;
                this.pagerstart = p;
                var html = '';
                if (p > 1) {
                    //页码从第几页开始
                    var tp = Math.floor(p - this.showcount / 2);
                    if (tp < 1) tp = 1;
                    html += '<a  class="next"  href="javascript:applist.pager.show(' + tp + ');">&lt;</a>';
                }
                var pe = p + this.showcount;
                if (pe > this.pagecount + 1) pe = this.pagecount + 1;
                for (var i = this.pagerstart; i < pe; i++) {
                    if (i == this.pageindex) {
                        html += '<a class="cur" href="javascript:void(0);">' + i + '</a>';
                    }
                    else {
                        html += '<a href="javascript:applist.pager.pagechange(' + i + ');">' + i + '</a>';
                    }
                }
                if (p + this.showcount < this.pagecount + 1) {
                    var tp = Math.floor(p + this.showcount / 2);
                    html += '<a class="next" href="javascript:applist.pager.show(' + tp + ');">&gt;</a>';
                }
                $('#pager').html(html);
            }
    },
    getUserProList: function () {
        if (oap.cookie != null)
            var cookeProList = oap.cookie.getCookie('cookeProList');
        if (typeof (cookeProList) != "undefined" && cookeProList != null) {
            cookeProList = JSON.parse(cookeProList);

            for (var i in cookeProList) {
                $("#userProList").append('<li><img src="" /><a href="' + cookeProList[i].url + '" >' + cookeProList[i].name + '</a></li>');
            }
        } else {
            $("#userProList").append('<li>目前没有常用业务</li>');
        }
    },
    setPageSize: function () {
        if ($('body').height() < $(window).height()) {
            $('.proBody').height($(window).height() - ($("#header").height() + $('#footer').height()) - 70);
        }
    }
    };
    $(function () {       
        applist.apps = JSON.parse('<%=appsJson%>');
        if (applist.apps) {
            /*applist.apps.sort(function (p1, p2) {
                return p2.Status - p1.Status;
            });*/
            for (var i = applist.apps.length - 1; i >= 0; i--) {
                if (applist.apps[i].Status == 0) applist.apps.splice(i,1);
            }
        }
        applist.pager.init(); //初始化分页
        applist.sorttype.init();
        applist.search.init();
        
        applist.setPageSize();   
    })

    $(window).resize(function () {
        applist.setPageSize();
    });

</script>

    <div id="footer">
        <ul>
            <li class="copyright" > Copyright 2014</li>
            <li><a href="../admin/index.aspx" target="_blank">管理端</a>    </li>    
               
        </ul>
    </div>
</body>
</html>

<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="JM.Report.Web.admin.index" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" style="overflow:hidden;">
<head runat="server">
<meta name="renderer" content="webkit">
<meta name="force-rendering" content="webkit">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>JM报表后台管理</title>
	<link rel="shortcut icon" href="../favicon.png" type="image/x-png" />
    <link rel="icon" href="../favicon.png" type="image/x-png" />
    <link href="../static/js/jquery-ui/css/cupertino/jquery-ui-1.10.3.custom.min.css" rel="stylesheet" />
    <link href="static/css/base.css" rel="stylesheet" />
    <link href="static/css/main-master.css" rel="stylesheet" />

    <script src="../static/js/jquery.min.js"></script>
    <script src="../static/js/jquery-ui/js/jquery-ui-1.10.4.custom.min.js"></script>
    <script src="../static/js/common.js"></script>
    <script src="../static/js/jquery-validate.min.js"></script>
</head>
<body>
     <header>
        <div class="header-inner">
            <div class="left-sidebar header-left">
                <h1 class="navbar-system">JM报表后台管理</h1>
            </div>
            <div class="header-right"></div>
        </div>
    </header>
    <div class="box-header">
        <div class="left-sidebar nav-left">
            <div class="user-current"></div>
            <a class="user-logout" href="<%= ResolveUrl("~/") %>login.aspx?cmd=logout">退出</a>
        </div>
         <div class="nav-right"><span id="page-title" style="padding: 2px 6px;display: inline-block;line-height: 30px;font-weight: bold;"></span></div>
    </div>
        <div id="left-menu" class="left-sidebar">
            <hr />
            <div class="jm-menu">                
                
            </div>
            <hr />
            <p>
                <strong>Copyright © 2014 JM</strong>
            </p>
        </div>
        <div id="main" style="">            
            <div class="main-inner">
                <iframe id="page-content" scolling="no" frameborder="0" width="100%" style="overflow-x:hidden; overflow-y:auto; margin:0; padding:0;"></iframe>
            </div>
        </div>

<script>
    function redirect(url, method, data) {
        if (!url || url == '#') return;
        $('#page-content').attr('src',url);
    }

    function resetHieght(h) {
        $('#page-content')[0].height=h;
    }

    /**
    * 菜单
    **/
    function jmmenu(option) {
        //容纳菜单的容器
        this.option = option;
        var lnks = this.option.target.find('a');
        var self = this;
        lnks.click(function () {
            self.click($(this));
            return false;
        });
        lnks.attr('data-click', '1');
    };

    //菜单项
    jmmenu.prototype.click = function (target, exp) {
        var ul = target.find('+ul');
        //没有子菜单则不处理
        if (ul.length == 0) {
            this.option.target.find('a.page-current').toggleClass('page-current', false);//去除当前页面样式
            target.toggleClass('page-current', true);//当前样式
            $('#page-title').html(target.html());
            redirect(target.attr('href'));
        }
        else {
            var deep = target.attr('data-deep');
            if (exp == true) {
                //隐藏同级的其它菜单,并去除当前样式效果
                //starget.parent().parent().find('>li>ul').hide();
                //target.parent().parent().find('>li>a').toggleClass('menu-current', false);
                ul.slideDown(500).show();
                //if (deep != '1') {
                //给菜单加上当前菜单样式
                target.toggleClass('menu-current', true);
                //}
            }
            else {
                //一级菜单如果打开后再次点击则不处理
                /*if(deep == '1') {
                    return;
                }*/
                //给菜单去除当前样式
                target.toggleClass('menu-current', false);
                ul.slideUp(500).show();
            }
        }
        var parent = target.parent().parent().parent();
        if (parent.length > 0 && parent[0].tagName == 'LI') {
            var lnk = parent.find('>a');
            if (lnk.length > 0) {
                this.click(lnk, true);
            }
        }
    };

    /**
    * 加载为jquery插件
    **/
    $.fn.menu = function (options) {
        var options = $.extend({
            target: $(this)
        }, options);
        //生成新tab或返回缓存的tab
        return new jmmenu(options);
    };

    function resize() {
        //var h = $(window).height() - $('.header-inner').outerHeight();
        //var mh = $('#main .main-inner').height() + 50;
        //h = Math.max(mh, h);
        //$('#left-menu,#main').height(h);

        var h = $(window).height() - $('.header-inner').outerHeight();
        $('#left-menu').height(h - 34);
        $('#page-content').height(h - 36);
    }

    $(function () {
        var menuhtml = '';
        var menus = [
            {
                name: '报表',
                id: 1,
                items: [
                    {
                        name: '框架管理',
                        id: 11,                       
                        url: 'pages/framework.aspx'
                    },
                    {
                        name: '特性菜单',
                        id: 12,
                        url: 'pages/featuremenu.aspx'
                    },
                    {
                        name: '模板管理',
                        id: 13,
                        url: 'pages/template.aspx'
                    }
                ]
            },
            {
                name: '系统',
                id: 2,
                items: [
                    {
                        name: '业务',
                        id: 21,
                        home: true,
                        url: 'production/manger.aspx'
                    },
                    {
                        name: '数据源',
                        id: 22,
                        url: 'pages/dataserver.aspx'
                    }
                ]
            }
        ];
        for (var i = 0; i < menus.length; i++) {
            menuhtml += jmtmpl('menutemplate', { item: menus[i] });
        }

        $('.jm-menu').html('<ul>' + menuhtml + '</ul>');
        $('.jm-menu').menu().click($('.jm-menu a[data-home=true]'));

        

        resize();
        $(window).resize(resize);

        $('.user-current').html('admin');
    });

</script>

   <script id="menutemplate" type="text/html">
<$		
		if(item['visible'] == 'false') {
			return;
		}
		if(item['page'] && item['page']['visible'] == 'false') {
			return;
		}
		var url = item['url'] || '#';
        var items = item['items']; 
        var mname = item['name'];
        var path = path || '';
        var deep = deep || 1;
        path += (path?' > ':'') + mname;
        
		if(items && items.length > 0) {
$>
		<li>
			<a href="<$= url$>" data-deep="<$= deep$>" class="menu menu-current">				
				<$= mname $>
			</a>
		
		<ul>
<$
            var len = items.length;
			for (var i=0;i<len;i++) {
				var h = jmtmpl('menutemplate',{item:items[i],path:path,deep:deep+1});
$>
				<$= h$>
<$			
			}
$>
		</ul>
		</li>
<$
		}
		else {
$>
		<li>
			<a href="<$= url$>" data-deep="<$= deep$>" data-page="<$= url$>" class="page" data-path="<$= path$>" data-home="<$= item['home']$>">				
				<$= mname $>
			</a>
		</li>
<$           
		}
$>
		
</script>
</body>
</html>

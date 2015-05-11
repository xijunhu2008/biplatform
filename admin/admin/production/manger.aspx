<%@ Page Title="" Language="C#" MasterPageFile="~/admin/master/page.Master" AutoEventWireup="true" CodeBehind="manger.aspx.cs" Inherits="JM.Report.Web.admin.production.manger" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script>
        var productionServer = '../../server/production.aspx';

        var curData = null;
        function renderProductionList(data) {
            curData = data;
            if (data.Data && data.Data.length) {
                $(data.Data).each(function (i, d) {
                    if (d.CreateOn) {
                        d.CreateOn = formatDate(parseDate(d.CreateOn),'yyyy-MM-dd HH:mm:ss');
                    }
                });
            }
            var html = renderTable([{ 'name': 'Id', 'displayName': 'id' },
                { 'name': 'Code', 'displayName': '编码' },
                {
                    'name': 'DisplayName', 'displayName': '名称', renderTD: function (d) {
                        return '<a href="#" onclick="javascript: openUpdateWin('+d.Id+');return false;">'+d[this.name]+'</a>';
                    }
                },
                {
                    'name': 'Status', 'displayName': '状态', renderTD: function (d) {
                        return d[this.name]?'已启用':'已关闭';
                    }
                },
                {
                    'name': 'ReportFrameworkId', 'displayName': '框架', renderTD: function (d) {
                        var f = d[this.name];
                        if (typeof frameworks != 'undefined' && frameworks) {
                            for (var i = 0; i < frameworks.length; i++) {
                                if (frameworks[i].Id == f) return frameworks[i].DisplayName;
                            }
                        }
                        return f;
                    }
                },
                { 'name': 'CreateOn', 'displayName': '创建日期' },
                {
                    'name': 'Status', 'displayName': '操作', renderTD: function (d) {
                        var s = d[this.name];
                        return '<a href="#" onclick="javascript:setAppState('+d['Id']+','+(s?0:1)+',this.innerHTML);return false;">'+(s ? '关闭' : '开启') + '</a>';
                    }
                }
            ],
                data.Data);
            $('#tb_app_list').html(html);
            $('#tb_app_list_pager').paging({ index: data.Index, count: data.PageCount });
            resetHieght();
        }

        function searchApp(page) {
            var par = { cmd: 'search', page: page || 1,count: 12 };
            par.status = $('#txt-status').val();
            if (par.status == '-1') par.status = '';
            par.name = $('#txt-name').val();
            request(productionServer, par, function (data, ex) {
                
                if (data) {
                    if(typeof data == 'string') data = JSON.parse(data);
                    renderProductionList(data);
                }
            });
        }

        function addApp(callback) {
            var app = {
                code: $('#win-app-add [name=txt-app-code]').val(),
                name: $('#win-app-add [name=txt-app-name]').val(),
                framework: $('#win-app-add [name=sel-framework]').val(),
                status: 1
            };
            request(productionServer + "?cmd=add", app,'post', function (r, ex) {
                if (Number(r) > 0) {
                    searchApp();
                    message.success('新增成功');
                    callback && callback(1);
                }
                else {
                    message.error(r || '新增失败');
                    callback && callback(0);
                }
                
            });
        }

        function updateApp(callback) {
            var app = {
                id: $('#win-app-update').attr('data-id'),
                code: $('#win-app-update [name=txt-app-code]').val(),
                name: $('#win-app-update [name=txt-app-name]').val(),
                framework: $('#win-app-update [name=sel-framework]').val()
            };
            request(productionServer + "?cmd=update", app, 'post', function (r, ex) {
                if (Number(r) > 0) {
                    searchApp();
                    message.success('保存成功');
                    callback && callback(1);
                }
                else {
                    message.error(r || '保存失败');
                    callback && callback(0);
                }

            });
        }

        //设定业务状态
        function setAppState(id, state, n,callback) {
            if (!confirm('确定要' + n + "当前业务？")) return false;
            request(productionServer + "?cmd=setStatus", { id: id, status: state }, 'post', function (r, ex) {
                if (Number(r) > 0) {
                    searchApp();
                    message.success(n + '成功');
                    callback && callback(1);
                }
                else {
                    message.error(r || n+'失败');
                    callback && callback(0);
                }

            });
        }

        //打开修改窗口
        function openUpdateWin(id) {
            var app = null;
            if (curData && curData.Data) {
                $(curData.Data).each(function (i, d) {
                    if (d.Id == id) {
                        app = d;
                        return false;
                    }
                });
            }
            if (app) {
                $('#win-app-update').attr('data-id', id);
                $('#win-app-update [name=txt-app-code]').val(app.Code);
                $('#win-app-update [name=txt-app-name]').val(app.DisplayName);
                framework: $('#win-app-update [name=sel-framework]').val(app.ReportFrameworkId);
                $('#win-app-update').dialog('open');
            }            
        }

        $(function () {
            /**
         * 分页组件初始化参数
         */
            $('#tb_app_list_pager').paging({
                showCount: 6,
                change: function (p) {
                    searchApp(p);
                }
            });

            getFrameworks(function (frameworks) {
                if (frameworks) {
                    var fs1 = $('#win-app-add [name=sel-framework]');
                    var fs2 = $('#win-app-update [name=sel-framework]');
                    $(frameworks).each(function (i, f) {
                        $('<option></option>').html(f.DisplayName).attr('value', f.Id).appendTo(fs1);
                        $('<option></option>').html(f.DisplayName).attr('value', f.Id).appendTo(fs2);
                    });
                }
            });

            searchApp(1);

            $('#win-app-add').dialog({
                width: 400,
                height: 300,
                autoOpen: false,
                buttons: [
                    {
                        text: '新增', click: function () {
                            addApp(function (r) {
                                if (r) {
                                    $('#win-app-add').dialog('close');
                                }
                            });
                        }
                    },
                    {
                        text: '取消', click: function () {
                                $(this).dialog('close');  
                        }
                    }
                ]
            });

            $('#win-app-update').dialog({
                width: 400,
                height: 300,
                autoOpen: false,
                buttons: [
                    {
                        text: '保存', click: function () {
                            updateApp(function (r) {
                                if (r) {
                                    $('#win-app-update').dialog('close');
                                }
                            });
                        }
                    },
                    {
                        text: '取消', click: function () {
                            $(this).dialog('close');
                        }
                    }
                ]
            });
        });
    </script>
    <ul class="page-toolbar clearfix">
        <li><a href="#" class="jsAdd" onclick="javascript:$('#win-app-add').dialog('open');return false;">新增</a></li>
    </ul>
    <ul class="page-toolbar clearfix">
        <li><label>名称</label><input type="text" id="txt-name" /></li>
        <li><label>状态</label><select id="txt-status"><option value="-1">所有</option><option value="0">已关闭</option><option value="1" selected="selected">已启用</option></select></li>
        <li><a href="#" class="jsSearch" onclick="searchApp()">查询</a></li>
    </ul>
    <div id="tb_app_list"></div>
    <div id="tb_app_list_pager"></div>

    <!--新增业务窗体-->
    <div id="win-app-add" title="新增业务" class="edit-content" style="display:none;">
        <ul>
            <li><label>编号</label><input name="txt-app-code" type="text" required maxlength="8" style="width: 180px;" placeholder="业务编辑（唯一）"/></li>
            <li><label>名称</label><input name="txt-app-name" type="text" required maxlength="16" style="width: 100px;" placeholder="业务名称"/></li>
            <li><label>框架</label><select name="sel-framework"><option value="0" selected="selected">无</option></select></li>            
        </ul>
    </div>

    <!--新增业务窗体-->
    <div id="win-app-update" title="修改业务" class="edit-content" style="display:none;">
        <ul>
            <li><label>编号</label><input name="txt-app-code" type="text" required maxlength="8" style="width: 180px;" placeholder="业务编辑（唯一）"/></li>
            <li><label>名称</label><input name="txt-app-name" type="text" required maxlength="16" style="width: 100px;" placeholder="业务名称"/></li>
            <li><label>框架</label><select name="sel-framework"><option value="0" selected="selected">无</option></select></li>            
        </ul>
    </div>
</asp:Content>

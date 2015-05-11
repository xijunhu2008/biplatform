<%@ Page Title="" Language="C#" MasterPageFile="~/admin/master/page.Master" AutoEventWireup="true" CodeBehind="dataserver.aspx.cs" Inherits="JM.Report.Web.admin.pages.dataserver" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script>
        var dataServer = '../server/dataserver.aspx';
        var serverTyps = JSON.parse('<%= DoNet.Common.Serialization.JSon.ModelToJson(JM.Report.Model.DataServer.GetServerTypes())%>');
        var curData = null;
        function renderServerList(data) {
            curData = data;
            
            var html = renderTable([{ 'name': 'Id', 'displayName': 'id' },                
                {
                    'name': 'DisplayName', 'displayName': '名称', renderTD: function (d) {
                        return '<a href="#" onclick="javascript: openUpdateWin(' + d.Id + ');return false;">' + d[this.name] + '</a>';
                    }
                },
                {
                    'name': 'Label', 'displayName': '编码'
                },
                {
                    'name': 'Host', 'displayName': '主机'
                },
                {
                    'name': 'Port', 'displayName': '端口'
                },
                {
                    'name': 'User', 'displayName': '用户'
                },
                {
                    'name': 'ServerType', 'displayName': '数据源类型', renderTD: function (d) {
                        var f = d[this.name];
                        if (typeof serverTyps != 'undefined' && serverTyps) {
                            for (var i = 0; i < serverTyps.length; i++) {
                                if (serverTyps[i].Key == f) return serverTyps[i].Value;
                            }
                        }
                        return f;
                    }
                },
                {
                    'name': 'DataBase', 'displayName': '数据源'
                },
                {
                    'name': 'Status', 'displayName': '操作', renderTD: function (d) {
                        var s = d[this.name];
                        return '<a href="#" onclick="javascript:deleteServer(' + d['Id'] + ');return false;">删除</a>';
                    }
                }
            ],
                data.Data);
            $('#tb_server_list').html(html);
            $('#tb_server_list_pager').paging({ index: data.Index, count: data.PageCount });
            resetHieght();
        }

        function searchServer(page) {
            var par = { cmd: 'search', page: page || 1, count: 12 };
            par.label = $('#txt-code').val();           
            par.name = $('#txt-name').val();
            par.host = $('#txt-host').val();
            var st = $('#txt-servertype').val();
            if (st) par.servertype = st;
            request(dataServer, par, function (data, ex) {
                debugger;
                if (data) {
                    if(typeof data == 'string') data = JSON.parse(data);
                    renderServerList(data);
                }
            });
            return false;
        }

        function addServer(callback) {
            var server = {
                id: 0,
                label: $('#win-server-add [name=txt-server-code]').val(),
                name: $('#win-server-add [name=txt-server-name]').val(),
                host: $('#win-server-add [name=txt-server-host]').val(),
                port: $('#win-server-add [name=txt-server-port]').val(),
                database: $('#win-server-add [name=txt-server-database]').val(),
                servertype: $('#win-server-add [name=sel-servertype]').val(),
                otherattr: $('#win-server-add [name=txt-server-other]').val(),
                user: $('#win-server-add [name=txt-server-user]').val(),
                password: $('#win-server-add [name=txt-server-pwd]').val()
            };
            request(dataServer + "?cmd=add", server, 'post', function (r, ex) {
                if (Number(r) > 0) {
                    searchServer();
                    message.success('新增成功');
                    callback && callback(1);
                }
                else {
                    message.error(r || '新增失败');
                    callback && callback(0);
                }

            });
        }

        function updateServer(callback) {
            var server = {
                id: $('#win-server-update').attr('data-id'),
                label: $('#win-server-update [name=txt-server-code]').val(),
                name: $('#win-server-update [name=txt-server-name]').val(),
                host: $('#win-server-update [name=txt-server-host]').val(),
                port: $('#win-server-update [name=txt-server-port]').val(),
                database: $('#win-server-update [name=txt-server-database]').val(),
                servertype: $('#win-server-update [name=sel-servertype]').val(),
                otherattr: $('#win-server-update [name=txt-server-other]').val(),
                user: $('#win-server-update [name=txt-server-user]').val(),
                password: $('#win-server-update [name=txt-server-pwd]').val()
            };
            request(dataServer + "?cmd=update", server, 'post', function (r, ex) {
                if (Number(r) > 0) {
                    searchServer();
                    message.success('保存成功');
                    callback && callback(1);
                }
                else {
                    message.error(r || '保存失败');
                    callback && callback(0);
                }

            });
        }

        //删除
        function deleteServer(id) {
            if (confirm('删除有可能会导致报表无法正常访问，确定删除？')) {
                request(dataServer + "?cmd=delete", { id: id }, 'post', function (r, ex) {
                    if (Number(r) > 0) {
                        searchServer();
                        message.success('删除成功');
                    }
                    else {
                        message.error(r || '删除失败');
                    }

                });
            }            
        }

        //打开修改窗口
        function openUpdateWin(id) {
            var data = null;
            if (curData && curData.Data) {
                $(curData.Data).each(function (i, d) {
                    if (d.Id == id) {
                        data = d;
                        return false;
                    }
                });
            }
            if (data) {
                $('#win-server-update').attr('data-id', id);
                $('#win-server-update [name=txt-server-code]').val(data.Label);
                $('#win-server-update [name=txt-server-name]').val(data.DisplayName);
                $('#win-server-update [name=txt-server-host]').val(data.Host);
                $('#win-server-update [name=txt-server-port]').val(data.Port);
                $('#win-server-update [name=txt-server-database]').val(data.DataBase);
                $('#win-server-update select[name=sel-servertype]').val(data.ServerType);
                $('#win-server-update [name=txt-server-user]').val(data.User);
                $('#win-server-update [name=txt-server-pwd]').val(data.Password);
                $('#win-server-update [name=txt-server-other]').val(data.OtherAttr);
                $('#win-server-update').dialog('open');
            }
        }

        $(function () {
            /**
         * 分页组件初始化参数
         */
            $('#tb_server_list_pager').paging({
                showCount: 6,
                change: function (p) {
                    searchServer(p);
                }
            });

            $(serverTyps).each(function (i, st) {
                $('#txt-servertype').append('<option value="' + st.Key + '">' + st.Value + '</option>');
                $('#win-server-add select[name=sel-servertype]').append('<option value="' + st.Key + '">' + st.Value + '</option>');
                $('#win-server-update select[name=sel-servertype]').append('<option value="' + st.Key + '">' + st.Value + '</option>');
            });

           

            searchServer(1);

            $('#win-server-add').dialog({
                width: 400,
                height: 410,
                modal: true,
                autoOpen: false,
                buttons: [
                    {
                        text: '新增', click: function () {
                            addServer(function (r) {
                                if (r) {
                                    $('#win-server-add').dialog('close');
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

            $('#win-server-update').dialog({
                width: 400,
                height: 410,
                modal: true,
                autoOpen: false,
                buttons: [
                    {
                        text: '保存', click: function () {
                            updateServer(function (r) {
                                if (r) {
                                    $('#win-server-update').dialog('close');
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
        <li><a href="#" class="jsAdd" onclick="javascript:$('#win-server-add').dialog('open');return false;">新增</a></li>
    </ul>
    <ul class="page-toolbar clearfix">
        <li><label>名称</label><input type="text" id="txt-name" /></li>
        <li><label>编码</label><input type="text" id="txt-code" /></li>
        <li><label>主机</label><input type="text" id="txt-host" /></li>
        <li><label>服务器类型</label><select id="txt-servertype"><option value="" selected>全部</option></select></li>
        <li><a href="#" class="jsSearch" onclick="searchServer()">查询</a></li>
    </ul>
    <div id="tb_server_list"></div>
    <div id="tb_server_list_pager"></div>

    <!--窗体-->
    <div id="win-server-add" title="新增数据源" class="edit-content" style="display:none;">
        <ul>
            <li><label>名称</label><input name="txt-server-name" type="text" required maxlength="16" style="width: 180px;" placeholder="名称"/></li>
            <li><label>编码</label><input name="txt-server-code" type="text" required maxlength="16" style="width: 100px;" placeholder="编码，必须唯一"/></li>
            <li><label>类型</label><select name="sel-servertype"></select></li>      
            <li><label>主机</label><input name="txt-server-host" type="text" required maxlength="16" style="width: 150px;" placeholder=""/></li>
            <li><label>端口</label><input name="txt-server-port" type="text" required maxlength="16" style="width: 80px;" placeholder=""/></li>
            <li><label>数据库</label><input name="txt-server-database" type="text" required maxlength="32" style="width: 150px;" placeholder=""/></li>
            <li><label>用户</label><input name="txt-server-user" type="text" required maxlength="16" style="width: 130px;" placeholder=""/></li>
            <li><label>密码</label><input name="txt-server-pwd" type="password" required maxlength="32" style="width: 130px;" placeholder=""/></li>      
            <li><label>其它属性</label><input name="txt-server-other" type="text" required maxlength="16" style="width: 150px;" placeholder=""/></li>  
        </ul>
    </div>

    <!--窗体-->
    <div id="win-server-update" title="修改数据源" class="edit-content" style="display:none;">
        <ul>
            <li><label>名称</label><input name="txt-server-name" type="text" required maxlength="16" style="width: 180px;" placeholder="名称"/></li>
            <li><label>编码</label><input name="txt-server-code" type="text" required maxlength="16" style="width: 100px;" placeholder="编码，必须唯一"/></li>
            <li><label>类型</label><select name="sel-servertype"></select></li>      
            <li><label>主机</label><input name="txt-server-host" type="text" required maxlength="16" style="width: 150px;" placeholder=""/></li>
            <li><label>端口</label><input name="txt-server-port" type="text" required maxlength="16" style="width: 80px;" placeholder=""/></li>
            <li><label>数据库</label><input name="txt-server-database" type="text" required maxlength="32" style="width: 150px;" placeholder=""/></li>
            <li><label>用户</label><input name="txt-server-user" type="text" required maxlength="16" style="width: 130px;" placeholder=""/></li>
            <li><label>密码</label><input name="txt-server-pwd" type="password" required maxlength="32" style="width: 130px;" placeholder=""/></li>      
            <li><label>其它属性</label><input name="txt-server-other" type="text" required maxlength="16" style="width: 150px;" placeholder=""/></li>    
        </ul>
    </div>
</asp:Content>

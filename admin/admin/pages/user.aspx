<%@ Page Title="" Language="C#" MasterPageFile="~/admin/master/page.Master" AutoEventWireup="true" CodeBehind="user.aspx.cs" Inherits="JM.Report.Web.admin.pages.user" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script>
        var dataServer = '../server/user.aspx';
        var curData = null;

        function renderUserList(data) {
            curData = data;
            var html = renderTable([{ 'name': 'Id', 'displayName': 'id' },
                {
                    'name': 'NickName', 'displayName': '名称', renderTD: function (d) {
                        return '<a href="#" onclick="javascript: openUpdateWin(' + d.Id + ');return false;">' + d[this.name] + '</a>';
                    }
                },
                {
                    'name': 'Creater', 'displayName': '创建人'
                },
                {
                    'name': 'CreateOn', 'displayName': '创建时间', renderTD: function (d) {
                        var dt = parseDate(d[this.name]);
                        return formatDate(dt, 'yyyy-MM-dd HH:mm:ss')
                    }
                },
                {
                    'name': 'Account', 'displayName': '操作', renderTD: function (d) {
                        var s = d[this.name];
                        return '<a href="#" onclick="javascript:deleteUser(\'' + s + '\');return false;">删除</a>';
                    }
                }
            ],
                data.Data);
            $('#tb_user_list').html(html);
            $('#tb_user_list_pager').paging({ index: data.Index, count: data.PageCount });
            resetHieght();
        }

        function searchUser(page) {
            var par = { cmd: 'search', page: page || 1, count: 12 };
            par.name = $('#txt-name').val();
            par.account = "";
            request(dataServer, par, function (data, ex) {
                if (data) {
                    if (typeof data == 'string') data = JSON.parse(data);
                    renderUserList(data);
                }
            });
            return false;
        }

        function addUser(callback) {
            var user = {
                Id: 0,
                Account:$('#win-user-add [name=txt-user-account]').val(),
                NickName: $('#win-user-add [name=txt-user-name]').val(),
                GroupRelegations: []
            };
            var pwd = $('#win-user-add [name=txt-user-password]').val();
            var cpwd = $('#win-user-add [name=txt-user-password-confirm]').val();
            if (!pwd) {
                message.warning('密码不可为空！');
                return false;
            }
            if (pwd != cpwd) {
                message.warning('输入的确认密码不一致，请确认！');
                return false;
            }
            $('#win-user-add input[name=group]:checked').each(function (i, g) {
                user.GroupRelegations.push({ Account: user.Account, GroupId: $(g).attr('data-id') });
            });
            request(dataServer + "?cmd=add", { "user": JSON.stringify(user), "password": pwd }, 'post', function (r, ex) {
                if (Number(r) > 0) {
                    searchUser();
                    message.success('新增成功');
                    callback && callback(1);
                }
                else {
                    message.error(ex || '新增失败');
                    callback && callback(0);
                }

            });
        }

        function updateUser(callback) {
            var user = {
                Account: $('#win-user-update').attr('data-account'),
                NickName: $('#win-user-update [name=txt-user-name]').val(),
                GroupRelegations: []
            };
            $('#win-user-update input[name=group]:checked').each(function (i, g) {
                user.GroupRelegations.push({ Account: user.Account, GroupId: $(g).attr('data-id') });
            });
            request(dataServer + "?cmd=update", {"user":JSON.stringify(user)}, 'post', function (r, ex) {
                if (Number(r) > 0) {
                    searchUser();
                    message.success('保存成功');
                    callback && callback(1);
                }
                else {
                    message.error(ex || '保存失败');
                    callback && callback(0);
                }

            });
        }

        //删除
        function deleteUser(account) {
            if (confirm('确定删除？')) {
                request(dataServer + "?cmd=delete", { account: account }, 'post', function (r, ex) {
                    if (Number(r) > 0) {
                        searchUser();
                        message.success('删除成功');
                    }
                    else {
                        message.error(ex || '删除失败');
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
                clearGroup('#win-user-update');
                $('#win-user-update input[name=group]').each(function (i, g) {
                    $(data.GroupRelegations).each(function (j, r) {
                        if (r.GroupId == $(g).attr('data-id')) {
                            g.checked = true;
                            return false;
                        }
                    });
                });
                $('#win-user-update').attr('data-account', data.Account);
                $('#win-user-update [name=txt-user-name]').val(data.NickName);
                $('#win-user-update').dialog('open');
            }
        }

        function clearGroup(pwin) {
            $(pwin + ' input[name=group]').each(function (i, g) {
                g.checked = false;
            });
        }


        $(function () {
            /**
         * 分页组件初始化参数
         */
            $('#tb_user_list_pager').paging({
                showCount: 6,
                change: function (p) {
                    searchUser(p);
                }
            });
            searchUser(1);

            $('#win-user-add').dialog({
                width: 400,
                height: 410,
                modal: true,
                autoOpen: false,
                buttons: [
                    {
                        text: '新增', click: function () {
                            addUser(function (r) {
                                if (r) {
                                    $('#win-user-add').dialog('close');
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

            $('#win-user-update').dialog({
                width: 400,
                height: 410,
                modal: true,
                autoOpen: false,
                buttons: [
                    {
                        text: '保存', click: function () {
                            updateUser(function (r) {
                                if (r) {
                                    $('#win-user-update').dialog('close');
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
        <li><a href="#" class="jsAdd" onclick="javascript:clearGroup('#win-user-add');$('#win-user-add').dialog('open');return false;">新增</a></li>
    </ul>
    <ul class="page-toolbar clearfix">
        <li><label>名称</label><input type="text" id="txt-name" /></li>
        <li><a href="#" class="jsSearch" onclick="searchUser()">查询</a></li>
    </ul>
    <div id="tb_user_list"></div>
    <div id="tb_user_list_pager"></div>

    <!--窗体-->
    <div id="win-user-add" title="新增用户" class="edit-content" style="display:none;">
        <ul>
            <li><label>帐号</label><input name="txt-user-account" type="text" required maxlength="16" style="width: 180px;" placeholder="用户帐号"/></li>
            <li><label>名称</label><input name="txt-user-name" type="text" required maxlength="16" style="width: 180px;" placeholder="名称"/></li>
             <li><label>密码</label><input name="txt-user-password" type="password" required maxlength="16" style="width: 180px;" placeholder="密码"/></li>
             <li><label>密码确认</label><input name="txt-user-password-confirm" type="password" required maxlength="16" style="width: 180px;" placeholder="密码确认"/></li>
            <li>
                <label>所属组</label>
                <hr />
                <ul>
                    <%
                        var groups = JM.Report.Bll.Factory.CreateGroupApp().Search(0, 0, null);
                        foreach (var p in groups.Data)
                        {
                        %>
                    <li><input type="checkbox" name="group" data-id="<%=p.Id %>" /><span><%=p.GroupName %></span></li>
                    <%
                        }
                         %>
                </ul>
            </li>
        </ul>
    </div>

    <!--窗体-->
    <div id="win-user-update" title="修改用户" class="edit-content" style="display:none;">
        <ul>
            <li><label>名称</label><input name="txt-user-name" type="text" required maxlength="16" style="width: 180px;" placeholder="名称"/></li>
            <li>
                <label>所属组</label>
                <hr />
                <ul>
                    <%
                        foreach (var p in groups.Data)
                        {
                        %>
                    <li><input type="checkbox" name="group" data-id="<%=p.Id %>" /><span><%=p.GroupName %></span></li>
                    <%
                        }
                         %>
                </ul>
            </li>
        </ul>
    </div>
</asp:Content>

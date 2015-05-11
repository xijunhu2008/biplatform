<%@ Page Title="" Language="C#" MasterPageFile="~/admin/master/page.Master" AutoEventWireup="true" CodeBehind="group.aspx.cs" Inherits="JM.Report.Web.admin.pages.group" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script>
        var dataServer = '../server/group.aspx';
        var curData = null;
       
        function renderGroupList(data) {
            curData = data;
            var html = renderTable([{ 'name': 'Id', 'displayName': 'id' },
                {
                    'name': 'GroupName', 'displayName': '名称', renderTD: function (d) {
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
                    'name': 'Id', 'displayName': '操作', renderTD: function (d) {
                        var s = d[this.name];
                        return '<a href="#" onclick="javascript:deleteGroup(' + d['Id'] + ');return false;">删除</a>';
                    }
                }
            ],
                data.Data);
            $('#tb_group_list').html(html);
            $('#tb_group_list_pager').paging({ index: data.Index, count: data.PageCount });
            resetHieght();
        }

        function searchGroup(page) {
            var par = { cmd: 'search', page: page || 1, count: 12 };
            par.name = $('#txt-name').val();
            request(dataServer, par, function (data, ex) {
                if (data) {
                    if (typeof data == 'string') data = JSON.parse(data);
                    renderGroupList(data);
                }
            });
            return false;
        }

        function addGroup(callback) {
            var group = {
                Id: 0,
                GroupName: $('#win-group-add [name=txt-group-name]').val(),
                ProductionRelegations: getReletaion('#win-group-add')
            };
            request(dataServer + "?cmd=save", { "group": JSON.stringify(group) }, 'post', function (r, ex) {
                if (Number(r) > 0) {
                    searchGroup();
                    message.success('新增成功');
                    callback && callback(1);
                }
                else {
                    message.error(r || '新增失败');
                    callback && callback(0);
                }

            });
        }

        function updateGroup(callback) {
            var group = {
                Id: $('#win-group-update').attr('data-id'),
                GroupName: $('#win-group-update [name=txt-group-name]').val(),
                ProductionRelegations: getReletaion('#win-group-update')
            };
            request(dataServer + "?cmd=save", { "group": JSON.stringify(group) }, 'post', function (r, ex) {
                if (Number(r) > 0) {
                    searchGroup();
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
        function deleteGroup(id) {
            if (confirm('确定删除？')) {
                request(dataServer + "?cmd=delete", { id: id }, 'post', function (r, ex) {
                    if (Number(r) > 0) {
                        searchGroup();
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
                clearProduction('#win-group-update');
                $('#win-group-update').attr('data-id', id);
                $('#win-group-update [name=txt-group-name]').val(data.GroupName);

                //绑定业务权限
                $('#win-group-update input[name=production]').attr('checked', false);
                if (data.ProductionRelegations && data.ProductionRelegations.length) {
                    $(data.ProductionRelegations).each(function (i, p) {
                        $('#win-group-update input[data-id=' + p.ProductionId + ']')[0].checked = true;
                    });
                }
                $('#win-group-update').dialog('open');
            }
        }

        //清队业务选择
        function clearProduction(pwin) {
            $(pwin + ' input[name=production]').each(function (i, chk) {
                chk.checked = false;
            });
        }

        function getReletaion(pwin) {
            var ret = [];
            $(pwin + ' input[name=production]:checked').each(function (i, chk) {
                ret.push({
                    ProductionId:$(chk).attr('data-id')
                });
            });
            return ret;
        }

        $(function () {
            /**
         * 分页组件初始化参数
         */
            $('#tb_group_list_pager').paging({
                showCount: 6,
                change: function (p) {
                    searchGroup(p);
                }
            });
            searchGroup(1);

            $('#win-group-add').dialog({
                width: 400,
                height: 410,
                modal: true,
                autoOpen: false,
                buttons: [
                    {
                        text: '新增', click: function () {
                            addGroup(function (r) {
                                if (r) {
                                    $('#win-group-add').dialog('close');
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

            $('#win-group-update').dialog({
                width: 400,
                height: 410,
                modal: true,
                autoOpen: false,
                buttons: [
                    {
                        text: '保存', click: function () {
                            updateGroup(function (r) {
                                if (r) {
                                    $('#win-group-update').dialog('close');
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
        <li><a href="#" class="jsAdd" onclick="javascript:clearProduction('#win-group-add');$('#win-group-add').dialog('open');return false;">新增</a></li>
    </ul>
    <ul class="page-toolbar clearfix">
        <li><label>名称</label><input type="text" id="txt-name" /></li>
        <li><a href="#" class="jsSearch" onclick="searchGroup()">查询</a></li>
    </ul>
    <div id="tb_group_list"></div>
    <div id="tb_group_list_pager"></div>

    <!--窗体-->
    <div id="win-group-add" title="新增用户组" class="edit-content" style="display:none;">
        <ul>
            <li><label>名称</label><input name="txt-group-name" type="text" required maxlength="16" style="width: 180px;" placeholder="名称"/></li>
            <li>
                <label>业务权限</label>
                <hr />
                <ul>
                    <%
                        var productions = JM.Report.Bll.Factory.CreateProductionApp().GetAll();
                        foreach (var p in productions)
                        {
                            if (p.Status == JM.Report.Model.Production.ProductionStatus.Close) continue;
                        %>
                    <li><input type="checkbox" name="production" data-id="<%=p.Id %>" /><span><%=p.DisplayName %></span></li>
                    <%
                        }
                         %>
                </ul>
            </li>
        </ul>
    </div>

    <!--窗体-->
    <div id="win-group-update" title="修改用户组" class="edit-content" style="display:none;">
        <ul>
            <li><label>名称</label><input name="txt-group-name" type="text" required maxlength="16" style="width: 180px;" placeholder="名称"/></li>
            <li>
                <label>业务权限</label>
                <hr />
                <ul>
                    <%
                        foreach (var p in productions)
                        {
                            if (p.Status == JM.Report.Model.Production.ProductionStatus.Close) continue;
                        %>
                    <li><input type="checkbox" name="production" data-id="<%=p.Id %>" /><span><%=p.DisplayName %></span></li>
                    <%
                        }
                         %>
                </ul>
            </li>
        </ul>
    </div>
</asp:Content>

<%@ Page Title="" Language="C#" MasterPageFile="~/admin/master/page.Master" AutoEventWireup="true" CodeBehind="framework.aspx.cs" Inherits="JM.Report.Web.admin.pages.framework" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <%--工具栏--%>
    <ul class="page-toolbar clearfix">
        <li><a href="#" class="jsAdd" onclick="javascript:$('#win-server-add').dialog('open');return false;">新增</a></li>
    </ul>

    <%--列表--%>
    <div id="tb_server_list"></div>


    <!--窗体-->
    <div id="win-server-add" title="新增框架" class="edit-content" style="display:none;">
        <ul>
            <li><label>名称</label><input name="txt-server-name" type="text" required maxlength="16" style="width: 180px;" placeholder="名称"/></li>
        </ul>
    </div>

    <!--窗体-->
    <div id="win-server-update" title="修改框架" class="edit-content" style="display:none;">
        <ul>
            <li><label>名称</label><input name="txt-server-name" type="text" required maxlength="16" style="width: 180px;" placeholder="名称"/></li>
        </ul>
    </div>



        <script>
            var dataServer = '../server/framework.aspx';

            var curData = null;
            function renderFwList(data) {
                curData = data;

                var html = renderTable([{ 'name': 'Id', 'displayName': 'id' },
                    {
                        'name': 'DisplayName', 'displayName': '名称', renderTD: function (d) {
                            return '<a href="#" onclick="javascript: openUpdateWin(' + d.Id + ');return false;">' + d[this.name] + '</a>';
                        }
                    },
                    {
                        'name': 'Creater', 'displayName': '创建人'
                    },
                    {
                        'name': 'CreateOn', 'displayName': '创建日期', renderTD: function (d) {
                            var dt = parseDate(d[this.name]);
                            return formatDate(dt, 'yyyy-MM-dd HH:mm:ss')
                        }
                    },
                    {
                        'name': 'Id', 'displayName': '操作', renderTD: function (d) {
                            return '<a href="frameworkmenu.aspx?id=' + d['Id'] + '">编辑</a>&nbsp;<a href="#" onclick="javascript:deleteFw(' + d['Id'] + ');return false;">删除</a>';
                        }
                    }
                ], data);
                $('#tb_server_list').html(html);
                $('#tb_server_list_pager').paging({ index: data.Index, count: data.PageCount });
                resetHieght();
            }

            
            function searchFw(page) {
                var par = { cmd: 'search', page: page || 1, count: 12 };
                request(dataServer, par, function (data, ex) {
                    if (data) {
                        //data = JSON.parse(data);
                        renderFwList(data);
                    }
                });
                return false;
            }

            function addFw(callback) {
                var fw = {
                    Id: 0,
                    DisplayName: $('#win-server-add [name=txt-server-name]').val(),
                };
                request(dataServer + "?cmd=add", fw, 'post', function (r, ex) {
                    if (Number(r) > 0) {
                        searchFw();
                        message.success('新增成功');
                        callback && callback(1);
                    }
                    else {
                        message.error(r || '新增失败');
                        callback && callback(0);
                    }

                });
            }

            function updateFw(callback) {
                var fw = {
                    Id: $('#win-server-update').attr('data-id'),
                    DisplayName: $('#win-server-update [name=txt-server-name]').val()
                };
                request(dataServer + "?cmd=update", fw, 'post', function (r, ex) {
                    if (Number(r) > 0) {
                        searchFw();
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
            function deleteFw(id) {
                if (confirm('确定删除？')) {
                    request(dataServer + "?cmd=delete", { id: id }, 'post', function (r, ex) {
                        if (Number(r) > 0) {
                            searchFw();
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
                if (curData) {
                    for (var i = 0; i < curData.length; i++) {
                        var item = curData[i];
                        if (item.Id == id) {
                            data = item;
                            break;
                        }
                    }
                }

                if (data) {
                    $('#win-server-update').attr('data-id', id);
                    $('#win-server-update [name=txt-server-name]').val(data.DisplayName);
                    $('#win-server-update').dialog('open');
                }
            }

            $(function () {
                searchFw(1);

                $('#win-server-add').dialog({
                    width: 400,
                    height: 200,
                    modal: true,
                    autoOpen: false,
                    position: 'top',
                    buttons: [
                        {
                            text: '新增', click: function () {
                                addFw(function (r) {
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
                    height: 200,
                    modal: true,
                    autoOpen: false,
                    buttons: [
                        {
                            text: '保存', click: function () {
                                updateFw(function (r) {
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
</asp:Content>

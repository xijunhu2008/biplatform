<%@ Page Title="" Language="C#" MasterPageFile="~/admin/master/page.Master" AutoEventWireup="true" CodeBehind="template.aspx.cs" Inherits="JM.Report.Web.admin.pages.template" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <script>
        var templateServer = '../server/template.aspx';

        var curData = null;
        function renderTemplateList(data) {
            curData = data;
            var html = renderTable([{ 'name': 'Id', 'displayName': 'id' },
                {
                    'name': 'DisplayName', 'displayName': '名称', renderTD: function (d) {
                        return '<a href="#" onclick="javascript: openUpdateWin(' + d.Id + ');return false;">' + d[this.name] + '</a>';
                    }
                },
                {
                    'name': 'Id', 'displayName': '操作', renderTD: function (d) {
                        return '<a href="#" onclick="javascript:if(confirm(\'确定删除？\'))deleteTemplate('+d.Id+');return false;">删除</a>';
                    }
                }
            ],
                data.Data);
            $('#tb_template_list').html(html);
            $('#tb_template_list_pager').paging({ index: data.Index, count: data.PageCount });
            resetHieght();
        }

        function searchTemplate(page) {
            var par = { cmd: 'search', page: page || 1, count: 12 };
            par.name = $('#txt-name').val();
            request(templateServer, par, function (data, ex) {
                if (data) {
                    if (typeof data == 'string') data = JSON.parse(data);
                    renderTemplateList(data);
                }
            });
        }

        function addTemplate(callback) {
            var template = {
                name: $('#win-template-add [name=txt-template-name]').val(),
                content: $('#win-template-add [name=txt-template-content]').val()
            };
            request(templateServer + "?cmd=save", template, 'post', function (r, ex) {
                if (Number(r) > 0) {
                    searchTemplate();
                    message.success('新增成功');
                    callback && callback(1);
                }
                else {
                    message.error(r || '新增失败');
                    callback && callback(0);
                }

            });
        }

        function updateTemplate(callback) {
            var template = {
                id: $('#win-template-update').attr('data-id'),
                name: $('#win-template-update [name=txt-template-name]').val(),
                content: $('#win-template-update [name=txt-template-content]').val()
            };
            request(templateServer + "?cmd=save", template, 'post', function (r, ex) {
                if (Number(r) > 0) {
                    searchTemplate();
                    message.success('保存成功');
                    callback && callback(1);
                }
                else {
                    message.error(r || '保存失败');
                    callback && callback(0);
                }

            });
        }

        function deleteTemplate(id,callback) {
            var template = {
                id: id
            };
            request(templateServer + "?cmd=delete", template, 'post', function (r, ex) {
                if (Number(r) > 0) {
                    searchTemplate();
                    message.success('删除成功');
                    callback && callback(1);
                }
                else {
                    message.error(r || '删除失败');
                    callback && callback(0);
                }

            });
        }


        //打开修改窗口
        function openUpdateWin(id) {
            var template = null;
            if (curData && curData.Data) {
                $(curData.Data).each(function (i, d) {
                    if (d.Id == id) {
                        template = d;
                        return false;
                    }
                });
            }
            if (template) {
                $('#win-template-update').attr('data-id', id);
                $('#win-template-update [name=txt-template-name]').val(template.DisplayName);
                $('#win-template-update [name=txt-template-content]').val(template.Content);
                $('#win-template-update').dialog('open');
            }
        }

        $(function () {
            /**
         * 分页组件初始化参数
         */
            $('#tb_template_list_pager').paging({
                showCount: 6,
                change: function (p) {
                    searchTemplate(p);
                }
            });

            searchTemplate(1);

            $('#win-template-add').dialog({
                width: 600,
                height: 300,
                autoOpen: false,
                buttons: [
                    {
                        text: '新增', click: function () {
                            addTemplate(function (r) {
                                if (r) {
                                    $('#win-template-add').dialog('close');
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

            $('#win-template-update').dialog({
                width: 600,
                height: 300,
                autoOpen: false,
                buttons: [
                    {
                        text: '保存', click: function () {
                            updateTemplate(function (r) {
                                if (r) {
                                    $('#win-template-update').dialog('close');
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
        <li><a href="#" class="jsAdd" onclick="javascript:$('#win-template-add').dialog('open');return false;">新增</a></li>
    </ul>
    <ul class="page-toolbar clearfix">
        <li><label>名称</label><input type="text" id="txt-name" /></li>
        <li><a href="#" class="jsSearch" onclick="searchTemplate()">查询</a></li>
    </ul>
    <div id="tb_template_list"></div>
    <div id="tb_template_list_pager"></div>

    <!--新增业务窗体-->
    <div id="win-template-add" title="新增模板" class="edit-content" style="display:none;">
        <ul>
            <li><label>名称</label><input name="txt-template-name" type="text" required maxlength="16" style="width: 200px;" placeholder="框架名称"/></li>
            <li><label>内容</label><textarea name="txt-template-content" required  placeholder="框架" style="width:400px;height:150px;"></textarea></li>
        </ul>
    </div>

    <!--新增业务窗体-->
    <div id="win-template-update" title="修改模板" class="edit-content" style="display:none;">
        <ul>
            <li><label>名称</label><input name="txt-template-name" type="text" required maxlength="16" style="width: 200px;" placeholder="框架名称"/></li>
            <li><label>内容</label><textarea name="txt-template-content" required placeholder="框架" style="width:400px;height:150px;"></textarea></li>
        </ul>
    </div>
</asp:Content>

<%@ Page Title="" Language="C#" MasterPageFile="~/admin/master/page.Master" AutoEventWireup="true" CodeBehind="editpage.aspx.cs" Inherits="JM.Report.Web.admin.pages.editpage" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <style>
        .ui-button-text,.ui-dialog-title{ color:#fff; }


        #jmreport-page-toolbar > ul 
        {
            list-style: none;
            padding: 0;
            margin: 4px;
        }
        #jmreport-page-toolbar > ul > li 
        {
            float: left;
            cursor: pointer;
            margin-right: 5px;
            border: 1px solid #ccc;
            border-radius:4px;
            padding: 4px;
            position: relative;
        }
    </style>


<script type="text/javascript">
    var pageServer = '../server/page.aspx';
    var controls = <%=DoNet.Common.Serialization.JSon.ModelToJson(JM.Report.Bll.Factory.CreateControlApp().GetAll())%>;
    var servers = <%=DoNet.Common.Serialization.JSon.ModelToJson(JM.Report.Bll.Factory.CreateDataServerApp().Search(0,0,null))%>;
    var tempaltes = <%=DoNet.Common.Serialization.JSon.ModelToJson(JM.Report.Bll.Factory.CreateReportTemplateApp().GetAll())%>;
    var currentReport = null ,currentPage=null;

    //获取页面详细信息
    function getPage(id, callback) {
        if (!id || id == '0') {
            showPage({
                DisplayName: '',
                ToolbarControls: [],
                Reports:[
                    {
                        TemplateId: tempaltes[0].Id,
                        Template:tempaltes[0],
                        Controls:[]
                    }
                ]
            });
            return false;
        }
        
        var win = message.showWaiting('获取页面信息中...');

        request(pageServer, { id: id, cmd: 'get' }, function (data, err) {
            win.close();
            if (data) {
                showPage(data);
            }
        });
    }

    //解析页面信息，显示编辑
    function showPage(page) {
        currentPage = page;
        $('#jmreport-page-title').val(page.DisplayName);
        showToolbar(page.ToolbarControls);
        renderPage(page);
    }

    //显示工具栏控件
    function showToolbar(toolbar) {
        if (toolbar) {
            $('#jmreport-page-toolbar>ul').html('');
            for (var i = 0; i < toolbar.length; i++) {
                var t = toolbar[i];
                addToolbar(t);
            }
            $('#jmreport-page-toolbar>ul').sortable();
        }
    }

    //添加工具栏参数
    function addToolbar(config) {
        config = config || {DisplayName: '',ControlName:'TextBox'};
        var c = $('<li class="control" title="点击我开始编辑">' +
                    '<img src="../static/img/toolbar_control_icon.png" width="16" height="16" />\
                    <span class="displayname">' + config.DisplayName + '</span>\
                        <a href="##" class="btn-close" onclick="removeToolbarItem(this);" title="点我移除该查询条件">[-移除]</a></li>');
        c.appendTo('#jmreport-page-toolbar>ul').click(function () {
            var li = $(this).closest('li')[0];
            editToolbar(li);
        });
        c[0].model = config;

        if(!config.Id) {
            editToolbar(c[0]);
        }
    }

    function removeToolbarItem(btn,e){
        if(confirm('确定删除？'))
            $(btn).closest('li').remove();

        // 非IE浏览器
        if (e && e.stopPropagation)
            e.stopPropagation(); 
        else
            window.event.cancelBubble = true;

        return false;
    }

    //生成字段映射框
    function createMapping(tb, source) {
        tb = $(tb);
        var body = tb.find('tbody');
        body.html('');
        if(source && source.Mappings) {
            $(source.Mappings).each(function(i,m) {
                addMapping(tb,m);
            });
        }
    }
    //新增字段
    function addMapping(tb, m) {
        tb = $(tb);
        m = m || {Name:'',DataType:'',DisplayName:'',Description:''};
        var tr = '<tr>';
        tr += '<td><input type="text" maxlength="32" name="name" value="' + m.Name + '"/></td>';
        tr += '<td><input type="text" maxlength="16" name="displayname" value="' + m.DisplayName + '"/></td>';
        tr += '<td><input type="text" maxlength="8" name="datatype" value="' + m.DataType + '"/></td>';
        tr += '<td><input type="text" maxlength="128" name="description" value="' + m.Description + '"/></td>';
        tb.find('tbody').append(tr + '</tr>');
    }

    //获取配置的字段
    function getMapping(tb) {
        tb = $(tb);
        var mapping = [];
        tb.find('tbody>tr').each(function(i,tr){
            tr = $(tr);
            var m = {};
            m.Name = $.trim(tr.find('input[name=name]').val());
            if(!m.Name) return;
            m.DisplayName = $.trim(tr.find('input[name=displayname]').val());
            m.DataType = $.trim(tr.find('input[name=datatype]').val());
            m.Description = $.trim(tr.find('input[name=description]').val());
            mapping.push(m);
        });
        return mapping;
    }

    //开始编辑工具栏控件配置
    function editToolbar(li) {        
        $("#toolbar-DisplayName").val(li.model.DisplayName);
        $("#toolbar-Control").val(li.model.ControlName);
        $('#toolbar-Label').val(li.model.Label);
        $('#toolbar-defaultvalue').val(li.model.DefaultValue);
        $("#toolbar-DataServerLabel").val(li.model.DataServerLabel);
        if (li.model.DataSource) {
            $("#toolbar-DataSource").val(li.model.DataSource.RequestParam);
            createMapping('#toolbar-DataSource-mapping',li.model.DataSource);
        }
        else {
            $("#toolbar-DataSource").val('');
            createMapping('#toolbar-DataSource-mapping');
        }
        $("#toolbar-control-edit")[0].model = li;//绑定当前编辑的对象
        $("#toolbar-control-edit").dialog('open');
    }

    //开始编辑报表控件配置
    function editReportControl(control) {        
        $("#report-DisplayName").val(control.model.DisplayName);
        $("#report-Control").val(control.model.ControlName);
        
        $("#report-DataServerLabel").val(control.model.DataServerLabel);
        if (control.model.DataSource) {
            $("#report-DataSource").val(control.model.DataSource.RequestParam);
            createMapping('#report-DataSource-mapping',control.model.DataSource);
        }
        else {
            $("#report-DataSource").val('');
            createMapping('#report-DataSource-mapping');
        }
        $('#report-ControlConfig').val(control.model.ControlConfig);
        $("#report-control-edit")[0].model = control;//绑定当前编辑的对象
        $("#report-control-edit").dialog('open');
    }

    //显示页面信息
    function renderPage(page) {
        var report = {};
        if(page && page.Reports && page.Reports.length) {
            report =  page.Reports[0];
        }
        $('#report-template').val(report.TemplateId);
        decodeTemplate(report);
        currentReport = report;
    }

    //解析模板
    function decodeTemplate(report, template) {
        template = template || report.Template;
        if (template && template.Content) {
            //保留原配置控件
            //var oldcontrols = $('#page-report-grid div.control');
            $('#page-report-grid').html('');
            var content = JSON.parse(template.Content);
            var controlindex = 0;
            for (var i = 0; i < content.length; i++) {
                var row = content[i];
                var tr = $('<tr></tr>');
                for (var j = 0; j < row.length;j++) {
                    var cell = row[j];
                    var td = $('<td></td>').attr(cell).appendTo(tr);
                    
                    var controlconfig = null;
                    for (var k = 0; k < report.Controls.length; k++) {
                        var c = report.Controls[k];
                        if (c && cell.index == c.ControlIndex) {
                            controlconfig = c;
                            break;
                        }
                    }

                    if(!controlconfig) {
                        controlconfig = {
                            'DisplayName' : '',
                            'ControlName': 'JMChart'
                        };
                    }
                    
                    
                    var control = $('<div class="control control-chart" title="点击我开始编辑"><div>\
                        <img width="16" height="16" src="../static/img/icons/'+controlconfig.ControlName+'.png"/>\
                        <span class="displayname">'+controlconfig.DisplayName+
                            '</span></div></div>').click(function(){
                                editReportControl(this);
                            });
                    control[0].model = controlconfig;
                   
                    $(control).attr('data-index',cell.index === undefined?controlindex:cell.index).appendTo(td);    
                    controlindex++;
                }
                tr.appendTo('#page-report-grid');
            }
        }
    }

    //保存当前页面
    function save(callback) {
        currentPage.ToolbarControls = [];
        var title=$.trim($('#jmreport-page-title').val());
        if(!title) {
            message.error('页面标题不可为空！');
            $('#jmreport-page-title').focus();
            return;
        }
        currentPage.DisplayName = title;
        //获取工具栏控件
        $('#jmreport-page-toolbar>ul>li.control').each(function(){
            currentPage.ToolbarControls.push(this.model);
        });
        currentPage.Reports[0].TemplateId = $('#report-template').val();
        currentPage.Reports[0].Controls = [];
        $('#page-report-grid div.control').each(function(){
            this.model.ControlIndex = $(this).attr('data-index');
            currentPage.Reports[0].Controls.push(this.model);
        });
        var win = message.showWaiting('保存中...');
        var page = JSON.stringify(currentPage);
        request(pageServer, { page: page, cmd: 'save' }, 'post',function (data, err) {
            win.close();
            if (data) {
                message.success('保存成功');
                getPage(data);
            }
            callback && callback(data, currentPage);
        });
    }

    $(function () {
        $("#toolbar-control-edit").dialog({
            autoOpen: false,
            height: 420,
            width: 450,
            position: 'top',
            modal: true,
            buttons: {
                "确定": function () {
                    var li = $("#toolbar-control-edit")[0].model;                   
                    var disname = $.trim($("#toolbar-DisplayName").val());
                    if(!disname) {
                        $("#toolbar-DisplayName").toggleClass('ui-state-error', true).attr('title','控件名称不可为空！').tooltip({
                            position: {
                                my: "left top",
                                at: "right+5 top-5"
                            }
                        }).tooltip('open');
                        setTimeout(function(){
                            $("#toolbar-DisplayName").toggleClass('ui-state-error', false);
                        },2000);
                        return false;
                    }
                    li.model.DisplayName = disname;                    
                    $(li).find('span').html(disname);

                    li.model.ControlName = $("#toolbar-Control").val();
                    var label = $.trim($('#toolbar-Label').val());
                    if(!label) {
                        $("#toolbar-Label").toggleClass('ui-state-error', true).attr('title','变量名不可为空！').tooltip({
                            position: {
                                my: "left top",
                                at: "right+5 top-5"
                            }
                        }).tooltip('open');
                        setTimeout(function(){
                            $("#toolbar-Label").toggleClass('ui-state-error', false);
                        },2000);
                        return false;
                    }
                    li.model.Label = label;
                    li.model.DefaultValue = $.trim($('#toolbar-defaultvalue').val());
                    li.model.DataServerLabel = $("#toolbar-DataServerLabel").val();
                    li.model.DataSource = li.model.DataSource || {};
                    var requestParam =  $("#toolbar-DataSource").val();
                    if (requestParam) {
                        li.model.DataSource.RequestParam = requestParam;
                    }
                    li.model.DataSource.Mappings = getMapping('#toolbar-DataSource-mapping');
                    $("#toolbar-control-edit").dialog("close");
                },
                '取消': function () {
                    $("#toolbar-control-edit").dialog("close");
                }
            },
            close: function () {                
                
            }
        });

        $("#report-control-edit").dialog({
            autoOpen: false,
            height: 570,
            width: 620,
            modal: true,
            position: 'top',
            buttons: {
                "确定": function () {
                    var container = $("#report-control-edit")[0].model;                   
                    var disname = $.trim($("#report-DisplayName").val());
                    if(!disname) {
                        $("#report-DisplayName").toggleClass('ui-state-error', true).attr('title','控件名称不可为空！').tooltip({
                            position: {
                                my: "left top",
                                at: "right+5 top-5"
                            }
                        }).tooltip('open');
                        setTimeout(function(){
                            $("#report-DisplayName").toggleClass('ui-state-error', false);
                        },2000);
                        return false;
                    }
                    container.model.DisplayName = disname;                    
                    $(container).find('span').html(disname);

                    container.model.ControlName = $("#report-Control").val();

                    container.model.ControlConfig = $("#report-ControlConfig").val();
                    
                    container.model.DataServerLabel = $("#report-DataServerLabel").val();
                    container.model.DataSource = container.model.DataSource || {};
                    var requestParam =  $("#report-DataSource").val();
                    if (requestParam) {
                        container.model.DataSource.RequestParam = requestParam;
                    }
                    container.model.DataSource.Mappings = getMapping('#report-DataSource-mapping');
                    $("#report-control-edit").dialog("close");
                },
                '取消': function () {
                    $("#report-control-edit").dialog("close");
                }
            },
            close: function () {                
                
            }
        });

        $(controls).each(function(i,c){
            if(c.ControlType == 0) $('<option value="' + c.Name + '">'+c.DisplayName+'('+c.Name+')</option>').appendTo('#toolbar-Control');
            else $('<option value="' + c.Name + '">'+c.DisplayName+'('+c.Name+')</option>').appendTo('#report-Control');
        });

        $(servers.Data).each(function(i,c){
            $('<option value="' + c.Label + '">'+c.DisplayName+'('+c.Label+')</option>').appendTo('#toolbar-DataServerLabel');
            $('<option value="' + c.Label + '">'+c.DisplayName+'('+c.Label+')</option>').appendTo('#report-DataServerLabel');
        });

        $(tempaltes).each(function(i,c){
            $('<option value="' + c.Id + '">'+c.DisplayName+'</option>').appendTo('#report-template');
        });

        $('#report-template').change(function(){           
            $(tempaltes).each(function(i,c){
                if(c.Id == $('#report-template').val()) {
                    decodeTemplate(currentReport,c);
                    return false;
                }
            });
            
        });

        var paras = getUrlParams();
        getPage(paras['id']);

        //添加工具栏控件
        $('#js-addtoolbar').click(function(){
            addToolbar();
        });
    });
</script>
 

<div>
<%--<div id="jmreport-controls" class="panel"></div>--%>
<%--<div id="jmreport-page" class="panel">            
	<div>
        <label>页面标题：</label>
        <input id="jmreport-page-title" maxlength="16" value="" class="text ui-widget-content ui-corner-all" />
	</div>
	<div id="jmreport-page-toolbar" class="ui-widget-content clearfix">
        <h3>查询条件栏</h3>
        <ul></ul>
        <a href="##" id="js-addtoolbar">+</a>
	</div>
    <div id="jmreport-page-template" class="ui-widget-content">
        <h3>报表模板</h3>
        <select id="report-template"></select>
	</div>
	<div id="jmreport-page-content" class="ui-widget-content">
        <h3>报表控件</h3>
        <table id="page-report-grid" cellpadding="0" cellspacing="0" class="jmreport-template"></table>
	</div>
</div>--%>

    <%--页面基本信息--%>
    <fieldset class="edit-field">
        <legend>页面基本信息</legend>
        <p>
            <label>页面标题：</label>
            <input type="text" id="jmreport-page-title" maxlength="16" value="" class="txt xl" />
        </p>
        <p>
            <label>报表模板：</label>
            <select id="report-template" class="txt xl" ></select>
        </p>
    </fieldset>

    <%--查询条件配置--%>
    <fieldset id="jmreport-page-toolbar" class="edit-field">
        <legend>查询条件配置</legend>
        <ul></ul>
        <a href="##" id="js-addtoolbar"  style="display: inline-block;margin-top: 8px;">[+添加]</a>
    </fieldset>

    <%--报表控件配置--%>
    <fieldset id="jmreport-page-content" class="edit-field">
        <legend>报表控件配置</legend>
        <table id="page-report-grid" cellpadding="0" cellspacing="0" class="jmreport-template"></table>
    </fieldset>




<%--<div id="jmreport-properties" class="panel"></div>--%>
   <%-- <button onclick="save()">保存</button>--%>
</div>

<div id="toolbar-control-edit" title="编辑工具栏控件">  
    <div class="edit-field">
      <p>
        <label for="toolbar-DisplayName">名称：</label>
        <input type="text" name="toolbar-DisplayName" id="toolbar-DisplayName" maxlength="16" placeholder="请输入控件的中文名称" class="txt m" />
      </p>
      <p>
          <label for="Label">变量名：</label>
          <input type="text" name="toolbar-Label" id="toolbar-Label" value="" maxlength="10" placeholder="参数名称，用于查询的变量" class="txt m" />
          <i>(如果有多个请用;分隔)</i>
      </p>
        <p>
          <label for="toolbar-control">默认值：</label>
          <input type="text" name="toolbar-defaultvalue" id="toolbar-defaultvalue" value="" maxlength="32" placeholder="默认值，多值用;" class="txt m" />
      </p>
      <p>
          <label for="toolbar-control">控件类型：</label>
          <select id="toolbar-Control" class="l"></select>
      </p>
      <p>
          <label for="toolbar-DataServerLabel">数据源：</label>
          <select id="toolbar-DataServerLabel" class="l"></select>
      </p>
      <p>
          <label for="toolbar-DataSource" style="vertical-align:top;">查询语句：</label>
          <textarea id="toolbar-DataSource" class="l" placeholder="查询数据参数" rows="10"></textarea>
      </p>
        <p>
          <label for="toolbar-DataSource" style="vertical-align:top;">字段配置：</label>
            <a href="#" onclick="javascript:addMapping('#toolbar-DataSource-mapping');return false;">添加</a>
          <table id="toolbar-DataSource-mapping" class="l"  style="height:200px; border:1px solid #ddd;">
              <thead>
                  <tr>
                      <th>字段名</th>
                      <th>显示名称</th>
                      <th>数据类型</th>
                      <th>简要说明</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody></tbody>
          </table>
      </p>
    </div>
  
</div>

<div id="report-control-edit" title="编辑报表控件">  
    <div class="edit-field">
        <p>
            <label for="report-DisplayName">名称：</label>
            <input type="text" name="report-DisplayName" id="report-DisplayName" maxlength="16" placeholder="请输入控件的中文名称" class="txt xl" />
        </p>

        <p>
            <label for="report-control">控件类型：</label>
            <select id="report-Control"  class="xl"></select>
        </p>

        <p>
            <label for="report-ControlConfig" style="vertical-align:top;">控件配置：</label>
            <textarea id="report-ControlConfig" class="xl" rows="10" placeholder="控件配置"></textarea>
        </p>
        
        <p>
            <label for="report-DataServerLabel">数据源：</label>
            <select id="report-DataServerLabel" class="xl"></select>
        </p>
       
        <p>
            <label for="report-DataSource" style="vertical-align:top;">查询语句：</label>
            <textarea id="report-DataSource" class="xl" rows="10" placeholder="查询数据参数"></textarea>
        </p>
        <p>
          <label for="toolbar-DataSource" style="vertical-align:top;">字段配置：</label>
            <a href="#" onclick="javascript:addMapping('#report-DataSource-mapping');return false;">添加</a>
          <table id="report-DataSource-mapping" class="l" style="height:200px; border:1px solid #ddd;" >
              <thead>
                  <tr>
                      <th>字段名</th>
                      <th>显示名称</th>
                      <th>数据类型</th>
                      <th>简要说明</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody></tbody>
          </table>
      </p>
    </div>
  
</div>
</asp:Content>


<!DOCTYPE html>

<html>
<head>
<meta name="renderer" content="webkit">
<meta name="force-rendering" content="webkit">
<meta http-equiv="X-UA-Compatible" content="chrome=1,IE=edge">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>管理后台--数据源</title>

<?php
    $this->load->view('admin/admin_header');
?>

</head>

<body>
<div id="pagebody">
  <div id="header">
          <?php
            $this->load->view('admin/admin_top');
          ?>
  </div>
  <section>
    <div class="body-width"> 
      
      <!--for ie border-->
      <div class="body-content">
        <div class="leftArea" id="leftArea" style="width:15%; min-width:220px;">
          <?php
            $this->load->view('admin/admin_menu');
          ?>
        </div>
        <div id="jmreport-page">
          <div id="jmreport-page-title">
            <div class="jmreport-pageTitle"><a href="javascript:;" style="font-size:16px;color:#004c85;" class='database_show'>新增</a></div>
          </div>

          <div>
            <div id="tb_user_list">
              <table>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>名称</th>
                    <th>编码</th>
                    <th>主机</th>
                    <th>端口</th>
                    <th>用户</th>
                    <th>数据源类型</th>
                    <th>数据源</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <?php foreach ($all_databases as $key => $value) {?>
                  <tr>
                    <td><?php echo $value['id']; ?></td>
                    <td><?php echo $value['displayname']; ?></td>
                    <td><?php echo $value['label']; ?></td>
                    <td><?php echo $value['host']; ?></td>
                    <td><?php echo $value['port']; ?></td>
                    <td><?php echo $value['user']; ?></td>
                    <td><?php echo $value['servertype']; ?></td>
                    <td><?php echo $value['database']; ?></td>
                    <td><a href="<?php echo base_url('index.php/admin/databases/databases_edit').'/'.$value['id']; ?>">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" class='database_delete' data-id="<?php echo $value['id']; ?>">删除</a></td>
                  </tr>
                  <?php }?>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="clear"></div>
      </div>

      <div id="app_sel_body" class="sel-body"> </div>
      <div id="go-top" style="position:fixed;display:none;" title="回到顶部">
        <a href="#" onclick="javascript:window.scrollTo(0,0);return false;">
          <img src="<?php echo base_url('static/img/go-up.png')?>" alt="回到顶部" />
        </a> 

      </div>
    </div>
  </section>

  <div>
    <div class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-front ui-dialog-buttons ui-draggable ui-resizable" style="position: absolute; height: auto; width: 400px; top: 227px; left: 657px; display:none;">
      <div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix"><span class="ui-dialog-title">新增业务</span>
        <button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close database_hiden" title="close"><span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span><span class="ui-button-text">close</span></button>
      </div>
      <div class="edit-content ui-dialog-content ui-widget-content" style="width: auto; min-height: 0px; max-height: none; height: 312px;">
        <form id="database">
        <ul>
          <li>
            <label>名称:</label>
            <input name="displayname" type="text" maxlength="16" value="" style="width: 180px;" >
          </li>
          <li>
            <label>编码:</label>
            <input name="label" type="text" maxlength="16" value="" style="width: 180px;" >
          </li>
          <li>
            <label>主机:</label>
            <input name="host" type="text" maxlength="16" value="" style="width: 180px;" >
          </li>
          <li>
            <label>端口:</label>
            <input name="port" type="text" maxlength="16" value="" style="width: 180px;" >
          </li>
          <li>
            <label>用户:</label>
            <input name="user" type="text" maxlength="16" value="" style="width: 180px;" >
          </li>
          <li>
            <label>密码:</label>
            <input name="password" type="password" maxlength="16" value="" style="width: 180px;" >
          </li>
          <li>
            <label>数据库:</label>
            <input name="database" type="text" maxlength="16" value="" style="width: 180px;" >
          </li>
          <li>
            <label>其它属性:</label>
            <input name="otherattr" type="text" maxlength="16" value="" style="width: 180px;" >
          </li>
          <li>
            <label>数据源类型:</label>
            <select name="servertype">
              <option value="0">mysql</option>
              <option value="1">oracle</option>
              <option value="2">sqlserver</option>
              <option value="3">npgsql</option>
            </select>
          </li>
        </ul>
        </form>
      </div>
      <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
        <div class="ui-dialog-buttonset">
          <button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only database_add" ><span class="ui-button-text">新增</span></button>
          <button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only database_hiden"><span class="ui-button-text">取消</span></button>
        </div>
      </div>
    </div>
  </div>

  <div id="footer">
    <ul>
      <li class="copyright">Copyright 2014</li>
      <li>JM</li>
      <li><a href="../admin/index.aspx" target="_blank">管理端</a></li>
    </ul>
  </div>
</div>
</body>

<script type="text/javascript">

  $(function () {
    $(window).resize(function () {
        $('#go-top').css({ "top": ($(window).height() - $("#go-top").height()), "left": $(window).width() - $("#go-top").width() - 2 });
    });

    $(window).scroll(function () {
        if ($(window).scrollTop() > 50) {
            $('#go-top').show();
        }else {
            $('#go-top').hide();
        }
    });

    $(".database_hiden").click(function(){
        $(".ui-resizable").hide();
    });
    $(".database_show").click(function(){
        $(".ui-resizable").show();
    });

    $('.database_add').click(function(){
        $.ajax({
           type: "POST",
           url: "<?php echo base_url('index.php/admin/databases/databases_add')?>",
           data: $('#database').serialize(),
           dataType: "json",
           success: function(data){
                      alert(data.msg);
                      location.reload();
                    },
        });
    });

    $('.database_delete').click(function(){
      if(confirm("确认要删除？")) {
        var id=$(this).attr("data-id");  //在页面当中我直接把数据的_id值刷出来赋给data-id 
        $.ajax({
           type: "POST",
           url: "<?php echo base_url('index.php/admin/databases/databases_delete')?>",
           data: {id:id},
           dataType: "json",
           success: function(data){
                      alert(data.msg);
                      location.reload();
                    },
        });
      }
    });
  });

</script> 

</html>

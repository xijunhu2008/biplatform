<!DOCTYPE html>

<html>
<head>
<meta name="renderer" content="webkit">
<meta name="force-rendering" content="webkit">
<meta http-equiv="X-UA-Compatible" content="chrome=1,IE=edge">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>管理后台--业务</title>

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
            <div class="jmreport-pageTitle"><a href="javascript:;" style="font-size:16px;color:#004c85;" class='user_production_show'>新增</a></div>
          </div>

          <div>
            <div id="tb_user_list">
              <table>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>编码</th>
                    <th>名称</th>
                    <th>图标</th>
                    <th>状态</th>
                    <th>框架</th>
                    <th>创建日期</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <?php foreach ($all_production as $key => $value) {?>
                  <tr>
                    <td><?php echo $value['id']; ?></td>
                    <td><?php echo $value['code']; ?></td>
                    <td><?php echo $value['displayname']; ?></td>
                    <td><img src="<?php echo $this->config->item('images_host').$value['image']; ?>" onerror="this.src='http://192.168.1.81/static/img/logos/noapping.png'" height='50px;' width='50px;'></td>
                    <td><?php if($value['status'] == 0){echo '<span style="color:red">关闭</span>'; }else if($value['status'] == 1){echo '<span style="color:green">开启</span>'; }?></td>
                    <td><?php echo $value['reportframeworkid']; ?></td>
                    <td><?php echo $value['createon']; ?></td>
                    <td><a href="<?php echo base_url('index.php/admin/system/production_edit').'/'.$value['id']; ?>">编辑</a></td>
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
        <button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close user_production_hiden" title="close"><span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span><span class="ui-button-text">close</span></button>
      </div>
      <div class="edit-content ui-dialog-content ui-widget-content" style="width: auto; min-height: 0px; max-height: none; height: 312px;">
        <form id="user_production">
        <ul>
          <li>
            <label>编码</label>
            <input name="code" type="text" maxlength="16" value="" style="width: 180px;" >
          </li>
          <li>
            <label>名称</label>
            <input name="displayname" type="text" maxlength="16" value="" style="width: 180px;" >
          </li>
          <li>
            <label>状态</label>
            <select name="status">
              <option value="1">开启</option>
              <option value="0">关闭 </option>
            </select>
          </li>
          <li>
            <label>所属框架</label>
            <hr>
            <ul>
              <li>
                <select name="reportframeworkid">
                  <?php foreach ($all_framework as $key => $value) {?>
                  <option value="<?php echo $value['id']; ?>"><?php echo $value['displayname']; ?></option>
                  <?php }?>
                </select>
              </li>
            </ul>
          </li>
        </ul>
        </form>
      </div>
      <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
        <div class="ui-dialog-buttonset">
          <button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only user_production_add" ><span class="ui-button-text">新增</span></button>
          <button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only user_production_hiden"><span class="ui-button-text">取消</span></button>
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

    $(".user_production_hiden").click(function(){
        $(".ui-resizable").hide();
    });
    $(".user_production_show").click(function(){
        $(".ui-resizable").show();
    });

    $('.user_production_add').click(function(){
        $.ajax({
           type: "POST",
           url: "<?php echo base_url('index.php/admin/system/production_add')?>",
           data: $('#user_production').serialize(),
           dataType: "json",
           success: function(data){
                      alert(data.msg);
                      location.reload();
                    },
        });
    });

    // $('.user_production_delete').click(function(){
    //   if(confirm("确认要删除？")) {
    //     var id=$(this).attr("data-id");  //在页面当中我直接把数据的_id值刷出来赋给data-id 
    //     $.ajax({
    //        type: "POST",
    //        url: "<?php echo base_url('index.php/admin/system/production_add')?>",
    //        data: {id:id},
    //        dataType: "json",
    //        success: function(data){
    //                   alert(data.msg);
    //                   location.reload();
    //                 },
    //     });
    //   }
    // });
  });

</script> 

</html>

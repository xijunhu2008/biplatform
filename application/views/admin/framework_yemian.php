<?php if(!$pagetconfig['id']){ ?>
<div>
  <button class="ui-button ui-button-text-only" role="button"><span class="ui-button-text zicaidan">新增子菜单</span></button>
  <button class="ui-button ui-button-text-only" role="button"><span class="ui-button-text ziyemian">新增子页面</span></button>
</div>
<?php } ?>

<fieldset class="edit-field">
  <legend>页面基本信息</legend>
  <p>
    <label>页面标题：</label>
    <input id='pid' maxlength="16" value="<?php echo $parentid; ?>" type="hidden">
    <input id='pageid' maxlength="16" value="<?php echo $pagetconfig['id']; ?>" type="hidden">
    <input id='reportconfigid' maxlength="16" value="<?php echo $reportconfig['id']; ?>" type="hidden">
    <input type="text" maxlength="16" value="<?php if($pagetconfig['id']){echo $pagetconfig['displayname'];} ?>" class="txt xl page_title">
  </p>
  <p>
    <label>报表模板：</label>
    <select id="report-template" class="txt xl">
      <?php foreach ($all_template as $key => $value) { ?>
      <option value="<?php echo $value['id']; ?>" <?php if(count($reportconfig)>2){if($value['id'] == $reportconfig['templateid']){echo 'selected="selected"';}} ?> ><?php echo $value['templatename']; ?></option>
      <?php } ?>
    </select>
  </p>
</fieldset>

<?php if($pagetconfig['id']){ ?>
<fieldset id="jmreport-page-toolbar" class="edit-field">
  <legend>查询条件配置</legend>
  <ul class="ui-sortable">
    <?php foreach ($toolbarcontrols as $key => $value) { ?>
    <li class="control" style="float:left;margin-left:10px;">
      <img src="<?php echo base_url('static/img/toolbar_control_icon.png')?>" width="16" height="16">
      <span class="displayname tj_control" title="点击我开始编辑" tid-date="<?php echo $value['id']; ?>" ><?php echo $value['displayname']; ?></span>
      <a href="#" class="btn-close" title="点我移除该查询条件" tid-date="<?php echo $value['id']; ?>">[-移除]</a>
    </li>
    <?php } ?>
  </ul>
  <div class="clear"></div>
  <a href="##" id="js-addtoolbar" style="display: inline-block;margin-top: 8px;">[+添加]</a>
</fieldset>
<fieldset id="jmreport-page-content" class="edit-field" style="border: 1px solid #e0e6f4;">
  <legend>报表控件配置</legend>
  <table id="page-report-grid" class="jmreport-template">
    <tbody>
      <?php if($template_info){ ?>
      <?php foreach($template_info as $value){ ?>
      <tr>
        <?php foreach($value as $v){ ?>
        <td colspan="<?php echo $v['colspan']; ?>" rowspan="<?php echo $v['rowspan']; ?>" width="<?php echo $v['width']; ?>" height="<?php echo $v['height']; ?>" index="<?php echo $v['index']; ?>">
          <div class="control control-chart" title="点击我开始编辑" data-index="<?php echo $v['index']; ?>">
            <div><img width="16" height="16" src="<?php if(isset($my_controls[$v['index']])){ echo base_url('static/img/icons/'.$my_controls[$v['index']]['controlname'].'.png');}else{echo base_url('static/img/icons/JMChart.png');} ?>"> <span class="displayname"><?php if(isset($my_controls[$v['index']])){echo $my_controls[$v['index']]['displayname'];}?></span></div>
          </div>
        </td>
        <?php } ?>
      </tr>
      <?php } ?>
      <?php } ?>
    </tbody>
  </table>
</fieldset>
<?php } ?>
<button class="ui-button ui-button-text-only" role="button" ><span class="ui-button-text" <?php if($pagetconfig['id']){echo 'id="yemian_edit"';}else{echo 'id="yemian_add"';} ?>>保存</span></button>

<script type="text/javascript">
  $(function () {

    $('.zicaidan').click(function(){
      var id='';
      $.ajax({
         type: "POST",
         url: "<?php echo base_url('index.php/admin/framework/framework_mulu')?>",
         data: {id:id},
         dataType: "html",
         success: function(html){
                    $('#show_mulu_wenjian >').remove();
                    $('#show_mulu_wenjian').append(html);
                  },
      });
    });

    $('.ziyemian').click(function(){
      var pageid='';
      var parentid=$('#pid').val();
      $.ajax({
         type: "POST",
         url: "<?php echo base_url('index.php/admin/framework/framework_yemian')?>",
         data: {pageid:pageid,parentid:parentid},
         dataType: "html",
         success: function(html){
                    $('#show_mulu_wenjian >').remove();
                    $('#show_mulu_wenjian').append(html);
                  },
      });
    });

    $('#yemian_add').click(function(){
      var page_title=$('.page_title').val();
      var tid=$('#report-template').val();
      var parentid=$('#pid').val();

      var frelegation=$('#menuContainer').attr("frelegation");
      if(frelegation == 1){
        var fid=$('#menuContainer').attr("fid");
      }else if(frelegation == 0){
        var fid=$('#menuContainer').attr("productionid");
      }

      if(page_title){
	      $.ajax({
	         type: "POST",
	         url: "<?php echo base_url('index.php/admin/framework/framework_yemian_add')?>",
	         data: {page_title:page_title,templateid:tid,frameworkid:fid,relegation:frelegation,parentid:parentid},
	         dataType: "JSON",
	         success: function(html){
	         			      alert(html.msg);
                      location.reload();
	                  },
	      });
      }
    });

    $('#yemian_edit').click(function(){
      var parentid=$('#pid').val();
      var pageid=$('#pageid').val();
      var page_title=$('.page_title').val();
      var tid=$('#report-template').val();

      if(page_title){
        $.ajax({
           type: "POST",
           url: "<?php echo base_url('index.php/admin/framework/framework_yemian_edit')?>",
           data: {parentid:parentid,pageid:pageid,page_title:page_title,templateid:tid},
           dataType: "JSON",
           success: function(html){
                      alert(html.msg);
                      location.reload();
                    },
        });
      }
    });

    
    $('#js-addtoolbar').click(function(){
      $.ajax({
         type: "POST",
         url: "<?php echo base_url('index.php/admin/framework/framework_condition')?>",
         data: null,
         dataType: "html",
         success: function(html){
                    $('#f_popup >').remove();
                    $("#f_popup").show();
                    $('#f_popup').append(html);
                  },
      });
    });

    $('.tj_control').click(function(){
      var id=$(this).attr("tid-date");
      $.ajax({
         type: "POST",
         url: "<?php echo base_url('index.php/admin/framework/framework_condition')?>",
         data: {id:id},
         dataType: "html",
         success: function(html){
                    $('#f_popup >').remove();
                    $("#f_popup").show();
                    $('#f_popup').append(html);
                  },
      });
    });

    $('.btn-close').click(function(){
      if(confirm("确认要删除？")) {
        var id=$(this).attr("tid-date");
        $.ajax({
           type: "POST",
           url: "<?php echo base_url('index.php/admin/framework/framework_condition_del')?>",
           data: {id:id},
           dataType: "json",
           success: function(data){
                        alert(data.msg);
                        location.reload();
                    },
        });
      }
    });

    $('.control-chart').click(function(){
      var reportconfigid=$('#reportconfigid').val();
      var index_id=$(this).attr("data-index");

      $.ajax({
         type: "POST",
         url: "<?php echo base_url('index.php/admin/framework/framework_control')?>",
         data: {reportconfigid:reportconfigid,index_id:index_id},
         dataType: "html",
         success: function(html){
                    $('#f_popup >').remove();
                    $("#f_popup").show();
                    $('#f_popup').append(html);
                  },
      });
    });



  });

</script> 
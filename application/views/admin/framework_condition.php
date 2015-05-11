  <div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix"><span id="ui-id-1" class="ui-dialog-title">编辑工具栏控件</span>
    <button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close" role="button" aria-disabled="false" title="close"><span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span><span class="ui-button-text">close</span></button>
  </div>
  <div id="toolbar-control-edit" class="ui-dialog-content ui-widget-content" style="width: auto; min-height: 0px; max-height: none; height: 322px;">
    <div class="edit-field">
      <p>
        <label for="toolbar-DisplayName">名称：</label>
        <input id='toolbarid' maxlength="16" value="<?php if($toolbar_info){echo $toolbar_info['id'];} ?>" type="hidden">
        <input id='datasourceid' name="datasourceid" maxlength="16" value="<?php if($toolbar_info){echo $toolbar_info['datasourceid'];} ?>" type="hidden">
        <input type="text" name="toolbar-DisplayName" id="toolbar-DisplayName" maxlength="16" placeholder="请输入控件的中文名称" value="<?php if($toolbar_info){echo $toolbar_info['displayname'];} ?>" class="txt m">
      </p>
      <p>
        <label for="Label">变量名：</label>
        <input type="text" name="toolbar-Label" id="toolbar-Label" maxlength="32" placeholder="参数名称，用于查询的变量" value="<?php if($toolbar_info){echo $toolbar_info['label'];} ?>" class="txt m">
        <i>(如果有多个请用;分隔)</i> </p>
      <p>
        <label for="toolbar-control">默认值：</label>
        <input type="text" name="toolbar-defaultvalue" id="toolbar-defaultvalue" value="<?php if($toolbar_info){echo $toolbar_info['defaultvalue'];} ?>" maxlength="32" placeholder="默认值，多值用;" class="txt m">
      </p>
      <p>
        <label for="toolbar-control">控件类型：</label>
        <select id="toolbar-Control" class="l">
          <?php foreach ($controls as $key => $value) { ?>
          <option value="<?php echo $value['name']; ?>" <?php if($toolbar_info){if($value['name'] == $toolbar_info['controlname']){echo 'selected="selected"';}} ?> ><?php echo $value['displayname']; ?>(<?php echo $value['name']; ?>)</option>
          <?php } ?>
        </select>
      </p>
      <p>
        <label for="toolbar-DataServerLabel">数据源：</label>
        <select id="toolbar-DataServerLabel" class="l">
          <?php foreach ($databases as $key => $value) { ?>
          <option value="<?php echo $value['label']; ?>" <?php if($toolbar_info){if($value['label'] == $toolbar_info['dataserverlabel']){echo 'selected="selected"';}} ?> ><?php echo $value['displayname']; ?>(<?php echo $value['label']; ?>)</option>
          <?php } ?>
        </select>
      </p>
      <p>
        <label for="toolbar-DataSource" style="vertical-align:top;">查询语句：</label>
        <textarea id="toolbar-DataSource" class="l" placeholder="查询数据参数" rows="10"><?php if($datasource_info){echo $datasource_info['requestparam'];} ?></textarea>
      </p>
      <p>
        <label for="toolbar-DataSource" style="vertical-align:top;">字段配置：</label>
        <a href="#" class="sourcemapping_html">添加</a>&nbsp;&nbsp;<a href="#" class="sourcemapping_add">提交</a></p>
      <table id="toolbar-DataSource-mapping" class="l" style="height:200px; border:1px solid #ddd;">
        <thead>
          <tr>
            <th>字段名</th>
            <th>显示名称</th>
            <th>数据类型</th>
            <th>简要说明</th>
          </tr>
        </thead>
        <tbody class="sourcemapping_append">
          <?php if($sourcemapping){ ?>
            <?php foreach ($sourcemapping as $key => $value) { ?>
            <tr>
              <td><input type="text" maxlength="32" name="name[]" value="<?php echo $value['name']; ?>"></td>
              <td><input type="text" maxlength="16" name="displayname[]" value="<?php echo $value['displayname']; ?>"></td>
              <td><input type="text" maxlength="8" name="datatype[]" value="<?php echo $value['datatype']; ?>"></td>
              <td><input type="text" maxlength="128" name="description[]" value="<?php echo $value['description']; ?>"></td>
            </tr>
            <?php } ?>
          <?php } ?>
        </tbody>
      </table>
      <p></p>
    </div>
  </div>
  <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
    <div class="ui-dialog-buttonset">
      <button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" id="cx_save"><span class="ui-button-text">确定</span></button>
      <button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-icon-closethick" role="button"><span class="ui-button-text">取消</span></button>
    </div>
  </div>

  
<script type="text/javascript">
  $(function () {

    $(".ui-icon-closethick").click(function(){
        $('#f_popup >').remove();
        $("#f_popup").hide();
    });

    $('#cx_save').click(function(){
      var toolbarid=$('#toolbarid').val();
      var pageid=$('#pageid').val();
      var displayname=$('#toolbar-DisplayName').val();
      var controlname=$('#toolbar-Control').val();
      var label=$('#toolbar-Label').val();
      var defaultvalue=$('#toolbar-defaultvalue').val();
      var dataserverlabel=$('#toolbar-DataServerLabel').val();
      var datasource=$('#toolbar-DataSource').val();
      if(displayname){
        if(!toolbarid){
          $.ajax({
             type: "POST",
             url: "<?php echo base_url('index.php/admin/framework/framework_condition_add')?>",
             data: {pageid:pageid,displayname:displayname,controlname:controlname,label:label,defaultvalue:defaultvalue,dataserverlabel:dataserverlabel,datasource:datasource},
             dataType: "JSON",
             success: function(html){
                        alert(html.msg);
                        location.reload();
                      },
          });
        }else{
          $.ajax({
             type: "POST",
             url: "<?php echo base_url('index.php/admin/framework/framework_condition_edit')?>",
             data: {toolbarid:toolbarid,pageid:pageid,displayname:displayname,controlname:controlname,label:label,defaultvalue:defaultvalue,dataserverlabel:dataserverlabel,datasource:datasource},
             dataType: "JSON",
             success: function(html){
                        alert(html.msg);
                        location.reload();
                      },
          });
        }
      }
    });

    $('.sourcemapping_html').click(function(){
      var shtml = '<tr><td><input type=\"text\" maxlength=\"32\" name=\"name[]\" value=\"\"></td><td><input type=\"text\" maxlength=\"16\" name=\"displayname[]\" value=\"\"></td><td><input type=\"text\" maxlength=\"8\" name=\"datatype[]\" value=\"\"></td><td><input type=\"text\" maxlength=\"128\" name=\"description[]\" value=\"\"></td></tr>';
      $('.sourcemapping_append').append(shtml);
    });


    $('.sourcemapping_add').click(function(){
        var id =$('#datasourceid').val();
        var n =$('input[name="name[]"]').serialize();
        var d =$('input[name="displayname[]"]').serialize();
        var i =$('input[name="datatype[]"]').serialize();
        var s =$('input[name="description[]"]').serialize();

        if(id){
          $.ajax({
             type: "POST",
             url: "<?php echo base_url('index.php/admin/framework/framework_sourcemapping_add')?>",
             data: 'id='+id+'&'+n+'&'+d+'&'+i+'&'+s,
             dataType: "JSON",
             success: function(html){
                        alert(html.msg);
                      },
          });
        }

    });

  });

</script> 
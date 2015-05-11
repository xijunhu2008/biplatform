                <div>
                  <button class="ui-button ui-button-text-only" role="button"><span class="ui-button-text zicaidan">新增子菜单</span></button>
                  <button class="ui-button ui-button-text-only" role="button"><span class="ui-button-text ziyemian">新增子页面</span></button>
                </div>
                <div>
                    <label>菜单名称：</label>
                    <input id='pid' maxlength="16" value="<?php echo $menu['id']; ?>" type="hidden">
                    <input id='add_parentid' maxlength="16" value="<?php echo $parentid; ?>" type="hidden"><!-- 仅仅为了新增的时候增加多级目录使用 -->
                    <input id='menu_name' maxlength="16" value="<?php echo $menu['displayname']; ?>">
                    <button class="ui-button ui-button-text-only" role="button" ><span class="ui-button-text" <?php if($menu['displayname']){echo 'id="mulu_edit"';}else{echo 'id="mulu_add"';} ?>>保存</span></button>
                </div>

<script type="text/javascript">
  $(function () {

    $('.zicaidan').click(function(){
      var id="";
      var parentid=$('#pid').val();
      $.ajax({
         type: "POST",
         url: "<?php echo base_url('index.php/admin/framework/framework_mulu')?>",
         data: {id:id,parentid:parentid},
         dataType: "html",
         success: function(html){
                    $('#show_mulu_wenjian >').remove();
                    $('#show_mulu_wenjian').append(html);
                  },
      });
    });

    $('.ziyemian').click(function(){
      var pageid='';
      var pid=$('#pid').val();
      $.ajax({
         type: "POST",
         url: "<?php echo base_url('index.php/admin/framework/framework_yemian')?>",
         data: {pageid:pageid,parentid:pid},
         dataType: "html",
         success: function(html){
                    $('#show_mulu_wenjian >').remove();
                    $('#show_mulu_wenjian').append(html);
                  },
      });
    });

    $('#mulu_add').click(function(){
      var pid=$('#add_parentid').val();
      var menu_name=$('#menu_name').val();

      var frelegation=$('#menuContainer').attr("frelegation");
      if(frelegation == 1){
        var fid=$('#menuContainer').attr("fid");
      }else if(frelegation == 0){
        var fid=$('#menuContainer').attr("productionid");
      }

      if(menu_name){
	      $.ajax({
	         type: "POST",
	         url: "<?php echo base_url('index.php/admin/framework/framework_mulu_add')?>",
	         data: {menu_name:menu_name,frameworkid:fid,relegation:frelegation,parentid:pid,},
	         dataType: "JSON",
	         success: function(html){
	         			alert(html.msg);
                      	location.reload();
	                  },
	      });
      }
    });

    $('#mulu_edit').click(function(){
      var pid=$('#pid').val();
      var menu_name=$('#menu_name').val();

      if(menu_name){
	      $.ajax({
	         type: "POST",
	         url: "<?php echo base_url('index.php/admin/framework/framework_mulu_edit')?>",
	         data: {id:pid,menu_name:menu_name},
	         dataType: "JSON",
	         success: function(html){
	         			alert(html.msg);
                      	location.reload();
	                  },
	      });
      }
    });








  });

</script> 
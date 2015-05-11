                <div>
                  <button class="ui-button ui-button-text-only" role="button"><span class="ui-button-text zicaidan">新增子菜单</span></button>
                  <button class="ui-button ui-button-text-only" role="button"><span class="ui-button-text ziyemian">新增子页面</span></button>
                </div>

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
      $.ajax({
         type: "POST",
         url: "<?php echo base_url('index.php/admin/framework/framework_yemian')?>",
         data: {pageid:pageid},
         dataType: "html",
         success: function(html){
                    $('#show_mulu_wenjian >').remove();
                    $('#show_mulu_wenjian').append(html);
                  },
      });
    });








    

  });

</script> 
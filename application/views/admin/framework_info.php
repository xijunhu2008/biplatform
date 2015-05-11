<!DOCTYPE html>

<html>
<head>
<meta name="renderer" content="webkit">
<meta name="force-rendering" content="webkit">
<meta http-equiv="X-UA-Compatible" content="chrome=1,IE=edge">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>管理后台--框架</title>

<?php
    $this->load->view('admin/admin_header');
?>

<link rel="stylesheet" type="text/css" href="<?php echo base_url('static/js/fancytree/skin-win8/ui.fancytree.css')?>">

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
            <div class="jmreport-pageTitle">编辑</div>
          </div>

            <div style="margin: 10px;">
              <div style="margin: 0 10px;width: 240px;float:left;min-height: 600px">
                <div id="menuContainer" fid="<?php echo $id; ?>" productionid="<?php if(isset($productionid)){echo $productionid;} ?>" frelegation="<?php echo $relegation; ?>">
                  <ul class="ui-fancytree fancytree-container" tabindex="0">
                    <span class="fancytree-node fancytree-exp-el fancytree-ico-ef" mid="0" pid="0" id="root"><span class="fancytree-expander"></span><span class="fancytree-icon"></span><span class="fancytree-title">根菜单（不可操作）</span></span>
                    <ul>
                    <?php echo $Menus_html; ?>
                    </ul>
                  </ul>
                </div>
              </div>
              <div id="show_mulu_wenjian" style="float:left;">

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

  <div id="f_popup" class="ui-dialog ui-widget ui-widget-content" style="position: absolute; height: auto; top: 50px; left: 481px; display: none;">
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

    $('.fancytree-expander').click(function(){
      var i = $(this).parent().parent().find('>ul').toggle();
    });

    $('#root').click(function(){
        $.ajax({
           type: "POST",
           url: "<?php echo base_url('index.php/admin/framework/framework_root_directory')?>",
           data: null,
           dataType: "html",
           success: function(html){
                      $('#show_mulu_wenjian >').remove();
                      $('#show_mulu_wenjian').append(html);
                    },
        });
    });

    $('.mulu').click(function(){
      var id=$(this).attr("mid");
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

    $('.yemian').click(function(){
      var pageid=$(this).attr("pid");
      var parentid=$(this).attr("mid");
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

  });

</script> 

</html>

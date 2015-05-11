<!DOCTYPE html>

<html>
<head>
<meta name="renderer" content="webkit">
<meta name="force-rendering" content="webkit">
<meta http-equiv="X-UA-Compatible" content="chrome=1,IE=edge">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>管理后台--用户</title>

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

          <div>
            <form action="<?php echo base_url('index.php/admin/manage/user_group_access_edit'); ?>" method="post">
                <table>
                    <input type="hidden" name="group_id" value="<?php echo $user_group['id']; ?>">
                    <tr>
                        <div style="margin: 20px 10px;width: 100%;float:none;" align="center">组名：<input type="text" name="groupname" value="<?php echo $user_group['groupname']; ?>" /></div>
                    </tr>
                    <tr>
                   <div style="margin:0 auto; width:<?php echo count($Menu_html)*260; ?>px;">
                      <?php if(!empty($Menu_html)) {?>
                          <?php foreach ($Menu_html as $m) {?>
		                      <div style="margin: 0 10px;width: 240px;float:left;min-height: 600px">
				                <div id="menuContainer" productionid="<?php if(isset($productionid)){echo $productionid;} ?>">
				                  <ul class="ui-fancytree fancytree-container" tabindex="0">
				                    <ul>
				                    <?php echo $m; ?>
				                    </ul>
				                  </ul>
				                </div>
				              </div>
				          <?php }?>
                     <?php }?>
                    </div>
                    </tr>
                    <tr>
                        <td colspan=2>
                            <input type="submit" />
                        </td>
                    </tr>
                </table>
            </form>
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

    $('.fancytree-expander').click(function(){
        var i = $(this).parent().parent().find('>ul').toggle();
      });

    $(window).scroll(function () {
        if ($(window).scrollTop() > 50) {
            $('#go-top').show();
        }else {
            $('#go-top').hide();
        }
    });

    $(".parentnode").click(
    function(){
        if($(this).is(":checked"))
        {
    		$(this).parent().parent().next().children("li").children("span").children("span").children(":input").prop("checked","checked");
        }
        else
        {
        	$(this).parent().parent().next().children("li").children("span").children("span").children(":input").prop("checked",false);
        }
    });

    $(".childrennode").click(function(){
        if($(this).parent().parent().parent().parent().children("li").children("span").children("span").children(":input").is(":checked"))
        {
        	$(this).parent().parent().parent().parent().parent().children("span").children("span").children(":input").prop("checked","checked");
        }
        else
        {
        	$(this).parent().parent().parent().parent().parent().children("span").children("span").children(":input").prop("checked",false);
        }
        
    });
 });

</script> 

</html>

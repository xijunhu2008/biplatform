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
<!--               <form action="<?php echo base_url('index.php/admin/system/uplode'); ?>" method="post" enctype="multipart/form-data">
                <label for="file">Filename:</label>
                <input type="file" name="imgfile"/> 
                <br />
                <input type="submit" name="submit" value="Submit" />
              </form> -->

              <form action="<?php echo base_url('index.php/admin/system/uplode'); ?>" method="post" enctype="multipart/form-data" class="new_user_form inline-input" id="pic_upload_form">
                <label>上传帖子图片？:</label>
                <input type="file" name="imgfile" value="" id="pic_upload_text">
                <button name="submit" type="button" id="pic_upload_submit">上传</button>
              </form>
              <div>
                        <img src="" id="show_pic_after_upload">
               </div>
              <div class="pic_property" style="display:none;">
               图片名字:<input type="text" value="" name="pic" id="pic_name_hidden"><br>
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
  });

</script> 

</html>

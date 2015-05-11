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

          <form action="<?php echo base_url('index.php/admin/system/uplode'); ?>" method="post" enctype="multipart/form-data" class="new_user_form inline-input" id="pic_upload_form">
            <label>上传图片:</label>
            <input type="file" name="imgfile" value="" id="pic_upload_text">
            <button name="submit" type="button" id="pic_upload_submit">上传</button>
          </form>
          <div>
            <img src="" id="show_pic_after_upload">
          </div>
          <div>
            <form action="<?php echo base_url('index.php/admin/system/production_edit'); ?>" method="post">
                <table>
                    <input type="hidden" name="id" value="<?php echo $production_info['id']; ?>">

                    <tr>
                        <td>名称：<input type="text" name="displayname" value="<?php echo $production_info['displayname']; ?>" /></td>
                    </tr>
                    <tr class="pic_property" style="display:none;">
                        <td>图片：<input type="text" value="<?php echo $production_info['image']; ?>" name="image_url" id="pic_name_hidden"></td>
                    </tr>
                    <tr>
                        <td> 
                          状态：
                          <select name="status">
                            <option value="1" <?php if($production_info['status'] == 1){echo 'selected="selected"';}?>>开启</option>
                            <option value="0" <?php if($production_info['status'] == 0){echo 'selected="selected"';}?>>关闭 </option>
                          </select>
                        </td>
                    </tr>
                    <tr>
                      
                        <td>
                          所属框架：
                          <select name="reportframeworkid">
                            <?php foreach ($all_framework as $key => $value) {?>
                            <option value="<?php echo $value['id']; ?>" <?php if($production_info['reportframeworkid'] == $value['id']){echo 'selected="selected"';}?> ><?php echo $value['displayname']; ?></option>
                            <?php }?>
                          </select>
                        </td>
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

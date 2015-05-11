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
            <form action="<?php echo base_url('index.php/admin/manage/user_group_relation_edit'); ?>" method="post">
                <table>
                    <input type="hidden" name="account" value="<?php echo $user['account']; ?>">
                    <tr>
                        <td>昵称：<input type="text" name="name" value="<?php echo $user['nickname']; ?>" /></td>
                    </tr>
                    <tr>
                        <td>密码：<input type="password" name="passwd" value="" /></td>
                    </tr>
                    <tr>
                      
                        <td>
                          所属组：
                          <?php foreach ($all_group as $key => $value) {?>
                          <input type="radio" name="group" value="<?php echo $value['id']; ?>" <?php if(in_array($value['id'], $relation)){echo 'checked';} ?> >
                          <span><?php echo $value['groupname']; ?></span>
                          <?php }?>
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

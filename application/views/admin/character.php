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
            <div class="jmreport-pageTitle"><a href="javascript:;" style="font-size:16px;color:#004c85;">特性菜单</a></div>
          </div>

          <div>
            <div id="tb_user_list">
              <table>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>名称</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <?php foreach ($all_production as $key => $value) {?>
                  <tr>
                    <td><?php echo $value['id']; ?></td>
                    <td><?php echo $value['displayname']; ?></td>
                    <td>
                      <a href="<?php echo base_url('index.php/admin/framework/character_info').'/'.$value['id']; ?>">详情</a>
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

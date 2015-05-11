<!DOCTYPE html>

<html>
<head>
<meta name="renderer" content="webkit">
<meta name="force-rendering" content="webkit">
<meta http-equiv="X-UA-Compatible" content="chrome=1,IE=edge">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>管理后台--数据源</title>

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
            <form action="<?php echo base_url('index.php/admin/databases/databases_edit'); ?>" method="post">
                <table>
                    <input type="hidden" name="id" value="<?php echo $databases_info['id']; ?>">

                    <tr>
                        <td>名称：<input type="text" name="displayname" value="<?php echo $databases_info['displayname']; ?>" /></td>
                    </tr>
                    <tr>
                        <td>编码：<input type="text" name="label" value="<?php echo $databases_info['label']; ?>" /></td>
                    </tr>
                    <tr>
                        <td>主机：<input type="text" name="host" value="<?php echo $databases_info['host']; ?>" /></td>
                    </tr>
                    <tr>
                        <td>端口：<input type="text" name="port" value="<?php echo $databases_info['port']; ?>" /></td>
                    </tr>
                    <tr>
                        <td>用户：<input type="text" name="user" value="<?php echo $databases_info['user']; ?>" /></td>
                    </tr>
                    <tr>
                        <td>密码：<input type="password" name="password" value="<?php echo $databases_info['password']; ?>" /></td>
                    </tr>
                    <tr>
                        <td>数据源：<input type="text" name="database" value="<?php echo $databases_info['database']; ?>" /></td>
                    </tr>
                    <tr>
                        <td>数据源：<input type="text" name="otherattr" value="<?php echo $databases_info['otherattr']; ?>" /></td>
                    </tr>
                    <tr>
                        <td> 
                          数据源类型：
                          <select name="servertype">
                            <option value="0" <?php if($databases_info['servertype'] == 0){echo 'selected="selected"';}?>>mysql</option>
                            <option value="1" <?php if($databases_info['servertype'] == 1){echo 'selected="selected"';}?>>oracle</option>
                            <option value="2" <?php if($databases_info['servertype'] == 2){echo 'selected="selected"';}?>>sqlserver</option>
                            <option value="3" <?php if($databases_info['servertype'] == 3){echo 'selected="selected"';}?>>npgsql</option>
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

<!DOCTYPE html>

<html>
<head>
<meta name="renderer" content="webkit">
<meta name="force-rendering" content="webkit">
<meta http-equiv="X-UA-Compatible" content="chrome=1,IE=edge">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>管理后台--JM报表</title>
<link rel="shortcut icon" href="<?php echo base_url('favicon.gif')?>" type="image/x-gif" />
<link rel="icon" href="<?php echo base_url('favicon.gif')?>" type="image/x-gif" />
<link rel="stylesheet" type="text/css" href="<?php echo base_url('static/js/jquery-ui/css/cupertino/jquery-ui-1.10.3.custom.min.css')?>">


<link rel="stylesheet" type="text/css" href="<?php echo base_url('static/js/fullcalendar/fullcalendar.css')?>">
<link rel="stylesheet" type="text/css" href="<?php echo base_url('static/css/report.css')?>">
<link href="<?php echo base_url('static/css/menu.css')?>" rel="stylesheet" />
<link href="<?php echo base_url('static/css/site.css')?>" rel="stylesheet" type="text/css" />


<!--jquery Core & oap.js-->
<script src="<?php echo base_url('static/js/jquery.min.js')?>" type="text/javascript"></script>

<!--jquery ui-->

<script type="text/javascript" src="<?php echo base_url('static/js/jquery-ui/js/jquery-ui-1.10.3.custom.min.js')?>"></script>
<script type="text/javascript" src="<?php echo base_url('static/js/fullcalendar/fullcalendar.min.js')?>"></script>
<script type="text/javascript" src="<?php echo base_url('static/js/jquery-ui/js/jquery-ui-timepicker-addon.js')?>"></script>
<script type="text/javascript" src="<?php echo base_url('static/js/jquery-ui/js/jquery-ui-timepicker-zh-CN.js')?>"></script>

<style type="text/css">

table{
    width: 100%;  
    font-size: 14px;
    border: 1px solid #e0e6f4;  
}
table thead tr{
    height: 34px;
    line-height: 34px;
}
table td{ height:34px; line-height:34px; text-align: center; border:1px solid #e0e6f4}
table th{ border-bottom:1px solid #dde3f0; font-size: 16px; font-weight:bold; }

</style>

</head>

<body>
<div id="pagebody">
  <div id="header">
    <div id="header-inner">
      <div id="logininfo"> welcome <span class="user">(<?php echo $user['nickname']?>)</span> <a href="../login.aspx?cmd=logout">退出</a> </div>
      <div class="logo"> <a href="../production/list.aspx"> <img alt="" src="<?php echo base_url('static/img/logo.png')?>" /> </a> <span>JM REPORT</span> <span>-</span> <span>后台管理</span> </div>
      <div class="clear"> </div>
    </div>
  </div>
  <section>
    <div class="body-width"> 
      
      <!--for ie border-->
      <div class="body-content">
        <div class="leftArea" id="leftArea" style="width:15%; min-width:220px;">
          <div class="leftMenu" id="leftMenu" > 
            <div id="searchkey">
            </div>
            <div id="report-menu" class="report-menu">
              <ul>
                <li class="menu">
                  <a class="menu">系统<div class="mark"></div></a>
                  <ul style="display: block;">
                    <li class="page"><a href="<?php echo base_url('index.php/admin/manage/user')?>" class="page" title="用户" >用户&nbsp;&nbsp;</a></li>
                    <li class="page"><a href="<?php echo base_url('index.php/admin/manage/user_group')?>" class="page" title="用户组">用户组&nbsp;&nbsp;</a></li>
                  </ul>
                </li>
              </ul>
            </div>
            
            <!--</div>--> 
            
          </div>
        </div>
        <div id="jmreport-page">
          <div id="jmreport-page-title">
            <div class="jmreport-pageTitle"></div>
          </div>

          <div>
<!--             <ul class="page-toolbar clearfix">
              <li><a href="#" class="jsAdd" onclick="javascript:clearGroup('#win-user-add');$('#win-user-add').dialog('open');return false;">新增</a></li>
            </ul>
            <ul class="page-toolbar clearfix">
              <li>
                <label>名称</label>
                <input type="text" id="txt-name">
              </li>
              <li><a href="#" class="jsSearch" onclick="searchUser()">查询</a></li>
            </ul> -->
            <div id="tb_user_list">
              <table>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>名称</th>
                    <th>创建人</th>
                    <th>创建时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <?php foreach ($all_user as $key => $value) {?>
                  <tr>
                    <td><?php echo $value['id']; ?></td>
                    <td><a href="#" onclick="javascript: openUpdateWin(1);return false;"><?php echo $value['nickname']; ?></a></td>
                    <td><?php echo $value['creater']; ?></td>
                    <td><?php echo $value['createon']; ?></td>
                    <td><a href="#" onclick="javascript:deleteUser('admin');return false;">删除</a></td>
                  </tr>
                  <?php }?>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="clear"></div>
      </div>

      <form target="_blank" id="exportform" method="post" action="" style="visibility: hidden;">
        <input type="text" hidden="hidden" id="par" name="par" />
        <input type="text" hidden="hidden" id="datapar" name="datapar" />
      </form>

      <div id="app_sel_body" class="sel-body"> </div>
      <div id="go-top" style="position:fixed;display:none;" title="回到顶部">
        <a href="#" onclick="javascript:window.scrollTo(0,0);return false;">
          <img src="<?php echo base_url('static/img/go-up.png')?>" alt="回到顶部" />
        </a> 
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
</html>

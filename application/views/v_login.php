<!DOCTYPE html>

<html lang="zh-CN">
<head>
<meta name="renderer" content="webkit">
<meta name="force-rendering" content="webkit">
<meta http-equiv="X-UA-Compatible" content="chrome=1,IE=edge">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<link rel="shortcut icon" href="<?php echo base_url('favicon.gif')?>" type="image/x-gif" />
<link rel="icon" href="<?php echo base_url('favicon.gif')?>" type="image/x-gif" />
<title>经营分析平台 -- 登陆</title>
<style>
html {
	background: #E1E1E4;
 background: url(<?php echo base_url('static/img/bg.png')?>);
}
.main {
	width: 100%;
	height: 100%;
	position: absolute;
	font-size: 14px;
}
.login-header {
	padding-top: 60px;
	text-align: center;
}
.login-header > h1 {
	font-size: 28px;
	font-weight: bold;
	color:#1D766F;
}
.login-box {
	border: 1px solid #ddd;
	box-shadow: 0 0 20px #ccc;
	border-radius: 6px;
	width: 360px;
	height: 220px;
	margin: 0 auto;
	position: relative;
	top: 4%;
	background-color: #F5F5F5;
}
.login-box ul {
	list-style: none;
	margin: 20px 10px;
}
.login-box ul li {
	margin: 34px 0;
}
.login-box ul li label {
	width: 80px;
	text-align: right;
	display: inline-block;
}
.login-box ul li input[type=text], .login-box ul li input[type=password] {
	width: 180px;
	height: 22px;
	padding: 4px;
	border:solid 1px #ccc;
	border-radius: 4px;
}
.login-box ul li input[type=submit] {
	padding:4px 8px;
	width: 30%;
	color: #fff;
	background-color:#009D91;
	margin: 0 35%;
	border-radius: 4px;
	border:solid 1px #1D766F;
}
</style>
<link href="<?php echo base_url('static/css/site.css')?>" type="text/css" rel="stylesheet" />
<script src="<?php echo base_url('static/js/jquery.min.js')?>"></script>
<script src="<?php echo base_url('static/js/jquery-validate.min.js')?>" ></script>
<script src="<?php echo base_url('static/js/common.js')?>"></script>
</head>

<body>
<div class="main">
  <div class="row-fluid">
    <div class="span12 center login-header">
      <h1>欢迎使用 KF 经营分析平台</h1>
    </div>
    <!--/span--> 
    
  </div>
  <div class="login-box">
    <form method="post">
      <ul>
        <li>
          <label>用户名：</label>
          <input type="text" placeholder="请输入用户名" required="true" value="" name="txtuser"/>
        </li>
        <li>
          <label>密码：</label>
          <input type="password" required="true" placeholder="请输入密码" name="txtpwd"/>
        </li>
        <li>
          <input type="submit" value="登 陆"/>
        </li>
      </ul>
    </form>
  </div>
</div>
</body>
</html>
<script src="<?php echo base_url('static/js/report/jmreport.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/jmreport.lan.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/jmreport.mail.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/jmreport.min.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/jmreport.notice.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/jmreport.poppage.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/jmreport.reportControls.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/jmreport.serverProxy.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/jmreport.toolbarControls.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/reportcontrols/advanceEprChart.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/reportcontrols/advanceGridViewData.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/reportcontrols/dataViewDatePick.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/reportcontrols/eprChart.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/reportcontrols/gridSparkLine.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/reportcontrols/gridViewData.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/reportcontrols/imageBox.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/reportcontrols/itemCompareList.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/reportcontrols/label.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/reportcontrols/linkButton.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/reportcontrols/newEprChart.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/reportcontrols/newGridViewData.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/toolbarcontrols/checkBoxList.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/toolbarcontrols/comboBoxOne.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/toolbarcontrols/dateTimeOne.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/toolbarcontrols/dateTimePickerOne.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/toolbarcontrols/dateTimeTwo.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/toolbarcontrols/halfaYearOne.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/toolbarcontrols/horizontalListBox.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/toolbarcontrols/monthOne.js')?>" async="async" defer="defer"></script>
<script src="<?php echo base_url('static/js/report/toolbarcontrols/textBox.js')?>" async="async" defer="defer"></script>
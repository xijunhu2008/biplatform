  <div id="header">
    <div id="header-inner">
      <div id="logininfo"> welcome <span class="user">(<?php $user_info = $this->session->userdata('jmreport_loginuserinfo'); echo $user_info['nickname'];?>)</span> <a href="<?php echo base_url('index.php/login/logout')?>">退出</a> </div>
      <div class="logo"> <a href="#"> <img alt="" src="<?php echo base_url('static/img/logo.png')?>" /> </a> <span>经营分析平台 -- 后台管理</span></div>
      <div class="clear"> </div>
    </div>
  </div>
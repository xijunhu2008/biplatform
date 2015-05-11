<!DOCTYPE html>

<html>
<head>
<meta name="renderer" content="webkit">
<meta name="force-rendering" content="webkit">
<meta http-equiv="X-UA-Compatible" content="chrome=1,IE=edge">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>经营分析平台 -- 业务</title>
<link rel="shortcut icon" href="<?php echo base_url('favicon.gif')?>" type="image/x-gif" />
<link rel="icon" href="<?php echo base_url('favicon.gif')?>" type="image/x-gif" />
<link href="<?php echo base_url('static/css/site.css')?>" rel="stylesheet" />
<link href="<?php echo base_url('static/css/applist.css')?>" rel="stylesheet" />
<script src="<?php echo base_url('static/js/jquery.min.js')?>"></script>
<script src="<?php echo base_url('static/js/common.js')?>"></script>

</head>

<body>
<div id="header">
          <?php
            $this->load->view('top');
          ?>
</div>
<div class="proBody">

    <div class="b_center">
        <div class='applist'id="applist">
           <ul>
            <?php foreach ($apps as $key => $value) {?>
            <li> <a class="pro" title="<?php echo $value['displayname']; ?>" href="<?php echo base_url('index.php/report/index').'/'.$value['id']; ?>"> <span class="img"> <img alt="<?php echo $value['displayname']; ?>" src="<?php echo $this->config->item('images_host').$value['image']; ?>" onerror="this.src='http://192.168.1.81/static/img/logos/noapping.png'"></span> <span class="title"><?php echo $value['displayname']; ?></span> </a> </li>
            <?php }?>
            <?php if($user['account'] == 'admin') {?>
            <li> <a class="pro" title="管理后台" href="<?php echo base_url('index.php/admin/manage/index'); ?>"> <span class="img"> <img alt="管理后台" src="http://192.168.1.81/static/img/logos/noapping.png" onerror="this.src='http://192.168.1.81/static/img/logos/noapping.png'"></span> <span class="title">管理后台</span> </a> </li>
            <?php }?>
           </ul>
        </div>
        <div id="pager"> </div>
    </div>
  
</div>
<div id="footer">
          <?php
            $this->load->view('footer');
          ?>
</div>
</body>
</html>

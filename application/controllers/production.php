<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Production extends MY_Controller{
	function __construct()
	{
        parent::__construct();
		$this->load->model('Production_model', 'production');
    }

    public function index(){
		$user = $this->login->getUser();
		$apps = $this->production->getAll();
		$pros = array();
		//是否有权限
		foreach ($apps as $app) {
			if($app['status'] != 1) continue;
			if(in_array($app['id'], $user['productions'])){
				$pros[] = $app;
			}
			//$app['HasPermission'] = in_array($app['id'], $user['productions']);
		}
		
		$this->parser->parse('v_production', array('apps'=>$pros, 'user'=>$user));
	}

}
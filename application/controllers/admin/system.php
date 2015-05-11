<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

//require_once('./application/controllers/base.php');

class System extends MY_Controller{
	function __construct(){
        parent::__construct();
        $this->load->model('system_admin_model','system_admin');
    }

	/**
	 * 业务相关操作
	 */
	public function index(){
		$this->production();
	}

	public function production(){
		$type = $this->input->post('type');
		$all_production = $this->system_admin->getAllProduction($type);
		$all_framework = $this->system_admin->getAllFramework();
		$this->parser->parse('/admin/production', array('all_production'=>$all_production,'all_framework'=>$all_framework));
	}

	public function production_add(){
		if($_POST){
			$code = $this->input->post('code');
			$displayname = $this->input->post('displayname');
			$status = $this->input->post('status');
			$reportframeworkid = $this->input->post('reportframeworkid');
			$time = date("Y-m-d H:i:s");

			$user = $this->session->userdata('jmreport_loginuserinfo');
			$creater = isset($user['account'])&&!empty($user['account']) ? $user['account'] : '火星人';

			$data = array('code'=>$code,'displayname'=>$displayname,'status'=>$status,'reportframeworkid'=>$reportframeworkid,'creater'=>$creater,'createon'=>$time);

			$rs = $this->system_admin->ProductionAdd($data);
			if($rs){
				$this->jsonContent(array(),0,'添加成功',false);
			}else{
				$this->jsonContent(array(),1,'添加失败',false);
			}
		}else{
			$this->jsonContent(array(),2,'参数错误',false);
		}
	}


	public function production_edit($id=''){
		if(!$id){
			$id = $this->input->post('id');
		}

		if(!$id){
			$this->jsonContent(array(),2,'参数错误',false);
			exit;
		}

		if($_POST){
			$displayname = $this->input->post('displayname');
			$image_url = $this->input->post('image_url');
			$status = $this->input->post('status');
			$reportframeworkid = $this->input->post('reportframeworkid');

			$user = $this->session->userdata('jmreport_loginuserinfo');
			$creater = isset($user['account'])&&!empty($user['account']) ? $user['account'] : '火星人';

			$data = array('displayname'=>$displayname,'image'=>$image_url,'status'=>$status,'reportframeworkid'=>$reportframeworkid);

			$rs = $this->system_admin->ProductionEdit($data,$id);

			redirect(site_url('admin/system/production'));
		}

		$production_info = $this->system_admin->getAllProductionById($id);
		$all_framework = $this->system_admin->getAllFramework();
		$this->parser->parse('/admin/production_edit', array('production_info'=>$production_info,'all_framework'=>$all_framework));
	}

	public function uplode_test(){
		$this->parser->parse('/admin/uplode', array());
	}

	public function uplode(){
        $this->load->model('upload_model','upload_model');
		$rs = $this->upload_model->uplode();
		echo $rs;
	}

}
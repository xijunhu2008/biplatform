<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

//require_once('./application/controllers/base.php');

class Databases extends MY_Controller{
	function __construct(){
        parent::__construct();
        $this->load->model('databases_admin_model','databases_admin');
    }

	/**
	 * 数据源相关操作
	 */
	public function index(){
		$this->databases();
	}

	public function databases(){
		$type = $this->input->post('type');
		$all_databases = $this->databases_admin->getAllDatabases($type);
		$this->parser->parse('/admin/databases', array('all_databases'=>$all_databases));
	}

	public function databases_add(){
		if($_POST){
			$displayname = $this->input->post('displayname');
			$label = $this->input->post('label');
			$servertype = $this->input->post('servertype');
			$host = $this->input->post('host');
			$port = $this->input->post('port');
			$user = $this->input->post('user');
			$password = $this->input->post('password');
			$database = $this->input->post('database');
			$otherattr = $this->input->post('otherattr');

			$data = array('displayname'=>$displayname,'label'=>$label,'servertype'=>$servertype,'host'=>$host,'port'=>$port,'user'=>$user,'password'=>$password,'database'=>$database,'otherattr'=>$otherattr);

			$rs = $this->databases_admin->DatabasesAdd($data);
			if($rs){
				$this->jsonContent(array(),0,'添加成功',false);
			}else{
				$this->jsonContent(array(),1,'添加失败',false);
			}
		}else{
			$this->jsonContent(array(),2,'参数错误',false);
		}
	}


	public function databases_edit($id=''){
		if(!$id){
			$id = $this->input->post('id');
		}

		if(!$id){
			$this->jsonContent(array(),2,'参数错误',false);
			exit;
		}

		if($_POST){
			$displayname = $this->input->post('displayname');
			$label = $this->input->post('label');
			$servertype = $this->input->post('servertype');
			$host = $this->input->post('host');
			$port = $this->input->post('port');
			$user = $this->input->post('user');
			$password = $this->input->post('password');
			$database = $this->input->post('database');
			$otherattr = $this->input->post('otherattr');

			$data = array('displayname'=>$displayname,'label'=>$label,'servertype'=>$servertype,'host'=>$host,'port'=>$port,'user'=>$user,'password'=>$password,'database'=>$database,'otherattr'=>$otherattr);

			$rs = $this->databases_admin->DatabasesEdit($data,$id);

			redirect(site_url('admin/databases/index'));
		}

		$databases_info = $this->databases_admin->getAllDatabasesById($id);
		$this->parser->parse('/admin/databases_edit', array('databases_info'=>$databases_info));
	}

	public function databases_delete(){
		$id = $this->input->post('id');
		if($id){
			$rs = $this->databases_admin->DatabasesDelBygid($id);

			if($rs){
				$this->jsonContent(array(),0,'删除成功',false);
			}else{
				$this->jsonContent(array(),1,'删除失败',false);
			}
		}else{
			$this->jsonContent(array(),2,'参数错误',false);
		}
	}
}
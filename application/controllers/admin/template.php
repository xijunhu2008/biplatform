<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

//require_once('./application/controllers/base.php');

class Template extends MY_Controller{
	function __construct(){
        parent::__construct();
        $this->load->model('template_admin_model','template_admin');
    }

	/**
	 * 数据源相关操作
	 */
	public function index(){
		$this->template();
	}

	public function template(){
		$type = $this->input->post('type');
		$all_template = $this->template_admin->getAllTemplate($type);
		$this->parser->parse('/admin/template', array('all_template'=>$all_template));
	}

	public function template_add(){
		if($_POST){
			$templatename = $this->input->post('templatename');
			$content = $this->input->post('content');

			$data = array('templatename'=>$templatename,'content'=>$content);

			$rs = $this->template_admin->TemplateAdd($data);
			if($rs){
				$this->jsonContent(array(),0,'添加成功',false);
			}else{
				$this->jsonContent(array(),1,'添加失败',false);
			}
		}else{
			$this->jsonContent(array(),2,'参数错误',false);
		}
	}


	public function template_edit($id=''){
		if(!$id){
			$id = $this->input->post('id');
		}

		if(!$id){
			$this->jsonContent(array(),2,'参数错误',false);
			exit;
		}

		if($_POST){
			$templatename = $this->input->post('templatename');
			$content = $this->input->post('content');

			$data = array('templatename'=>$templatename,'content'=>$content);
			$rs = $this->template_admin->templateEdit($data,$id);

			redirect(site_url('admin/template/index'));
		}

		$template_info = $this->template_admin->getAllTemplateById($id);
		$this->parser->parse('/admin/template_edit', array('template_info'=>$template_info));
	}

	public function template_delete(){
		$id = $this->input->post('id');
		if($id){
			$rs = $this->template_admin->TemplateDelBygid($id);

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
<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

//require_once('./application/controllers/base.php');

class Manage extends MY_Controller{
	function __construct(){
        parent::__construct();
        $this->load->model('user_admin_model','user_admin');
    }

	/**
	 * 后台管理
	 */
	public function index(){
		$this->user();
	}

	public function user(){
		//$access = $this->check_access();
		//获取所有用户
		$all_user = $this->user_admin->getAllUser();

		//获取所有组
		$user_group = $this->user_admin->getAllUserGroup();

		$this->parser->parse('/admin/user', array('all_user'=>$all_user,'all_group'=>$user_group));
	}

	public function user_add(){
		if($_POST){
			$account = $this->input->post('account');
			$name = $this->input->post('name');
			$passwd = $this->input->post('passwd');
			$group = $this->input->post('group');
			$time = date("Y-m-d H:i:s");

			$passwd = !empty($passwd) ? strtoupper(md5($passwd)) : '';

			$user = $this->session->userdata('jmreport_loginuserinfo');
			$creater = isset($user['account'])&&!empty($user['account']) ? $user['account'] : '火星人';

			$data = array('account'=>$account,'nickname'=>$name,'password'=>$passwd,'creater'=>$creater,'createon'=>$time);

			$rs = $this->user_admin->userAdd($data);
			if($rs){
				if(!empty($group)){
					//foreach ($group as $key => $value){
						$user_group_data = array();
						$user_group_data = array('groupid'=>$group,'account'=>$account,'creater'=>$creater,'createon'=>$time);
						$user_group_rs = $this->user_admin->userGroupRelationAdd($user_group_data);
					//}
				}

				$this->jsonContent(array(),0,'添加成功',false);
			}else{
				$this->jsonContent(array(),1,'添加失败',false);
			}
		}else{
			$this->jsonContent(array(),2,'参数错误',false);
		}
	}

	//用户与组关系编辑
	public function user_group_relation_edit($account=''){
		if(!$account){
			$account = $this->input->post('account');
		}

		if($_POST){
			$name = $this->input->post('name');
			$passwd = $this->input->post('passwd');
			$group = $this->input->post('group');
			$passwd = !empty($passwd) ? strtoupper(md5($passwd)) : '';

			$data = array('nickname'=>$name,'password'=>$passwd);
			$rs = $this->user_admin->userEdit($data,$account);

			$del_rs = $this->user_admin->userGroupRelationDel($account);
			if($del_rs){
				if(!empty($group)){
					$user = $this->session->userdata('jmreport_loginuserinfo');
					$creater = isset($user['account'])&&!empty($user['account']) ? $user['account'] : '火星人';
					$time = date("Y-m-d H:i:s");
					//foreach ($group as $key => $value){
						$user_group_data = array();
						$user_group_data = array('groupid'=>$group,'account'=>$account,'creater'=>$creater,'createon'=>$time);
						$user_group_rs = $this->user_admin->userGroupRelationAdd($user_group_data);
					//}
				}
			}
		}

		unset($user);
		//获取当前用户
		$user = $this->user_admin->getUserByAccount($account);
		//获取所有组
		$all_group = $this->user_admin->getAllUserGroup();
		//获取当前用户的所属组
		$UserGroupRelation = $this->user_admin->getUserGroupRelation($account);

		$my_relation_ids = array();
		if ($UserGroupRelation) {
			foreach ($UserGroupRelation as $key => $value) {
				$my_relation_ids[] = $value['id'];
			}
		}
		$this->parser->parse('/admin/user_edit', array('user'=>$user[0],'all_group'=>$all_group,'relation'=>$my_relation_ids));
	}


	public function user_delete(){
		$account = $this->input->post('account');
		if($account){
			$rs = $this->user_admin->userDel($account);

			if($rs){

				$del_rs = $this->user_admin->userGroupRelationDel($account);

				$this->jsonContent(array(),0,'删除成功',false);
			}else{
				$this->jsonContent(array(),1,'删除失败',false);
			}
		}else{
			$this->jsonContent(array(),2,'非有效参数',false);
		}
	}

	public function user_group(){	
		$this->load->model('Production_model', 'production');

		$app = $this->production->getAll();
		$all_production = array();
		$apps = array();
		if(!empty($app)){
			foreach ($app as $v) {
				$apps[$v['id']] = $v;
				$all_production[$v['id']] = $this->user_admin->getProductionAdnFrameworkMenus($v['id'], $v['reportframeworkid']);
			}
		}

		//$access = $this->check_access();
		$user_group = $this->user_admin->getAllUserGroup();

		$this->parser->parse('/admin/user_group', array('user_group'=>$user_group,'apps'=>$apps,'all_production'=>$all_production));
	}

	public function user_group_add(){
		if($_POST){
			$groupname = $this->input->post('groupname');
			$group = $this->input->post('group');
			$time = date("Y-m-d H:i:s");
			$user = $this->session->userdata('jmreport_loginuserinfo');
			$creater = isset($user['account'])&&!empty($user['account']) ? $user['account'] : '火星人';

			$data = array('groupname'=>$groupname,'creater'=>$creater,'createon'=>$time);

			$rs = $this->user_admin->userGroupAdd($data);

			if($rs){
				if(!empty($group)){
					foreach ($group as $value){
						$access_data = array();
						$ids = explode('_', $value);
						$access_data = array('groupid'=>$rs,'productionid'=>$ids[0],'mid'=>$ids[1],'creater'=>$creater,'createon'=>$time);
						$uaccess_rs = $this->user_admin->userGroupAccessAdd($access_data);
					}
				}

				$this->jsonContent(array(),0,'添加成功',false);
			}else{
				$this->jsonContent(array(),1,'添加失败',false);
			}
		}else{
			$this->jsonContent(array(),2,'参数错误',false);
		}
	}



	/*public function user_group_access_edit($group_id=''){
		if(!$group_id){
			$group_id = $this->input->post('group_id');
		}

		if($_POST){
			$groupname = $this->input->post('groupname');
			$group = $this->input->post('group');

			$data = array('groupname'=>$groupname);

			$rs = $this->user_admin->userGroupEdit($data,$group_id);

			$del_rs = $this->user_admin->userGroupAccessDelBygid($group_id);
			if($del_rs){
				if(!empty($group)){
					foreach ($group as $value){
						$access_data = array();
						$time = date("Y-m-d H:i:s");
						$user = $this->session->userdata('jmreport_loginuserinfo');
						$creater = isset($user['account'])&&!empty($user['account']) ? $user['account'] : '火星人';
						$ids = explode('_', $value);
						$access_data = array('groupid'=>$group_id,'productionid'=>$ids[0],'mid'=>$ids[1],'creater'=>$creater,'createon'=>$time);
						$access_rs[] = $this->user_admin->userGroupAccessAdd($access_data);
					}

					if($access_rs){
						redirect(site_url('admin/manage/user_group'));
					}else{
						redirect(site_url('admin/manage/user_group'));
					}
				}
			}
		}

		$this->load->model('Production_model', 'production');
		$app = $this->production->getAll();
		$all_production = array();
		$apps = array();
		if(!empty($app)){
			foreach ($app as $v) {
				$apps[$v['id']] = $v;
				$all_production[$v['id']] = $this->user_admin->getProductionAdnFrameworkMenus($v['id'], $v['reportframeworkid']);
			}
		}

		//$access = $this->check_access();
		$user_group = $this->user_admin->getAllUserGroupById($group_id);

		$my_group = $this->user_admin->getGroupAccessBygid($group_id);
		$my_group_id = array();
		if(!empty($my_group)){
			foreach ($my_group as $key => $value) {
				$my_group_id[$value['productionid']][] = $value['mid'];
			}
		}

		$this->parser->parse('/admin/group_edit', array('user_group'=>$user_group,'apps'=>$apps,'all_production'=>$all_production,'my_group_id'=>$my_group_id));

	}*/
	
	public function user_group_access_edit($group_id=''){
		if(!$group_id){
			$group_id = $this->input->post('group_id');
		}
		
		if($_POST){
			$groupname = $this->input->post('groupname');
			$group = $this->input->post('group');

			$data = array('groupname'=>$groupname);

			$rs = $this->user_admin->userGroupEdit($data,$group_id);

			$del_rs = $this->user_admin->userGroupAccessDelBygid($group_id);
			if($del_rs){
				if(!empty($group)){
					foreach ($group as $value){
						$access_data = array();
						$time = date("Y-m-d H:i:s");
						$user = $this->session->userdata('jmreport_loginuserinfo');
						$creater = isset($user['account'])&&!empty($user['account']) ? $user['account'] : '火星人';
						$ids = explode('_', $value);
						$access_data = array('groupid'=>$group_id,'productionid'=>$ids[0],'mid'=>$ids[1],'creater'=>$creater,'createon'=>$time);
						$access_rs[] = $this->user_admin->userGroupAccessAdd($access_data);
					}

					if($access_rs){
						redirect(site_url('admin/manage/user_group'));
					}else{
						redirect(site_url('admin/manage/user_group'));
					}
				}
			}
		}
		
		$this->load->model('Production_model', 'production');
		$app = $this->production->getAll();
		$all_production = array();
		$apps = array();
		if(!empty($app)){
			foreach ($app as $v) {
				$apps[$v['id']] = $v;
				$all_production[$v['id']] = $this->user_admin->getProductionAdnFrameworkMenus($v['id'], $v['reportframeworkid']);
			}
		}

		//$access = $this->check_access();
		$user_group = $this->user_admin->getAllUserGroupById($group_id);

		$my_group = $this->user_admin->getGroupAccessBygid($group_id);
		$my_group_id = array();
		if(!empty($my_group)){
			foreach ($my_group as $key => $value) {
				$my_group_id[$value['productionid']][] = $value['mid'];
			}
		}
		
		$Menu_html = array();
		if(!empty($all_production))
		{
			foreach($all_production as $key => $value)
			{
				if(!isset($Menu_html[$key]))
				{
					$Menu_html[$key] ='';
				}
				if(!isset($my_group_id[$key]))
				{
					$my_group_id[$key] =array();
				}
				$Menu_html[$key] .= "<span style=\"font-weight: bold; color:red;\">{$apps[$key]['displayname']}:</span>";
				$menus = $value;
				$Menu_sub_html = $this->user_admin->createMenuHtml($menus,$my_group_id[$key],$key);
				$Menu_html[$key] .= $Menu_sub_html;
			}
		}
		
		$this->parser->parse('/admin/group_edit', array('user_group'=>$user_group,'Menu_html'=>$Menu_html));
	}


	public function user_group_delete(){
		$id = $this->input->post('id');
		if($id){
			$rs = $this->user_admin->userGroupDel($id);

			if($rs){
				$this->user_admin->userGroupRelationDelBygid($id);
				$this->user_admin->userGroupAccessDelBygid($id);

				$this->jsonContent(array(),0,'删除成功',false);
			}else{
				$this->jsonContent(array(),1,'删除失败',false);
			}
		}else{
			$this->jsonContent(array(),2,'非有效参数',false);
		}
	}

}
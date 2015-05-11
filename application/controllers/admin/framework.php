<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

//require_once('./application/controllers/base.php');

class Framework extends MY_Controller{
	function __construct(){
        parent::__construct();
        $this->load->model('framework_admin_model','framework_admin');
    }

	/**
	 * 模板相关操作
	 */
	public function index(){
		$this->framework();
	}

	//框架相关信息展示
	public function framework(){
		$all_framework = $this->framework_admin->getAllFramework();
		$this->parser->parse('/admin/framework', array('all_framework'=>$all_framework));
	}
	//新增框架信息
	public function framework_add(){
		if($_POST){
			$frameworkname = $this->input->post('frameworkname');
			$time = date("Y-m-d H:i:s");

			$user = $this->session->userdata('jmreport_loginuserinfo');
			$creater = isset($user['account'])&&!empty($user['account']) ? $user['account'] : '火星人';

			$data = array('displayname'=>$frameworkname,'creater'=>$creater,'createon'=>$time);

			$rs = $this->framework_admin->FrameworkAdd($data);
			if($rs){
				$this->jsonContent(array(),0,'添加成功',false);
			}else{
				$this->jsonContent(array(),1,'添加失败',false);
			}
		}else{
			$this->jsonContent(array(),2,'参数错误',false);
		}
	}

	//编辑框架信息
	public function framework_edit($id=''){
		if(!$id){
			$id = $this->input->post('id');
		}

		if(!$id){
			$this->jsonContent(array(),2,'参数错误',false);
			exit;
		}

		if($_POST){
			$frameworkname = $this->input->post('frameworkname');
			$data = array('displayname'=>$frameworkname);
			$rs = $this->framework_admin->frameworkEdit($data,$id);

			redirect(site_url('admin/framework/index'));
		}

		$framework_info = $this->framework_admin->getAllframeworkById($id);
		$this->parser->parse('/admin/framework_edit', array('framework_info'=>$framework_info));
	}

	public function framework_delete(){
		$id = $this->input->post('id');
		if($id){
			$rs = $this->framework_admin->frameworkDelBygid($id);

			if($rs){
				$this->jsonContent(array(),0,'删除成功',false);
			}else{
				$this->jsonContent(array(),1,'删除失败',false);
			}
		}else{
			$this->jsonContent(array(),2,'参数错误',false);
		}
	}

	public function framework_info($id=''){
		if(!$id){
			$id = $this->input->post('id');
		}

		if(!$id){
			$this->jsonContent(array(),2,'参数错误',false);
			exit;
		}

		//获取当前模板对应的
		$Menus = $this->framework_admin->getMenus($id,1);
		$Menus_html = $this->common_model->createMenuHtml($Menus);
		$this->parser->parse('/admin/framework_info', array('id'=>$id,'relegation'=>1,'Menus_html'=>$Menus_html));
	}

	//获取所有的业务
	public function character(){
        $this->load->model('system_admin_model','system_admin');
		$all_production = $this->system_admin->getAllProduction(1);
		$this->parser->parse('/admin/character', array('all_production'=>$all_production));
	}
	public function character_info($id=''){
		if(!$id){
			$id = $this->input->post('id');
		}

		if(!$id){
			$this->jsonContent(array(),2,'参数错误',false);
			exit;
		}
        $this->load->model('system_admin_model','system_admin');

		//获取当前模板对应的
		$Menus = $this->framework_admin->getMenus($id,0);
		$Menus_html = $this->common_model->createMenuHtml($Menus);

		$production_info = $this->system_admin->getAllProductionById($id);

		$this->parser->parse('/admin/framework_info', array('id'=>$production_info['reportframeworkid'],'productionid'=>$production_info['id'],'relegation'=>0,'Menus_html'=>$Menus_html));
	}

	public function framework_root_directory(){
		$html = $this->parser->parse('/admin/framework_mulu_root_directory', array(),true);
		echo $html;
	}
	public function framework_mulu(){
		$id = $this->input->get_post('id');
		$parentid = $this->input->get_post('parentid');
		if($id){
			$menu = $this->framework_admin->getMenuById($id);

			$html = $this->parser->parse('/admin/framework_mulu', array('menu'=>$menu,'parentid'=>$parentid),true);
			echo $html;
		}else{
			$menu['id'] = 0;
			$menu['displayname'] = '';
			$html = $this->parser->parse('/admin/framework_mulu', array('menu'=>$menu,'parentid'=>$parentid),true);
			echo $html;
		}
	}

	public function framework_mulu_add(){
		$menu_name = $this->input->post('menu_name');
		$frameworkid = $this->input->post('frameworkid');
		$parentid = $this->input->post('parentid');
		$relegation = $this->input->post('relegation');

		$data = array('displayname'=>$menu_name,'relegation'=>$relegation,'relegationid'=>$frameworkid,'pageid'=>0,'parentid'=>$parentid);

		$rs = $this->framework_admin->MenuAdd($data);
		if($rs){
			$this->jsonContent(array(),0,'添加成功',false);
		}else{
			$this->jsonContent(array(),1,'添加失败',false);
		}
	}

	public function framework_mulu_edit(){
		$id = $this->input->get_post('id');
		if(!$id){
			$this->jsonContent(array(),2,'参数错误',false);
			exit;
		}

		$menu_name = $this->input->get_post('menu_name');

		$data = array('displayname'=>$menu_name);

		$rs = $this->framework_admin->MenuEdit($data,$id);

		if($rs){
			$this->jsonContent(array(),0,'编辑成功',false);
		}else{
			$this->jsonContent(array(),1,'编辑失败',false);
		}
	}

	public function framework_yemian(){
        $this->load->model('template_admin_model','template_admin');

		$pageid = $this->input->get_post('pageid');
		$parentid = $this->input->post('parentid');
		//获取所有的模板
		$all_template = $this->template_admin->getAllTemplate();

		if($pageid){
			$pagetconfig = $this->framework_admin->getPageConfigById($pageid);
			$reportconfig = $this->framework_admin->getReportConfigById($pageid);
			$toolbarcontrols = $this->framework_admin->getToolBarcontrolConfigByWhere(' pageid = ? ',$pageid,0);

			$template_info = array();
			if($reportconfig['templateid']){
				foreach ($all_template as $key => $value) {
					if($value['id'] == $reportconfig['templateid']){
						$template_info = json_decode($value['content'],true);
					}
				}

				$my_control = $this->framework_admin->getControlConfigByWhere(' reportid = ? ',$reportconfig['id'],0);
				$my_controls = array();
				foreach ($my_control as $key => $value) {
					$my_controls[$value['controlindex']] = $value;
				}
			}else{
				$my_controls = array();
				$template_info = array();
			}

			$html = $this->parser->parse('/admin/framework_yemian', array('parentid'=>$parentid,'all_template'=>$all_template,'pagetconfig'=>$pagetconfig,'reportconfig'=>$reportconfig,'toolbarcontrols'=>$toolbarcontrols,'template_info'=>$template_info,'my_controls'=>$my_controls),true);
			echo $html;
		}else{
			$pagetconfig['id'] = '';
			$template_info = array();
			$reportconfig['id'] = "";
			$my_controls = array();
			$html = $this->parser->parse('/admin/framework_yemian', array('parentid'=>$parentid,'all_template'=>$all_template,'pagetconfig'=>$pagetconfig,'reportconfig'=>$reportconfig,'template_info'=>$template_info,'my_controls'=>$my_controls),true);
			echo $html;
		}

	}

	public function framework_yemian_add(){
		$page_title = $this->input->post('page_title');
		$templateid = $this->input->post('templateid');
		$frameworkid = $this->input->post('frameworkid');
		$parentid = $this->input->post('parentid');
		$relegation = $this->input->post('relegation');

		$time = date("Y-m-d H:i:s");
		$user = $this->session->userdata('jmreport_loginuserinfo');
		$creater = isset($user['account'])&&!empty($user['account']) ? $user['account'] : '火星人';

		$data = array('displayname'=>$page_title,'creater'=>$creater,'createon'=>$time);
		$rs = $this->framework_admin->PageAdd($data);

		if($rs){
			$m_data = array('displayname'=>$page_title,'relegation'=>$relegation,'relegationid'=>$frameworkid,'pageid'=>$rs,'parentid'=>$parentid);
			$m_rs = $this->framework_admin->MenuAdd($m_data);

			$r_data = array('displayname'=>$page_title,'pageid'=>$rs,'templateid'=>$templateid);
			$r_rs = $this->framework_admin->ReportConfigAdd($r_data);

			if($r_rs){
				$this->jsonContent(array(),0,'添加成功',false);
			}else{
				$this->jsonContent(array(),1,'添加失败',false);
			}
		}
	}

	public function framework_yemian_edit(){
		$parentid = $this->input->post('parentid');
		$pageid = $this->input->post('pageid');
		$page_title = $this->input->post('page_title');
		$templateid = $this->input->post('templateid');

		$data = array('displayname'=>$page_title);
		$rs = $this->framework_admin->PageEdit($data,$pageid);

		$m_data = array('displayname'=>$page_title);
		$m_rs = $this->framework_admin->MenuEdit($m_data,$parentid);

		$r_data = array('displayname'=>$page_title,'templateid'=>$templateid);
		$r_rs = $this->framework_admin->ReportConfigEdit($r_data,$pageid);

		if($r_rs){
			$this->jsonContent(array(),0,'编辑成功',false);
		}else{
			$this->jsonContent(array(),1,'编辑失败',false);
		}
	}

	public function framework_condition(){
        $this->load->model('databases_admin_model','databases_admin');
		$id = $this->input->get_post('id');

		$databases = $this->databases_admin->getAllDatabases();
		$controls = $this->framework_admin->getControlsByWhere(' controltype = ? ',0,0);

		if($id){
			$toolbar_info = $this->framework_admin->getToolBarcontrolConfigByWhere(' id = ? ',$id,1);
			if(!empty($toolbar_info['datasourceid'])){
				$datasource_info = $this->framework_admin->getDataSourceByWhere(' id = ? ',$toolbar_info['datasourceid'],1);

				$sourcemapping = $this->framework_admin->getSourceMappingByWhere(' datasourceid = ? ',$toolbar_info['datasourceid'],0);
			}else{
				$datasource_info = array();
				$sourcemapping = array();
			}
		}else{
			$toolbar_info = array();
			$datasource_info = array();
			$sourcemapping = array();
		}
		$html = $this->parser->parse('/admin/framework_condition', array('databases'=>$databases,'controls'=>$controls,'toolbar_info'=>$toolbar_info,'datasource_info'=>$datasource_info,'sourcemapping'=>$sourcemapping),true);
		echo $html;
	}

	public function framework_condition_add(){
		$pageid = $this->input->post('pageid');
		$displayname = $this->input->post('displayname');
		$controlname = $this->input->post('controlname');
		$label = $this->input->post('label');
		$defaultvalue = $this->input->post('defaultvalue');
		$dataserverlabel = $this->input->post('dataserverlabel');
		$datasource = $this->input->post('datasource');

		$data = array('displayname'=>$displayname,'requestparam'=>$datasource,'methodname'=>'query');
		$rs = $this->framework_admin->DataSourceAdd($data);

		if($rs){
			$t_data = array('pageid'=>$pageid,'displayname'=>$displayname,'controlname'=>$controlname,'label'=>$label,'defaultvalue'=>$defaultvalue,'dataserverlabel'=>$dataserverlabel,'datasourceid'=>$rs);
			$t_rs = $this->framework_admin->ToolBarcontrolConfigAdd($t_data);

			if($t_rs){
				$this->jsonContent(array(),0,'添加成功',false);
			}else{
				$this->jsonContent(array(),1,'添加失败',false);
			}
		}
	}

	public function framework_condition_edit(){
		$toolbarid = $this->input->post('toolbarid');
		$pageid = $this->input->post('pageid');
		$displayname = $this->input->post('displayname');
		$controlname = $this->input->post('controlname');
		$label = $this->input->post('label');
		$defaultvalue = $this->input->post('defaultvalue');
		$dataserverlabel = $this->input->post('dataserverlabel');
		$datasource = $this->input->post('datasource');

		if($toolbarid){
			$toolbar_info = $this->framework_admin->getToolBarcontrolConfigByWhere(' id = ? ',$toolbarid,1);
			if(!empty($toolbar_info['datasourceid'])){
				$data = array('displayname'=>$displayname,'requestparam'=>$datasource,'methodname'=>'query');
				$se = $this->framework_admin->DataSourceEdit($data,$toolbar_info['datasourceid']);
				$rs = $toolbar_info['datasourceid'];
			}else{
				if(!empty($datasource)){
					$data = array('displayname'=>$displayname,'requestparam'=>$datasource,'methodname'=>'query');
					$se = $rs = $this->framework_admin->DataSourceAdd($data);
				}else{
					$se = $rs = 0;
				}
			}

			$t_data = array('pageid'=>$pageid,'displayname'=>$displayname,'controlname'=>$controlname,'label'=>$label,'defaultvalue'=>$defaultvalue,'dataserverlabel'=>$dataserverlabel,'datasourceid'=>$rs);
			$t_rs = $this->framework_admin->ToolBarcontrolConfigEdit($t_data,$toolbarid);

			if($t_rs || $se){
				$this->jsonContent(array(),0,'编辑成功',false);
			}else{
				$this->jsonContent(array(),1,'编辑失败',false);
			}
		}else{
			$this->jsonContent(array(),2,'非法参数',false);
		}
	}

	public function framework_condition_del(){
		$id = $this->input->post('id');
		if($id){
			$rs = $this->framework_admin->ToolBarcontrolConfigDelBygid($id);

			if($rs){
				$this->jsonContent(array(),0,'删除成功',false);
			}else{
				$this->jsonContent(array(),1,'删除失败',false);
			}
		}else{
			$this->jsonContent(array(),2,'参数错误',false);
		}
	}


	public function framework_sourcemapping_add(){
		$id = $this->input->get_post('id');
		$name = $this->input->get_post('name');
		$displayname = $this->input->get_post('displayname');
		$datatype = $this->input->get_post('datatype');
		$description = $this->input->get_post('description');

		$rs = array();
		if(!empty($name)){
			$this->framework_admin->SourceMappingDelBygid($id);
			foreach ($name as $key => $value) {
				$data = array();
				$data = array('datasourceid'=>$id,'name'=>$name[$key],'displayname'=>$displayname[$key],'datatype'=>$datatype[$key],'description'=>$description[$key]);
				$rs[] = $this->framework_admin->SourceMappingAdd($data);
			}
		}

		if($rs){
			$this->jsonContent(array(),0,'添加成功',false);
		}else{
			$this->jsonContent(array(),1,'添加失败',false);
		}
	}

	public function framework_control(){
        $this->load->model('databases_admin_model','databases_admin');
		$reportconfigid = (int)$this->input->get_post('reportconfigid');
		$index_id = (int)$this->input->get_post('index_id');

		$databases = $this->databases_admin->getAllDatabases();
		$controls = $this->framework_admin->getControlsByWhere(' controltype = ? ',1,0);

		$controlconfig = $this->framework_admin->getControlConfigByWhere(' reportid = ? AND controlindex = ? ',array($reportconfigid,$index_id),1);

		if($controlconfig){
			if(!empty($controlconfig['datasourceid'])){
				$datasource_info = $this->framework_admin->getDataSourceByWhere(' id = ? ',$controlconfig['datasourceid'],1);

				$sourcemapping = $this->framework_admin->getSourceMappingByWhere(' datasourceid = ? ',$controlconfig['datasourceid'],0);
			}else{
				$datasource_info = array();
				$sourcemapping = array();
			}
		}else{
			$controlconfig = array();
			$datasource_info = array();
			$sourcemapping = array();
		}

		$html = $this->parser->parse('/admin/framework_control', array('reportconfigid'=>$reportconfigid,'index_id'=>$index_id,'databases'=>$databases,'controls'=>$controls,'controlconfig'=>$controlconfig,'datasource_info'=>$datasource_info,'sourcemapping'=>$sourcemapping),true);
		echo $html;
	}
	
	public function framework_control_add(){
		$reportid = $this->input->post('reportid');
		$displayname = $this->input->post('displayname');
		$controlname = $this->input->post('controlname');
		$controlindex = $this->input->post('controlindex');
		$controlconfig = $this->input->post('controlconfig');
		$dataserverlabel = $this->input->post('dataserverlabel');
		$datasource = $this->input->post('datasource');

		$data = array('displayname'=>$displayname,'requestparam'=>$datasource,'methodname'=>'query');
		$rs = $this->framework_admin->DataSourceAdd($data);

		if($rs){
			$t_data = array('reportid'=>$reportid,'displayname'=>$displayname,'controlname'=>$controlname,'controlindex'=>$controlindex,'controlconfig'=>$controlconfig,'dataserverlabel'=>$dataserverlabel,'datasourceid'=>$rs);
			$t_rs = $this->framework_admin->ControlConfigAdd($t_data);

			if($t_rs){
				$this->jsonContent(array(),0,'添加成功',false);
			}else{
				$this->jsonContent(array(),1,'添加失败',false);
			}
		}
	}

	public function framework_control_edit(){
		$controlid = $this->input->post('controlid');
		$reportid = $this->input->post('reportid');
		$displayname = $this->input->post('displayname');
		$controlname = $this->input->post('controlname');
		$controlindex = $this->input->post('controlindex');
		$controlconfig = $this->input->post('controlconfig');
		$dataserverlabel = $this->input->post('dataserverlabel');
		$datasource = $this->input->post('datasource');

		if($controlid){
			$control_info = $this->framework_admin->getControlConfigByWhere(' id = ? ',$controlid,1);
			if(!empty($control_info['datasourceid'])){
				$data = array('displayname'=>$displayname,'requestparam'=>$datasource,'methodname'=>'query');
				$se = $this->framework_admin->DataSourceEdit($data,$control_info['datasourceid']);
				$rs = $control_info['datasourceid'];
			}else{
				if(!empty($datasource)){
					$data = array('displayname'=>$displayname,'requestparam'=>$datasource,'methodname'=>'query');
					$se = $rs = $this->framework_admin->DataSourceAdd($data);
				}else{
					$se = $rs = 0;
				}
			}

			$c_data = array('displayname'=>$displayname,'controlname'=>$controlname,'controlindex'=>$controlindex,'controlconfig'=>$controlconfig,'dataserverlabel'=>$dataserverlabel,'datasourceid'=>$rs);
			$c_rs = $this->framework_admin->ControlConfigEdit($c_data,$controlid);

			if($c_rs || $se){
				$this->jsonContent(array(),0,'编辑成功',false);
			}else{
				$this->jsonContent(array(),1,'编辑失败',false);
			}
		}else{
			$this->jsonContent(array(),2,'非法参数',false);
		}

	}
}
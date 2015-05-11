<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

//require('base.php');

class Report extends MY_Controller{
	function __construct(){
        parent::__construct();
    }

	/**
	 *  
	 * 业务报表
	 */
	public function index($appid){
		$user = $this->login->getUser();	
		$this->load->model('Production_model', 'production');
		$this->load->model('Menu_model', 'menu');
        $this->load->model('user_admin_model','user_admin');

		$app = $this->production->getById($appid);
		$menus = $this->menu->getProductionAdnFrameworkMenus($app['id'], $app['reportframeworkid']);

		$group = $this->user_admin->getUserGroupRelation($user['account']);

		$my_group_ids = array();
		if($group){
			$my_group = $this->user_admin->getGroupAccessByg2id($group[0]['id'],$appid);
			if($my_group){
				foreach ($my_group as $key => $value) {
					$my_group_ids[] = $value['mid'];
				}
			}
		}

		$new_menu = array();                                                         //|| ($value['parentid'] == 0 && $value['pageid'] == 0)
		if(!empty($my_group_ids)){
			foreach ($menus as $key => $value) {
				if ((in_array($value['id'], $my_group_ids))) {
					$new_menu[] = $value;
				}
			}
		}
		$menuhtml = $this->createMenuHtml($new_menu);
		$this->parser->parse('v_report', array('app'=>$app,'menuhtml'=>$menuhtml, 'user'=>$user));
	}

	//生成菜单html
	function createMenuHtml($menus, $parent=null, $deep=1){
		if(!$menus || count($menus) == 0) return '';

		if(!$parent) $parent = array('id'=>0);
		if(!isset($parent['children'])) {
			$parent['children'] = array();
			foreach ($menus as $m) {
				if($m['parentid'] == $parent['id'] || ($parent['id']==0 && !$m['parentid'])) {
					$parent['children'][] = $m;
				}
			}
		}
		$html = '';
		if(count($parent['children']) > 0){
			if($parent['id'] > 0) {
				$html .= "<li class=\"menu\"><a href=\"#\" class=\"menu\" data-deep=\"{$deep}\">{$parent['displayname']}<div class=\"mark\"></div></a>";
				$html .= '<ul>';
				foreach ($parent['children'] as $cm) {
					$html .= $this->createMenuHtml($menus, $cm, $deep);
				}
				$html .= '</ul></li>';
			}
			else{
				foreach ($parent['children'] as $cm) {
					$html .= $this->createMenuHtml($menus, $cm, $deep);
				}
			}
		}else { 
            $html .= "<li class=\"page\">";
		    $html .= "<a href=\"#\" data-relegation=\"{$parent['relegation']}\" data-page=\"{$parent['pageid']}\" class=\"page\" title=\"{$parent['displayname']}\" data-deep=\"{$deep}\" data-home=\"0\">{$parent['displayname']}&nbsp;&nbsp;</a>";
            $html .= "</li>";
        }
        return $html;

	}

	//请求后台数据
	function getData() {		
		$this->load->model('Reportdata_model', 'reportData');
		$param = @json_decode($this->input->post('param'), true);
		$user = $this->login->getUser();	

		// header('param:'.json_encode($param));
		// header('user:'.json_encode($user));

		// if(!in_array($param['productionId'], $user['productions'])) {
		// 	throw new Exception("您没有权限", 1);			
		// }

		$data = array();
		$data[] = $this->reportData->requestData($param);

		$this->jsonContent($data);
	}

}

?>
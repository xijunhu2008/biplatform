<?php

/**
 * 公共model
 *
 * @author axelis
 * @date 2015年4月18日11:52:30
 */

class Common_model extends MY_Model

{

	/**
	 * 写操作日志
	 * @param {string} $table 操作的表名
	 * @param {string} $target 操作的id
	 * @param {string} $action 操作类型，delete update error debug等
	 * @param {string} $desc 操作说明
	 * @param {string} $sql 操作sql
	 */
	public function write($table, $target, $action, $desc = '', $sql = '') {

		$now = date('Y-m-d H:i:s');

		$user = $this->login->getUser();

		$operator = $user?$user['LoginName']:'';

		//生成insert语句

		$sql = $this->db->insert_string('t_action_log', array("tablename"=>$table,"target_id"=>$target,"action_type"=>$action,"sql"=>$sql,"description"=>$desc,"operator"=>$operator,"ondate"=>$now));

		$this->db->query($sql);

	}

	/**
	 * 生成后台菜单
	 * @param {array} $menus 表单表中的数据
	 */
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
				$chufaid = isset($parent['pageid']) && !empty($parent['pageid']) ? 'yemian' : 'mulu';
				$html .= "<li class=\"fancytree-lastsib\"><span class=\"fancytree-node fancytree-exp-el fancytree-ico-ef  {$chufaid} \" mid=\"{$parent['id']}\" pid=\"{$parent['pageid']}\"><span class=\"fancytree-expander\"></span><span class=\"fancytree-icon\"></span><span class=\"fancytree-title\">{$parent['displayname']}</span></span>";
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
			$chufaid = isset($parent['pageid']) && !empty($parent['pageid']) ? 'yemian' : 'mulu';
            $html .= "<li>";
		    $html .= "<span class=\"fancytree-node fancytree-exp-n fancytree-ico-c {$chufaid} \"  mid=\"{$parent['id']}\" pid=\"{$parent['pageid']}\"><span class=\"fancytree-expander\"></span><span class=\"fancytree-icon\"></span><span class=\"fancytree-title\">{$parent['displayname']}&nbsp;&nbsp;</span></span>";
            $html .= "</li>";
        }
        return $html;

	}
}
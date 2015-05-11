<?php

/**
 * 用户操作
 *
 * @author axelis
 * @date 2015年4月14日16:54:04
 */

class User_admin_model extends MY_Model{
	//获取所有的用户
	public function getAllUser(){
		$sql = "select id,account,nickname,creater,createon from tbuser where 1 ";	
		$rs = $this->dbHelper->select($sql);
		return $rs;
	}

	public function getUserByAccount($account){
		if(!is_array($account)){
			$data = array($account);
		}
		$sql = "select id,account,nickname from tbuser where account=? ";	
		$rs = $this->dbHelper->select($sql,$data);
		return $rs;
	}

	//新增用户
	public function userAdd($data){
		if(!empty($data)){
			$table_name = 'tbuser';
			$rs = $this->dbHelper->insert($table_name, $data, null,true);
			return $rs;
		}
	}

	//修改用户
	public function userEdit($data,$account){
		if(!empty($data) && !empty($account)){
			if(!is_array($account)){
				$account_data = array($account);
			}

			$table_name = 'tbuser';
			$where = " account = ? ";
			$rs = $this->dbHelper->update($table_name,$data,$where,$account_data);
			return $rs;
		}
	}

	//删除用户
	public function userDel($account){
		if(!empty($account)){
			if(!is_array($account)){
				$data = array($account);
			}

			$table_name = 'tbuser';
			$sql = " DELETE FROM {$table_name} WHERE account = ? ";
			$rs = $this->dbHelper->delete($sql,$account);
			return $rs;
		}
	}

	//获取所有的用户组
	public function getAllUserGroup(){
		$sql = "select * from tbgroup where 1 ";	
		$rs = $this->dbHelper->select($sql);
		return $rs;
	}

	//获取ID指定的用户组
	public function getAllUserGroupById($id){
		if(!is_array($id)){
			$id_data = array($id);
		}
		$sql = "select * from tbgroup where id=? ";	
		$rs = $this->dbHelper->select_row($sql,$id_data);
		return $rs;
	}

	//新增用户组
	public function userGroupAdd($data){
		if(!empty($data)){
			$table_name = 'tbgroup';
			$rs = $this->dbHelper->insert($table_name, $data, null,true);
			return $rs;
		}
	}

	//修改组
	public function userGroupEdit($data,$id){
		if(!empty($data) && !empty($id)){
			if(!is_array($id)){
				$id_data = array($id);
			}

			$table_name = 'tbgroup';
			$where = " id = ? ";
			$rs = $this->dbHelper->update($table_name,$data,$where,$id_data);
			return $rs;
		}
	}

	//删除用户组
	public function userGroupDel($id){
		if(!empty($id)){

			if(!is_array($id)){
				$ids = array($id);
			}

			$table_name = 'tbgroup';
			$sql = " DELETE FROM {$table_name} WHERE id = ? ";
			$rs = $this->dbHelper->delete($sql,$ids);
			return $rs;
		}
	}


	//用户与用户组关系数据
	public function getUserGroupRelation($account){
		if(!empty($account)){
			if(!is_array($account)){
				$account_data = array($account);
			}

			$sql = "select id,groupname from tbgroup where id in (select groupid from tbuser_group where account=?) ";	
			$rs = $this->dbHelper->select($sql,$account_data);
			return $rs;
		}
	}

	//新增用户与用户组关系数据
	public function userGroupRelationAdd($data){
		if(!empty($data)){
			$table_name = 'tbuser_group';
			$rs = $this->dbHelper->insert($table_name, $data, null,true);
			return $rs;
		}
	}

	//修改用户与用户组关系
	// public function userGroupRelationEdit($data,$where,$account){
	// 	if(!empty($data)){

	// 		if(!is_array($account)){
	// 			$account_data = array($account);
	// 		}

	// 		$table_name = 'tbuser_group';
	// 		$where = !empty($where) ? $where : " account=? ";
	// 		$rs = $this->dbHelper->update($table_name,$data,$where,$account_data);
	// 		return $rs;
	// 	}
	// }

	//删除某个用户与用户组关系
	public function userGroupRelationDel($account){
		if(!empty($account)){

			if(!is_array($account)){
				$account_data = array($account);
			}

			$table_name = 'tbuser_group';
			$sql = " DELETE FROM {$table_name} WHERE account = ? ";
			$rs = $this->dbHelper->delete($sql,$account_data);
			return $rs;
		}
	}

	//通过组ID删除某个用户与用户组关系
	public function userGroupRelationDelBygid($groupid){
		if(!empty($groupid)){

			if(!is_array($groupid)){
				$groupid_data = array($groupid);
			}
			
			$table_name = 'tbuser_group';
			$sql = " DELETE FROM {$table_name} WHERE groupid = ? ";
			$rs = $this->dbHelper->delete($sql,$groupid_data);
			return $rs;
		}
	}


	//获取业务和其框架的菜单合集
	/*public function getProductionAdnFrameworkMenus($productionId, $frameworkId) {
		$sql = "select * from tbmenu where ((relegation=0 and relegationid=?) or (relegation=1 and relegationid=?)) AND pageid != 0 order by parentid,seq ";
		return $this->dbHelper->select($sql, array($productionId, $frameworkId));

	}*/
	
	public function getProductionAdnFrameworkMenus($productionId, $frameworkId) {
		$sql = "select * from tbmenu where ((relegation=0 and relegationid=?) or (relegation=1 and relegationid=?)) order by parentid,seq ";
		return $this->dbHelper->select($sql, array($productionId, $frameworkId));

	}


	//新增组与业务的权限关系
	public function userGroupAccessAdd($data){
		if(!empty($data)){
			$table_name = 'tbgroup_production';
			$rs = $this->dbHelper->insert($table_name, $data, null,true);
			return $rs;
		}
	}
	
	//通过组ID删除某个用组所有权限
	public function userGroupAccessDelBygid($groupid){
		if(!empty($groupid)){

			if(!is_array($groupid)){
				$groupid_data = array($groupid);
			}
			
			$table_name = 'tbgroup_production';
			$sql = " DELETE FROM {$table_name} WHERE groupid = ? ";
			$rs = $this->dbHelper->delete($sql,$groupid_data);
			return $rs;
		}
	}

	//通过组ID获取所有权限ID
	public function getGroupAccessBygid($id) {
		$sql = "select * from tbgroup_production where groupid=?";
		$pro = $this->dbHelper->select($sql, array($id));
		return $pro;
	}

	//通过组ID,APPID获取所有权限ID
	public function getGroupAccessByg2id($id,$appid) {
		$sql = "select * from tbgroup_production where groupid=? AND productionid = ?";
		$pro = $this->dbHelper->select($sql, array($id,$appid));
		return $pro;
	}
	
	//生产对应的权限界面
	public function createMenuHtml($menus,$my_group_id,$productionid,$parent=null)
	{
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
				$ToLead = $productionid.'_'.$parent['id'];
				if(isset($my_group_id))
				{
					if(in_array($parent['id'], $my_group_id))
					{
						$check = 'checked';
					}
					else 
					{
						$check = '';
					}
				}
				else 
				{
					$check = '';
				}
				$html .= "<li class=\"fancytree-lastsib\"><span class=\"fancytree-node fancytree-exp-el fancytree-ico-ef  {$chufaid} \" mid=\"{$parent['id']}\" pid=\"{$parent['pageid']}\"><span class=\"fancytree-expander\"></span><span class=\"fancytree-icon\"></span><span class=\"fancytree-title\">{$parent['displayname']}</span><span style=\"float:right\"><input type=\"checkbox\" name=\"group[]\" class=\"parentnode\" value=\"{$ToLead}\" {$check}></span></span>";
				$html .= '<ul>';
				foreach ($parent['children'] as $cm) {
					$html .= $this->createMenuHtml($menus, $my_group_id,$productionid, $cm);
				}
				$html .= '</ul></li>';
			}
			else{
				foreach ($parent['children'] as $cm) {
					$html .= $this->createMenuHtml($menus, $my_group_id,$productionid, $cm);
				}
			}
		}else {
			$ToLead = $productionid.'_'.$parent['id'];
			if(isset($my_group_id))
			{
				if(in_array($parent['id'], $my_group_id))
				{
					$check = 'checked';
				}
				else 
				{
					$check = '';
				}
			}
			else 
			{
				$check = '';
			}
			$chufaid = isset($parent['pageid']) && !empty($parent['pageid']) ? 'yemian' : 'mulu';
            $html .= "<li>";
		    $html .= "<span class=\"fancytree-node fancytree-exp-n fancytree-ico-c {$chufaid} \"  mid=\"{$parent['id']}\" pid=\"{$parent['pageid']}\"><span class=\"fancytree-expander\"></span><span class=\"fancytree-icon\"></span><span class=\"fancytree-title\">{$parent['displayname']}&nbsp;&nbsp;</span><span style=\"float:right\"><input type=\"checkbox\" name=\"group[]\" class=\"childrennode\" value=\"{$ToLead}\" {$check}></span></span>";
            $html .= "</li>";
        }
        return $html;
	}
}

?>
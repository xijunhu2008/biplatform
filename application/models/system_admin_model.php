<?php

/**
 * 系统相关操作model
 *
 * @author axelis
 * @date 2015年4月20日17:28:23
 */

class System_admin_model extends MY_Model{
	//获取所有的业务
	public function getAllProduction($type = ''){
		$type = !empty($type) ? "status = {$type} " : 1 ;
		$sql = "select * from tbproduction where {$type} ";
		$rs = $this->dbHelper->select($sql);
		return $rs;
	}

	//获取ID指定的业务
	public function getAllProductionById($id){
		if(!is_array($id)){
			$id_data = array($id);
		}
		$sql = "select * from tbproduction where id=? ";
		$rs = $this->dbHelper->select_row($sql,$id_data);
		return $rs;
	}
	
	//新增业务
	public function ProductionAdd($data){
		if(!empty($data)){
			$table_name = 'tbproduction';
			$rs = $this->dbHelper->insert($table_name, $data, null,true);
			return $rs;
		}
	}

	//修改业务
	public function ProductionEdit($data,$id){
		if(!empty($data) && !empty($id)){
			if(!is_array($id)){
				$id_data = array($id);
			}

			$table_name = 'tbproduction';
			$where = " id = ? ";
			$rs = $this->dbHelper->update($table_name,$data,$where,$id_data);
			return $rs;
		}
	}

	//获取所有的框架信息
	public function getAllFramework(){
		$sql = "select * from tbreportframework where 1 ";
		$rs = $this->dbHelper->select($sql);
		return $rs;
	}
}
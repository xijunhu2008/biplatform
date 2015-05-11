<?php

/**
 * 数据源相关操作model
 *
 * @author axelis
 * @date 2015年4月22日17:40:51
 */

class Databases_admin_model extends MY_Model{
	//获取所有的数据源
	public function getAllDatabases($where = ''){
		$where = !empty($where) ? $where : 1 ;
		$sql = "select * from tbdataserver where {$where} ";
		$rs = $this->dbHelper->select($sql);
		return $rs;
	}

	//获取ID指定的数据源
	public function getAllDatabasesById($id){
		if(!is_array($id)){
			$id_data = array($id);
		}
		$sql = "select * from tbdataserver where id=? ";
		$rs = $this->dbHelper->select_row($sql,$id_data);
		return $rs;
	}
	
	//新增数据源
	public function DatabasesAdd($data){
		if(!empty($data)){
			$table_name = 'tbdataserver';
			$rs = $this->dbHelper->insert($table_name, $data, null,true);
			return $rs;
		}
	}

	//修改数据源
	public function DatabasesEdit($data,$id){
		if(!empty($data) && !empty($id)){
			if(!is_array($id)){
				$id_data = array($id);
			}

			$table_name = 'tbdataserver';
			$where = " id = ? ";
			$rs = $this->dbHelper->update($table_name,$data,$where,$id_data);
			return $rs;
		}
	}

	//通过组ID删除某个数据源
	public function DatabasesDelBygid($id){
		if(!empty($id)){

			if(!is_array($id)){
				$id_data = array($id);
			}
			
			$table_name = 'tbdataserver';
			$sql = " DELETE FROM {$table_name} WHERE id = ? ";
			$rs = $this->dbHelper->delete($sql,$id_data);
			return $rs;
		}
	}
}
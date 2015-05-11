<?php

/**
 * 业务操作
 *
 * @author fefeding
 * @date 2014-12-21
 */

class Production_model extends MY_Model{
	//获取所有业务信息
	public function getAll() {
		$sql = "select * from tbproduction where status = 1 order by createon desc";
		$productions = $this->dbHelper->select($sql);
		return $productions;
	}

	//获取业务信息
	public function getById($id) {
		$sql = "select * from tbproduction where id=?";
		$pro = $this->dbHelper->select_row($sql, array($id));
		return $pro;
	}
}
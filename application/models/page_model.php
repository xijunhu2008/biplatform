<?php

/**

 * 页面操作

 *

 * @author fefeding

 * @date 2014-12-21

 */

class Page_model extends MY_Model

{

	//获取页面

	public function getById($id) {

		$sql = "select * from tbpageconfig where id=?";

		return $this->dbHelper->select_row($sql, array($id));

	}

}
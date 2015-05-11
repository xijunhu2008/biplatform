<?php

/**

 * 菜单操作

 *

 * @author fefeding

 * @date 2014-12-21

 */

class Menu_model extends MY_Model

{

	//获取业务菜单或框架菜单 

	//$relegation=0表示业务，=1表示框架

	public function getByRelegation($rid, $relegation=0) {

		$sql = "select * from tbmenu where relegation=? and relegationid=? order by seq";

		return $this->dbHelper->select($sql, array($relegation, $rid));

	}



	//获取业务和其框架的菜单合集

	public function getProductionAdnFrameworkMenus($productionId, $frameworkId) {

		$sql = "select * from tbmenu where (relegation=0 and relegationid=?) or (relegation=1 and relegationid=?) order by seq";

		return $this->dbHelper->select($sql, array($productionId, $frameworkId));

	}

}
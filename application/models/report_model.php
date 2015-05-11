<?php

/**

 * 报表操作

 *

 * @author fefeding

 * @date 2014-12-21

 */

class Report_model extends MY_Model

{

	//获取页面的报表对象

	public function getReportsByPage($id) {

		$sql = "select t1.*, t2.content from tbreportconfig t1 left join tbreporttemplate t2 on t2.id=t1.templateid where pageid=?";

		return $this->dbHelper->select($sql, array($id));

	}



	//获取报表的模板

	public function getReportTemplate($id) {

		$sql = "select * from tbreporttemplate where id=?";

		return $this->dbHelper->select_row($sql, array($id));

	}

}
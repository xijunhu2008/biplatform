<?php

/**

 * 数据源操作

 *

 * @author fefeding

 * @date 2014-12-21

 */

class Reportdata_model extends MY_Model

{

	//通过id获取服务器

	public function getServerById($id) {

		$sql = "select * from tbdataserver where id=?";

		return $this->dbHelper->select_row($sql, array($id));

	}



	//通过label获取服务器

	public function getServerByLabel($label) {

		$sql = "select * from tbdataserver where label=?";

		return $this->dbHelper->select_row($sql, array($label));

	}



	//通过id获取数据源

	public function getSourceById($id) {

		$sql = "select * from tbdatasource where id=?";

		return $this->dbHelper->select_row($sql, array($id));

	}



	//获取数据源的字段映射

	public function getSourceMappingById($id) {

		$sql = "select * from tbdatasourcemapping where datasourceid=?";

		return $this->dbHelper->select($sql, array($id));

	}



	//请求数据

	public function requestData($params) {		

		$source = $this->getSourceById($params['dataSourceId']);                  

		$server = $this->getServerByLabel($params['dataServerLabel']);

		$server = null;

		//为框架请求

		if($params['isFramework']) {

			$this->load->model('Production_model', 'production');

			$app = $this->production->getById($params['productionId']);

			$server = $this->getServerByLabel($params['dataServerLabel'] . '_' . $app['code']);

		}

		if(!$server) $server = $this->getServerByLabel($params['dataServerLabel']);

		if(!$server) {

			throw new Exception('获取数据服务器配置失败：' . $params['dataServerLabel']);

		}



		//初始化查询参数

		$this->replaceParams($params,$source);

		$data = $this->getData($server, $source);

		return $data;

	}



	//通过配置信息获取数据

	/*Mysql = 0,

            Oracle = 1,

            Sqlserver = 2,

            Npgsql = 3,

            WebService = 4,

            Cgi = 5

            */

	public function getData($server, $source) {

		try {

			$dbdriver = $server['servertype'];

			$dbdrivermap = array(0=>'mysql',1=>'oracle',2=>'sqlserver',3=>'npgsql');

			$dbdriver = $dbdrivermap[$dbdriver];

			$dbconfig = array();

			$dbconfig['hostname'] = $server['host'];

			$dbconfig['port'] = $server['port'];

			$dbconfig['username'] = $server['user'];

			$dbconfig['password'] = $server['password'];

			$dbconfig['database'] = $server['database'];

			$dbconfig['dbdriver'] = $dbdriver;

			$dbconfig['dbprefix'] = "";

			$dbconfig['pconnect'] = FALSE;

			$dbconfig['db_debug'] = TRUE;

			$dbconfig['cache_on'] = FALSE;

			$dbconfig['cachedir'] = "";

			$dbconfig['char_set'] = "utf8";

			$dbconfig['dbcollat'] = "utf8_general_ci";



			//$dsn = "{$dbdriver}://{$server['user']}:{$server['password']}@{$server['host']}/{$server['database']}?char_set=utf8";

			

			$db = $this->load->database($dbconfig, true);

			$sql = $source['requestparam'];

			$qry = $this->dbHelper->query($sql, null, $db);

			$data = array();

			$data['mappings'] = $this->getSourceMappingById($source['id']);

			$fields = @$qry->list_fields();

			$data['fields'] = array();

			if($fields) {

				for ($i=0;$i<count($fields);$i++) {

					$type = @mysql_field_type($qry->result_id, $i);

					$data['fields'][] = array('name'=>$fields[$i],'datatype'=>$type);	

				}

			}

			$data['data'] = $qry->result_array();

			$data['sql'] = $sql;

		}

		catch(Exception $e) {

			return array('msg'=>$e->getMessage());

		}		

		return $data;

	}



	//用变量处理查询参数

	function replaceParams(&$params, &$source) {

		$this->initParas($params);

		$pkey = array();

		$pvalue = array();

		foreach ($params['condition'] as $item) {

			$pkey[] = "#{$item['Key']}#";

			$pvalue[] = $item['Value'];

			$pkey[] = "%{$item['Key']}%";

			$pvalue[] = $item['Value'];

		}

		$source['requestparam'] = str_ireplace($pkey, $pvalue, $source['requestparam']);		

	}



	//初始化一些时间参数

	function initParas(&$params) {

		if(!$params['condition']) $params['condition'] = array();

		$now = date('Y-m-d H:i:s');

		$params['condition'][] = array('Key'=>'sys_now','Value'=>$now);

		$params['condition'][] = array('Key'=>'sys_now{yyyy}','Value'=>date('Y'));

		$params['condition'][] = array('Key'=>'sys_now{MM}','Value'=>date('m'));

		$params['condition'][] = array('Key'=>'sys_now{dd}','Value'=>date('d'));

		$params['condition'][] = array('Key'=>'sys_now{HH}','Value'=>date('H'));

		$params['condition'][] = array('Key'=>'sys_now{mm}','Value'=>date('i'));

		$params['condition'][] = array('Key'=>'sys_now{ss}','Value'=>date('s'));

	}

}

?>
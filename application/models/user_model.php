<?php
/**
 * 用户操作
 *
 * @author fefeding
 * @date 2014-12-21
 */
class User_model extends MY_Model
{

	//通过帐号和密码获取用户信息，主要用于登录用
	public function getByAccAndPwd($acc, $pwd) {
		$sql = "select id, account, nickname from tbuser where account=? and password=?";
		$pwd = $this->createPassword($acc, $pwd);		
		$user = $this->dbHelper->select_row($sql, array($acc, $pwd));
		return $user;
	}

	//通过帐号获取用户信息
	public function getByAccount($acc) {
		$sql = "select id, account, nickname from tbuser where account=?";			
		$user = $this->dbHelper->select_row($sql, array($acc));
		return $user;
	}

	//通过id获取用户信息
	public function getById($id) {
		$sql = "select id, account, nickname from tbuser where id=?";			
		$user = $this->dbHelper->select_row($sql, array($id));
		return $user;
	}

	//获取用户有权限的业务
	public function getUserProductions($account) {
		$sql = "select productionid from tbgroup_production where groupid in (select groupid from tbuser_group where account=?)";
		$pros = $this->dbHelper->select($sql, array($account));
		$ret = array();
		foreach ($pros as $p) {
			$ret[] = $p['productionid'];
		}
		return $ret;
	}

	//生成用户存储密码
	private function createPassword($acc, $pwd) {
		return strtoupper(md5($pwd));
	}
}
?>
<?php

/**
 * 登录逻辑
 *
 * @author fefeding
 * @date 2014-11-10
 */

class Login_model extends MY_Model{

	const LOGINUSERKEY = "jmreport_loginuser";
	const LOGINUSERINFO = "jmreport_loginuserinfo";

	private $CURUSER = null;



	/**
	 * 获取当前登录用户信息
	 */

	public function getUser() {
		if($this->CURUSER) return $this->CURUSER;

		$key = $this->session->userdata(self::LOGINUSERKEY);

		if(!$key || strlen($key) <= 32) return null;

		$id = intval(substr($key, 32));	

		$this->load->model('User_model', 'user');

		$this->CURUSER = $this->user->getById($id);

		$this->CURUSER['productions'] = $this->user->getUserProductions($this->CURUSER['account']);

		return $this->CURUSER;
	}



	/**
	 * 登录认证
	 */

	public function login($acc, $pwd) {

		$this->load->model('User_model', 'user');

		$this->CURUSER = $this->user->getByAccAndPwd($acc, $pwd);		

		if($this->CURUSER) {
			$key = md5($acc) . $this->CURUSER['id']; 			
			$this->session->set_userdata(self::LOGINUSERKEY, $key);

			$user_info = $this->user->getById($this->CURUSER['id']);
			$this->session->set_userdata(self::LOGINUSERINFO, $user_info);
		}

		return $this->CURUSER;

	}

	/**
	 * 检查登录情况，如果未登录，则跳到oa sso登录页
	 */

	public function checkLogin() {
		$user = $this->getUser();
		if(!$user) {
			redirect(site_url('login'));
			return null;
		}
		return $user;
	}

	/**
	 * 登出，销毁对应的session
	 */

	public function logout() {
		$this->session->unset_userdata(self::LOGINUSERKEY);
		$this->session->unset_userdata(self::LOGINUSERINFO);
	}

}

?>
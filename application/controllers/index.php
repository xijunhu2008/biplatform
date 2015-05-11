<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');



//require('base.php');



class Index extends MY_Controller {

	function __construct()  

	{

        parent::__construct();

    }



	/**

	 * 首页controller	 

	 * 业务报表

	 */

	public function index($app)

	{

		redirect(site_url('production'));

	}



	

}

?>
<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 父控制器
 * @author axelis
 */
class MY_Controller extends CI_Controller
{
    function __construct($islogin=0){
        parent::__construct();
        $this->load->library('session');
        $this->load->helper('url');
        $this->load->library('parser');
        $this->load->model('common/Database_model','dbHelper', TRUE);
        $this->load->model('common/Action_model', 'logger');
        $this->load->model('Login_model','login');

        $this->load->model('common/common_model', 'common_model');

        //检查登录，未登录则跳到oa页

        if(!$islogin) {

            $user = $this->login->checkLogin();

            if(!$user) return;

        }

    }

    //返回json数据，主要用于cgi请求，会包装成{code:0,data:{},msg:''}
    public function jsonContent($data, $code=0,$msg='', $ret = false){
        $res = array('code'=>$code, 'msg'=>$msg, 'data'=>$data);
        $json = @json_encode($res);
        //如果给定最后一个参数为TRUE ，则直返回json而非打印
        if($ret) {
            return $json;
        }
        echo $json;
    }

    // public function check_access(){
    //     /**
    //      * 返回业务权限
    //      * @param **********
    //      */
    //     $user = $this->login->getUser();

    //     $this->load->model('Production_model', 'production');
    //     $apps = $this->production->getAll();

    //     $pros = array();

    //     //是否有权限
    //     if($apps){
    //         foreach($apps as $app){
    //             $app['HasPermission'] = in_array($app['id'], $user['productions']);
    //             $pros[$app['id']] = $app;
    //         }
    //     }

    //     return $pros;
    // }
}
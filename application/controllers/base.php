<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');



class Base_Controller extends CI_Controller {



	function __construct($islogin=0)  

	{

        parent::__construct();

        $this->load->library('session');

        $this->load->helper('url');

		$this->load->library('parser');

        $this->load->model('common/Database_model','dbHelper', TRUE);

        $this->load->model('common/Action_model', 'logger');

        $this->load->model('Login_model','login');



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



/**
 * 读写日志
 */

class logger

{

    /**
     * 写异常日志
     */

    static function error($content) 

    {

        //if($uin && $debugusers && in_array($uin, $debugusers)) {

        //    echo '<script>';            

        //    echo "console.error(\"{$content}\");";

         //   echo '</script>';

        //}   



        $path = 'error/' . date('Ymd') . '.log';        

        self::write($path,$content);

    }



    /**
     * 写调试日志
     */

    static function debug($content)

    {

        if(isset($_SERVER) && isset($_GET) && isset($_SERVER['HTTP_HOST'])){    

            if(isset($_GET['debug']) && $_GET['debug'] != '0') {               

                    echo '<script>';            

                    echo "console.debug(\"{$content}\");";

                    echo '</script>';

            }               



            //如果是测试域名，则打出测试参数

            $path = 'debug/' . date('Ymd') . '.log';

            self::write($path,$content);

            

        }       

    }



    /**
     * 写日志文件
     */

    static function write($path,$data)

    {

        $fd = false;

        try

        {

            $path = dirname(__FILE__) . '/../../log/' . $path;

            $log = dirname($path);

            if(!is_dir($log)) 

            {

                mkdir($log,0777,true);//创建多级目录

            }

            

            $fd = fopen($path,'a+');            

            if($fd)

            {

                $data = date('[H:i:s]') . $data . "\r\n";

                //fwrite($f,$data);             

                fputs($fd, $data);

                fclose($fd);

            }

        }

        catch(Exception $e)

        {

            if($fd) fclose($fd);

            var_dump($e);

        }

    }
}


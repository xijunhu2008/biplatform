<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class upload_model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
    }

	public function uplode(){
		$images_path = $this->config->item('images_path');
		$images_host = $this->config->item('images_host');
		 
		$extArr = array("jpg", "png", "gif"); 
		 
		if(isset($_POST) and $_SERVER['REQUEST_METHOD'] == "POST"){ 
		    $name = $_FILES['imgfile']['name']; 
		    $size = $_FILES['imgfile']['size']; 
		     
		    if(empty($name)){ 
		        echo '请选择要上传的图片'; 
		        exit; 
		    } 
		    $ext = $this->extend($name); 
		    if(!in_array($ext,$extArr)){ 
		        echo '图片格式错误！'; 
		        exit; 
		    } 
		    if($size>(100*1024)){ 
		        echo '图片大小不能超过100KB'; 
		        exit; 
		    } 
		    $image_name = time().rand(100,999).".".$ext;
		    $tmp = $_FILES['imgfile']['tmp_name']; 
		    if(move_uploaded_file($tmp, $images_path.$image_name)){
		        return $images_host.$image_name.'|'.$image_name;
		    }else{ 
		        return ''; 
		    } 
		    exit; 
		} 
 
	}

	//获取文件类型后缀 
	public function extend($file_name){ 
	    $extend = pathinfo($file_name); 
	    $extend = strtolower($extend["extension"]); 
	    return $extend; 
	}
}
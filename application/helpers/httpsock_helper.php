<?php
/**
 * 模拟http请求
 * 
 * @author: fefeding
 * @date: 2014-11-10
 *
 */

//fsocket模拟get提交
function sock_get($url, $query, $syn = FALSE)
{
	if(is_array($query)) {
		$pars = '';
		foreach ($query as $key => $value) {
			$pars .= "&{$key}=" . urlencode($value);
		}
		$query = trim($pars, '&');
	}
	$info = parse_url($url);
	$fp = fsockopen($info["host"], 80, $errno, $errstr, 3);
	$head = "GET ".$info['path']."?".$info["query"]." HTTP/1.0\r\n";
	$head .= "Host: ".$info['host']."\r\n";
	$head .= "\r\n";
	$write = fputs($fp, $head);
	$data = '';
	//如果不用移步则读取返回
	if($syn == FALSE) {
	   	while (!feof($fp))
		   {
			    $line = fread($fp,4096);
			    $data .= $line;
		   }
	}

	fsockclose($fp);
	return $data;
}

//fsock模拟post提交
function sock_post($url, $data, $syn=FALSE)
{
	if(is_array($data)) {
		$pars = '';
		foreach ($data as $key => $value) {
			$pars .= "&{$key}=" . urlencode($value);
		}
		$data = trim($pars, '&');
	}

   $info = parse_url($url);
   $fp = fsockopen($info["host"], 80, $errno, $errstr, 3);
   $head = "POST ".$info['path']."?".$info["query"]." HTTP/1.0rn";
   $head .= "Host: ".$info['host']."rn";
   $head .= "Referer: http://".$info['host'].$info['path']."rn";
   $head .= "Content-type: application/x-www-form-urlencodedrn";
   $head .= "Content-Length: ".strlen($data)."rn";
   $head .= "rn";
   $head .= $data;
   $write = fputs($fp, $head);
   $data = '';
   //如果不用移步则读取返回
	if($syn == FALSE) {
	   	while (!feof($fp))
		   {
			    $line = fread($fp,4096);
			    $data .= $line;
		   }
	}
	fsockclose($fp);
	return $data;
}
?>
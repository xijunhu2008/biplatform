<?php

/**
 * 模板相关操作model
 *
 * @author axelis
 * @date 2015年4月22日17:40:51
 */

class Framework_admin_model extends MY_Model{
	//获取所有的框架
	public function getAllFramework(){
		$sql = "select * from tbreportframework where 1 ";
		$rs = $this->dbHelper->select($sql);
		return $rs;
	}

	//获取ID指定的框架
	public function getAllFrameworkById($id){
		if(!is_array($id)){
			$id_data = array($id);
		}
		$sql = "select * from tbreportframework where id=? ";
		$rs = $this->dbHelper->select_row($sql,$id_data);
		return $rs;
	}
	
	//新增框架
	public function FrameworkAdd($data){
		if(!empty($data)){
			$table_name = 'tbreportframework';
			$rs = $this->dbHelper->insert($table_name, $data, null,true);
			return $rs;
		}
	}

	//修改框架
	public function FrameworkEdit($data,$id){
		if(!empty($data) && !empty($id)){
			if(!is_array($id)){
				$id_data = array($id);
			}

			$table_name = 'tbreportframework';
			$where = " id = ? ";
			$rs = $this->dbHelper->update($table_name,$data,$where,$id_data);
			return $rs;
		}
	}

	//通过组ID删除某个框架
	public function FrameworkDelBygid($id){
		if(!empty($id)){

			if(!is_array($id)){
				$id_data = array($id);
			}
			
			$table_name = 'tbreportframework';
			$sql = " DELETE FROM {$table_name} WHERE id = ? ";
			$rs = $this->dbHelper->delete($sql,$id_data);
			return $rs;
		}
	}

	//获取所有的菜单
	public function getMenus($id = '',$type=''){
		if(!empty($id)){

			if(!is_array($id)){
				$id_data = array($id,$type);
			}

			$sql = "select * from tbmenu where relegationid = ? AND relegation = ? ";
			$rs = $this->dbHelper->select($sql,$id_data);
			return $rs;
		}
	}

	//获取菜单
	public function getMenuById($id = ''){
		if(!is_array($id)){
			$id_data = array($id);
		}
		$sql = "select * from tbmenu where id=? ";	
		$rs = $this->dbHelper->select_row($sql,$id_data);
		return $rs;
	}

	//新增菜单
	public function MenuAdd($data){
		if(!empty($data)){
			$table_name = 'tbmenu';
			$rs = $this->dbHelper->insert($table_name, $data, null,true);
			return $rs;
		}
	}

	//修改菜单
	public function MenuEdit($data,$id){
		if(!empty($data) && !empty($id)){
			if(!is_array($id)){
				$id_data = array($id);
			}

			$table_name = 'tbmenu';
			$where = " id = ? ";
			$rs = $this->dbHelper->update($table_name,$data,$where,$id_data);
			return $rs;
		}
	}


	//获取报表配置
	public function getReportConfigById($id = ''){
		if(!is_array($id)){
			$id_data = array($id);
		}
		$sql = "select * from tbreportconfig where id=? ";	
		$rs = $this->dbHelper->select_row($sql,$id_data);
		return $rs;
	}
	//新增报表配置
	public function ReportConfigAdd($data){
		if(!empty($data)){
			$table_name = 'tbreportconfig';
			$rs = $this->dbHelper->insert($table_name, $data, null,true);
			return $rs;
		}
	}

	//修改报表配置
	public function ReportConfigEdit($data,$id){
		if(!empty($data) && !empty($id)){
			if(!is_array($id)){
				$id_data = array($id);
			}else{
				$id_data = $id;
			}

			$table_name = 'tbreportconfig';
			$where = " pageid = ? ";
			$rs = $this->dbHelper->update($table_name,$data,$where,$id_data);
			return $rs;
		}
	}


	//获取页面基础信息
	public function getPageConfigById($id = ''){
		if(!is_array($id)){
			$id_data = array($id);
		}
		$sql = "select * from tbpageconfig where id=? ";	
		$rs = $this->dbHelper->select_row($sql,$id_data);
		return $rs;
	}
	//新增页面
	public function PageAdd($data){
		if(!empty($data)){
			$table_name = 'tbpageconfig';
			$rs = $this->dbHelper->insert($table_name, $data, null,true);
			return $rs;
		}
	}

	//修改菜单
	public function PageEdit($data,$id){
		if(!empty($data) && !empty($id)){
			if(!is_array($id)){
				$id_data = array($id);
			}

			$table_name = 'tbpageconfig';
			$where = " id = ? ";
			$rs = $this->dbHelper->update($table_name,$data,$where,$id_data);
			return $rs;
		}
	}

	//获取报表配置
	public function getToolBarcontrolConfigByWhere($where='',$id = '',$more=''){
		$where = !empty($where) ? $where : 1;

		if($where != 1){
			if(!is_array($id)){
				$id_data = array($id);
			}
		}else{
			$id_data = array();
		}

		$sql = "select * from tbtoolbarcontrolconfig where {$where} ";
		if($more){
			$rs = $this->dbHelper->select_row($sql,$id_data);
		}else{
			$rs = $this->dbHelper->select($sql,$id_data);
		}
		return $rs;
	}

	//新增报表配置
	public function ToolBarcontrolConfigAdd($data){
		if(!empty($data)){
			$table_name = 'tbtoolbarcontrolconfig';
			$rs = $this->dbHelper->insert($table_name, $data, null,true);
			return $rs;
		}
	}
	//修改报表配置
	public function ToolBarcontrolConfigEdit($data,$id){
		if(!empty($data) && !empty($id)){
			if(!is_array($id)){
				$id_data = array($id);
			}

			$table_name = 'tbtoolbarcontrolconfig';
			$where = " id = ? ";
			$rs = $this->dbHelper->update($table_name,$data,$where,$id_data);
			return $rs;
		}
	}

	//通过组ID删除某个报表配置
	public function ToolBarcontrolConfigDelBygid($id){
		if(!empty($id)){

			if(!is_array($id)){
				$id_data = array($id);
			}
			
			$table_name = 'tbtoolbarcontrolconfig';
			$sql = " DELETE FROM {$table_name} WHERE id = ? ";
			$rs = $this->dbHelper->delete($sql,$id_data);
			return $rs;
		}
	}
	

	//获取控件
	public function getControlsByWhere($where='',$id = '',$more=''){
		$where = !empty($where) ? $where : 1;

		if($where != 1){
			if(!is_array($id)){
				$id_data = array($id);
			}
		}else{
			$id_data = array();
		}

		$sql = "select * from tbcontrols where {$where} ";
		if($more){
			$rs = $this->dbHelper->select_row($sql,$id_data);
		}else{
			$rs = $this->dbHelper->select($sql,$id_data);
		}
		return $rs;
	}

	//获取
	public function getDataSourceByWhere($where='',$id = '',$more=''){
		$where = !empty($where) ? $where : 1;

		if($where != 1){
			if(!is_array($id)){
				$id_data = array($id);
			}
		}else{
			$id_data = array();
		}

		$sql = "select * from tbdatasource where {$where} ";
		if($more){
			$rs = $this->dbHelper->select_row($sql,$id_data);
		}else{
			$rs = $this->dbHelper->select($sql,$id_data);
		}
		return $rs;
	}

	//新增数据源配置
	public function DataSourceAdd($data){
		if(!empty($data)){
			$table_name = 'tbdatasource';
			$rs = $this->dbHelper->insert($table_name, $data, null,true);
			return $rs;
		}
	}

	//修改数据源配置
	public function DataSourceEdit($data,$id){
		if(!empty($data) && !empty($id)){
			if(!is_array($id)){
				$id_data = array($id);
			}

			$table_name = 'tbdatasource';
			$where = " id = ? ";
			$rs = $this->dbHelper->update($table_name,$data,$where,$id_data);
			return $rs;
		}
	}

	//获取数据源的字段属性映射表
	public function getSourceMappingByWhere($where='',$id = '',$more=''){
		$where = !empty($where) ? $where : 1;

		if($where != 1){
			if(!is_array($id)){
				$id_data = array($id);
			}
		}else{
			$id_data = array();
		}

		$sql = "select * from tbdatasourcemapping where {$where} ";
		if($more){
			$rs = $this->dbHelper->select_row($sql,$id_data);
		}else{
			$rs = $this->dbHelper->select($sql,$id_data);
		}
		return $rs;
	}
	//新增数据源的字段属性映射表
	public function SourceMappingAdd($data){
		if(!empty($data)){
			$table_name = 'tbdatasourcemapping';
			$rs = $this->dbHelper->insert($table_name, $data, null,true);
			return $rs;
		}
	}
	//通过组ID删除某个数据源的字段属性映射表
	public function SourceMappingDelBygid($id){
		if(!empty($id)){

			if(!is_array($id)){
				$id_data = array($id);
			}
			
			$table_name = 'tbdatasourcemapping';
			$sql = " DELETE FROM {$table_name} WHERE datasourceid = ? ";
			$rs = $this->dbHelper->delete($sql,$id_data);
			return $rs;
		}
	}



	//获取
	public function getControlConfigByWhere($where='',$id ='',$more=''){
		$where = !empty($where) ? $where : 1;

		if($where != 1){
			if(!is_array($id)){
				$id_data = array($id);
			}else{
				$id_data = $id;
			}
		}else{
			$id_data = array();
		}

		$sql = "select * from tbreportcontrolconfig where {$where} ";
		if($more){
			$rs = $this->dbHelper->select_row($sql,$id_data);
		}else{
			$rs = $this->dbHelper->select($sql,$id_data);
		}
		return $rs;
	}
	//新增
	public function ControlConfigAdd($data){
		if(!empty($data)){
			$table_name = 'tbreportcontrolconfig';
			$rs = $this->dbHelper->insert($table_name, $data, null,true);
			return $rs;
		}
	}

	//修改报表配置
	public function ControlConfigEdit($data,$id){
		if(!empty($data) && !empty($id)){
			if(!is_array($id)){
				$id_data = array($id);
			}

			$table_name = 'tbreportcontrolconfig';
			$where = " id = ? ";
			$rs = $this->dbHelper->update($table_name,$data,$where,$id_data);
			return $rs;
		}
	}
}
$(document).ready(function(){
	//上传图片
	$("#pic_upload_submit").click(function () {
		if ($("#pic_upload_text").val() == "") {
			 alert("请选择一个图片文件，再点击上传。");
			 return;
	    }
		
	    $("#pic_upload_form").ajaxSubmit({
			success: function (html, status) {
				if(html){
					var result = html.replace("<pre>", "");
					result = result.replace("</pre>", "");
					result=result.split('|');
					url = result[0];
					url_name  = result[1];
					$("#show_pic_after_upload").attr('src',url);
					$("#pic_name_hidden").attr('value',url_name);
					$(".pic_property").show();
					alert('上传成功');
				}else{

					alert('上传失败');
				}
			}
	  	});
	  	return false; 
   });   
});
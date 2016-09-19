/*!
 * jQuery Cascading Plugin v1.0.0
 * https://github.com/wuxinwudai/jquery-cascading
 *
 * Copyright 2016 王嘉庆
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (Register as an anonymous module)
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {
	/**
	* Menu 定义菜单类型
	* @param id  select控件的ID
	* @param url 请求数据的地址
	* @param show_field select option用于显示数据源
	* @param value_field select用于存储值的属性
	* @param value 默认值
	*/
	function Menu(id,url,show_field,value_field,value) {
		this.id = id;		
		this.url = url;
		this.show_field = show_field;
		this.value_field = value_field;
		this.value = value;
	}
	/*
	* 用于创建 Menu 对象
	*/
	$.menu = function(id,url,show_field,value_field,value) {
		return new Menu(id,url,	show_field,value_field,value);
	}
	$.bindCascading = function(arr){
			
		//opt = $.extends({},default);
		var $arr = [];		
		for (var i = arr.length - 1; i >= 0; i--) {				
			if(!arr[i].id){ throw new Error("Property id is needed!");}				
			var id = arr[i].id;
			$arr[i] = $("#"+id);
			if(!$arr[i].get(0)){
			    $arr[i] = $("<select id='" + id + "+'></select>");
				$arr[i].after($arr[i-1]);
			}
		    $arr[i].attr("data-cas-level",i);			
			if(arr[i].value != undefined) {
				$arr[i].attr("data-cas-"+arr[i].value_field,arr[i].value);				
			}else{
			    //if(i>0)$arr[i].hide();
			    $arr[i].value = $arr[i].attr("data-cas-" + arr[i].value_field);
			}
			if (i < $arr.length - 1) {//排除最后一项的级联
			    $arr[i].change(function () {
			        var ii = $(this).attr("data-cas-level");
			        var ds = [];
			        var val = 0;
			        if ($arr[0].find("option").length == 0) {//对第一级处理
			            val = $arr[0].attr("data-cas-" + arr[0].value_field);
						$.ajax({ 
							type:"GET",
							url:arr[0].url.replace("{id}",!!val?val:""), 
							dataType: "json", 
							async:false, 
							success:function(n){ds=n;} 
						});
						val = $arr[0].attr("data-cas-" + arr[0].value_field);
			            $.each(ds, function (idx, n) {
							if (val == n[arr[0].value_field]) {
							   
								$arr[0].append("<option value='" + n[arr[0].value_field] + "' selected='selected'>" + n[arr[0].show_field] + "</option>");
							}else{
								$arr[0].append("<option value='" + n[arr[0].value_field] + "'>" + n[arr[0].show_field] + "</option>");
							}							
						});						
			        }			        
					var $s = $(this);	
					var j = +ii + 1;
					var $next = $arr[j];//级联的下一项，必定存在不可能为undefined，因为最后一项change已被排除
					var option = $s.find("option:selected");
					if (option.length > 0) {//有选中项设置为选中值
						val = option.val();	
						$.ajax({ 
							type:"GET",
							url: arr[j].url.replace("{id}", !!val ? val : ""),
							dataType: "json", 
							async:false, 
							success:function(n){ds=n;} 
						});	
						$next.find("option").remove();
						val = $next.attr("data-cas-" + arr[j].value_field);
						$.each(ds,function(idx,n){
							if (val == n[arr[i+1]]) {
							    $next.append("<option value='" + n[arr[j].value_field] + "' selected='selected'>" + n[arr[j].show_field] + "</option>");
							}else{
								$next.append("<option value='" + n[arr[j].value_field] + "'>" + n[arr[j].show_field] + "</option>");
							}
							
						});	
						if (!$next.is(":visible")) {
							$next.show();
						}
						$next.change();
					}											
				});
			}			
		}	
		$($arr[0]).change();
	}
	
}));

function wordParser(a, b) {
	
	b = b || false;
	
	switch (b) {
		
		case "w": var result = a.match(/[a-z]+(?=_|$)/ig);
		
		break
		
		case "n": 
		
			var result = a.match(/\d+/ig);
		
			for (var i in result) result[i] = parseInt(result[i]);
		
		break
		
		default: var result = a.match(/[^_]+(?=_|$)/ig);
		
	}
	
	return result;
	
} // wordParser

function EXTRAWINDOW (options) {
	
	if (! options) {
	
		if ($("#extrawindow_body").is("[class*=extrawindow-animate-show]")) {
			
			$("#extrawindow_body").removeClass("extrawindow-animate-show").addClass("extrawindow-animate-hide");
			
			$("#extrawindow_fade").css({opacity: 0});
			
			setTimeout('$("#extrawindow_body, #extrawindow_fade").remove()', 300);
			
		} else $("#extrawindow_body, #extrawindow_fade").remove();
		
		return false;
	}
	
	var opt = $.extend({  
	
		"width": "auto",
		
		"height": "auto",
		
		"offset": (options.e) ? page(options.e) : false,
		
		"autoclose": false,
		
		"redraw": false,
		
		"fadecolor": "#000000",
		
		"fadeopacity": 0,
		
		"zIndex": 1000,
		
		"animate": true,
		
		"func": false, 
		
		"header_height": false,
		
		"footer_height": false

	}, options);
	
	if (! opt.redraw) {
		
		if (opt.offset) {
				
			var ex_X = $(window).width() - (opt.offset.x + $(ext_body).width());
																			   
			var ex_Y = $(window).height() - (opt.offset.y + $(ext_body).height());
				
			var off_X = (ex_X < 0) ? opt.offset.x + ex_X : opt.offset.x;
				
			var off_Y = (ex_Y < 0) ? opt.offset.y + ex_Y : opt.offset.y;
				
		}

		var ext_body = $("<table />", {
			
			"id": "extrawindow_body",
			
			"class": "extrawindow-body" + (opt.animate ? " extrawindow-animate-show" : ""),
			
			"css": {
	
				width: opt.width,
				
				height: opt.height,
				
				left: opt.offset ? off_X : "50%", 
			
				top: opt.offset ? off_Y : "50%", 
				
				marginLeft: opt.offset ? 0 : -(opt.width / 2),
				
				marginTop: opt.offset ? 0 : -(opt.height / 2),
				
				zIndex: opt.zIndex
				
			}
			
		});
		
		if (opt.header) var ext_header = $("<tr><td class='extrawindow-header'>" + opt.header + "</td></tr>", { "css": opt.header_height ? opt.header_height : "" });
			
		if (opt.content) var ext_content = $("<tr><td class='extrawindow-content'>" + opt.content + "</td></tr>");
		
		if (opt.footer) var ext_footer = $("<tr><td class='extrawindow-footer'>" + opt.footer + "</td></tr>", { "css": opt.footer_height ? opt.footer_height : ""});

		$(ext_body).append(ext_header ? ext_header : "", ext_content ? ext_content : "", ext_footer ? ext_footer : "");
		
		//$(ext_body).append("<tr><td align='center' class='extrawindow_bfoot'>JUST RESEARCH CENTER</td></tr>");
		
		var ext_fade = $("<div />", {
			
			"id": "extrawindow_fade",
			
			"css": {
				
				position: "absolute", 
				
				top: 0, 
				
				left: 0, 
				
				width: $(window).width(), 
				
				height: $(window).height(), 
				
				zIndex: opt.zIndex - 1,
				
				backgroundColor: opt.fadecolor,
				
				opacity: opt.fadeopacity,
				
				transition: opt.animate ? "opacity 0.3s ease-in-out" : ""
				
			}
			
		}); 
		
		$("body").append(ext_body, ext_fade);
		
		$(".button", ext_body).bind("click", function(e) { e.stopPropagation(); eventListener(this) });
		
		$("input, select", ext_body).bind("change", function(e) { e.stopPropagation(); eventListener(this) });

		if (opt.animate) { setTimeout('$("#extrawindow_fade").css({opacity:' + opt.fadeopacity + '})', 50) }

		if (opt.autoclose) $("#extrawindow_body, #extrawindow_fade").bind("click", function() { EXTRAWINDOW() });
		
		if (opt.func) eval(opt.func);
	
	} else {
		
		if (opt.header) $("#extrawindow_body .extrawindow-header").html(opt.header);
		
		if (opt.content) $("#extrawindow_body .extrawindow-content").html(opt.content);
		
		if (opt.footer !== false) {
			
			$("#extrawindow_body .extrawindow-footer").html(opt.footer);
		
			$("#extrawindow_body .button").bind("click", function(e) { e.stopPropagation(); eventListener(this) });
			
			$("#extrawindow_body input, #extrawindow_body select").bind("change", function(e) { e.stopPropagation(); eventListener(this) });
			
		} 
		
		if (opt.header_height) $("#extrawindow_body .extrawindow-header").css({ height: opt.header_height });
		
		if (opt.footer_height) $("#extrawindow_body .extrawindow-footer").css({ height: opt.footer_height });
		
		opt.autoclose ? $("#extrawindow_body, #extrawindow_fade").bind("click", function() { EXTRAWINDOW() }) : $("#extrawindow_body, #extrawindow_fade").unbind();
		
		if (opt.func) eval(opt.func)
		
	}
	
} // EXTRAWINDOW

function generator() {
	
	for (var i = 0, result = "" ; i < arguments[0]; i ++) {
	
		//var t = Math.floor(Math.random() * 4) + 1;
		
		//result += (t == 1) ? String.fromCharCode(Math.floor(Math.random() * 26) + 97) : 
		
			//((t == 2) ? String.fromCharCode(Math.floor(Math.random() * 25) + 65) : String.fromCharCode(Math.floor(Math.random() * 31) + 33));
			
		result += String.fromCharCode(Math.floor(Math.random() * 91) + 35);
	
	}
	
	return result;
	
} // generator

(function($) { 

	var methods = {
	
		init: function(options) {
			
			var opt = $.extend({
				
				path: "",
				
				method: "post",
				
				data: "",
				
				datatype: "",
				
				varname: "text",
				
				width: parseInt(this.css("width")),
				
				height: parseInt(this.css("height")),
				
				val: this.text(),
				
				border_width: 1,
				
				zindex: 1000,
				
				pr_top: (parseInt(this.css("height")) - 16) / 2,
				
				pr_left: parseInt(this.css("width")) - 16
				
			}, options); 
			
			opt.inp = $("<input />", {
				
				id: "editinput", 
				
				type: "text",
				
				value: opt.val,
				
				css: {position: "absolute", width: opt.width, height: opt.height, padding: 0, "border-width": opt.border_width, top: -opt.border_width, left: -opt.border_width, zIndex: opt.zindex}
				
			});
			
			opt.back = $("<div \>", {
				
				id: "editback",
				
				css: {position: "absolute", top: 0, width: $(window).width(), height: $(window).height(), zIndex: opt.zindex - 1}
				
			})
		
			this.data("opt", opt).html(opt.inp).wrapInner("<div style='position: relative'></div>");
			
			$("#editinput").select().keypress(function(e) { if (e.which == 13) methods.ajax.call($("#editinput").parents(":eq(1)")) });
			
			$("body").append(opt.back).children("#editback").click(function() { methods.remove.call($("#editinput").parents(":eq(1)")) });
			
			return this;
			
		},
		
		remove: function(a) {
			
			var opt = $(this).data("opt");
			
			$(this).text((typeof(a) != "undefined") ? a : opt.val).removeData().children().remove();
			
			$("#editback").remove();
			
			return $(this);
			
		},
		
		ajax: function() {
	
			var opt = $(this).data("opt");
			
			$("div", this).append("<div class='preloader-img' style='left:" + opt.pr_left + "px; top:" + opt.pr_top + "px; z-index:" + opt.zindex + "'></div>");
			
			eval('var senddata = $.extend({' + opt.varname + ': $(this).children().children().val()}, opt.data)');
			
			$.ajax({
					
				url: opt.path,
							
				type: opt.method,
							
				dataType: opt.datatype, 
							
				data: senddata,
				
				success: function(a) { 
				
					if (a) methods.remove.call($("#editinput").parents(":eq(1)"), $("#editinput").val());
					
					else methods.remove.call($("#editinput").parents(":eq(1)"));
					
				},
				
				error: function() { methods.remove.call($("#editinput").parents(":eq(1)")) }
				
			});
			
		}
	
	}
	
	$.fn.EDIT = function(method) {

  		if (methods[method]) {
			
      		return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			
   		} else if (typeof method === 'object' || ! method) {
			
      		return methods.init.apply(this, arguments);
			
    	} else $.error("Метод с именем " +  method + " не существует для jQuery.EDIT");
		 
  	}

})($); // EDIT

$(function() {

	$("#main td[id*=menu], #main td[id*=user]").click(function(e) { e.stopPropagation(); eventListener(this, e) });
	
	$("#main td[id*=edit]").attr("title", "possible to modify").dblclick(function(e) { e.stopPropagation(); eventListener(this, e) });
	
	$("#main select").change(function(e) { e.stopPropagation(); eventListener(this, e) });
	
}); // ready

function eventListener() {
	
	var id = (typeof(arguments[0]) == "object") ? wordParser(arguments[0].id) : wordParser(arguments[0]);
	
	switch (arguments[1].type) {
		
		case "click":
	
			switch (id[0]) {
				
				case "menuusers":
				
					$("#main td[class*=menu-active]:not(#" + id + ")").removeClass("menu-active").addClass("menu-inactive");
				
					$(arguments[0]).removeClass("menu-inactive").addClass("menu-active");
					
					$("#content").children().addClass("display-none").end().children("#users").removeClass("display-none");
				
				break // menuusers
				
				case "menuprojects":
				
					$("#main td[class*=menu-active]:not(#" + id + ")").removeClass("menu-active").addClass("menu-inactive");
				
					$(arguments[0]).removeClass("menu-inactive").addClass("menu-active");
					
					$("#content").children().addClass("display-none").end().children("#projects").removeClass("display-none");
				
				break // menuprojects
				
				case "menuoutdata":
				
					$("#main td[class*=menu-active]:not(#" + id + ")").removeClass("menu-active").addClass("menu-inactive");
				
					$(arguments[0]).removeClass("menu-inactive").addClass("menu-active");
					
					$("#content").children().addClass("display-none").end().children("#outdata").removeClass("display-none");
				
				break // menuprojects
				
				case "menulogout":
				
					$("body").append("<form method='post'><input type='hidden' name='action' value='2'></form>").children("form").submit();
				
				break // menulogout
				
				case "userdel":
				
					if (confirm("delete " + id[1] + "?")) 
						
						$("body").append("<form method='post'><input type='hidden' name='action' value='3'><input type='hidden' name='id' value='" + id[1] + "'></form>").children("form").submit();
				
				break // userdel
				
				case "useradd":
				
					EXTRAWINDOW({
						
						width: 500,
						
						height: 230,
						
						header: "user add",
						
						content: "<form method='post'><input type='hidden' name='action' value='4'><table width='100%'><tr>" +
						
		"<td><input type='text' required name='name' placeholder='name'></td><td><input type='number' required name='project' placeholder='project' min='1'></td>" +
		
		"<td><input type='text' name='data' placeholder='data'></td>" +
		
		"</tr><tr><td colspan='3'height='20px'></td></tr><tr>" +
						
		"<td><input type='text' required name='login' placeholder='login'></td><td><input type='text' required name='password' placeholder='password'></td>" +
		
		"<td><input type='button' value='generate' onClick='$(\"input[name=password]\").val(generator(12))'><input type='submit' value='Ok'>" +
		
		"</td></tr></table></form>",
						
						footer: "<input type='button' value='Cancel' onClick='EXTRAWINDOW()'>",
						
						fadeopacity: 0.5
						
					});
				
				break // useradd
				
			}
		
		break // click
	
	    case "dblclick":
		
			var f = (id[1] == "password") ? [id[1], $(arguments[0]).prev().text()] : ((id[1] == "login") ? [id[1], $(arguments[0]).next().text()] : id[1]);
		
			$(arguments[0]).EDIT({path: "Users&Pr0jects.php", data: {action: 5, table: "0_users", id: id[2], field: f}}); 
		
		break // dblclick
		
		case "change":
		
			switch (id[0]) {
				
				case "odproject":
				
					var id = $("#odproject > :selected").attr("id");
				
					if (id != undefined) {
						
						alert(id);
						
					}
				
				break // odproject
				
			}
		
		break // change
		
	}
	
} // eventListener
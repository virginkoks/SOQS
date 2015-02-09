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
		
		if (opt.header) var ext_header = "<tr><td class='extrawindow-header'>" + opt.header + "</td></tr>";
			
		if (opt.content) var ext_content = "<tr><td class='extrawindow-content'>" + opt.content + "</td></tr>";
		
		if (opt.footer) var ext_footer = "<tr><td class='extrawindow-footer'>" + opt.footer + "</td></tr>";

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
		
		//$("input, select", ext_body).bind("change", function(e) { e.stopPropagation(); eventListener(this) });

		if (opt.animate) { setTimeout('$("#extrawindow_fade").css({opacity:' + opt.fadeopacity + '})', 50) }

		if (opt.autoclose) $("#extrawindow_fade").bind("click", function() { EXTRAWINDOW() });
		
		if (opt.func) eval(opt.func);
	
	} else {
		
		if (opt.header) $("#extrawindow_body .extrawindow-header").html(opt.header);
		
		if (opt.content) $("#extrawindow_body .extrawindow-content").html(opt.content);
		
		if (opt.footer !== false) {
			
			$("#extrawindow_body .extrawindow-footer").html(opt.footer);
		
			$("#extrawindow_body .button").bind("click", function(e) { e.stopPropagation(); eventListener(this) });
			
			//$("#extrawindow_body input, #extrawindow_body select").bind("change", function(e) { e.stopPropagation(); eventListener(this) });
			
		} 
		
		if (opt.header_height) $("#extrawindow_body .extrawindow-header").css({ height: opt.header_height });
		
		if (opt.footer_height) $("#extrawindow_body .extrawindow-footer").css({ height: opt.footer_height });
		
		opt.autoclose ? $("#extrawindow_fade").bind("click", function() { EXTRAWINDOW() }) : $("#extrawindow_fade").unbind();
		
		if (opt.func) eval(opt.func)
		
	}
	
} // EXTRAWINDOW

(function($) { 

	var methods = {
		
		init: function(options) {
			
			var opt = $.extend({
				
				el: document.getElementById($(this).attr("id")),
				
				scrollStartPos: 0,
				
				ts: function(event) {
					
					opt.scrollStartPos = this.scrollTop + event.touches[0].pageY;
					
				},
				
				tm: function(event) {
					
					this.scrollTop = opt.scrollStartPos - event.touches[0].pageY;
				
					event.preventDefault();
					
				}

			}, options); 
			
			opt.el.addEventListener("touchstart", opt.ts, false);
			
			opt.el.addEventListener("touchmove", opt.tm, false);
			
			this.data("opt", opt);
			
			return this;
			
		},
		
		disable: function() {
			
			var opt = $(this).data("opt");
			
			document.getElementById($(this).attr("id")).removeEventListener("touchstart", opt.ts, false).removeEventListener("touchmove", opt.tm, false);
		
			return this;
		
		}
		
	}

	$.fn.overtouch = function(method) {

  		if (methods[method]) {
			
      		return isTouchDevice() ? methods[method].apply(this, Array.prototype.slice.call(arguments, 1)) : this;
			
   		} else if (typeof method === "object" || ! method) {
			
      		return isTouchDevice() ? methods.init.apply(this, arguments) : this;
			
    	} else $.error("Метод с именем " +  method + " не существует для jQuery.overtouch");
		 
  	}

})($); // overtouch

function wordParser(a, b) {
	
	b = b || false;
	
	var expr = (b == "w") ? /[a-z]+(?=_|$)/ig : (b == "n") ? /-?\d+/ig : /[^_]+(?=_|$)/ig;
	
	var result = a.match(expr);
	
	for (var i in result) result[i] = /^\d+$/.test(result[i]) ? parseInt(result[i]) : result[i];
	
	return result;
	
} // wordParser

(function (factory) {
	
	if (typeof define === 'function' && define.amd) {
		
		define(['jquery'], factory);
		
	} else if (typeof exports === 'object') {
		
		factory(require('jquery'));
		
	} else factory(jQuery);
	
} (function ($) {

	function parseCookieValue(s) {
		
		if (s.indexOf('"') === 0) s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');

		try {

			s = decodeURIComponent(s.replace(/\+/g, " "));
			
			return JSON.parse(s);
			
		} catch(e) {}
		
	}
	
	function isLocalStorageAvailable() {
	
		try {
			
			return "localStorage" in window && window["localStorage"] !== null;
			
		} catch (e) {
			
			return false;
			
		}
		
	}

	$.cookie = function (key, value, options) {
		
		if (isLocalStorageAvailable()) {
			
			if (value !== undefined) {
			
				options = $.extend({}, options);
				
				if (typeof options.expires === 'number') {
					
					if (options.expires < 0) return localStorage.removeItem(key);
					
					var minutes = options.expires, t = options.expires = new Date();
					
					t.setMinutes(t.getMinutes() + minutes);
					
					value.expires = options.expires.getTime();
					
				}
				
				return localStorage.setItem(key, JSON.stringify(value));
			
			}
			
			var result = undefined;
			
			var cookies = JSON.parse(localStorage.getItem(key));
			
			if (cookies) if (cookies.expires - new Date().getTime() > 0) {
				
				delete(cookies.expires);
				
				result = cookies;

			} else localStorage.removeItem(key);
			
		} else {
			
			if (value !== undefined) {
				
				options = $.extend({}, options);
	
				if (typeof options.expires === "number") {
					
					var minutes = options.expires, t = options.expires = new Date();
					
					t.setMinutes(t.getMinutes() + minutes);
					
				}
	
				return (document.cookie = [
				
					encodeURIComponent(key), "=", encodeURIComponent(JSON.stringify(value)),
					
					options.expires ? "; expires=" + options.expires.toUTCString() : "",
					
					options.path    ? "; path=" + options.path : "",
					
					options.domain  ? "; domain=" + options.domain : "",
					
					options.secure  ? "; secure" : ""
					
				].join(""));
				
			}

			var result = key ? undefined : {};

			var cookies = document.cookie ? document.cookie.split("; ") : [];
	
			for (var i = 0, l = cookies.length; i < l; i++) {
				
				var parts = cookies[i].split("=");
				
				var name = decodeURIComponent(parts.shift());
				
				var cookie = parts.join("=");
	
				if (key && key === name) { 
					
					result = parseCookieValue(cookie);
					
					break;
					
				}
	
				if (! key && (cookie = parseCookieValue(cookie)) !== undefined) result[name] = cookie;
				
			}

		}
		
		return result;
		
	}

	$.removeCookie = function (key) {
		
		if ($.cookie(key) === undefined) return false;

		$.cookie(key, "", { expires: -1 });
		
		return ! $.cookie(key);
		
	};

})); // cookie

function isTouchDevice() {
	
	try {
		
		document.createEvent("TouchEvent");
		
		return true;
		
	} catch(e) { return false }
	
} // isTouchDevice

function show_wh() {
	
	$("body").prepend("<div id='dim' style='position:absolute; z-index:1000; color:#cb0000'>" + $(window).width() + " x " + $(window).height() + "</div>");
	
	$(window).resize(function() { $("#dim").text($(window).width() + " x " + $(window).height()) });
	
} // show_wh

var cpos = 1;

var LH = parseInt(document.location.hash.slice(1));

var preloader = $("<div />", {"class": "preloader preloader-dark-gif"});

$(function() {
	
	show_wh();
	
	$("body").append(preloader);
	
	$("span[id*=m_], #login, div[id*=arrow]").bind("click", function(e) { e.stopPropagation(); eventListener(this, e) });
	
	$("div[class*=icon]").mouseenter(function() { $(this).addClass("icon-rotate-back") }).mouseleave(function() { $(this).removeClass("icon-rotate-back") });
	
//	$(".c-body-back").attr("src", "public/img/jpg/1.jpg").load(function() { 
//	
//		$("#preloader").addClass("preloader-nodisplay");
//		
//		$("#c_body").css({opacity: 1}).children(":first").removeClass("cb-local-nodisplay");
//		
//		if (LH && typeof(LH) == "number" && LH < 5) eventListener("m_" + LH);
//		
//		if (typeof(quest) != "undefined" && quest == "welcomequest") EXTRAWINDOW({
//		
//			width: 500, 
//											
//			height: 330,
//			
//			footer_height: 50, 
//											
//			header: "Just Research Center", 
//											
//			content: "Здорово, что вы заглянули!<br><br>Ответьте, пожалуйста, на несколько вопросов анкеты, касающихся исследовательских услуг на рынке подмосковья.", 
//											
//			footer: "<table align='center' style='table-layout:fixed; width:80%'><tr><td><span id='quest_1' class='button'>Ответить на вопросы</span></td>" +
//			
//				"<td><span id='quest_0' class='button'>Перейти на сайт</span></td></tr></table>",
//			
//			fadeopacity:0.3
//									
//		});
//	
//	});
	
}); // ready

function eventListener() {
	
	var id = (typeof(arguments[0]) == "object") ? wordParser(arguments[0].id) : wordParser(arguments[0]);

	switch (id[0]) { 
		
		case "m":
		
			if (cpos == 1 && id[1] > 1) {

				$("#content_divider").css({height: "20%"});
				
				$("#bottom_container > div:last").css({top: "100%"});
				
				$("#bottom_container > div:first").css({top: 0}).scrollLeft((id[1] - 2) * $(window).width());
			
			} else if (id[1] == 1) {
				
				$("#content_divider").css({height: "70%"});
				
				$("#bottom_container > div:last").css({top: 0});
				
				$("#bottom_container > div:first").css({top: "-100%"});

				
			} else if (id[1] != cpos){
				
				$("#bottom_container > div:first").scrollLeft((id[1] - cpos) * $(window).width());
				
			}
			
			cpos = id[1];

		break // m
		
		case "arrow1":
		
			if ($("#mob1_1 > div:eq(1)").position().left == 0) {
				
				var shifter = $("#mob1_1").width() * id[1];
				
				$("#mob1_1 > div").each(function() { $(this).css({left: "+=" + shifter}) });
				
				$("#mob1_2 > div").each(function() { $(this).css({left: "-=" + shifter}) });
				
				if (id[1] > 0) {
					
					$("#mob1_1 > div:last").css({left: "-100%"}).insertBefore($("#mob1_1 > div:first"));
					
					$("#mob1_2 > div:first").css({left: ($("#mob1_1 > div").length - 2) * 100 + "%"}).insertAfter($("#mob1_2 > div:last"));
					
				} else {
					
					$("#mob1_2 > div:last").css({left: "-100%"}).insertBefore($("#mob1_2 > div:first"));
					
					$("#mob1_1 > div:first").css({left: ($("#mob1_1 > div").length - 2) * 100 + "%"}).insertAfter($("#mob1_1 > div:last"));
					
				}
				
			}
		
		break // arrow1
		
		case "arrow2": 
		
			if ($("#mob2_1 > table:eq(1)").position().left == 0) {
				
				var shifter = $("#mob2_1").width() * id[1];
				
				$("#mob2_1 > table").each(function() { $(this).css({left: "+=" + shifter}) });
				
				if (id[1] > 0) {
					
					$("#mob2_1 > table:last").css({left: "-100%"}).insertBefore($("#mob2_1 > table:first"));
					
				} else $("#mob2_1 > table:first").css({left: ($("#mob2_1 > table").length - 2) * 100 + "%"}).insertAfter($("#mob2_1 > table:last"));
				
			}
		
		break // arrow2
		
		case "quest":
		
			EXTRAWINDOW();
			
			document.location = (id[1]) ? document.location.href.replace(/(\?.*)/, "quest.php$1") : document.location.href.replace(/(\?.*)/, "");
		
		break // quest
		
		case "login":
		
			EXTRAWINDOW({
			
				width: 420, 
												
				height: 220, 
												
				header: "Личный кабинет", 
												
				content: "<table id='tlogin' style='width:100%;'><tr><td><input id='inp_l' type='text' size='25' maxlength='20' placeholder='Логин'></td><td><input id='inp_p' type='password' size='25' maxlength='20' placeholder='Пароль'></td></tr></table>", 
												
				footer: "<span id='loginsubmit' class='button'>Вход</span>",
				
				fadeopacity:0.3,
				
				autoclose: true,
				
				animate: false,
				
				func: "$('#tlogin input').keypress(function(e) { if (e.which == 13) eventListener('loginsubmit') }).filter(':first').focus()"
									
			});
		
		break // login
		
		case "loginsubmit":
		
			if ($("#inp_l").val() && $("#inp_p").val()) $("form").children(":first").val($.md5($("#inp_l").val() + $("#inp_p").val())).end().submit();
		
		break // loginsubmit

	} 
	
} // eventListener
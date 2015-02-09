function wordParser(a, b) {
	
	b = b || false;
	
	var expr = (b == "w") ? /[a-z]+(?=_|$)/ig : (b == "n") ? /-?\d+/ig : /[^_]+(?=_|$)/ig;
	
	var result = a.match(expr);
	
	for (var i in result) result[i] = /^\d+$/.test(result[i]) ? parseInt(result[i]) : result[i];
	
	return result;
	
} // wordParser

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var minutes = options.expires, t = options.expires = new Date();
				t.setTime(+t + minutes * 60000);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

})); // cookie

var cpos = 1;

var LH = wordParser(document.location.hash.slice(1));

var preloader = $("<div />", {"class": "preloader preloader-dark-gif"});

$(function() {
	
	$("body").append(preloader);
	
	$("span[id*=m_], div[id*=arrow]").bind("click", function(e) { e.stopPropagation(); eventListener(this, e) });
	
	$(".icon").mouseenter(function() { $(this).addClass("icon-rotate-back") }).mouseleave(function() { $(this).removeClass("icon-rotate-back") });
	
//	$(".c-body-back").attr("src", "public/img/jpg/1.jpg").load(function() { 
//	
//		$("#preloader").addClass("preloader-nodisplay");
//		
//		$("#c_body").css({display: "block", opacity: 0}).animate({opacity: 1}).children(":first").removeClass("cb-local-nodisplay");
//		
//		if (LH) LHListener();
//	
//	});
	
}); // ready

function eventListener() {
	
	var id = (typeof(arguments[0]) == "object") ? wordParser(arguments[0].id) : wordParser(arguments[0]);

	switch (id[0]) { 
		
		case "m":
		
			if (cpos == 1 && id[1] > 1) {

				$("#content tr:first td").css({height: "30%"});
				
				$("#content tr:last td > div > div:first").css({top: "-100%"});
				
				$("#content tr:last td > div > div:last").css({top: 0});
			
			} else if (id[1] == 1) {
				
				$("#content tr:first td").css({height: "70%"});
				
				$("#content tr:last td > div > div:first").css({top: 0});
				
				$("#content tr:last td > div > div:last").css({top: "100%"});

				
			} else if (id[1] != cpos){
				
				$("#content_bottom").scrollLeft((id[1] == 3) ? $(window).width() * 2 : 0);
				
			}
			
			cpos = id[1];
		
			//if (WELCOMEQUEST.hash) {
//				
//				if (WELCOMEQUEST.status) {
//					
//					if (confirm("Вы действительно хотите прервать опрос?")) eventListener("wo_1_" + id[1]);
//					
//				} else logout("m_" + id[1]);
//				
//			} else {
//				
//				$("#c_body > div:eq(" + (id[1] - 1) + ")").removeClass("cb-local-nodisplay").siblings("div").addClass("cb-local-nodisplay");
//
//				$("#m_" + id[1], "#main_menu").addClass("menu-active").siblings().removeClass("menu-active");
//				
//			};
		
		break // m
		
		case "wc":
		
			if (id[1]) {
				
				$("#c_body").css({display: "none"});
				
				$("#preloader").removeClass("preloader-nodisplay");
				
				login($.md5("welcomequest"));
				
			}
		
		break // wc
		
		case "wo":
			
			if (id[1]) {
				
				logout();
				
				eventListener("m_" + id[2]);
				
			}
		
		break // wo
				
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

	} 
	
} // eventListener

function LHListener() {
	
	//document.location.hash = "";
		
	switch (LH[0]) {
			
		case "welcomequest":
		
			if (! USERLOCAL) if (confirm("Здорово, что вы заглянули!\n\nОтветьте, пожалуйста, на несколько вопросов анкеты, касающихся исследовательских услуг на рынке подмосковья.")) 
			
				eventListener("wc_1");
	
		break // welcomequest
			
		default: document.location.hash = "";
			
	}
	
} // LHListener

function extScriptConnection(a) {
	
	var script = document.createElement("script");
								
	//var style = document.createElement("style");
																		
	script.type = "text/javascript";
					
	//style.type = "text/css";
					
	script.text = a.js;
		
	//style.text = a.css;
	
	//document.getElementsByTagName('head')[0].appendChild(style);
				
	document.body.appendChild(script);
	
} // extScriptConnection

function login(h) {
	
	$.ajax({
					
		url: "public/php/ajax.php",
					
		type: "POST",
					
		dataType: "json", 
					
		data: {a: 1, b: h},
					
		success: function(a) {
			
			WELCOMEQUEST.hash = h;
		
			WELCOMEQUEST.amount = a.amount
					
			WELCOMEQUEST.data = a.data;
			
			WELCOMEQUEST.status = true;
			
			$("#preloader").addClass("preloader-nodisplay");

			$("#content").append(a.htm).toggleClass("cc-overflow");
			
			extScriptConnection(a);
			
			c_position = 0;
			
		}

	});
	
} // login

function logout() {
	
	if (WELCOMEQUEST.hash) WELCOMEQUEST = {hash: 0, amount: 0, data: {}, status: false};
	
	if (typeof(finish_timer) != "undefined") clearTimeout(finish_timer);
	
	if ($("body > script").length) $("body > script").remove();

	$("#content").toggleClass("cc-overflow").children("#anktable").remove().end().children().css({display: "block"});
	
	if (arguments[0]) eventListener(arguments[0]);
	
} // logout
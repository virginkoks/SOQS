var ITYPE = {
	
	"text": 	"[type=text], [type=url], [type=email], [type=tel]",  
	
	"cinput": 	"[type=radio], [type=checkbox], [type=hidden], select"
	
};

var IPATTERN = {
	
	"text": 	/^[^\^\\\/?{}+=:;`~|]*$/i, 
	
	"url": 		/^.*$/i,

	"email": 	/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i, 
	
	"tel": 		/^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/i
};

function isTouchDevice() {
	
	try {
		
		document.createEvent("TouchEvent");
		
		return true;
		
	} catch(e) { return false }
	
} // isTouchDevice

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
		
		$(".button", ext_body).bind("click", function(e) { e.stopPropagation(); eventListener(e, this) });
		
		//$("input, select", ext_body).bind("change", function(e) { e.stopPropagation(); eventListener(this) });

		if (opt.animate) { setTimeout('$("#extrawindow_fade").css({opacity:' + opt.fadeopacity + '})', 50) }

		if (opt.autoclose) $("#extrawindow_fade").bind("click", function() { EXTRAWINDOW() });
		
		if (opt.func) eval(opt.func);
	
	} else {
		
		if (opt.header) $("#extrawindow_body .extrawindow-header").html(opt.header);
		
		if (opt.content) $("#extrawindow_body .extrawindow-content").html(opt.content);
		
		if (opt.footer !== false) {
			
			$("#extrawindow_body .extrawindow-footer").html(opt.footer);
		
			$("#extrawindow_body .button").bind("click", function(e) { e.stopPropagation(); eventListener(e, this) });
			
			//$("#extrawindow_body input, #extrawindow_body select").bind("change", function(e) { e.stopPropagation(); eventListener(this) });
			
		} 
		
		if (opt.header_height) $("#extrawindow_body .extrawindow-header").css({ height: opt.header_height });
		
		if (opt.footer_height) $("#extrawindow_body .extrawindow-footer").css({ height: opt.footer_height });
		
		opt.autoclose ? $("#extrawindow_fade").bind("click", function() { EXTRAWINDOW() }) : $("#extrawindow_fade").unbind();
		
		if (opt.func) eval(opt.func)
		
	}
	
} // EXTRAWINDOW

$(function() { 

	$("select:not([multiple])").each(function(index, element) { if (! element.selectedIndex) POSTDATA[$(element).attr("id").match(/\d+/g)[0]][$(element).attr("id").match(/\d+/g)[1]] = 1 });

	$("input, select").not(ITYPE.text).change(function(e) { eventListener(e, this) }).end().filter(ITYPE.text).keypress(function(e) { return eventListener(e, this) }).keyup(function(e) { return eventListener(e, this) });
	
	$("[data-control-type=button]").click(function(e) { e.stopPropagation(); eventListener(e, this) });
	
	if (isTouchDevice()) {
		
		$("input, select").css({fontSize: 20});
		
		$("#content").overtouch();
		
	}

});

function eventListener(e, a) {
	
	var my = {
		
		"id": a.id.match(/\d+/g),
		
		"cinput": $(a).siblings(ITYPE.cinput),
		
		"tinput": $(a).siblings(ITYPE.text), 
		
		"seltext": $(a).children(":selected").is("[data-text]"),
		
		"nexttext": (a.type != "file") ? $("input[name=" + a.name + "]").siblings(ITYPE.text).filter("[class*=text-active]") : false,
		
		"checked": $(a).prop("checked"),
		
		"multiple": $(a).prop("multiple"),
		
		"selected": (a.selectedIndex + 1).toString(),
		
		"only": $(a).is("[only]"),
		
		"children": $(a).children(),
		
		"parent": $(a).closest("div"),
		
		"value": a.value,
		
		"type": a.type,
		
		"accept": a.accept ? a.accept.split(",") : false,
		
		"flength": a.files ? a.files.length : false,
		
		"count": a.dataset.count,
		
		"size": a.dataset.size,
		
		"nextcheck": (a.type != "file") ? $("input[type=checkbox][name=" + a.name + "][id!=" + a.id + "]") : false,
		
		"nextonlyid": (a.type != "file") ? ($("input[type=checkbox][name=" + a.name + "][id!=" + a.id + "][only]").length ? $("input[type=checkbox][name=" + a.name + "][id!=" + a.id + "][only]").attr("id").match(/\d+/g) : false) : false,
	
	}
	
	switch (e.type) {
		
		case "change" : 
			
			switch (a.type) {

				case "radio":
				
					POSTDATA[my.id[0]] = {};
					
					if (my.nexttext.length) $(my.nexttext).removeClass("text-active").val("");

					if (my.tinput.length) {
						
						$(my.tinput).addClass("text-active").focus();
						
					} else POSTDATA[my.id[0]][my.id[1]] = my.id[1];
					
				break // radio
				
				case "checkbox":
				
					if (my.checked) { 
						
						if (my.only) {
							
							$(my.nextcheck).removeAttr("checked");
							
							if (my.nexttext.length) $(my.nexttext).removeClass("text-active").val("");
							
						} else if (my.nextonlyid) {
		
								$(my.nextcheck).filter("[only]").removeAttr("checked").siblings(ITYPE.text).filter("[class*=text-active]").removeClass("text-active").val("");

								if (typeof(POSTDATA[my.id[0]][my.nextonlyid[1]]) != "undefined") delete(POSTDATA[my.id[0]][my.nextonlyid[1]]);
							
						}
						
						if (my.tinput.length) {
								
							$(my.tinput).addClass("text-active").focus();
								
						} else POSTDATA[my.id[0]][my.id[1]] = my.id[1];
		
					} else {
						
						if (my.tinput.length) $(my.tinput).removeClass("text-active").val("");
						
						if (my.only) {
							
							POSTDATA[my.id[0]] = {};
							
						} else if (typeof(POSTDATA[my.id[0]][my.id[1]]) != "undefined") {
							
							delete(POSTDATA[my.id[0]][my.id[1]]); 
							
							var x = 0;
							
							for (var i in POSTDATA[my.id[0]]) x ++;
							
							if (! x) POSTDATA[my.id[0]] = {};
							
						}
						
					}
				
				break // checkbox
				
				case "file":
				
					$(my.parent).children(".file-item-container").remove();
				
					for (var i = 0; i < my.flength; i ++) {
						
						POSTDATA[my.id[0]][i + 1] = (my.flength != my.count) ? "ERROR:Неверное количество файлов" : (($.inArray(e.target.files[i].type, my.accept) == -1) ? "ERROR:Недопустимый тип файла" : ((e.target.files[i].size > my.size) ? "ERROR:Недопустимый размер файла" : i + 1));

						$(my.parent).append("<div class='file-item-container'><span class='file-num'>" + (i + 1) + "</span><span class='file-name'>" + e.target.files[i].name + " (" + (e.target.files[i].size / 1048576).toFixed(2) + " МБ)<span></div>");

					}

				break // file
				
			} // type
			
			switch (a.nodeName.toLowerCase()) {
				
				case "select":
				
					if (my.multiple) {
						
						$(my.children).each(function(index, element) { 
						
							if ($(element).is(":selected")) {
								
								POSTDATA[my.id[0]][index + 1] = (index + 1).toString();
								
							} else if (typeof(POSTDATA[my.id[0]][index + 1]) != "undefined") delete(POSTDATA[my.id[0]][index + 1]);
							
						});

					} else {
						
						POSTDATA[my.id[0]] = {};
						
						if (my.tinput.length) {
							
							if (! my.seltext) {
								
								POSTDATA[my.id[0]][my.selected] = my.selected;
								
								$(my.tinput).removeClass("text-active");
								
							} else $(my.tinput).addClass("text-active").focus();
							
						} else POSTDATA[my.id[0]][my.selected] = my.selected;

					}
				
				break // select
				
			} // nodeName
			
		break // change
		
		case "keypress":
		
			switch (a.type) {
		
				case "tel":
				
					if (e.which != 8 && (e.which < 48 || e.which > 57 || a.value.length > 17)) return false;
					
					a.value = ((e.which > 8) ? 
					
						((/^\+7\s\(\d{3}$/.test(my.value)) ? my.value + ") " : 
					
						((/^\+7\s\(\d{3}\)((\s\d{3})|(\s\d{3}-\d{2}))$/.test(my.value)) ? my.value + "-" : 
						
						((/^\+7\s\(/.test(my.value)) ? my.value : "+7 ("))) :
						
						((my.value.length < 5) ? "+7 ( " : my.value));
		
				break // tel
				
			}

		break  // keypress
		
		case "keyup":
		
			if ($(my.cinput).is("[data-only]") || $(my.cinput).is("select")) POSTDATA[my.id[0]] = {};
			
			if (/^\s*$/.test(my.value)) {
				
				delete(POSTDATA[my.id[0]][my.id[1]]);
				
			} else POSTDATA[my.id[0]][my.id[1]] = my.id[1] + my.type + "[" + my.value + "]";
		
		break // keyup
		
		case "click":
		
			switch (a.id) {
				
				case "logout": $("form").append("<input type='hidden' name='logout'>").submit();
				
				break // logout
				
				case "next":
				
					//alert(JSON.stringify(POSTDATA).replace(/'/g, "&#039;")); //return false;
					
					if (typeof(POSTDATA) == "object") {

						for (var i in POSTDATA) {
							
							if (Object.keys(POSTDATA[i]).length) {
							
								for (var j in POSTDATA[i]) {
									
									if ($("input[id*=" + i + "_]").is("[type=file]")) {
										
										if (POSTDATA[i][j].toString().indexOf("ERROR") != -1) {
											
											var v_err = [i, POSTDATA[i][j].substr(6)];
											
											break
											
										}
										
									} else {
									
										var v_obj = /^\d+(text|url|tel|email)\[(.*)\]$/.exec(POSTDATA[i][j]);
										
										if (v_obj && ! IPATTERN[v_obj[1]].test(v_obj[2])) {
											
											var v_err = [i, "Поле заполнено неправильно"];
											
											break
											
										}
									
									}
									
								}
								
								if (typeof(v_err) != "undefined") break
							
							} else {
								
								var v_err = [i, "Поле не заполнено"];
								
								break
								
							}
							
						}
						
						if (typeof(v_err) == "undefined") {
							
							$(".navi-right").addClass("navi-right-preloader-animate");
							
							if ($("input[type=file]").length) $("form").append($("input[type=file]"));
					
							$("form").append("<input type='hidden' name='post_data' value='" + JSON.stringify(POSTDATA).replace(/'/g, "&#039;") + "'>").submit();
					
						} else marker(v_err);
					
					} else $("form").submit();
					
				break // next
				
				case "clear":
				
					for (var i in POSTDATA) POSTDATA[i] = {};
				
					$("input").filter(ITYPE.text).val("").end().filter(ITYPE.cinput).removeAttr("checked");
					
					$(".file-item-container").remove();
					
					//document.getElementById(Id).innerHTML = document.getElementById(Id).innerHTML; 
					
					$("select option").removeAttr("selected");
					
					$("select:not([multiple])").each(function(index, element) { if (! element.selectedIndex) POSTDATA[$(element).attr("id").match(/\d+/g)[0]][$(element).attr("id").match(/\d+/g)[1]] = 1 });
				
					marker();
					
				break // clear
				
				case "prev":
				
					document.forms[0].w_amount.value --;
	
					$(".navi-right").addClass("navi-right-preloader-animate");
						
					$("form").submit();
				
				break // prev

				
			}
		
		break // click
	
	}
	
} // eventListener

function marker(a) {
	
	if (a) $(".answer-container").children(".q-error-mark").remove().end().removeClass("answer-error").filter("[id=answer_container_" + a[0] + "]").addClass("answer-error").append("<div class='q-error-mark'>" + a[1] + "</div>");
	
	else $(".answer-container").children(".q-error-mark").remove().end().removeClass("answer-error");
	
} // marker
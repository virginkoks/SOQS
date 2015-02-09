var POSTDATA = {};

var ITYPE = {
	
	"text": 	"[type=text], [type=url], [type=email], [type=tel]", 
	
	"select": 	"select", 
	
	"cinput": 	"[type=radio], [type=checkbox], [type=hidden]"
	
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

$(function() { 

	if (isTouchDevice()) {
		
		$("input, select").css({fontSize: 20});
		
		$("#content").overtouch();
		
	}

	$("input, select").not(ITYPE.text).change(function(e) { eventListener(e, this) }).end().filter(ITYPE.text).keypress(function(e) { return eventListener(e, this) }).keyup(function(e) { return eventListener(e, this) });
	
	$("#next").click(function(e) { e.stopPropagation(); postAnswer() });

});

function eventListener(e, a) {
	
	var my = (a.type == "radio" || a.type == "checkbox") ? {
				
		"id": a.id.match(/\d+/)[0],
		
		"checked": $(a).prop("checked"),
		
		"text": $(a).siblings(ITYPE.text), 
	
		"select": $(a).siblings(ITYPE.select), 
		
		"nexttext": $("input[name=" + a.name + "]").siblings(ITYPE.text).filter("[class*=text-active]"),
		
		"nextselect": $("input[name=" + a.name + "][id!=" + a.id + "]").siblings(ITYPE.select),
		
		"nextcheck": $("input[type=checkbox][name=" + a.name + "][id!=" + a.id + "]"),
		
		"nextonlyid": $("input[type=checkbox][name=" + a.name + "][id!=" + a.id + "][only]").length ? $("input[type=checkbox][name=" + a.name + "][id!=" + a.id + "][only]").attr("id").match(/\d+/)[0] : false,
	
	} : {
		
		"name": $(a).siblings(ITYPE.cinput).attr("name"),
		
		"id": $(a).siblings(ITYPE.cinput).attr("id").match(/\d+/)[0],
		
		"type": $(a).siblings(ITYPE.cinput).attr("type"),
		
		"cinput": $(a).siblings(ITYPE.cinput),
		
		"multi": $(a).prop("multiple")
		
	};
	
	switch (e.type) {
		
		case "change" : 
			
			switch (a.type) {

				case "radio":
				
					delete(POSTDATA[a.name]);
				
					if (my.nextselect.length) $(my.nextselect).attr("disabled", true).filter("[multiple]").children().each(function(i, e) { $(e).removeAttr("selected") });
					
					if (my.nexttext.length) $(my.nexttext).removeClass("text-active").val("");

					if (my.text.length) {
						
						$(my.text).addClass("text-active");
						
					} else if (my.select.length) {
						
						$(my.select).attr("disabled", false);
		
						if (! $(my.select[0]).is("[multiple]")) POSTDATA[a.name] = my.id + "sel[" + my.select[0].selectedIndex + "]";

					} else POSTDATA[a.name] = my.id; //alert(POSTDATA[a.name]);
					
				break // radio
				
				case "checkbox":
				
					if (my.checked) {
						
						if (my.text.length) $(my.text).addClass("text-active"); 
						
						if ($(a).is("[only]")) {
							
							$(my.nextcheck).removeAttr("checked").siblings(ITYPE.select).attr("disabled", true).filter("[multiple]").children().each(function(i, e) { $(e).removeAttr("selected") });
							
							if (my.nexttext.length) $(my.nexttext).removeClass("text-active").val("");

							if (my.select.length) {
								
								$(my.select).attr("disabled", false);
								
								if (! $(my.select[0]).is("[multiple]")) {
									
									POSTDATA[a.name] = {};
									
									POSTDATA[a.name][my.id] = my.id + "sel[" + my.select[0].selectedIndex + "]";
									
								} else delete(POSTDATA[a.name]);

							} else if (! my.text.length) {

								POSTDATA[a.name] = {};
								
								POSTDATA[a.name][my.id] = my.id;

							} else delete(POSTDATA[a.name]);
							
						} else {
							
							if (my.nextonlyid) {
		
								$(my.nextcheck).filter("[only]").removeAttr("checked")
								
									.siblings(ITYPE.text).filter("[class*=text-active]").removeClass("text-active").val("").end()
									
									.siblings(ITYPE.select).attr("disabled", true).filter("[multiple]").children().each(function(i, e) { $(e).removeAttr("selected") });

								if (typeof(POSTDATA[a.name]) != "undefined" && typeof(POSTDATA[a.name][my.nextonlyid]) != "undefined") delete(POSTDATA[a.name][my.nextonlyid]);
							
							}
							
							if (my.select.length) {
								
								$(my.select).attr("disabled", false);
								
								if (! $(my.select[0]).is("[multiple]")) {
							
									if (typeof(POSTDATA[a.name]) == "undefined") POSTDATA[a.name] = {};
									
									POSTDATA[a.name][my.id] = my.id + "sel[" + my.select[0].selectedIndex + "]";
									
								}
								
							} else if (! $(my.text).length) {
								
								if (typeof(POSTDATA[a.name]) == "undefined") POSTDATA[a.name] = {};
								
								POSTDATA[a.name][my.id] = my.id;
								
							}
							
						}
		
					} else {
						
						if (my.text.length) $(my.text).removeClass("text-active").val("");
						
						if (my.select.length) $(my.select).attr("disabled", true).filter("[multiple]").children().each(function(i, e) { $(e).removeAttr("selected") });
						
						if ($(a).is("[only]")) {
							
							if (typeof(POSTDATA[a.name]) != "undefined") delete(POSTDATA[a.name]);
							
						} else if (typeof(POSTDATA[a.name]) != "undefined" && typeof(POSTDATA[a.name][my.id]) != "undefined") {
							
							delete(POSTDATA[a.name][my.id]); 
							
							var x = 0;
							
							for (var i in POSTDATA[a.name]) x ++;
							
							if (! x) delete(POSTDATA[a.name]);
							
						}
						
					}
				
				break // checkbox
				
			} // type
			
			switch (a.nodeName.toLowerCase()) {
				
				case "select":
				
					if (my.multi) {
						
						var options = [];
							
						$(a).children().each(function(i, e) { if ($(e).is(":selected")) options.push(i) });
						
						if (options.length) {
							
							if (my.type == "checkbox") {
								
								if ($(my.cinput).is("[only]")) {
									
									POSTDATA[my.name] = {};
									
								} else if (typeof(POSTDATA[my.name]) == "undefined") POSTDATA[my.name] = {};
								
								POSTDATA[my.name][my.id] = my.id + "sel[" + options.join() + "]";
								
							} else POSTDATA[my.name] = my.id + "sel[" + options.join() + "]";
							
						} else if ($(my.cinput).is("[only]") && typeof(POSTDATA[a.name]) != "undefined") delete(POSTDATA[a.name]);
						
					} else if (my.type == "checkbox") {
						
						if ($(my.cinput).is("[only]")) {
									
							POSTDATA[my.name] = {};
									
						} else if (typeof(POSTDATA[my.name]) == "undefined") POSTDATA[my.name] = {};
						
						POSTDATA[my.name][my.id] = my.id + "sel[" + a.selectedIndex + "]";
						
					} else POSTDATA[my.name] = my.id + "sel[" + a.selectedIndex + "]";
				
				break // select
				
			} // nodeName
			
		break // change
		
		case "keypress":
		
			switch (a.type) {
		
				case "tel":
				
					if (e.which != 8 && (e.which < 48 || e.which > 57 || a.value.length > 17)) return false;
					
					a.value = ((e.which > 8) ? 
					
						((/^\+7\s\(\d{3}$/.test(a.value)) ? a.value + ") " : 
					
						((/^\+7\s\(\d{3}\)((\s\d{3})|(\s\d{3}-\d{2}))$/.test(a.value)) ? a.value + "-" : 
						
						((/^\+7\s\(/.test(a.value)) ? a.value : "+7 ("))) :
						
						((a.value.length < 5) ? "+7 ( " : a.value));
		
				break // tel
				
			}

		break // keypress
		
		case "keyup":
		
			if (my.type == "checkbox") {
						
				if ($(my.cinput).is("[only]")) {
							
					POSTDATA[my.name] = {};
							
				} else if (typeof(POSTDATA[my.name]) == "undefined") POSTDATA[my.name] = {};
				
				POSTDATA[my.name][my.id] = my.id + a.type + "[" + a.value + "]";
				
			} else POSTDATA[my.name] = my.id + a.type + "[" + a.value + "]";
		
		break // keyup
	
	}
	
} // eventListener

function postAnswer() {
	
	cycle:
	
	for (var i = 1; i <= document.forms[0].a_amount.value; i ++) 
		
	if (typeof(POSTDATA[i]) != "undefined") {
		
		if (typeof(POSTDATA[i]) == "object") {
			
			for (var j in POSTDATA[i]) {
				
				var vertext = /^\d+(text|url|tel|email)\[(.*)\]$/.exec(POSTDATA[i][j]); 
				
				if (vertext && ! IPATTERN[vertext[1]].test(vertext[2])) {
				
					var verror = IPATTERN[vertext[1]]+"   "+vertext[2];
		
					break cycle;
					
				}
				
			}
			
		} else {
		
			var vertext = /^\d+(text|url|tel|email)\[(.*)\]$/.exec(POSTDATA[i]);

			if (vertext && ! IPATTERN[vertext[1]].test(vertext[2])) {
				
				var verror = "e2 "+vertext[2];
	
				break;
				
			}
		
		}

	} else {
		
		var verror = "e1 "+i;
		
		break;
		
	}
	
	if (typeof(verror) == "undefined") {
	
		for (var i = 1; i <= document.forms[0].a_amount.value; i ++) {
			
			var value = ((typeof(POSTDATA[i]) == "object") ? [] : POSTDATA[i]);
				
			if (typeof(value) == "object") for (var j in POSTDATA[i]) value.push(POSTDATA[i][j]);

			$("form").append("<input type='hidden' name='a" + i + "' value='" + ((typeof(value) == "object") ? value.join("|") : value) + "'>");
			
		}
		
		$("#next").addClass("waiting");
		
		$("form").submit(); 
		
	} else alert("Поле " + verror + " заполнено неправильно");
	
} // postAnswer
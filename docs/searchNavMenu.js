/*! searchNavMenu.js v3.0 |  Andrej Grlica | andrej.grlica@right-thing.solutions */
/* ==========================================================================

   Description:
	Script is used for Search Navigation Menu in Oracle APEX (24.2 and later)

   -------------------------------------------------------------------------------

	Parameters :
		item_id = item id from apex
		menuOptions = (additional menu options)
		elm = object
		e = event
		ajaxIdentifier = name of ajax call function
		l_skey = character keypress focus on search
*/

var SNMClosed = false;
var SNMDefaults =
				{
					"MenuOpen": false,
					"MenuClickOpenClose": true,
					"SaveSS": true,
					"ShortcutSaveSS": false,
					"ShrtCaseSensitive": true,
					"OnSearchShowChildren": true,
					"UseFocus":true,
					"Shortcuts": []
				};
// Other spellings of option names (lower case) that are accepted, e.g. the names older README versions documented.
var SNMOptionAliases =
				{
					"mmenuclickopenclose": "MenuClickOpenClose",
					"shortcutcasesensitive": "ShrtCaseSensitive"
				};
var SNMOptions = mergeSNMOptions(null);
var SNMSaveDelay = 300; // ms after the last keyup before the text is saved in session state

/* Options given to the item are merged into the defaults; option names are not case sensitive. */
function mergeSNMOptions(menuOptions) {
	var l_options = $.extend({}, SNMDefaults, {"Shortcuts": []}), l_names = {}, l_name;
	$.each(SNMDefaults, function(name) { l_names[name.toLowerCase()] = name; });
	$.each(SNMOptionAliases, function(alias, name) { l_names[alias] = name; });
	if (menuOptions)
		$.each(menuOptions, function(name, value) {
			l_name = l_names[name.toLowerCase()] || name;
			l_options[l_name] = value;
		});
	if (!Array.isArray(l_options.Shortcuts))
		l_options.Shortcuts = [];
	return l_options;
}

function setSNMShortcuts(p_shortcuts) {
	SNMOptions.Shortcuts = Array.isArray(p_shortcuts) ? p_shortcuts : [];
}

function appendSNMShortcut(p_shortcut) {
	if (!p_shortcut || !p_shortcut.name || !p_shortcut.action) {
		apex.debug.error("appendSNMShortcut: a shortcut needs a name and an action: " + JSON.stringify(p_shortcut));
		return false;
	}
	SNMOptions.Shortcuts.push(p_shortcut);
	return true;
}

function openModalSNMHelp() {
	openModalSNM("SNM_Help", getHelpSNM());
}

/* Entries the search currently shows (hidden entries have an inline display:none, on themselves or on a parent). */
function shownNavNodesSNM() {
	return $('li[id^="t_TreeNav_"]').filter(function() {
		return $(this).parentsUntil("#t_TreeNav").addBack().filter(function() { return this.style.display == "none"; }).length == 0;
	});
}

function openSNMChildrenIfExists() {
	if (SNMOptions.OnSearchShowChildren) {
		$('li[id^="t_TreeNav"].is-expandable, li[id^="t_TreeNav"].is-collapsible').filter(function() {
			return this.style.display != "none";
		}).children("ul").children("li").each(function () {
			if ($(this).has( "strong" ).length || ($(this).has( "ul" ).length == false && $(this).has( "strong" ).length == false))
				$(this).css("display", "");
		});
	}
}

/* Called by the plug-in's render code: adds the search box to the navigation tree and starts the plug-in. */
function renderSearchNavMenu(p_config) {
	var l_box = $("<div/>", {"id": p_config.itemId, "class": ("srch_nav " + (p_config.cssClasses || "")).trim()});
	$("<input/>", {"class": "srch_input", "type": "text", "placeholder": p_config.placeholder || "", "aria-label": p_config.placeholder || "Search navigation"}).appendTo(l_box);
	if (p_config.icon)
		$("<span class=\"srch_icon\"><i></i></span>").find("i").addClass("fa " + p_config.icon).end().appendTo(l_box);
	$("#t_TreeNav").prepend(l_box);
	$("#t_Button_navControl").on("click", function() { showHideSearchBar(p_config.itemId); });
	LoadSearchNavMenu(p_config.itemId, p_config.options, p_config.ajaxId, p_config.key, p_config.value);
}

function LoadSearchNavMenu(item_id, menuOptions, ajaxIdentifier, l_skey, elmVal) {
	SNMOptions = mergeSNMOptions(menuOptions);

	SNMOptions.ajaxId = ajaxIdentifier;
	SNMOptions.ItemId = item_id;
	if (SNMOptions.MenuClickOpenClose)
		$("#t_Body_nav #t_TreeNav").on("click", "ul li.a-TreeView-node div.a-TreeView-content:not(:has(a))", function() {
			$(this).prev("span.a-TreeView-toggle").click();
		});

	if (SNMOptions.SaveSS)
		$("input.srch_input").val(elmVal);

    //Add events on items
    //----- KeyDOWN
    $("input.srch_input").on("keydown", function(e) {
		keyDownSearchNav($(this), e);
    });

	//----- KeyUP
    $("input.srch_input").on("keyup", function(e, pageEvent) {
		keyUpSearchNav($(this), e, pageEvent);
    });

	//----- Field emptied without a key (e.g. the browser's clear button)
	$("input.srch_input").on("input", function() {
		if (this.value == "") {
			var currItem = document.activeElement;
			setCurrentNav(item_id);
			saveSesSateNav("");
			if (SNMOptions.UseFocus)
				currItem.focus();
			else
				$(this).focus();
		}
	});

	//----- Leaving the box saves a pending text at once
	$("input.srch_input").on("blur", function() {
		flushSaveSNM();
	});

    //----- Click on input bar, prevent default "Chrome problem".
    $("input.srch_input").on("click", function(e){e.preventDefault(); return false;});

    apex.jQuery(window).on("apexwindowresized", function(e) {
            onResizeWinSearchNav();
    });

    //    ----- Keybind to focus on Search Box. Ctrl + User Selected Key (Default = S)
    if (l_skey) {
		SNMOptions.skey = l_skey;
		$(document).on("keydown", function(e){
			shortCutSearchNav(e, l_skey);
        });
	}

	addModalSNM("SNM_Help", "Search Navigation Menu HELP");

	//---- On document ready
	$(function() {
		var currItem = document.activeElement;
		if (!isNavTreeOpen())
			SNMClosed=true;
		openAllNavSubmenus();
		$('li[id^="t_TreeNav"].is-collapsible').find('span.a-TreeView-toggle').click();
		//Because all list were open and last one closed we need to open current list
		setCurrentNav(item_id);

		if (SNMOptions.MenuOpen)
			showAllSublistsSearchNav();

		if (SNMOptions.UseFocus)
			currItem.focus();
	});
}

function openAllNavSubmenus(elm) {
	var l_elm="";
	if (elm)
		l_elm="li[id="+elm.attr("id")+"] ";
	$(l_elm+'li[id^="t_TreeNav"].is-expandable').each(function() {
		$(this).find("span.a-TreeView-toggle").click();
		openAllNavSubmenus($(this));
	});
}

function setCurrentNav(item_id) {
	$('li[id^="t_TreeNav"]').each( function(){
        if ($(this).find("div.a-TreeView-content:first").hasClass("is-current")) {
            $(this).find("div.a-TreeView-row:first").addClass("is-selected");
            if ($(this).hasClass("is-expandable"))
                $(this).find("span.a-TreeView-toggle:first").click();
       }
	   else if ($(this).find("div.a-TreeView-content:first").hasClass("is-current--top")) {
			$(this).find("span.a-TreeView-toggle:first").click();
	   }
       else
           $(this).find("div.a-TreeView-row:first").removeClass("is-selected");
    });
	if (SNMClosed)
		$('#t_Button_navControl').click();
    else
		showHideSearchBar(item_id);
}

function isNavTreeOpen() {
	return $("body").hasClass("js-navExpanded");
}

function redirectUrlSNM(redirectURL, pNewWindow) {
	if (redirectURL && !pNewWindow) {
		window.location.href = redirectURL;
		if (!SNMOptions.ShortcutSaveSS && redirectURL.toLowerCase().indexOf("javascript:") == 0) {
			$("input.srch_input").val("");
			setCurrentNav(SNMOptions.ItemId);
		}
	}
	else if (redirectURL && pNewWindow) {
		if (!SNMOptions.ShortcutSaveSS) {
			$("input.srch_input").val("");
			setCurrentNav(SNMOptions.ItemId);
		}
		window.open(redirectURL, "_blank");
	}
}

/* Session state saves: typing is debounced (pLazy) and all saves go out one after another,
   so an older text can never overwrite a newer one. */
var SNMSave = { timer: null, value: null, queue: $.Deferred().resolve().promise() };

function sendSaveSNM(newVal) {
	var l_send = function() {
		return apex.server.plugin( SNMOptions.ajaxId, {
			x01: newVal
		}, {dataType:"json"}).then(function( pData ) {
			if(pData && pData.state == 'OK')
				apex.debug.info("Saved session state.");
			else
				apex.debug.error("Saving the session state for Search Navigation failed: "+JSON.stringify(pData)  );
		}, function( jqXHR, textStatus, errorThrown ) {
			apex.debug.error("Saving the session state for Search Navigation failed: "+textStatus+" "+errorThrown );
		});
	};
	SNMSave.queue = SNMSave.queue.then(l_send, l_send);
	return SNMSave.queue;
}

/* Sends a save that is still waiting for the debounce, at once. Returns a promise that is done when all saves are. */
function flushSaveSNM() {
	if (SNMSave.timer) {
		clearTimeout(SNMSave.timer);
		SNMSave.timer = null;
		sendSaveSNM(SNMSave.value);
	}
	return SNMSave.queue;
}

function saveSesSateNav(newVal, redirectURL, pNewWindow, pLazy) {
	if (SNMOptions.SaveSS) {
		if (SNMSave.timer) {
			clearTimeout(SNMSave.timer);
			SNMSave.timer = null;
		}
		if (pLazy) {
			SNMSave.value = newVal;
			SNMSave.timer = setTimeout(function() { SNMSave.timer = null; sendSaveSNM(newVal); }, SNMSaveDelay);
		}
		else
			sendSaveSNM(newVal).always(function() { redirectUrlSNM(redirectURL, pNewWindow); });
	}
	else {
		redirectUrlSNM(redirectURL, pNewWindow);
	}
}

function showHideSearchBar(item_id) {
  if (isNavTreeOpen())
    $('input.srch_input').trigger("keyup", [true]);
  else {
	$('input.srch_input').trigger("keyup", [true]);
	hideAllSublistsSearchNav();
  }
}

function hideAllSublistsSearchNav() {
	$('li[id^="t_TreeNav"].is-expandable').find("ul").css("display", "none");
}
function showAllSublistsSearchNav() {
	$('li[id^="t_TreeNav"].is-expandable').find("ul").css("display", "grid");
}

/* The label text with the first match in <strong>; the text itself is escaped. */
function colorSearchNav(txt, rplStr) {
    var loc = txt.toLowerCase().indexOf(rplStr.toLowerCase()), esc = apex.util.escapeHTML;
    if (loc!=-1) {
        return esc(txt.slice(0, loc))+'<strong>'+esc(txt.slice(loc, loc+rplStr.length))+'</strong>'+esc(txt.slice(rplStr.length+loc, txt.length));
    }
    return esc(txt);
}

function hoverSearchNav() {
    $('li[id^="t_TreeNav_"] div.is-hover').removeClass("is-hover");
    shownNavNodesSNM().find('a.a-TreeView-label strong').each(function() {
        $(this).parents("li").eq(0).children("div").addClass("is-hover");
        return false;
    });
}

function stepNextSearchNav(reverse) {
    var obj = $('li[id^="t_TreeNav_"] div.is-hover'), newObj, flg; //flg for flag next object
    if (obj[0]) {
        obj.removeClass("is-hover");
        shownNavNodesSNM().find('a.a-TreeView-label strong').each(function() {
           if($(this).parents("li").eq(0).attr("id") == obj.parent("li").attr("id") && reverse)
               return false;
           else if (flg) {
               newObj=$(this).parents("li").eq(0);
               return false;
           }
           else if ($(this).parents("li").eq(0).attr("id") == obj.parent("li").attr("id") && !reverse && !flg) {
               flg = true;
               newObj=$(this).parents("li").eq(0);
           }
           else
               newObj=$(this).parents("li").eq(0);
        });
        if (newObj)
            $(newObj).children("div").addClass("is-hover");
        else
            $(obj).addClass("is-hover");
    }
    else
       hoverSearchNav();
}

/* f?p URL of the current application and session. */
function pageUrlSNM(p_page_id, p_clearCache, p_items, p_values) {
	return "f?p="+apex.env.APP_ID+":"+p_page_id+":"+apex.env.APP_SESSION+":::"+p_clearCache+":"+(p_items || "")+":"+(p_values || "");
}

function parseSNMShortcut(obj, elmVal) {
	var retURL = "";

	if ("action" in obj) {
		var l_clearCache="", l_page_id = apex.env.APP_PAGE_ID;
		if (obj.page_id)
			l_page_id = obj.page_id;
		if (obj.clearCache)
			if ("clearCacheList" in obj)
				l_clearCache = obj.clearCacheList;
			else
				l_clearCache = l_page_id;

		if (obj.action.toLowerCase() == "page" && !elmVal)
			retURL = pageUrlSNM(l_page_id, l_clearCache);
		else if (obj.action.toLowerCase() == "url" && !elmVal) {
			if (obj.url)
				retURL = obj.url;
		}
		else if (obj.action.toLowerCase() == "ir") {
			var ir_link="IR";
			if ("IR_static_id" in obj)
				ir_link+="["+obj.IR_static_id+"]";
			if ("IR_operator" in obj)
				ir_link+=obj.IR_operator+"_";
			if ("IR_type" in obj)
				if (obj.IR_type.toLowerCase() == "column")
					if ("IR_column" in obj)
						ir_link+=obj.IR_column;
					else
						ir_link+="ROWFILTER";
				else
					ir_link+="ROWFILTER";
			else
				ir_link+="ROWFILTER";
			if (l_clearCache) {
				if ("IR_clearCache" in obj)
					l_clearCache +=","+obj.IR_clearCache;
			}
			else {
				if ("IR_clearCache" in obj)
					l_clearCache = obj.IR_clearCache;
			}
			if (elmVal)
				retURL = pageUrlSNM(l_page_id, l_clearCache, ir_link, elmVal);
			else
				if ("IR_value" in obj)
					retURL = pageUrlSNM(l_page_id, l_clearCache, ir_link, obj.IR_value);
		}
		else if (obj.action.toLowerCase() == "item") {
			if (elmVal) {
				if ("item_name" in obj)
					retURL = pageUrlSNM(l_page_id, l_clearCache, obj.item_name, elmVal);
			}
			else
				if ("item_name" in obj && "item_value" in obj)
					retURL = pageUrlSNM(l_page_id, l_clearCache, obj.item_name, obj.item_value);
		}
	}
	if (retURL)
		apex.debug.info("Object:"+JSON.stringify(obj)+" returning URL :'"+retURL+"'");
	return retURL;
}

function redirectSNM(obj, startWith, elmVal) {
	var rdr, l_newWindow, valSessionState="";
	if (SNMOptions.ShortcutSaveSS)
		valSessionState=elmVal;
	if(obj) {
		if (obj.newWindow)
			l_newWindow = true;
		if (startWith)
			rdr=parseSNMShortcut(obj, elmVal.substr(obj.name.length+1, elmVal.length-obj.name.length+1));
		else
			rdr=parseSNMShortcut(obj);

		if (rdr) {
			saveSesSateNav(valSessionState, rdr, l_newWindow);
			return true;
		}
	}
	else {
		rdr = shownNavNodesSNM().find('div.is-hover a.a-TreeView-label').attr("href");
		if (rdr) {
			// the typed text is saved before the page changes
			flushSaveSNM().always(function() { window.location.href = rdr; });
			return true;
		}
	}
	return false;
}

function checkAndRedirectSNM(elm) {
	var elmVal = $(elm).val(), find_shortcut = false, caseSensitive;
	if (SNMOptions.ShrtCaseSensitive)
		caseSensitive=true;
	if (!jQuery.isEmptyObject(SNMOptions.Shortcuts)) {
		for(var i=0; i<SNMOptions.Shortcuts.length; i++) {
			if ((SNMOptions.Shortcuts[i].name == elmVal && caseSensitive) || (SNMOptions.Shortcuts[i].name.toLowerCase() == elmVal.toLowerCase() && !caseSensitive)) {
				find_shortcut = redirectSNM(SNMOptions.Shortcuts[i]);
			}
			else if ((elmVal.indexOf(SNMOptions.Shortcuts[i].name+":") == 0 && caseSensitive) ||
					 (elmVal.toLowerCase().indexOf(SNMOptions.Shortcuts[i].name.toLowerCase()+":") == 0  && !caseSensitive)) {
					find_shortcut = redirectSNM(SNMOptions.Shortcuts[i], true, elmVal);
			}
			if (find_shortcut) { break; }
		}
	}
	if (!find_shortcut)
		find_shortcut = redirectSNM();
}

/*  EVENTS........ */

function addModalSNM(name, title) {
	$('body').append('<div id="'+name+'" />')

	$("#"+name).dialog(
		{"modal":true
		,"title":title
		,"autoOpen":false
		,"resizable":true
		,"dialogClass":"no-close srch_modal"
		,"width":'500px'
		,"closeOnEscape":true
		,buttons : {
				"Close" : function () {
					$(this).dialog("close");
				}
			}
		}
	);
}

function openModalSNM(name, p_msg) {
	$("#"+name)
	.css('margin','12px') // Make dialog text easier to read.
	.html(p_msg) // Generate the message.
	.dialog('open'); // Open the dialog.
}

function getHelpSNM() {
	var esc = apex.util.escapeHTML;
	var l_return = "<h3>Shortcuts :</h3>";
	l_return +="<table>";
	l_return +="<tr><td class=\"td_right\"><strong>CTRL+"+esc(String(SNMOptions.skey))+" :</strong></td><td colspan=\"4\">Focus on search box item</td></tr>";
	l_return +="<tr><td class=\"td_right\"><strong>F1 :</strong></td><td colspan=\"4\">Opens search navigation menu help page</td></tr>";

	if (!jQuery.isEmptyObject(SNMOptions.Shortcuts)) {
		   l_return +="<tr class=\"tr_bg\"><td>Shortcut label</td><td>Type</td><td>Condition</td><td>Example (type in)</td></tr>";
		for(var i=0; i<SNMOptions.Shortcuts.length; i++) {
			l_return +="<tr><td><strong>"+esc(String(SNMOptions.Shortcuts[i].name))+"</strong></td><td>"+esc(String(SNMOptions.Shortcuts[i].action))+"</td>";
			l_return +="<td>";
			if (SNMOptions.Shortcuts[i].action.toLowerCase()=="ir") {
				if (SNMOptions.Shortcuts[i].IR_type && SNMOptions.Shortcuts[i].IR_type.toLowerCase()=="column") {
					if ("IR_column" in SNMOptions.Shortcuts[i])
						l_return +="column "+esc(SNMOptions.Shortcuts[i].IR_column.toUpperCase())+" ";
				}
				else
					l_return +="row ";

				if ("IR_operator" in SNMOptions.Shortcuts[i]) {
					if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "C")
						l_return +="contains";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "GTE")
						l_return +="greather than or equal to";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "GT")
						l_return +="greather than";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "LIKE")
						l_return +="like";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "LT")
						l_return +="less than";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "LTE")
						l_return +="less than r equal to";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "N")
						l_return +="null";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "NC")
						l_return +="not cointains";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "NEQ")
						l_return +="not equals";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "NLIKE")
						l_return +="not like";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "NN")
						l_return +="not null";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "NIN")
						l_return +="not in";
					else if (SNMOptions.Shortcuts[i].IR_operator.toUpperCase() == "IN")
						l_return +="in";
					else
						l_return +="equals";
				}
				else
					l_return +="contains";
			}
			l_return +="</td>";

			if ("example" in SNMOptions.Shortcuts[i])
				l_return +="<td>"+esc(String(SNMOptions.Shortcuts[i].example))+"</td>";
			else
				l_return +="<td></td>";
			l_return +="</tr>";
		}
	}
	l_return +="</table>";
	return l_return;
}

function keyDownSearchNav(elm, e) {
	switch (e.which) {
		   case 13:
		       checkAndRedirectSNM(elm);
			   e.preventDefault();
			  break;
		   case 40:
			  stepNextSearchNav(false);
			  e.preventDefault();
			  break;
		   case 38:
			  stepNextSearchNav(true);
			  e.preventDefault();
			  break;
			case 112:
			  openModalSNMHelp();
			  e.preventDefault();
			  break;
	}
}

//elm= input, e=event, paegeEvent=keyup of hide/show
function keyUpSearchNav(elm, e, pageEvent) {
	switch (e.which) {
	   case 13:
	   case 17:
	   case 40:
	   case 38:
	   case 112:
		   e.preventDefault();
		   break;
	   default:
		var elmVal = $(elm).val();
		 $(".a-TreeView-label strong").replaceWith(function() { return document.createTextNode($(this).text()); });
		 if (elmVal != "") {
			 $('li[id^="t_TreeNav"]').each(function() {
			   if ($(this).find(".a-TreeView-label").text().toLowerCase().indexOf(elmVal.toLowerCase())!= -1 ) {
				   if ($(this).hasClass("is-expandable"))
					   $(this).find("ul").css("display", "grid");
				   $(this).find(".a-TreeView-label").each(function(){
					   $(this).html(colorSearchNav($(this).text(),elmVal));
				   });
				   $(this).css("display", "");
			   }
			   else
				 $(this).css("display", "none");
			  });
		}
		else {
		   $('li[id^="t_TreeNav"]').each(function() {
			  if ($(this).hasClass("is-expandable"))
					  $(this).find("ul").css("display", "none");
			  $(this).css("display", "");
		   });
		}
		if (!pageEvent)
			saveSesSateNav(elmVal, null, null, true);
		hoverSearchNav();
		openSNMChildrenIfExists();
	}
}

function shortCutSearchNav(e, l_skey) {
	if(e.ctrlKey && e.keyCode === l_skey.charCodeAt(0)){
		if (!isNavTreeOpen())
			$('#t_Button_navControl').click();
		var tmp = $("input.srch_input").val();
		$("input.srch_input").focus().val(tmp);
		e.preventDefault();
		return false;
	}
}

function onResizeWinSearchNav() {
	if ($("input.srch_input").is(":focus"))
		$('.t-PageBody:not(.js-navExpanded) #t_Button_navControl').click();
	else {
		if (!isNavTreeOpen())
			hideAllSublistsSearchNav();
	}
}

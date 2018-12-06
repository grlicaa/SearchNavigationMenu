/*! searchNavMenu.js v2.0 | ABAKUS PLUS d.o.o. | Andrej Grlica | andrej.grlica@abakus.si */

/* ==========================================================================

   Description:
	Script is used for Search Navigation Menu in Oracle Application Express
	
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
var SNMOptions =
				{
					"MenuOpen": false,
					"MenuClickOpenClose": true,
					"SaveSS": true,
					"ShortcutSaveSS": false,
					"ShrtCaseSensitive": true,
					"Shortcuts": []
				};

function setSNMShortcuts(p_shortcuts) {
	SNMOptions.Shortcuts = p_shortcuts;
}

function appendSNMShortcut(p_shortcut) {
	(SNMOptions.Shortcuts).push(p_shortcuts);
}

function openModalSNMHelp() {
	openModalSNM("SNM_Help", getHelpSNM());
}

function LoadSearchNavMenu(item_id, menuOptions, ajaxIdentifier, l_skey, elmVal) {
	if (menuOptions)
		SNMOptions = menuOptions;

	SNMOptions.ajaxId = ajaxIdentifier;
	SNMOptions.ItemId = item_id;
	if (SNMOptions.MenuClickOpenClose)
		$("#t_Body_nav #t_TreeNav").on("click", "ul li.a-TreeView-node div.a-TreeView-content:not(:has(a))", function() {
			$(this).prev("span.a-TreeView-toggle").click();
		});
		
	if (SNMOptions.SaveSS)
		$("input.srch_input").val(elmVal);
	
    // Add events on items
    //----- KeyDOWN
    $("input.srch_input").keydown(function(e) {
		keyDownSearchNav($(this), e);
		// Display children under parent node. This can be removed.
		$('li[id^="t_TreeNav"].is-expandable[style="display: block;"]').children("ul").children("li").each(function () {$(this).css("display", "block"); });
    });
    
	//----- KeyUP
    $("input.srch_input").keyup(function(e, pageEvent) {
		keyUpSearchNav($(this), e, pageEvent);
		 // Display children under parent node. This can be removed.
		$('li[id^="t_TreeNav"].is-expandable[style="display: block;"]').children("ul").children("li").each(function () {$(this).css("display", "block"); });
    });

    //----- Click on input bar, prevent default "Chrome problem".
    $("input.srch_input").on("click", function(e) {
		 	e.preventDefault(); return false;
	 });
 
    apex.jQuery(window).on("apexwindowresized", function(e) {
            onResizeWinSearchNav();
    });

    //    ----- Keybind to focus on Search Box. Ctrl + User Selected Key (Default = S)
    if (l_skey)
		SNMOptions.skey = l_skey;
		$(document).on("keydown", function(e){
			shortCutSearchNav(e, l_skey);
        });	
		
	addModalSNM("SNM_Help", "Search Navigation Menu Help");
	
	//---- On document ready	
	$(function() {
		var currItem = document.activeElement;
		if (!isNavTreeOpen())
			SNMClosed=true;
		openAllNavSubmenus();
		$('li[id^="t_TreeNav"].is-collapsible').find('span.a-TreeView-toggle').click(); 
		//Because all list were open and last one closed, we need to open current list
		setCurrentNav(item_id);

		if (SNMOptions.MenuOpen)
			showAllSublistsSearchNav();
	
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
        if ($(this).find("div.a-TreeView-content").hasClass("is-current")) {
            $(this).find("div.a-TreeView-row").addClass("is-selected");
            if ($(this).hasClass("is-expandable"))
                $(this).find("span.a-TreeView-toggle").click();  
       }
       else
           $(this).find("div.a-TreeView-row").removeClass("is-selected");
    });
	if (SNMClosed)
		$('#t_Button_navControl').click();
    else
		showHideSearchBar(item_id);
}

function isNavTreeOpen() {
	try {
		return apex.theme42.toggleWidgets.isExpanded("nav");
	}
	catch(e) {
		apex.debug.info("Error: apex.theme42.toggleWidgets.isExpanded('nav') doesn't exist before Oracle APEX 5.1 errormsg: "+e); 
		return $('body').hasClass('js-navExpanded');
	}
	return false;
}

function redirectUrlSNM(redirectURL, pNewWindow) {
	if (redirectURL && !pNewWindow) {
		window.location.href = redirectURL;
		if (!SNMOptions.ShortcutSaveSS && redirectURL.toLowerCase().startsWith('javascript:')) {
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

function saveSesSateNav(newVal, redirectURL, pNewWindow) {
	if (SNMOptions.SaveSS) {
		apex.server.plugin( SNMOptions.ajaxId, {
			x01: newVal
		}, {dataType:"json", 
			accept: "application/json",
			success: function( pData ) {
				if(pData.state == 'OK') {
					apex.debug.info("Saved session state.");  
					redirectUrlSNM(redirectURL, pNewWindow);
				}
				else
					apex.debug.error("Saving the session state for Search Navigation failed: "+JSON.stringify(pData) );
		   },
		   error: function( pData ) {
			 apex.debug.error("Saving the session state for Search Navigation failed: "+JSON.stringify(pData) );
		   }
		}); 
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
	$('li[id^="t_TreeNav"].is-expandable').find("ul").css("display", "block");
}

function colorSearchNav(txt, rplStr) {
    var loc = txt.toLowerCase().indexOf(rplStr.toLowerCase());
    if (loc!=-1) {
        return txt.slice(0, loc)+'<strong>'+txt.slice(loc, loc+rplStr.length)+'</strong>'+txt.slice(rplStr.length+loc, txt.length);
    }
    return txt;    
}

function hoverSearchNav() {
    $('li[id^="t_TreeNav_"] div.is-hover').removeClass("is-hover");
    $('li[id^="t_TreeNav_"][style*="display: block"] a.a-TreeView-label strong').each(function() {
        $(this).parents("li").eq(0).children("div").addClass("is-hover");
        return false;
    });
}

function stepNextSearchNav(reverse) {
    var obj = $('li[id^="t_TreeNav_"] div.is-hover'), newObj, flg; //flg for flag next object
    if (obj[0]) {
        obj.removeClass("is-hover");
        $('li[id^="t_TreeNav_"][style*="display: block"] a.a-TreeView-label strong').each(function() {
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

function parseSNMShortcut(obj, elmVal) {
	var retURL = "";
	
	if ("action" in obj) {
		var l_clearCache="", l_page_id = $v("pFlowStepId");
		if (obj.page_id)
			l_page_id = obj.page_id;
		if (obj.clearCache)
			if ("clearCacheList" in obj)
				l_clearCache = obj.clearCacheList;
			else
				l_clearCache = l_page_id; 
		
		if (obj.action.toLowerCase() == "page" && !elmVal) 
			retURL = "f?p="+$v("pFlowId")+":"+l_page_id+":"+$v("pInstance")+"::NO:"+l_clearCache+"::"
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
				retURL = "f?p="+$v("pFlowId")+":"+l_page_id+":"+$v("pInstance")+"::NO:"+l_clearCache+":"+ir_link+":"+elmVal;
			else
				if ("IR_value" in obj)	
					retURL = "f?p="+$v("pFlowId")+":"+l_page_id+":"+$v("pInstance")+"::NO:"+l_clearCache+":"+ir_link+":"+obj.IR_value;
		}		
		else if (obj.action.toLowerCase() == "item") {
			if (elmVal) {
				if ("item_name" in obj)	
					retURL = "f?p="+$v("pFlowId")+":"+l_page_id+":"+$v("pInstance")+"::NO:"+l_clearCache+":"+obj.item_name+":"+elmVal;
			}
			else 
				if ("item_name" in obj && "item_value" in obj)
					retURL = "f?p="+$v("pFlowId")+":"+l_page_id+":"+$v("pInstance")+"::NO:"+l_clearCache+":"+obj.item_name+":"+obj.item_value;			
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
		rdr = $('li[id^="t_TreeNav_"][style*="display: block"] div.is-hover a.a-TreeView-label').attr("href");
		if (rdr) {
			window.location.href = rdr;
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
			else if ((elmVal.startsWith(SNMOptions.Shortcuts[i].name+":") && caseSensitive) ||
					 (elmVal.toLowerCase().startsWith(SNMOptions.Shortcuts[i].name.toLowerCase()+":") && !caseSensitive)) {
					find_shortcut = redirectSNM(SNMOptions.Shortcuts[i], true, elmVal);
			}
			if (find_shortcut) { break; }
		}
	}
	if (!find_shortcut)
		find_shortcut = redirectSNM();
}

/*  EVENTS  */

function addModalSNM(name, title) {
	$('body').append('<div id="'+name+'" />')
	
	$("#"+name).dialog(
		{
			"modal" : true,
			"title" : title,
			"autoOpen":false,
			"resizable":true,
			"dialogClass": "no-close srch_modal",
			"width" : '500px',
			"closeOnEscape" : true,
			buttons: {
				"Close": function () {
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
	var l_return = "<h3>Shortcuts :</h3>";
	l_return +="<table>";
	l_return +="<tr><td class=\"td_right\"><strong>CTRL+"+SNMOptions.skey+" :</strong></td><td colspan=\"4\">Focus on Search Box</td></tr>";
	l_return +="<tr><td class=\"td_right\"><strong>F1:</strong></td><td colspan=\"4\">Opens the Search Navigation Menu help.</td></tr>";
	
	if (!jQuery.isEmptyObject(SNMOptions.Shortcuts)) {
		   l_return +="<tr class=\"tr_bg\"><td>Shortcut Label</td><td>Type</td><td>Condition</td><td>Example (type in)</td></tr>";
		for(var i=0; i<SNMOptions.Shortcuts.length; i++) {
			l_return +="<tr><td><strong>"+SNMOptions.Shortcuts[i].name+"</strong></td><td>"+SNMOptions.Shortcuts[i].action+"</td>";
			l_return +="<td>";
			if (SNMOptions.Shortcuts[i].action.toLowerCase()=="ir") {
				if (SNMOptions.Shortcuts[i].IR_type.toLowerCase()=="column") {
					if ("IR_column" in SNMOptions.Shortcuts[i])
						l_return +="column "+SNMOptions.Shortcuts[i].IR_column.toUpperCase()+" ";
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
				l_return +="<td>"+SNMOptions.Shortcuts[i].example+"</td>";
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
		var elmVal = $(elm).val(), save_ss = false;
		 $(".a-TreeView-label strong").replaceWith(function() { return $(this).html(); }); 
		 if (elmVal != "") {
			 $('li[id^="t_TreeNav"]').each(function() {
			   if ($(this).find(".a-TreeView-label").text().toLowerCase().indexOf(elmVal.toLowerCase())!= -1 ) {
				   if ($(this).hasClass("is-expandable"))
					   $(this).find("ul").css("display", "block");
				   $(this).find(".a-TreeView-label").each(function(){
					   $(this).html(colorSearchNav($(this).text(),elmVal)); 
				   });
				   $(this).css("display", "block"); 
			   }
			   else
				 $(this).css("display", "none");
			  });
		}
		else {
		   $('li[id^="t_TreeNav"]').each(function() {
			  if ($(this).hasClass("is-expandable"))
					  $(this).find("ul").css("display", "none");
			  $(this).css("display", "block");
		   });
		}        
		if (!pageEvent)
			saveSesSateNav(elmVal); 
		hoverSearchNav();
		$f_First_field();
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
               apex.theme42.toggleWidgets.expandWidget("nav");
	else {
		if (!isNavTreeOpen())
			hideAllSublistsSearchNav();
	}
}

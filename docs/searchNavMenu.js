/*! searchNavMenu.js v1.2 | ABAKUS PLUS d.o.o. | Andrej Grlica | andrej.grlica@abakus.si */
/* ==========================================================================
   Description
	Script is used for Searching Navigation Menu in Oracle Application Express
   -------------------------------------------------------------------------------
   Parametrs : 
     item_id : item id from apex
     menuOpen : (is menu on load open) true/false
	 elm : object
	 e: event
	 ajaxIdentifier: name of ajax call function
	 l_skey : character keypress focus on search
*/ 

var SrchNavMenuClosed = false;

function LoadSearchNavSubmenu(item_id, menuOpen) {
	if (!isNavTreeOpen())
		SrchNavMenuClosed=true;
    openAllNavSubmenus();
	$('li[id^="t_TreeNav"].is-collapsible').find('span.a-TreeView-toggle').click(); 
	//Because all list were open and last one closed we need to open current list
	setCurrentNav(item_id);
	if (menuOpen)
		showAllSublistsSearchNav();
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
	if (SrchNavMenuClosed)
		$('#t_Button_navControl').click();
    else
		showHideSearchBar(item_id);
}

function isNavTreeOpen() {
	if (apex.theme42.toggleWidgets.isExpanded("nav") == null) {
		return $('body').hasClass('js-navExpanded');		
	} 
	else
		return apex.theme42.toggleWidgets.isExpanded("nav");
}

function saveSesSateNav(ajaxIdentifier, newVal) {
	apex.server.plugin( ajaxIdentifier, {
    x01: newVal
    }, {dataType:"text", 
       success: function( pData ) {
         apex.debug.info("Saved session state."); 
       },
       error: function( pData ) {
         apex.debug.error("Save session state for Search Navigation failed :"+JSON.stringify(pData) ); 
       }	   
    }); 
}

	   
function showHideSearchBar(item_id) {
  if (isNavTreeOpen()) {
    $('input.srch_input').trigger("keyup", [true]);
  }
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
    var obj = $('li[id^="t_TreeNav_"] div.is-hover');
    var newObj, flg; //flg for flag next objext
    
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

function redirectSearchNav() {
    var rdr = $('li[id^="t_TreeNav_"][style*="display: block"] div.is-hover a.a-TreeView-label').attr("href");
    if (rdr)
        window.location.href = rdr;
}

/*  EVENTS........ */

function keyDownSearchNav(e) {
	 switch (e.which) {
		   case 13:
			   redirectSearchNav();
			   e.preventDefault();
			  break;
		   case 40:
			  stepNextSearchNav(false);  
			  e.preventDefault();
			  break;
		   case 38:
			  stepNextSearchNav(true);
			   e.preventDefault();            
		   }
}

//elm= input, e=event, ajaxIdentifier=name of ajaxProcedure, save_ss parameter on/off, paegeEvent=keyup of hide/show
function keyUpSearchNav(elm, e, ajaxIdentifier, save_ss, pageEvent) {
	switch (e.which) {
	   case 13:
	   case 17:
	   case 40:
	   case 38:
		   e.preventDefault();
		   break;
	   default: 
		 var elmVal = $(elm).val();
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
		if (save_ss && !pageEvent)
			saveSesSateNav(ajaxIdentifier,elmVal); 
		hoverSearchNav();
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
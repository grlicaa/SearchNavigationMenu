# SearchNavigationMenu (SNM)

## Demo
A demo application is available on apex.oracle.com<br/>
https://apex.oracle.com/pls/apex/f?p=111583

## Preview
![](https://raw.githubusercontent.com/grlicaa/SearchNavigationMenu/master/docs/Preview.gif)
![](https://raw.githubusercontent.com/grlicaa/SearchNavigationMenu/master/docs/Preview2.gif)

## Change log
V 2.1.
<ul>
<li>Fixed FocusOnLoad problem <a href="https://github.com/grlicaa/SearchNavigationMenu/issues/3" target="_blank">#3</a>.</li>  
<li>Fixed sub menus problem (Hide/Show child) <a href="https://github.com/grlicaa/SearchNavigationMenu/issues/7" target="_blank">#7</a>.</li>  
<li>Fixed bug on IE ".startsWidth" <a href="https://github.com/grlicaa/SearchNavigationMenu/issues/4" target="_blank">#4</a>.</li>
<li>On IE now users can use clear text input property.</li>
</ul>
For upgrading to new version of SNM 2.1, please add next two following lines to your "Options"<br>
<pre>
 "OnSearchShowChildren":true,
 "UseFocus":true,
</pre> 

V 2.0.
<ul>
<li>Added "Shortcuts": URL based search</li>  
<li>Added help for "Shortcuts" (F1 whilst Search Box is active).</li>  
<li>Added functions to manipulate shortcuts.</li>
<li>Options moved to JSON structure.</li>
<li>Added Style section in Options (optional).</li>
<li>Added further documentation</li>  
</ul>
V 1.4.
<ul>
<li>Re-created Plugin for APEX 5.0</li>
<li>Changed CSS to Font Awesome<br/>
If you use Font APEX define icon CSS "fa-search" for Font Awesome "fa-search font_awesome"</li>
</ul>
V 1.3.
<ul>
<li>Added new function JS regarding 'isExpanded("nav")' error for apex 5.1.1</li>
</ul>
V 1.2.
<ul>
<li>CSS added body action and not JS changing "display"</li>
<li>On resize if tree is collapsed then close all opened sub lists</li>
</ul>
V 1.1.
<ul>
<li>Resolved Bug 25592396 Item Type plug-in uses render function name for Ajax call Apex 5.1.0</li>
<li>Resolved problem on smartphones when window resize navigation menu is closed.</li>
<li>Added new attribute "Navigation menu open". </li>
</ul>

## Install

### New install
<ol>
<li>Import plug-in "item_type_plugin_si_abakus_searchnavigationmenu.sql" into your application.</li>
<li>Add region on global page.
(Region must be on page but you can hide it with style="display:none;" in "Custom Attributes")
(Recommend to also set the condition of this region to not display on your Login Page</li>
<li>Add SearchNavigationMenu [Plug-in] item to the region.
![](https://raw.githubusercontent.com/grlicaa/SearchNavigationMenu/master/docs/hide_region.png)
</li>
<li>Decide options and style of the item (or leave default values).
![](https://raw.githubusercontent.com/grlicaa/SearchNavigationMenu/master/docs/Settings.menu.png)
</li>
<li>Save changes. Search Navigation Menu is now ready to use.</li>
<li>Please leave some feedback. Thanks!</li>
</ol>

### Replace existing plug-in
Because you are replacing the plug-in, the default options are inherited from the previous installation of the plug-in.<br>
Please set new Options and Styles for the item. You can use examples in help section.



## Functionality

### Implemented
<ul>
<li>Search is not case sensitive.</li>
<li>Search works on sub lists also.</li>
<li>Search adds style option for color, background and weight(user choice) on first match in String.</li>
<li>Added functionality to SNM without target.</li>
<li>"CTRL+S" is the default keybind to focus on SNM.</li>
<li>"Enter" in SNM redirects to selected navigation item.</li>
<li>Keys UP and DOWN can be used during searching to select different nav items.</li>
<strong>New in V2.0: </strong>
<li>Added shortcuts</li>
<li>When focused on the Search Box, pressing F1 will open the help page.</li>
</ul>

### Recommended Functions:
```javascript
    setSNMShortcuts(p_shortcuts_array);   // Add multiple new shortcuts to the array.
    appendSNMShortcut(p_shortcut_object); // Add one shortcut to the array.
    openModalSNMHelp();                   // Open help menu, same as F1.
```

### Tested On (so far):

#### Browsers
<ul>
<li>FireFox 54.0.1, 56.0.2</li>
<li>Chrome 59.0.3071.115, 60.0.3112.90</li>
<li>Microsoft Edge 38.14393.1066.0, 40.15063.0.0</li>
</ul>

#### Oracle APEX Versions
<ul>
<li>Application Express 5.0</li>
<li>Application Express 5.1</li>
</ul>

## Documentation

### Option Settings
#### Default Settings
<pre>
{
 "menuOpen": false,   
 "MmenuClickOpenClose": true,
 "saveSS": true,
 "shortcutSaveSS": false,
 "shortcutCaseSensitive": true,
 "OnSearchShowChildren":true,
 "UseFocus":true,
 "shortcuts": []
}
</pre>
##### MenuOpen:
MMenu fully expanded on-load (Not Recommended)<br>
##### MenuClickOpenClose:
Default APEX behavior on navigation menu click is to open target page. This is a problem when the item doesn't have a target.<br>
In that case, if you want to open a sub-menu you need to click on the "arrow down". <br>
With this option set to true, when a user clicks on a "no target" nav item (title, icon or arrow) it instead opens the sub-menu.
##### SaveSS :
SaveSS stands for "Save Session State of item".<br>
##### ShortcutSaveSS :
ShortcutSaveSS stands for "Save Session State of item when using a Shortcut".<br>
##### ShortcutCaseSensitive :
Shortcut can be made case-sensitive. Caution: This will only affect the shortcut, not the search string.

#### Shortcuts:
For more information on shortcut settings, you can use <a href="https://apex.oracle.com/pls/apex/f?p=111583:400" target="_blank">SNM Shortcut Modeller</a>.
##### Default Settings
<pre>
{  
  "name": "emp",
  "action": "page",
  "page_id": 300,
  "newWindow": false,
  "clearCache": true,
  "clearCacheList": "300,301,RIR",
  "example": "emp"
}
</pre>
###### Name:
Name of shortcut. This is used for SNM to find the object.<br>
This is useful if you want users to be able to search in specific items. See the example below:
<pre>person:Andrej</pre>
This means: Find shortcut "person", if object is IR or ITEM add search parameter value "Andrej".
URL of Page Objects don't take parameters, only shortcuts.
###### Action :
Depending on this setting engine decide what to do with shortcut. We have four basic actions types PAGE, IR, URL and ITEM.<br>
Every type have his own properties and all of them have "Common settings".
###### page_id :
Page ID is the value for the page you want the shortcut to focus on. If this option is null, SNM will search the active page.
###### newWindow :
This will open the search results in a New Window if set to true. The default is set to "false".<br>
###### clearCache and clearCacheList :
This setting will include "ClearCache" into the search URL if set to true.<br>
If clearCache option in set to "true" the link is added to the clearCacheList. If the clearCacheList doesn't exist then page_id is placed in the clearCache zone.
###### Example :
Here we can create an example for the Help Menu.<br>
User can see this example by pressing F1 whilst Search Box is active.
###### PAGE:
<pre>
{ 
  "name": "emp",
  "action": "page",
  "page_id": 300,
  "newWindow": true,
  "clearCache": true,
  "clearCacheList": "RIR,300",
  "example":"emp"
}</pre>
Setting for Page Objects are like default settings. We can define which page to redirect to.<br>
Options are: Clear cache, open in new window and example (Help Menu).
###### IR:
<pre>
{ 
  "name": "person",
  "action": "IR",
  "IR_static_id": "EMP",
  "IR_type": "column",
  "IR_column": "ENAME",
  "IR_value": "KING",
  "IR_operator": "C",
  "IR_clearCache": "RIR",
  "page_id": 300,
  "example": "person:andrej"
}</pre>
<b>IR_static_id:</b> Static ID for IR, required if there are multiple IRs on the page.<br>
<b>IR_type:</b> Row or Column (default is Row).<br>
<b>IR_column:</b> Define the column name (or null)<br>
<b>IR_value:</b> If this parameter isn't defined then this is the default value, or it can be used for the shortcut.<br>
<b>IR_operator:</b> Operators: C, EQ, etc. See link below for more operators.<br>
<b>IR_clearCache:</b> CIR or RIR.<br>
For more information on IR Linking: https://docs.oracle.com/database/apex-5.1/HTMDB/linking-to-interactive-reports.htm#HTMDB30108
###### URL :
<pre>
{ 
  "name": "google",
  "action": "url",
  "url": "http://google.com",
  "newWindow": true
}</pre>
###### ITEM :
<pre>
{
  "name": "EMPNO",
  "action": "item",
  "item_name": "P300_ACTIVE",
  "item_value": "Y",
  "page_id": 300,
  "clearCache": true
}</pre>

### Style settings
For more information on style settings you can use <a href="https://apex.oracle.com/pls/apex/f?p=111583:500" target="_blank">SNM Style Modeller</a>.
<pre>
/* ** Style Settings for SNM (including icons) */

/* FIX: If you use Font Awesome, enable to this fix Search Icon */
/*
.srch_nav span {
   top: 2px;
}
*/
/* FIX: If you use Font Awesome disable this .t-TreeNav */

.t-TreeNav .a-TreeView-node--topLevel ul .a-TreeView-content .fa {
   vertical-align: top;
   width: 32px;
   height: 32px;
   line-height: 32px;
   text-align: center;
   transition: width .2s ease;
}

/* Search Result Style */
.a-TreeView-label strong {
    font-weight: bold;
    color: black;
    background-color: #ffef9a;
}
/* Search Box Field Style */
.srch_nav input {
    color: black;
    background-color: #f1f6fa;
    border-color: #ededed;
}
/* Search Box Margin when clicked */
.srch_nav input:focus {
    border-color: #ff7052;
}
</pre>

## About me
Andrej Grlica<br/>
Company The Righr Thing Solutions<br/>
I have been an Oracle APEX Developer since 2008<br/>
When I'm not focusing on a code problem, you can find me on:<br/>
Work Email : [andrej.grlica@right-thing.solutions](mailto:andrej.grlica@right-thing.solutions)<br/>
Private Email : [andrej.grlica@gmail.com](mailto:andrej.grlica@gmail.com)<br/>
LinkedIn: [Link](https://www.linkedin.com/in/andrej-grlica-303998a4/)<br/>
Slack (#orclapex) PM:[@grlicaa](https://orclapex.slack.com/messages/@grlicaa/)

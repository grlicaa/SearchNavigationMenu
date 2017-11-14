# SearchNavigationMenu

## Demo
A demo application is available on apex.oracle.com<br/>
https://apex.oracle.com/pls/apex/f?p=111583

## Preview
![](https://raw.githubusercontent.com/grlicaa/SearchNavigationMenu/master/docs/Preview.gif)
![](https://raw.githubusercontent.com/grlicaa/SearchNavigationMenu/master/docs/Preview2.gif)

## Change log
V 2.0.
<ul>
<li>Added "Shortcuts" URL based search</li>  
<li>Added help for "Shortcuts" (press F1 while focused on item).</li>  
<li>Added functions "" to manipulate with shortcuts.</li>
<li>Added Style section in options so you can move style inside theme (optional).</li>
<li>Options moved to JSON structure.</li>
<li>Added Style section in options so you can move style inside theme (optional).</li>
<li>Added documentation and help inside every option.</li>  
</ul>
V 1.4.
<ul>
<li>Re-crated Plugin for APEX 5.0</li>
<li>Changed CSS for Font Awesome <br/>
If you use font apex define icon CCS "fa-search" for font awesome "fa-search font_awesome"</li>
</ul>
V 1.3.
<ul>
<li>Added new function JS regarding to 'isExpanded("nav")' error for apex 5.1.1</li>
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
(Region must be on page but you can hide it with style="display:none;" in "Custom Attributes")</li>
<li>Add SearchNavigationMenu [Plug-in] item to the region.

![](https://raw.githubusercontent.com/grlicaa/SearchNavigationMenu/master/docs/hide_region.png)
</li>
<li>Decide options and style of the item (or leave default values).

![](https://raw.githubusercontent.com/grlicaa/SearchNavigationMenu/master/docs/Settings.menu.png)
</li>
<li>Save changes. Search Navigation Menu is now ready to use.</li>
<li>Please leave same feedback. Thanks</li>
</ol>

### Replace existing plug-in
Because replacing, default options are inherited from privies version of plug-in.<br>
Please, set new Options and Styles for item. You can use examples in help section.



## Functionality

### Implemented
<ul>
<li>Search is not case sensitive</li>
<li>Search works on sub lists also</li>
<li>Search adds style option color,background and weight(user choice) on first match in String</li>
<li>Added functionality to navigation menu without target</li>
<li>"Control+s" focus on search navigation</li>
<li>"Enter" in search navigation redirect on selected link</li>
<li>Keys up and down in search navigation move searched text link</li>
<strong>New 2.0 version: </strong>
<li>Added shortcuts</li>
<li>While focused on search box (F1 key) opens search navigation help</li>
</ul>

### Recomemded functions
```javascript
    setSNMShortcuts(p_shortcuts_array);   //Add new set of shortcuts
    appendSNMShortcut(p_shortcut_object); // Add one shortcut on shortcuts array
    openModalSNMHelp();                   //open help same as pressing F1 key
```

### Tested on (so far):

#### Browsers
<ul>
<li>FireFox 54.0.1, 56.0.2</li>
<li>Crome 59.0.3071.115, 60.0.3112.90</li>
<li>Microsoft Edge 38.14393.1066.0, 40.15063.0.0</li>
</ul>

#### Apex Versions
<ul>
<li>Application Express 5.0</li>
<li>Application Express 5.1</li>
</ul>

## Documentation

### Option settings
#### Main settings
<pre>
{"MenuOpen":false,   
 "MenuClickOpenClose":true,
 "SaveSS":true,
 "ShortcutSaveSS":false,
 "ShrtCaseSensitive":true,
 "Shortcuts" : []
}
</pre>
##### MenuOpen :
Menu fully opened on load (not recommended)<br>
##### MenuClickOpenClose :
Default APEX behavior on navigation menu click is to open target page. Problem becomes when link don't have target. <br>
In that case if you want to open sub-menu you need to click on "arrow down". <br>
With this option enabled (set to "Yes") when user click on "no target" in navigation menu (title, icon or arrow) it opens sub-menu.
##### SaveSS :
SaveSS stands for Save Session State of item.<br>
##### ShortcutSaveSS :
ShortcutSaveSS stands for Save Session State of item when shortcut has occurred.<br>
User usually need only to open quick setting with shortcut and than empty search field.
##### ShrtCaseSensitive :
Shortcut can be case sensitive. Be aware this is setting only for shortcut name and not searching value.

#### Shortcuts :
For more information on shortcut settings you can use <a href="https://apex.oracle.com/pls/apex/f?p=111583:400" target="_blank">SNM Shortcut modeler</a>.
##### Common settings
<pre>
{  "name": "emp",
  "action": "page",
  "page_id": 300,
  "newWindow": false,
  "clearCache": true,
  "clearCacheList": "300,301,RIR",
  "example": "emp"
}</pre>
###### name :
Name of shortcut. This is used for search engine to find action.<br>
If user need to add parameter for IR or ITEM type shortcut search it can be done like below example.
<pre>person:Andrej</pre>
This means find shortcut "person" if action is IR or ITEM add search parameter value "Andrej".
URL od PAGE action type don't take parameters only shortcuts.
###### page_id :
Page id is setting on what page we need search or redirect. If this option is null, engine takes current page.
###### newWindow :
This option means if we need to open search result in new window than we set this option to "true".<br>
By default this option in "false".
###### clearCache and clearCacheList :
Depending of clearCache setting we add clear cache in search URL.<br>
If clearCache option in set to "true" we put in link clearCacheList. If clearCacheList don't exists than we put page_id into clearCache zone.
###### example :
Here we can put example for user to demonstrate purpose of shortcut.<br>
User can see this example by pressing F1 key on search box.
###### action :
Depending on this setting engine decide what to do with shortcut. We have four basic actions types PAGE, IR, URL and ITEM.<br>
Every type have his own properties and all of them have "Common settings".
###### PAGE :
<pre>
{ "name": "emp",
  "action": "page",
  "page_id": 300,
  "newWindow": true,
  "clearCache": true,
  "clearCacheList": "RIR,300",
  "example":"emp"
}</pre>
Setting for PAGE actions are like common settings. We can define which page to redirect.<br>
Options are clear cache, open in new window and example for user.
###### IR :
<pre>
{ "name": "person",
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
<b>IR_static_id</b> if you have more than one IR on page.<br>
<b>IR_type</b> row or column (if empty default is row).<br>
<b>IR_column</b> if column define column.<br>
<b>IR_value</b> if we don't add parameter than this is default value or it can be used for shortcut.<br>
<b>IR_operator</b> C, EQ..<br>
<b>IR_clearCache</b> CIR or RIR.<br>
More about IR Linking on : https://docs.oracle.com/database/apex-5.1/HTMDB/linking-to-interactive-reports.htm#HTMDB30108
###### URL :
<pre>
{ "name": "google",
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
For more information on style settings you can use <a href="https://apex.oracle.com/pls/apex/f?p=111583:500" target="_blank">SNM Style modeler</a>.
<pre>
/*
** STYLE Settings for search navigation menu and menu icons
*/
/* FIX If you use FONT awesome enable this .srch_nav span */
/*
.srch_nav span {
   top:2px;
}
*/
/* FIX If you use FONT awesome disable  this .t-TreeNav */
.t-TreeNav .a-TreeView-node--topLevel ul .a-TreeView-content .fa {
   vertical-align: top;
   width: 32px; /* This can be decrease to have smaller spacing */
   height: 32px;
   line-height: 32px;
   text-align: center;
   transition: width .2s ease;
}
/* Search resault setting */
.a-TreeView-label strong {
    font-weight:bold;
    color:black;
    background-color:#ffef9a;
}
/* Input field style setting */
.srch_nav input {
    color:black;
    background-color:#f1f6fa;
    border-color:#ededed;
}
/* Input field on hover setting */
.srch_nav input:focus {
    border-color:#ff7052;
}
</pre>

## About me
Andrej Grlica<br/>
Company [Abakus Plus d.o.o.](http://abakus.si/en/home)<br/>
I’m a oracle apex developer since 2008.<br/>
When I’m not into code problem, you can find me on:<br/>
Work email : [andrej.grlica@abakus.si](mailto:andrej.grlica@abakus.si)<br/>
Private email : [andrej.grlica@gmail.com](mailto:andrej.grlica@gmail.com)<br/>
Twitter : [@AndrejGrlica](https://twitter.com/AndrejGrlica)<br/>
Linked-in : [Link](https://www.linkedin.com/in/andrej-grlica-303998a4/)<br/>
Slack (#orclapex) PM:[@grlicaa](https://orclapex.slack.com/messages/@grlicaa/)
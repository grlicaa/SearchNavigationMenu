# SearchNavigationMenu (SNM)

Oracle APEX item plug-in that adds a search box to the Universal Theme navigation menu: type to filter the menu,
use shortcuts to jump to pages, Interactive Report filters, items or URLs.

## Demo
A demo application is available on oracleapex.com<br/>
https://oracleapex.com/ords/f?p=111583

## Preview
![](https://raw.githubusercontent.com/grlicaa/SearchNavigationMenu/master/docs/Preview.gif)
![](https://raw.githubusercontent.com/grlicaa/SearchNavigationMenu/master/docs/Preview2.gif)

## Which version do I need?

| Your Oracle APEX version | Plug-in version | Plug-in file | Demo app |
|---|---|---|---|
| **24.2 and later** | **3.0** (current) | [`plug-in/item_type_plugin_si_abakus_searchnavigationmenu.sql`](plug-in/item_type_plugin_si_abakus_searchnavigationmenu.sql) | [`src/sample_app/f111583.sql`](src/sample_app/f111583.sql) |
| 5.0 – 24.2 (legacy) | 2.2 (last legacy release, no further changes) | [`plug-in/legacy/item_type_plugin_si_abakus_searchnavigationmenu_2.2.sql`](plug-in/legacy/item_type_plugin_si_abakus_searchnavigationmenu_2.2.sql) | [`src/sample_app/legacy/`](src/sample_app/legacy/) |

On APEX 24.2 both versions work; use 3.0.
Version 2.1 and older no longer work on current APEX (they call `$f_First_field` and `apex.theme42.toggleWidgets.expandWidget`, which APEX removed), so please update to 2.2 or 3.0.

The plug-in's internal name stays `SI.ABAKUS.SEARCHNAVIGATIONMENU` in every version, so a new version simply replaces the old one.

## Change log

### V 3.0 (Oracle APEX 24.2 and later)
<ul>
<li>Requires Oracle APEX 24.2 or later; exported from APEX 24.2.</li>
<li>Session state is saved 300 ms after the last key instead of on every key, and saves are sent one after another, so fast typing or pasting can no longer save an older text over the newer one. Enter, leaving the box and clearing it save at once.</li>
<li><code>appendSNMShortcut</code> works again (it pushed an undefined variable) and checks that the shortcut has a <code>name</code> and an <code>action</code>.</li>
<li>Options are merged into the defaults (options you leave out keep their default value), and option names are no longer case sensitive. The spellings older README versions used (<code>menuOpen</code>, <code>saveSS</code>, <code>MmenuClickOpenClose</code>, <code>shortcutCaseSensitive</code>, <code>shortcuts</code>, ...) work as well.</li>
<li>Menu labels, shortcut help texts, the placeholder and the session value are escaped, so special characters can no longer break the page.</li>
<li>The plug-in no longer forces <code>display: grid</code> on menu entries; it leaves the theme's own layout (<a href="https://github.com/grlicaa/SearchNavigationMenu/issues/9" target="_blank">#9</a>).</li>
<li>Removed old Internet Explorer handling (<a href="https://github.com/grlicaa/SearchNavigationMenu/issues/8" target="_blank">#8</a>) and old APEX 5.x code paths; uses <code>apex.env</code> instead of <code>$v("pFlowId")</code>.</li>
<li>The default "Style" no longer contains the old Font Awesome icon fixes; Universal Theme 24.2 does not need them.</li>
<li>The plug-in ships only minified files: <code>searchNavMenu.min.js</code> and <code>searchNavMenu.min.css</code> (sources in <code>docs/</code>).</li>
<li>PL/SQL: values passed with <code>apex_javascript.add_attribute</code>, no <code>commit</code> in the AJAX call; the AJAX function is now <code>ajax</code>. Source in <code>src/plugin/plugin_code.plsql</code>.</li>
<li>New demo application for APEX 24.2.</li>
</ul>

**Upgrading from 2.x to 3.0:** import the 3.0 plug-in file into your application and choose to replace the existing plug-in. Your items keep their settings.
If your item's "Style" still contains the block that starts with `/* FIX If you use FONT awesome disable this .t-TreeNav */`, you can delete that block.

### V 2.2 (legacy line, Oracle APEX 5.0 – 24.2)
<ul>
<li>Removed the call to <code>$f_First_field</code>, which no longer exists in current APEX <a href="https://github.com/grlicaa/SearchNavigationMenu/issues/10" target="_blank">#10</a>, <a href="https://github.com/grlicaa/SearchNavigationMenu/issues/14" target="_blank">#14</a>.</li>
<li>Replaced the removed <code>apex.theme42.toggleWidgets.expandWidget</code> call <a href="https://github.com/grlicaa/SearchNavigationMenu/issues/11" target="_blank">#11</a>.</li>
<li>Packages the <code>searchNavMenu.js</code> / <code>.css</code> 2.2 files (published in <code>docs/</code> in Dec 2021, never packaged before).</li>
</ul>
Upgrading from 2.1 needs no option changes.

### V 2.1
<ul>
<li>Fixed FocusOnLoad problem <a href="https://github.com/grlicaa/SearchNavigationMenu/issues/3" target="_blank">#3</a>.</li>
<li>Fixed sub menus problem (Hide/Show child) <a href="https://github.com/grlicaa/SearchNavigationMenu/issues/7" target="_blank">#7</a>.</li>
<li>Fixed bug on IE ".startsWidth" <a href="https://github.com/grlicaa/SearchNavigationMenu/issues/4" target="_blank">#4</a>.</li>
<li>On IE now users can use clear text input property.</li>
</ul>
For upgrading to SNM 2.1, please add the following two lines to your "Options"<br>
<pre>
 "OnSearchShowChildren":true,
 "UseFocus":true,
</pre>

### V 2.0
<ul>
<li>Added "Shortcuts": URL based search</li>
<li>Added help for "Shortcuts" (F1 whilst Search Box is active).</li>
<li>Added functions to manipulate shortcuts.</li>
<li>Options moved to JSON structure.</li>
<li>Added Style section in Options (optional).</li>
<li>Added further documentation</li>
</ul>

### V 1.4
<ul>
<li>Re-created Plugin for APEX 5.0</li>
<li>Changed CSS to Font Awesome<br/>
If you use Font APEX define icon CSS "fa-search" for Font Awesome "fa-search font_awesome"</li>
</ul>

### V 1.3
<ul>
<li>Added new function JS regarding 'isExpanded("nav")' error for apex 5.1.1</li>
</ul>

### V 1.2
<ul>
<li>CSS added body action and not JS changing "display"</li>
<li>On resize if tree is collapsed then close all opened sub lists</li>
</ul>

### V 1.1
<ul>
<li>Resolved Bug 25592396 Item Type plug-in uses render function name for Ajax call Apex 5.1.0</li>
<li>Resolved problem on smartphones when window resize navigation menu is closed.</li>
<li>Added new attribute "Navigation menu open". </li>
</ul>

## Install

### New install
<ol>
<li>Import the plug-in file for your APEX version (see <a href="#which-version-do-i-need">Which version do I need?</a>) into your application.</li>
<li>Add a region on the global page (page 0).
(The region must be on the page, but you can hide it with style="display:none;" in "Custom Attributes".)
We recommend a condition so that the region is not shown on your login page.<br/>
<img src="https://raw.githubusercontent.com/grlicaa/SearchNavigationMenu/master/docs/hide_region.png" />
</li>
<li>Add a SearchNavigationMenu [Plug-in] item to the region.</li>
<li>Decide the options and the style of the item (or leave the default values).<br/>
<img src="https://raw.githubusercontent.com/grlicaa/SearchNavigationMenu/master/docs/menu.png" />
</li>
<li>Save changes. Search Navigation Menu is now ready to use.</li>
<li>Please leave some feedback. Thanks!</li>
</ol>

### Replace existing plug-in
Import the new plug-in file and choose to replace the existing plug-in. Items keep their Options and Style.

## Functionality
<ul>
<li>Search is not case sensitive.</li>
<li>Search works on sub lists also.</li>
<li>Search highlights the first match in each label (color, background and weight are set in "Style").</li>
<li>Navigation entries without a target open their sub-menu on click (option <code>MenuClickOpenClose</code>).</li>
<li>"CTRL+S" is the default key to focus on the search box (attribute "Ctrl+").</li>
<li>"Enter" in the search box opens the selected navigation entry, or runs a shortcut.</li>
<li>Keys UP and DOWN select the previous / next matching entry.</li>
<li>Shortcuts: page, Interactive Report filter, item and URL shortcuts, with values (e.g. <code>job:MANAGER</code>, values may contain spaces).</li>
<li>F1 in the search box opens the help with all shortcuts.</li>
</ul>

### JavaScript API
```javascript
    setSNMShortcuts(p_shortcuts_array);   // Replace all shortcuts.
    appendSNMShortcut(p_shortcut_object); // Add one shortcut (needs "name" and "action"); returns true when added.
    openModalSNMHelp();                   // Open the help, same as F1.
```

## Tested on
Tested automatically (Playwright, Chromium) against the demo application:
<ul>
<li>3.0: Oracle APEX 24.2</li>
<li>2.2: Oracle APEX 24.2</li>
</ul>

## Documentation

### Option Settings
#### Default Settings
<pre>
{
 "MenuOpen": false,
 "MenuClickOpenClose": true,
 "SaveSS": true,
 "ShortcutSaveSS": false,
 "ShrtCaseSensitive": true,
 "OnSearchShowChildren": true,
 "UseFocus": true,
 "Shortcuts": []
}
</pre>
In 3.0 option names are not case sensitive and options you leave out keep these defaults.

##### MenuOpen
Menu fully expanded on load (not recommended).
##### MenuClickOpenClose
Default APEX behavior on navigation menu click is to open the target page. This is a problem when the entry doesn't have a target.<br>
In that case, if you want to open a sub-menu you need to click on the "arrow down".<br>
With this option set to true, when a user clicks on a "no target" nav entry (title, icon or arrow) it opens the sub-menu instead.
##### SaveSS
Save the search text in the session state of the item, so it is back in the search box on the next page.
##### ShortcutSaveSS
Save the search text in session state also when a shortcut runs (by default the box is emptied).
##### ShrtCaseSensitive
Shortcut names are case sensitive. This only affects shortcut names, not the menu search.
##### OnSearchShowChildren
While searching, also show the entries below a matching entry.
##### UseFocus
Keep the focus where it was when the page loads.

#### Shortcuts
For more information on shortcut settings, you can use the <a href="https://oracleapex.com/ords/f?p=111583:400" target="_blank">SNM Shortcut Modeller</a>.
##### Common Settings
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
###### name
Name of the shortcut. This is used by SNM to find the shortcut.<br>
For IR and ITEM shortcuts users can add a value after the name:
<pre>person:Andrej</pre>
This means: find shortcut "person" and, as it is an IR or ITEM shortcut, use the value "Andrej".
PAGE and URL shortcuts don't take values.
###### action
What the shortcut does: PAGE, IR, URL or ITEM.<br>
Every type has its own properties, and all of them have the common settings.
###### page_id
The page the shortcut opens. If it is null, SNM uses the current page.
###### newWindow
Open the result in a new window when true. The default is false.
###### clearCache and clearCacheList
When clearCache is true, the URL clears the cache of clearCacheList. If there is no clearCacheList, page_id is used.
###### example
An example for the help (F1).
##### PAGE
<pre>
{
  "name": "emp",
  "action": "page",
  "page_id": 300,
  "newWindow": true,
  "clearCache": true,
  "clearCacheList": "RIR,300",
  "example": "emp"
}</pre>
##### IR
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
<b>IR_static_id:</b> Static ID of the Interactive Report, required if there are several on the page.<br>
<b>IR_type:</b> row or column (default is row).<br>
<b>IR_column:</b> the column name (for IR_type column).<br>
<b>IR_value:</b> the value used when the user types no value.<br>
<b>IR_operator:</b> C, EQ, GTE, ... (see the link below for all operators).<br>
<b>IR_clearCache:</b> CIR or RIR.<br>
More about linking to Interactive Reports: https://docs.oracle.com/en/database/oracle/apex/24.2/htmdb/linking-to-interactive-reports.html
##### URL
<pre>
{
  "name": "google",
  "action": "url",
  "url": "http://google.com",
  "newWindow": true
}</pre>
##### ITEM
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
For more information on style settings you can use the <a href="https://oracleapex.com/ords/f?p=111583:500" target="_blank">SNM Style Modeller</a>.
Default style of a new item in 3.0:
<pre>
/*
** STYLE Settings for search navigation menu and menu icons
*/
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

## Building the plug-in files
The plug-in uses `docs/searchNavMenu.min.js` and `docs/searchNavMenu.min.css`, made from `docs/searchNavMenu.js` and `docs/searchNavMenu.css`:
```
npx terser docs/searchNavMenu.js --compress --mangle --comments "/^!/" -o docs/searchNavMenu.min.js
npx clean-css-cli -O1 -o docs/searchNavMenu.min.css docs/searchNavMenu.css
```

## About me
Andrej Grlica<br/>
Company The RIGHT THING Solutions<br/>
I have been an Oracle APEX Developer since 2008<br/>
When I'm not focusing on a code problem, you can find me on:<br/>
Work Email : [andrej.grlica@right-thing.solutions](mailto:andrej.grlica@right-thing.solutions)<br/>
Private Email : [andrej.grlica@gmail.com](mailto:andrej.grlica@gmail.com)<br/>
LinkedIn: [Link](https://www.linkedin.com/in/andrej-grlica-303998a4/)<br/>
Slack (#orclapex) PM:[@grlicaa](https://orclapex.slack.com/messages/@grlicaa/)

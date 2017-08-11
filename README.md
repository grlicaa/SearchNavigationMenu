# SearchNavigationMenu

## Demo
A demo application is available on apex.oracle.com<br/>
https://apex.oracle.com/pls/apex/f?p=SEARCHNAVIGATIONMENU

## Changelog
V 1.1. 
<ul>
<li>Resolved Bug 25592396 Item Type plug-in uses render function name for Ajax call Apex 5.1.0</li>
<li>Resolved problem on smartphones when windowresize navigation menu is closed.</li>
<li>Added new attribute "Navigation menu open". </li>
</ul>

## Preview
![](https://raw.githubusercontent.com/grlicaa/SearchNavigationMenu/master/docs/Preview.gif)

## Install
<ol>
<li>Import plug-in "item_type_plugin_si_abakus_searchnavigationmenu.sql" into your application.</li>
<li>Add region on global page.
(Region must be on page but you can hide it with style="display:none;" in "Custom Attributes")</li>
<li>Add SearchNavigationMenu [Plug-in] item to the region.</li>
<li>Decide behavior and style of the item (or leave default values).

![ ](https://raw.githubusercontent.com/grlicaa/SearchNavigationMenu/master/docs/Settings.png)
</li>
<li>Save changes. Search Navigation Menu is now ready to use.</li>
<li>Please leave same feedback. Thanks</li>
</ol>


## Functionality

### Implemented
<ul>
<li>Search is not case sensitive</li>
<li>Search works on sub lists also</li>
<li>Search adds color,background and weight(user choice) on first match in String</li>
<li>Added functionality to navigation menu witout target</li>
<li>"Control+s" focus on search navigation</li>
<li>"Enter" in search navigation redirect on selected link</li>
<li>Keys up and down in search navigation move searched text link</li>
</ul>

### Tested on (so far):

#### Browsers
<ul>
<li>FireFox 54.0.1</li>
<li>Crome 59.0.3071.115, 60.0.3112.90</li>
<li>Microsoft Edge 38.14393.1066.0, 40.15063.0.0</li>
</ul>

#### Apex Versions
<ul>
<li>Application Express 5.1.0</li>
<li>Application Express 5.1.2</li>
</ul>

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

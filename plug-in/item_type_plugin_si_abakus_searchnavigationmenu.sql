set define off verify off feedback off
whenever sqlerror exit sql.sqlcode rollback
--------------------------------------------------------------------------------
--
-- ORACLE Application Express (APEX) export file
--
-- You should run the script connected to SQL*Plus as the Oracle user
-- APEX_050100 or as the owner (parsing schema) of the application.
--
-- NOTE: Calls to apex_application_install override the defaults below.
--
--------------------------------------------------------------------------------
begin
wwv_flow_api.import_begin (
 p_version_yyyy_mm_dd=>'2016.08.24'
,p_release=>'5.1.2.00.09'
,p_default_workspace_id=>61716057417882438171
,p_default_application_id=>111583
,p_default_owner=>'ANDREJGR'
);
end;
/
prompt --application/ui_types
begin
null;
end;
/
prompt --application/shared_components/plugins/item_type/si_abakus_searchnavigationmenu
begin
wwv_flow_api.create_plugin(
 p_id=>wwv_flow_api.id(21719142165174129929)
,p_plugin_type=>'ITEM TYPE'
,p_name=>'SI.ABAKUS.SEARCHNAVIGATIONMENU'
,p_display_name=>'SearchNavigationMenu'
,p_supported_ui_types=>'DESKTOP'
,p_supported_component_types=>'APEX_APPLICATION_PAGE_ITEMS'
,p_javascript_file_urls=>'#PLUGIN_FILES#searchNavMenu.js'
,p_css_file_urls=>'#PLUGIN_FILES#searchNavMenu.css'
,p_plsql_code=>wwv_flow_string.join(wwv_flow_t_varchar2(
'-- GLOBAL',
'subtype gt_string is varchar2(32767);',
'',
'procedure render (',
'    p_item   in            apex_plugin.t_item,',
'    p_plugin in            apex_plugin.t_plugin,',
'    p_param  in            apex_plugin.t_item_render_param,',
'    p_result in out nocopy apex_plugin.t_item_render_result ) is',
'',
'  ',
'  --l_no_matches_msg           gt_string := p_plugin.attribute_01;  ',
'  ',
'  l_placeholder        gt_string := p_item.placeholder;',
'  l_item_id            gt_string := p_item.name;',
'  l_item_css           gt_string := p_item.element_css_classes;',
'',
'  l_css_icon           gt_string := p_item.attribute_02;',
'  l_icon_color         gt_string := p_item.attribute_08;',
'  ',
'  l_no_target_menu     gt_string := p_item.attribute_03;',
'  l_skey               gt_string := p_item.attribute_01;',
'  ',
'  l_sel_enabled        gt_string := p_item.attribute_04;',
'  l_sel_bold           gt_string := p_item.attribute_05;',
'  l_sel_color          gt_string := p_item.attribute_06;',
'  l_sel_bg_color       gt_string := p_item.attribute_07;',
'  ',
'  l_sb_enabled         gt_string := p_item.attribute_09;',
'  l_sb_color           gt_string := p_item.attribute_10;',
'  l_sb_bg_color        gt_string := p_item.attribute_11;',
'  l_sb_bor_color       gt_string := p_item.attribute_12;',
'  l_sb_bor_hover_color gt_string := p_item.attribute_13;',
'  ',
'  l_save_ss            gt_string := p_item.attribute_14;  ',
'  l_css_code      gt_string;',
'  l_onload_code   gt_string;',
'begin',
'    ',
'    ',
'    ----- Set CSS -----------',
'    if p_item.attribute_02 is not null and l_icon_color is not null then',
'       l_css_code := l_css_code||''.srch_nav span { color:''||l_icon_color||'';}'';',
'    end if;',
'    ',
'    if l_sel_enabled= ''Y'' then',
'        l_css_code := l_css_code||''.a-TreeView-label strong {'';',
'        if l_sel_bold = ''N'' then',
'            l_css_code := l_css_code||''font-weight:normal;'';',
'        end if;',
'        if l_sel_color is not null then',
'            l_css_code := l_css_code||''color:''||l_sel_color||'';'';',
'        end if;',
'        if l_sel_bg_color is not null then',
'            l_css_code := l_css_code||''background-color:''||l_sel_bg_color||'';'';',
'        end if;',
'        l_css_code := l_css_code||''}'';',
'    else',
'        l_css_code := l_css_code||''.a-TreeView-label strong {font-weight:normal;} '';',
'    end if;',
'    ',
'    if l_sb_enabled= ''Y'' then',
'        l_css_code := l_css_code||''.srch_nav input {'';',
'        if l_sb_color is not null then',
'            l_css_code := l_css_code||''color:''||l_sb_color||'';'';',
'        end if;',
'        if l_sb_bg_color is not null then',
'            l_css_code := l_css_code||''background-color:''||l_sb_bg_color||'';'';',
'        end if;   ',
'        if l_sb_bor_color is not null then',
'            l_css_code := l_css_code||''border-color:''||l_sb_bor_color||'';'';',
'        end if;        ',
'        l_css_code := l_css_code||''}'';',
'        ',
'        if l_sb_bor_hover_color is not null then',
'            l_css_code := l_css_code||''.srch_nav input:focus {border-color:''||l_sb_bor_hover_color||''}'';',
'        end if;',
'    end if;',
'    ',
'    if l_css_icon is null then ',
'        l_css_code := l_css_code||''.srch_nav input{padding: 3px 2px 3px 3px;}'';  ',
'    end if; ',
'    ',
'    ',
'    apex_css.add(l_css_code);',
'',
'',
'   --------- Set JS',
'    if l_no_target_menu = ''Y'' then',
'        l_onload_code:= l_onload_code||''$("#t_Body_nav #t_TreeNav").on("click", "ul li.a-TreeView-node div.a-TreeView-content:not(:has(a))", function(){',
'                                       $(this).prev("span.a-TreeView-toggle").click();});'';',
'    end if;',
'',
'    ----- Close / Open navigation menu',
'    l_onload_code:= l_onload_code||''$("#t_Button_navControl").on("click", function(){showHideSearchBar("''||l_item_id||''");});'';',
'    ',
'    --Add element on page',
'    l_onload_code:= l_onload_code||''$("#t_TreeNav").prepend("<div id=\"''||l_item_id||''\" class=\"srch_nav ''||l_item_css||''\">"+                       ',
'                        "<input class=\"srch_input\" type=\"text\" placeholder=\"''||l_placeholder||''\" value=\"\"/>"+'';',
'    if l_css_icon is not null then                        ',
'        l_onload_code:= l_onload_code||''"<span class=\"srch_icon\"><i class=\"fa ''||l_css_icon||''\"></i></span></div>");'';',
'    else',
'        l_onload_code:= l_onload_code||''"</div>");'';',
'    end if;',
'    ',
'     if l_save_ss = ''Y'' then',
'         -- Set value after so focus is at the end of string',
'        l_onload_code:= l_onload_code||''$("input.srch_input").val("''||APEX_UTIL.GET_SESSION_STATE(l_item_id)||''");'';',
'    end if;',
'    --Open an close all lists on page',
'    l_onload_code:= l_onload_code||''$(function() {LoadSearchNavSubmenu(''||l_item_id||'');});'';',
'',
'    ',
'    --Add event''s on item',
'    --------------------------------------------------------------------------------',
'    ',
'    ----- KeyDOWN',
'    l_onload_code:= l_onload_code||''$("input.srch_input").keydown(function(e) {',
'                                       keyDownSearchNav(e);',
'                                    });'';',
'    ----- KeyUP',
'    l_onload_code:= l_onload_code||''$("input.srch_input").keyup(function(e) {',
'                                       keyUpSearchNav($(this), e, "''|| apex_plugin.get_ajax_identifier ||''",''||CASE WHEN l_save_ss=''Y'' THEN ''true'' ELSE ''false'' END||'');',
'                                    });'';',
'',
'    ----- Click on input bar pervent default "Chrome problem"',
'    l_onload_code:= l_onload_code||''$("input.srch_input").on("click", function(e){e.preventDefault();return false;});'';',
'',
'    IF l_skey IS NOT NULL THEN',
'        ----- Focus combination Crt + *user selectet key defolt s',
'        l_onload_code:= l_onload_code||''$(document).on("keydown", function(e){',
'                                            shortCutSearchNav(e, "''||l_skey||''");',
'                                        });'';',
'   END IF;',
'    ',
'    ',
'   apex_javascript.add_onload_code(l_onload_code);',
'end;',
'',
'procedure AjaxSearchNav (',
'    p_item   in            apex_plugin.t_item,',
'    p_plugin in            apex_plugin.t_plugin,',
'    p_param  in            apex_plugin.t_item_ajax_param,',
'    p_result in out nocopy apex_plugin.t_item_ajax_result ) is',
'begin',
'    apex_util.set_session_state(p_item.name, apex_application.g_x01);',
'    htp.p(''OK'');',
'exception',
'    when others then',
'        raise;',
'end;'))
,p_api_version=>2
,p_render_function=>'render'
,p_ajax_function=>'AjaxSearchNav'
,p_standard_attributes=>'ELEMENT:PLACEHOLDER'
,p_substitute_attributes=>true
,p_subscribe_plugin_settings=>true
,p_version_identifier=>'1.0'
,p_files_version=>65
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(21734810476345798321)
,p_plugin_id=>wwv_flow_api.id(21719142165174129929)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>1
,p_display_sequence=>10
,p_prompt=>'Ctrl+'
,p_attribute_type=>'TEXT'
,p_is_required=>false
,p_default_value=>'S'
,p_max_length=>1
,p_supported_ui_types=>'DESKTOP'
,p_supported_component_types=>'APEX_APPLICATION_PAGE_ITEMS'
,p_is_translatable=>false
,p_text_case=>'UPPER'
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'User can define key combination to focus on Search navigation Menu.<br/>',
'<br/>',
'Default value = "S"<br/>',
'Null    value = disabled<br/>',
'<br/>',
'If you need to use Crl+"S" as browser save as than we recommend to switch this option to something else !<br/>',
'<br/>',
'Ctrl+<br/>',
'"F" is browser default for find<br/>',
'"L" is browser default for focus oo address bar<br/>',
'"M" is browser default for mute<br/>',
'"N" is browser default for new window<br/>',
'"O" is browser default for open<br/>',
'"P" is browser default for print<br/>',
'"S" is browser default for save <br/>',
'"T" is browser default for new tab<br/>',
'"U" is browser default for source code<br/>',
'"1-9" is browser default to switch between open tabs<br/>'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(21749852747769707796)
,p_plugin_id=>wwv_flow_api.id(21719142165174129929)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>2
,p_display_sequence=>20
,p_prompt=>'Icon CSS calss'
,p_attribute_type=>'ICON'
,p_is_required=>false
,p_default_value=>'fa-search'
,p_supported_ui_types=>'DESKTOP'
,p_supported_component_types=>'APEX_APPLICATION_PAGE_ITEMS'
,p_is_translatable=>false
,p_examples=>wwv_flow_string.join(wwv_flow_t_varchar2(
'fa-search<br/>',
'fa-calendar-search<br/>',
'fa-cloud-search<br/>',
'fa-database-search<br/>',
'fa-envelope-search<br/>',
'fa-file-search<br/>',
'fa-folder-search<br/>',
'fa-search-minus<br/>',
'fa-search-plus<br/>',
'fa-server-search<br/>',
'fa-table-search<br/>',
'fa-window-search'))
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'Define class for Font Apex or Font Awesome.<br/>',
'<br/>',
'Default value : "fa-search"<br/>',
'Null    value : icon span is hidden<br/>'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(21720010756798610403)
,p_plugin_id=>wwv_flow_api.id(21719142165174129929)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>3
,p_display_sequence=>30
,p_prompt=>'Menu click open/close'
,p_attribute_type=>'CHECKBOX'
,p_is_required=>false
,p_default_value=>'Y'
,p_supported_component_types=>'APEX_APPLICATION_PAGE_ITEMS'
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'Default APEX behavior on navigation menu click is to open target page. Problem becomes when link don''t have target. <br/>',
'In that case if you want to open sub-menu you need to click on "arrow down". <br/>',
'With this option enabled (set to "Yes") when user click on "no target" in navigation menu (title, icon or arrow) it opens sub-menu. <br/>',
'<br/>',
'YES = row<br/>',
'NO = default apex setting (<span>)<br/>'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(21748977659130222566)
,p_plugin_id=>wwv_flow_api.id(21719142165174129929)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>4
,p_display_sequence=>40
,p_prompt=>'Searched text CSS enabled'
,p_attribute_type=>'CHECKBOX'
,p_is_required=>false
,p_default_value=>'Y'
,p_supported_ui_types=>'DESKTOP'
,p_supported_component_types=>'APEX_APPLICATION_PAGE_ITEMS'
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'With this option user enable / disable searched text color, background and font weight.<br/>',
'Default option is "Yes"'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(21749008107296282537)
,p_plugin_id=>wwv_flow_api.id(21719142165174129929)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>5
,p_display_sequence=>50
,p_prompt=>'Searched text is bold'
,p_attribute_type=>'CHECKBOX'
,p_is_required=>false
,p_default_value=>'Y'
,p_supported_ui_types=>'DESKTOP'
,p_supported_component_types=>'APEX_APPLICATION_PAGE_ITEMS'
,p_is_translatable=>false
,p_depending_on_attribute_id=>wwv_flow_api.id(21748977659130222566)
,p_depending_on_has_to_exist=>true
,p_depending_on_condition_type=>'EQUALS'
,p_depending_on_expression=>'Y'
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'This option decide if searched text is bold.<br/>',
'Default option is "Yes"'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(21749018510838288851)
,p_plugin_id=>wwv_flow_api.id(21719142165174129929)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>6
,p_display_sequence=>60
,p_prompt=>'Searched text color'
,p_attribute_type=>'COLOR'
,p_is_required=>false
,p_default_value=>'black'
,p_supported_ui_types=>'DESKTOP'
,p_supported_component_types=>'APEX_APPLICATION_PAGE_ITEMS'
,p_is_translatable=>false
,p_depending_on_attribute_id=>wwv_flow_api.id(21748977659130222566)
,p_depending_on_has_to_exist=>true
,p_depending_on_condition_type=>'EQUALS'
,p_depending_on_expression=>'Y'
,p_examples=>'Default : black'
,p_help_text=>'This option is to set searched text color.'
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(21749024022253296179)
,p_plugin_id=>wwv_flow_api.id(21719142165174129929)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>7
,p_display_sequence=>70
,p_prompt=>'Searched text background color'
,p_attribute_type=>'COLOR'
,p_is_required=>false
,p_default_value=>'#ffef9a'
,p_supported_ui_types=>'DESKTOP'
,p_supported_component_types=>'APEX_APPLICATION_PAGE_ITEMS'
,p_is_translatable=>false
,p_depending_on_attribute_id=>wwv_flow_api.id(21748977659130222566)
,p_depending_on_has_to_exist=>true
,p_depending_on_condition_type=>'EQUALS'
,p_depending_on_expression=>'Y'
,p_examples=>'Default : #ffef9a'
,p_help_text=>'This option is to set searched background color.'
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(21749119049241356313)
,p_plugin_id=>wwv_flow_api.id(21719142165174129929)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>8
,p_display_sequence=>25
,p_prompt=>'Icon color'
,p_attribute_type=>'COLOR'
,p_is_required=>false
,p_supported_ui_types=>'DESKTOP'
,p_supported_component_types=>'APEX_APPLICATION_PAGE_ITEMS'
,p_is_translatable=>false
,p_depending_on_attribute_id=>wwv_flow_api.id(21749852747769707796)
,p_depending_on_has_to_exist=>true
,p_depending_on_condition_type=>'NOT_NULL'
,p_help_text=>'This option is to set icon color.'
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(21749122695297367100)
,p_plugin_id=>wwv_flow_api.id(21719142165174129929)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>9
,p_display_sequence=>90
,p_prompt=>'Search box CSS enabled'
,p_attribute_type=>'CHECKBOX'
,p_is_required=>false
,p_default_value=>'Y'
,p_supported_ui_types=>'DESKTOP'
,p_supported_component_types=>'APEX_APPLICATION_PAGE_ITEMS'
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'With this option user enable / disable search box color, background and border color.<br/>',
'Default option is "Yes"'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(21749124455798372034)
,p_plugin_id=>wwv_flow_api.id(21719142165174129929)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>10
,p_display_sequence=>100
,p_prompt=>'Search box color'
,p_attribute_type=>'COLOR'
,p_is_required=>false
,p_default_value=>'black'
,p_supported_ui_types=>'DESKTOP'
,p_supported_component_types=>'APEX_APPLICATION_PAGE_ITEMS'
,p_is_translatable=>false
,p_depending_on_attribute_id=>wwv_flow_api.id(21749122695297367100)
,p_depending_on_has_to_exist=>true
,p_depending_on_condition_type=>'EQUALS'
,p_depending_on_expression=>'Y'
,p_help_text=>'This option is to set search box text color.'
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(21749140957907374984)
,p_plugin_id=>wwv_flow_api.id(21719142165174129929)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>11
,p_display_sequence=>110
,p_prompt=>'Search box background color'
,p_attribute_type=>'COLOR'
,p_is_required=>false
,p_default_value=>'#f1f6fa'
,p_supported_ui_types=>'DESKTOP'
,p_supported_component_types=>'APEX_APPLICATION_PAGE_ITEMS'
,p_is_translatable=>false
,p_depending_on_attribute_id=>wwv_flow_api.id(21749122695297367100)
,p_depending_on_has_to_exist=>true
,p_depending_on_condition_type=>'EQUALS'
,p_depending_on_expression=>'Y'
,p_examples=>'Default : #f1f6fa'
,p_help_text=>'This option is to set search box background color.'
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(21749152526033371589)
,p_plugin_id=>wwv_flow_api.id(21719142165174129929)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>12
,p_display_sequence=>120
,p_prompt=>'Search box border color'
,p_attribute_type=>'COLOR'
,p_is_required=>false
,p_default_value=>'#ededed'
,p_supported_ui_types=>'DESKTOP'
,p_supported_component_types=>'APEX_APPLICATION_PAGE_ITEMS'
,p_is_translatable=>false
,p_depending_on_attribute_id=>wwv_flow_api.id(21749122695297367100)
,p_depending_on_has_to_exist=>true
,p_depending_on_condition_type=>'EQUALS'
,p_depending_on_expression=>'Y'
,p_examples=>'Default : #ededed'
,p_help_text=>'This option is to set search box border color.'
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(21749144631436390380)
,p_plugin_id=>wwv_flow_api.id(21719142165174129929)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>13
,p_display_sequence=>130
,p_prompt=>'Search box focus border color'
,p_attribute_type=>'COLOR'
,p_is_required=>false
,p_default_value=>'#ff7052'
,p_supported_ui_types=>'DESKTOP'
,p_supported_component_types=>'APEX_APPLICATION_PAGE_ITEMS'
,p_is_translatable=>false
,p_depending_on_attribute_id=>wwv_flow_api.id(21749122695297367100)
,p_depending_on_has_to_exist=>true
,p_depending_on_condition_type=>'EQUALS'
,p_depending_on_expression=>'Y'
,p_examples=>'Default : #ff7052'
,p_help_text=>'This option is to set on focus search box border color.'
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(21753185230230021003)
,p_plugin_id=>wwv_flow_api.id(21719142165174129929)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>14
,p_display_sequence=>5
,p_prompt=>'Save session state'
,p_attribute_type=>'CHECKBOX'
,p_is_required=>false
,p_default_value=>'Y'
,p_supported_ui_types=>'DESKTOP'
,p_supported_component_types=>'APEX_APPLICATION_PAGE_ITEMS'
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'With this option user enable/disable item to save session state.</br>',
'If session state is disabled on every page load Search box value is empty.</br>',
'Default option is "Yes".'))
);
end;
/
begin
wwv_flow_api.g_varchar2_table := wwv_flow_api.empty_varchar2_table;
wwv_flow_api.g_varchar2_table(1) := '2F2A21207365617263684E61764D656E752E6A732076312E30207C204142414B555320504C555320642E6F2E6F2E207C20416E6472656A2047726C696361207C20616E6472656A2E67726C696361406162616B75732E7369202A2F0D0A2F2A203D3D3D3D';
wwv_flow_api.g_varchar2_table(2) := '3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D0D0A20202056657273696F6E203A20312E300D0A2020202D2D2D2D2D2D2D';
wwv_flow_api.g_varchar2_table(3) := '2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D0D0A20202044617465203A2030352E30382E323031370D0A2020202D';
wwv_flow_api.g_varchar2_table(4) := '2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D0D0A2020204465736372697074696F6E0D0A09536372';
wwv_flow_api.g_varchar2_table(5) := '697074206973207573656420666F7220536561726368696E67204E617669676174696F6E204D656E7520696E204F7261636C65204170706C69636174696F6E20457870726573730D0A2020202D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D';
wwv_flow_api.g_varchar2_table(6) := '2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D0D0A202020506172616D65747273203A200D0A20202020206974656D5F6964203A206974656D2069642066726F';
wwv_flow_api.g_varchar2_table(7) := '6D20617065780D0A200D0A2A2F200D0A0D0A76617220537263684E61764D656E75436C6F736564203D2066616C73653B0D0A0D0A0D0A66756E6374696F6E204C6F61645365617263684E61765375626D656E75286974656D5F696429207B0D0A09696620';
wwv_flow_api.g_varchar2_table(8) := '282124282223745F427574746F6E5F6E6176436F6E74726F6C22292E686173436C617373282269732D6163746976652229290D0A0909537263684E61764D656E75436C6F7365643D747275653B0D0A202020206F70656E416C6C4E61765375626D656E75';
wwv_flow_api.g_varchar2_table(9) := '7328293B0D0A092428276C695B69645E3D22745F547265654E6176225D2E69732D636F6C6C61707369626C6527292E66696E6428277370616E2E612D54726565566965772D746F67676C6527292E636C69636B28293B200D0A092F2F4265636175736520';
wwv_flow_api.g_varchar2_table(10) := '616C6C206C6973742077657265206F70656E20616E64206C617374206F6E6520636C6F736564207765206E65656420746F206F70656E2063757272656E74206C6973740D0A0973657443757272656E744E6176286974656D5F6964293B0D0A7D0D0A0D0A';
wwv_flow_api.g_varchar2_table(11) := '66756E6374696F6E206F70656E416C6C4E61765375626D656E757328656C6D29207B0D0A09766172206C5F656C6D3D22223B0D0A0969662028656C6D290D0A09096C5F656C6D3D226C695B69643D222B656C6D2E617474722822696422292B225D20223B';
wwv_flow_api.g_varchar2_table(12) := '0D0A0924286C5F656C6D2B276C695B69645E3D22745F547265654E6176225D2E69732D657870616E6461626C6527292E656163682866756E6374696F6E2829207B0D0A0909242874686973292E66696E6428227370616E2E612D54726565566965772D74';
wwv_flow_api.g_varchar2_table(13) := '6F67676C6522292E636C69636B28293B0D0A09096F70656E416C6C4E61765375626D656E75732824287468697329293B0D0A097D293B0D0A7D0D0A0D0A66756E6374696F6E2073657443757272656E744E6176286974656D5F696429207B0D0A09242827';
wwv_flow_api.g_varchar2_table(14) := '6C695B69645E3D22745F547265654E6176225D27292E65616368282066756E6374696F6E28297B0D0A202020202020202069662028242874686973292E66696E6428226469762E612D54726565566965772D636F6E74656E7422292E686173436C617373';
wwv_flow_api.g_varchar2_table(15) := '282269732D63757272656E74222929207B0D0A202020202020202020202020242874686973292E66696E6428226469762E612D54726565566965772D726F7722292E616464436C617373282269732D73656C656374656422293B0D0A2020202020202020';
wwv_flow_api.g_varchar2_table(16) := '2020202069662028242874686973292E686173436C617373282269732D657870616E6461626C652229290D0A20202020202020202020202020202020242874686973292E66696E6428227370616E2E612D54726565566965772D746F67676C6522292E63';
wwv_flow_api.g_varchar2_table(17) := '6C69636B28293B20200D0A202020202020207D0D0A20202020202020656C73650D0A2020202020202020202020242874686973292E66696E6428226469762E612D54726565566965772D726F7722292E72656D6F7665436C617373282269732D73656C65';
wwv_flow_api.g_varchar2_table(18) := '6374656422293B0D0A202020207D293B0D0A0969662028537263684E61764D656E75436C6F736564290D0A090924282223745F427574746F6E5F6E6176436F6E74726F6C22292E636C69636B28293B0D0A09656C73650D0A090973686F77486964655365';
wwv_flow_api.g_varchar2_table(19) := '61726368426172286974656D5F6964293B0D0A7D0D0A0D0A66756E6374696F6E2073617665536573536174654E617628616A61784964656E7469666965722C206E657756616C29207B0D0A09617065782E7365727665722E706C7567696E2820616A6178';
wwv_flow_api.g_varchar2_table(20) := '4964656E7469666965722C207B0D0A202020207830313A206E657756616C0D0A202020207D2C207B64617461547970653A2274657874222C200D0A20202020202020737563636573733A2066756E6374696F6E282070446174612029207B0D0A20202020';
wwv_flow_api.g_varchar2_table(21) := '2020202020617065782E64656275672E696E666F282253617665642073657373696F6E2073746174652E22293B200D0A202020202020207D2C0D0A202020202020206572726F723A2066756E6374696F6E282070446174612029207B0D0A202020202020';
wwv_flow_api.g_varchar2_table(22) := '202020617065782E64656275672E6572726F722822536176652073657373696F6E20737461746520666F7220536561726368204E617669676174696F6E206661696C6564203A222B4A534F4E2E737472696E676966792870446174612920293B200D0A20';
wwv_flow_api.g_varchar2_table(23) := '2020202020207D092020200D0A202020207D293B200D0A7D0D0A0D0A092020200D0A66756E6374696F6E2073686F7748696465536561726368426172286974656D5F696429207B0D0A20206966202824282223745F427574746F6E5F6E6176436F6E7472';
wwv_flow_api.g_varchar2_table(24) := '6F6C22292E686173436C617373282269732D616374697665222929207B0D0A202020202428276469765B69643D22272B6974656D5F69642B27225D27292E73686F7728293B0D0A20202020242827696E7075742E737263685F696E70757427292E747269';
wwv_flow_api.g_varchar2_table(25) := '6767657228226B6579757022293B0D0A09537263684E61764D656E75436C6F736564203D2066616C73653B0D0A20207D0D0A2020656C7365207B0D0A09242827696E7075742E737263685F696E70757427292E7472696767657228226B6579757022293B';
wwv_flow_api.g_varchar2_table(26) := '0D0A202020202428276469765B69643D22272B6974656D5F69642B27225D27292E6869646528293B20200D0A202020202428276C695B69645E3D22745F547265654E6176225D2E69732D657870616E6461626C6527292E66696E642822756C22292E6373';
wwv_flow_api.g_varchar2_table(27) := '732822646973706C6179222C20226E6F6E6522293B0D0A09537263684E61764D656E75436C6F736564203D20747275653B0D0A20207D0D0A7D0D0A0D0A66756E6374696F6E20636F6C6F725365617263684E6176287478742C2072706C53747229207B0D';
wwv_flow_api.g_varchar2_table(28) := '0A20202020766172206C6F63203D207478742E746F4C6F7765724361736528292E696E6465784F662872706C5374722E746F4C6F776572436173652829293B0D0A20202020696620286C6F63213D2D3129207B0D0A202020202020202072657475726E20';
wwv_flow_api.g_varchar2_table(29) := '7478742E736C69636528302C206C6F63292B273C7374726F6E673E272B7478742E736C696365286C6F632C206C6F632B72706C5374722E6C656E677468292B273C2F7374726F6E673E272B7478742E736C6963652872706C5374722E6C656E6774682B6C';
wwv_flow_api.g_varchar2_table(30) := '6F632C207478742E6C656E677468293B0D0A202020207D0D0A2020202072657475726E207478743B202020200D0A7D0D0A0D0A66756E6374696F6E20686F7665725365617263684E61762829207B0D0A202020202428276C695B69645E3D22745F547265';
wwv_flow_api.g_varchar2_table(31) := '654E61765F225D206469762E69732D686F76657227292E72656D6F7665436C617373282269732D686F76657222293B0D0A202020202428276C695B69645E3D22745F547265654E61765F225D5B7374796C652A3D22646973706C61793A20626C6F636B22';
wwv_flow_api.g_varchar2_table(32) := '5D20612E612D54726565566965772D6C6162656C207374726F6E6727292E656163682866756E6374696F6E2829207B0D0A2020202020202020242874686973292E706172656E747328226C6922292E65712830292E6368696C6472656E28226469762229';
wwv_flow_api.g_varchar2_table(33) := '2E616464436C617373282269732D686F76657222293B0D0A202020202020202072657475726E2066616C73653B0D0A202020207D293B0D0A7D0D0A0D0A66756E6374696F6E20737465704E6578745365617263684E6176287265766572736529207B0D0A';
wwv_flow_api.g_varchar2_table(34) := '20202020766172206F626A203D202428276C695B69645E3D22745F547265654E61765F225D206469762E69732D686F76657227293B0D0A20202020766172206E65774F626A2C20666C673B202F2F666C6720666F7220666C6167206E657874206F626A65';
wwv_flow_api.g_varchar2_table(35) := '78740D0A202020200D0A20202020696620286F626A5B305D29207B0D0A20202020202020206F626A2E72656D6F7665436C617373282269732D686F76657222293B0D0A20202020202020202428276C695B69645E3D22745F547265654E61765F225D5B73';
wwv_flow_api.g_varchar2_table(36) := '74796C652A3D22646973706C61793A20626C6F636B225D20612E612D54726565566965772D6C6162656C207374726F6E6727292E656163682866756E6374696F6E2829207B0D0A2020202020202020202020696628242874686973292E706172656E7473';
wwv_flow_api.g_varchar2_table(37) := '28226C6922292E65712830292E61747472282269642229203D3D206F626A2E706172656E7428226C6922292E617474722822696422292026262072657665727365290D0A20202020202020202020202020202072657475726E2066616C73653B0D0A2020';
wwv_flow_api.g_varchar2_table(38) := '202020202020202020656C73652069662028666C6729207B0D0A2020202020202020202020202020206E65774F626A3D242874686973292E706172656E747328226C6922292E65712830293B0D0A20202020202020202020202020202072657475726E20';
wwv_flow_api.g_varchar2_table(39) := '66616C73653B0D0A20202020202020202020207D0D0A2020202020202020202020656C73652069662028242874686973292E706172656E747328226C6922292E65712830292E61747472282269642229203D3D206F626A2E706172656E7428226C692229';
wwv_flow_api.g_varchar2_table(40) := '2E617474722822696422292026262021726576657273652026262021666C6729207B0D0A202020202020202020202020202020666C67203D20747275653B0D0A2020202020202020202020202020206E65774F626A3D242874686973292E706172656E74';
wwv_flow_api.g_varchar2_table(41) := '7328226C6922292E65712830293B0D0A20202020202020202020207D0D0A2020202020202020202020656C73650D0A2020202020202020202020202020206E65774F626A3D242874686973292E706172656E747328226C6922292E65712830293B0D0A20';
wwv_flow_api.g_varchar2_table(42) := '202020202020207D293B0D0A2020202020202020696620286E65774F626A290D0A20202020202020202020202024286E65774F626A292E6368696C6472656E282264697622292E616464436C617373282269732D686F76657222293B0D0A202020202020';
wwv_flow_api.g_varchar2_table(43) := '2020656C73650D0A20202020202020202020202024286F626A292E616464436C617373282269732D686F76657222293B2020200D0A202020207D0D0A20202020656C73650D0A20202020202020686F7665725365617263684E617628293B202020200D0A';
wwv_flow_api.g_varchar2_table(44) := '7D0D0A0D0A66756E6374696F6E2072656469726563745365617263684E61762829207B0D0A2020202076617220726472203D202428276C695B69645E3D22745F547265654E61765F225D5B7374796C652A3D22646973706C61793A20626C6F636B225D20';
wwv_flow_api.g_varchar2_table(45) := '6469762E69732D686F76657220612E612D54726565566965772D6C6162656C27292E6174747228226872656622293B0D0A2020202069662028726472290D0A202020202020202077696E646F772E6C6F636174696F6E2E68726566203D207264723B0D0A';
wwv_flow_api.g_varchar2_table(46) := '7D0D0A0D0A2F2A20204556454E54532E2E2E2E2E2E2E2E202A2F0D0A0D0A66756E6374696F6E206B6579446F776E5365617263684E6176286529207B0D0A09207377697463682028652E776869636829207B0D0A0909202020636173652031333A0D0A09';
wwv_flow_api.g_varchar2_table(47) := '090920202072656469726563745365617263684E617628293B0D0A090909202020652E70726576656E7444656661756C7428293B0D0A0909092020627265616B3B0D0A0909202020636173652034303A0D0A0909092020737465704E6578745365617263';
wwv_flow_api.g_varchar2_table(48) := '684E61762866616C7365293B20200D0A0909092020652E70726576656E7444656661756C7428293B0D0A0909092020627265616B3B0D0A0909202020636173652033383A0D0A0909092020737465704E6578745365617263684E61762874727565293B0D';
wwv_flow_api.g_varchar2_table(49) := '0A090909202020652E70726576656E7444656661756C7428293B2020202020202020202020200D0A09092020207D0D0A7D0D0A0D0A66756E6374696F6E206B657955705365617263684E617628656C6D2C20652C20616A61784964656E7469666965722C';
wwv_flow_api.g_varchar2_table(50) := '20736176655F737329207B0D0A097377697463682028652E776869636829207B0D0A09202020636173652031333A0D0A09202020636173652034303A0D0A09202020636173652033383A0D0A0909202020652E70726576656E7444656661756C7428293B';
wwv_flow_api.g_varchar2_table(51) := '0D0A0909202020627265616B3B0D0A0920202064656661756C743A200D0A09092076617220656C6D56616C203D202428656C6D292E76616C28293B0D0A0909202428222E612D54726565566965772D6C6162656C207374726F6E6722292E7265706C6163';
wwv_flow_api.g_varchar2_table(52) := '65576974682866756E6374696F6E2829207B2072657475726E20242874686973292E68746D6C28293B207D293B200D0A09092069662028656C6D56616C20213D20222229207B0D0A090909202428276C695B69645E3D22745F547265654E6176225D2729';
wwv_flow_api.g_varchar2_table(53) := '2E656163682866756E6374696F6E2829207B0D0A09090920202069662028242874686973292E66696E6428222E612D54726565566965772D6C6162656C22292E7465787428292E746F4C6F7765724361736528292E696E6465784F6628656C6D56616C2E';
wwv_flow_api.g_varchar2_table(54) := '746F4C6F77657243617365282929213D202D312029207B0D0A0909090920202069662028242874686973292E686173436C617373282269732D657870616E6461626C652229290D0A0909090909202020242874686973292E66696E642822756C22292E63';
wwv_flow_api.g_varchar2_table(55) := '73732822646973706C6179222C2022626C6F636B22293B0D0A09090909202020242874686973292E66696E6428222E612D54726565566965772D6C6162656C22292E656163682866756E6374696F6E28297B0D0A0909090909202020242874686973292E';
wwv_flow_api.g_varchar2_table(56) := '68746D6C28636F6C6F725365617263684E617628242874686973292E7465787428292C656C6D56616C29293B200D0A090909092020207D293B0D0A09090909202020242874686973292E6373732822646973706C6179222C2022626C6F636B22293B200D';
wwv_flow_api.g_varchar2_table(57) := '0A0909092020207D0D0A090909202020656C73650D0A0909090920242874686973292E6373732822646973706C6179222C20226E6F6E6522293B0D0A09090920207D293B0D0A09097D0D0A0909656C7365207B0D0A09092020202428276C695B69645E3D';
wwv_flow_api.g_varchar2_table(58) := '22745F547265654E6176225D27292E656163682866756E6374696F6E2829207B0D0A090909202069662028242874686973292E686173436C617373282269732D657870616E6461626C652229290D0A09090909092020242874686973292E66696E642822';
wwv_flow_api.g_varchar2_table(59) := '756C22292E6373732822646973706C6179222C20226E6F6E6522293B0D0A0909092020242874686973292E6373732822646973706C6179222C2022626C6F636B22293B0D0A09092020207D293B0D0A09097D20202020202020200D0A0909696620287361';
wwv_flow_api.g_varchar2_table(60) := '76655F7373290D0A09090973617665536573536174654E617628616A61784964656E7469666965722C656C6D56616C293B200D0A0909686F7665725365617263684E617628293B0D0A097D202020200D0A7D0D0A0909200D0A66756E6374696F6E207368';
wwv_flow_api.g_varchar2_table(61) := '6F72744375745365617263684E617628652C206C5F736B657929207B0D0A09696628652E6374726C4B657920262620652E6B6579436F6465203D3D3D206C5F736B65792E63686172436F64654174283029297B200D0A090969662028537263684E61764D';
wwv_flow_api.g_varchar2_table(62) := '656E75436C6F736564290D0A09090924282223745F427574746F6E5F6E6176436F6E74726F6C22292E636C69636B28293B0D0A090976617220746D70203D20242822696E7075742E737263685F696E70757422292E76616C28293B0D0A0909242822696E';
wwv_flow_api.g_varchar2_table(63) := '7075742E737263685F696E70757422292E666F63757328292E76616C28746D70293B0D0A0909652E70726576656E7444656661756C7428293B0D0A090972657475726E2066616C73653B0D0A097D090D0A7D0D0A';
null;
end;
/
begin
wwv_flow_api.create_plugin_file(
 p_id=>wwv_flow_api.id(21720151255269719178)
,p_plugin_id=>wwv_flow_api.id(21719142165174129929)
,p_file_name=>'searchNavMenu.js'
,p_mime_type=>'text/javascript'
,p_file_charset=>'utf-8'
,p_file_content=>wwv_flow_api.varchar2_to_blob(wwv_flow_api.g_varchar2_table)
);
end;
/
begin
wwv_flow_api.g_varchar2_table := wwv_flow_api.empty_varchar2_table;
wwv_flow_api.g_varchar2_table(1) := '2F2A21207365617263684E61764D656E752E6373732076312E31207C204142414B555320504C555320642E6F2E6F2E207C20416E6472656A2047726C696361207C20616E6472656A2E67726C696361406162616B75732E7369202A2F0D0A2F2A203D3D3D';
wwv_flow_api.g_varchar2_table(2) := '3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D0D0A20202056657273696F6E203A20312E310D0A2020202D2D2D2D2D2D';
wwv_flow_api.g_varchar2_table(3) := '2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D0D0A20202044617465203A2030352E30382E323031370D0A202020';
wwv_flow_api.g_varchar2_table(4) := '2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D0D0A2020204465736372697074696F6E0D0A095573';
wwv_flow_api.g_varchar2_table(5) := '656420666F7220536561726368696E67204E617669676174696F6E204D656E75205374796C6520536865657420696E204F7261636C65204170706C69636174696F6E20457870726573730D0A2020202D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D';
wwv_flow_api.g_varchar2_table(6) := '2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D200D0A2A2F200D0A0D0A0D0A2E737263685F6E6176207B0D0A09706F736974696F6E3A72656C61746976';
wwv_flow_api.g_varchar2_table(7) := '653B0D0A2020202077696474683A3935253B0D0A096D617267696E3A203470783B090D0A7D0D0A0D0A2E737263685F69636F6E207B0D0A09666F6E742D73697A653A20323070783B0D0A7D0D0A0D0A2E737263685F6E6176207370616E207B0D0A09706F';
wwv_flow_api.g_varchar2_table(8) := '736974696F6E3A206162736F6C7574653B0D0A09646973706C61793A20626C6F636B3B0D0A096C6566743A203770783B0D0A09746F703A203770783B0D0A09666F6E742D73697A653A20323070783B0D0A7D0D0A2E737263685F6E617620696E70757420';
wwv_flow_api.g_varchar2_table(9) := '7B0D0A0977696474683A20313030253B0D0A096D617267696E3A3270783B0D0A0970616464696E673A20337078203270782033707820323570783B0D0A09626F726465723A2031707820736F6C69643B200D0A09646973706C61793A20626C6F636B3B0D';
wwv_flow_api.g_varchar2_table(10) := '0A09626F726465722D7261646975733A203470783B0D0A097472616E736974696F6E3A20302E327320656173652D6F75743B0D0A7D0D0A2E737263685F6E617620696E7075743A666F637573207B0D0A096F75746C696E653A20303B0D0A7D0D0A';
null;
end;
/
begin
wwv_flow_api.create_plugin_file(
 p_id=>wwv_flow_api.id(21720178485949732585)
,p_plugin_id=>wwv_flow_api.id(21719142165174129929)
,p_file_name=>'searchNavMenu.css'
,p_mime_type=>'text/css'
,p_file_charset=>'utf-8'
,p_file_content=>wwv_flow_api.varchar2_to_blob(wwv_flow_api.g_varchar2_table)
);
end;
/
begin
wwv_flow_api.import_end(p_auto_install_sup_obj => nvl(wwv_flow_application_install.get_auto_install_sup_obj, false), p_is_component_import => true);
commit;
end;
/
set verify on feedback on define on
prompt  ...done

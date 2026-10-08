-- Search Navigation Menu 3.0: PL/SQL code of the item type plug-in SI.ABAKUS.SEARCHNAVIGATIONMENU
-- (Render Procedure/Function Name: render, AJAX Procedure/Function Name: ajax)

function render (
    p_item                in apex_plugin.t_page_item,
    p_plugin              in apex_plugin.t_plugin,
    p_value               in varchar2,
    p_is_readonly         in boolean,
    p_is_printer_friendly in boolean )
    return apex_plugin.t_page_item_render_result
is
    l_result    apex_plugin.t_page_item_render_result;
    l_css_icon  varchar2(4000) := p_item.attribute_02;
    l_options   varchar2(32767) := p_item.attribute_03;
    l_style     varchar2(32767) := p_item.attribute_04;
begin
    ----- Set CSS -----------
    if l_css_icon is null then
        l_style := l_style || '.srch_nav input{padding: 3px 2px 3px 3px;}';
    end if;
    if l_style is not null then
        apex_css.add(l_style);
    end if;

    ----- Search box and settings (Options is the developer's JSON, the other values are escaped)
    apex_javascript.add_onload_code(
        'renderSearchNavMenu({' ||
            apex_javascript.add_attribute('itemId',      p_item.name) ||
            apex_javascript.add_attribute('placeholder', p_item.placeholder) ||
            apex_javascript.add_attribute('cssClasses',  p_item.element_css_classes) ||
            apex_javascript.add_attribute('icon',        l_css_icon) ||
            apex_javascript.add_attribute('ajaxId',      apex_plugin.get_ajax_identifier) ||
            apex_javascript.add_attribute('key',         p_item.attribute_01) ||
            apex_javascript.add_attribute('value',       p_value, false) ||
            '"options":' || coalesce(l_options, 'null') ||
        '});');

    l_result.is_navigable := true;
    return l_result;
end render;

function ajax (
    p_item   in apex_plugin.t_page_item,
    p_plugin in apex_plugin.t_plugin )
    return apex_plugin.t_page_item_ajax_result
is
    l_result apex_plugin.t_page_item_ajax_result;
begin
    apex_debug.info('Save to session state item:%s value:%s', p_item.name, apex_application.g_x01);
    apex_util.set_session_state(p_item.name, apex_application.g_x01);
    apex_json.open_object;
    apex_json.write('state', 'OK');
    apex_json.close_object;
    return l_result;
end ajax;

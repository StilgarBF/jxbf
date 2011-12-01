function parse_tabbedpane(xml) {
	var html = '';

	var html_tabs = '';
	var html_cont = '';

	var tabs = xml.find('tab');

	if(tabs.length != 0) {
		html_tabs += '<ul class="tabs">';

		var is_first = true;
		var selected = false;
		
		jQuery.each(tabs, function(i,e) {
			if(jQuery(this).attr('selected') || is_first) {
				selected	=	i;	}
			is_first = false;
		});

		jQuery.each(tabs, function(i,e) {

			var tab_id = jQuery(this).attr('name');
			var tab_title = jQuery(this).attr('title');

			html_tabs += '<li'+((selected == i) ? ' class="tab_active"' : '')+'><a href="#'+tab_id+'">'+tab_title+'</a></li>';

			html_cont += '<div id="'+tab_id+'" class="tab'+(!(selected == i) ? ' hidden_tab':'')+'">';
			
			jQuery(this).children('section').each(function(){

				html_cont += parseSection(jQuery(this));

			});
			html_cont += '</div>';


		});
		html_tabs += '</ul>';
	}

	html = html_tabs + html_cont;

	return html;
			jQuery('#'+e+' tfoot tr').prepend('<td class="nosort flag" colspan="2"></td>');
}

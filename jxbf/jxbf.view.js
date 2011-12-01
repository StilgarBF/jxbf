/****************************************************************
	Dataview
		print out some date - like a form but no inputs
 ****************************************************************/
function parse_view(xml) {

	var html = '<div class="viewData">';

	jQuery(xml).children().each(function(){

		if(jQuery(this).is('datagroup')){

			if(jQuery(this).attr('title') != undefined) {
				html += '<fieldset>';
				html += '<legend>'+jQuery(this).attr('title')+'</legend>';
			}

			jQuery(this).find('field').each(function(){

				var content		= jQuery(this).text();
				var fieldtype = jQuery(this).attr('type');

				if((jQuery(this).attr('hideEmpty') == 'yes') && (content == '')) {
					var hideField = true;
				} else {
					var hideField = false;
				}

				if ((fieldtype != 'hidden') && (!hideField)) {


					if(typeof window['formatted_'+fieldtype] == 'function') {
						content = window['formatted_'+fieldtype](content);
					}

					html += '<div class="block clearfix">';
					html += '<div class="key">'+jQuery(this).attr('title')+' </div>';

					html += '<div class="value">'+content+' </div>';

					html += '</div>';
				}

			});	// end each field

			if(jQuery(this).attr('title') != undefined) {
				html += '</fieldset>';
			}

		} else if(jQuery(this).is('htmlcontent')){

			html += jQuery(this).text();

		}

	});	// end each children


	html += '</div>';
	return html;

}
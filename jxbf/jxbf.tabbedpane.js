/**
 * Copyright (c), Tino Dietel <tino.dietel@projekt2k.de>.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.

 *  * Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in
 *    the documentation and/or other materials provided with the
 *    distribution.

 *  * Neither the name of Tino Dietel nor the names of his contributors
 *    may be used to endorse or promote products derived from this
 *    software without specific prior written permission.

 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

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
		}

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

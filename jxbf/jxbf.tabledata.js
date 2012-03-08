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

/****************************************************************
	Tables
 ****************************************************************/
function parse_tabledata(xml) {

	html = '';

	var tabledata = xml;

	if(tabledata.length != 0) {

		var collumnType 	= new Array();

		var columnClass	= new Array();

		var rowClickAction='';
		var type = tabledata.attr('type');

		var rownavigation	= false;
		var rowClickObject	= false;

		if(tabledata.children('rownavigation').length != 0) {
			rownavigation = navigation2Object(tabledata.children('rownavigation'));

			jQuery.each(rownavigation.entries, function(i,e){

				if(this.context == 'click') {

					rowClickObject	= "{clickaction:{";
					rowClickObject	+= "linkTarget:" + (this.linkTarget ? "'"+this.linkTarget+"'" : false)+",";
					rowClickObject	+= "relation:" + (this.relation ? "'"+this.relation+"'" : false)+"";

					jQuery.each(this.target, function(i,e){
						if(i=='para') {
							rowClickObject += ", " + i + ":{";
							var efirst			= true;
							jQuery.each(e, function(ei,ee){
								rowClickObject += (efirst?"":", ") + ei + ":'" + ee + "'";
								efirst			= false;
							});
							rowClickObject	+= "}";
						} else {
							rowClickObject += ", " + i + ":" + (e ? "'"+e+"'" : "false");
						}
					});
					rowClickObject	+= "}}";
				}
			});
		}

		var tableID='';
		if(tabledata.attr('name')!=''){
			tableID=' id="'+tabledata.attr('name')+'"';
		}

		html += '<table width="100%" border="0" cellpadding="0" cellspacing="0" '+tableID+' class="jxbf_table table table-striped table-bordered table-condensed" data-rowclick="'+rowClickObject+'">';
		html += '<thead>';

		html += '<tr>';

		tabledata.find('tablehead > cell').each(function(){
			var v_class='class="';
			if(jQuery(this).attr('type')!=undefined) {
				v_class += jQuery(this).attr('type');
			}
			if(jQuery(this).attr('headClass')!=undefined) {
				v_class += ' '+jQuery(this).attr('headClass');
			}

			v_style='';
			if(jQuery(this).attr('width')!=undefined) {
				v_style += ' style="width:'+jQuery(this).attr('width')+'px;"';
			}

			if(jQuery(this).attr('sortable')=='no') {
				v_class +=' {sorter: false} nosort';
			}

			if(jQuery(this).attr('columnClass')!=undefined) {
				columnClass.push(jQuery(this).attr('columnClass'));
			} else {
				columnClass.push(false);
			}

			v_class +='"';
			html 	+= '<th '+v_class+''+v_style+'>' + jQuery(this).text() + '</th>';
			collumnType.push((jQuery(this).attr('type')!=undefined) ? jQuery(this).attr('type') : false);
		});

		// adding a collumn for rownavigation if needed
		if(rownavigation) {
			html	+= '<th class="{sorter: false} nosort"></th>';
		}

		html += '</tr></thead><tbody>';

		tabledata.find('tablerows > row').each(function(){

			var thisID		= jQuery(this).attr('id') ? jQuery(this).attr('id') : '';
			var classes 	= 'class="';

			var tooltipEl	= jQuery(this).find('tooltip');

			var dataStr		= ' ';

			if(tooltipEl.length != 0) {
				dataStr		+= 'data-tooltip="'+ escape(tooltipEl.text()) +'" ';
				classes 	+= 'toolTipRow ';
			}

			var thisType = jQuery(this).attr('type') ? jQuery(this).attr('type') : false;

			var	typeMetadata = false;
			if(thisType) {
				typeMetadata = "clickaction:{type:'"+thisType+"'}";
			}

			var data = "metadata {";
			if(typeMetadata) {
				data += typeMetadata;
			}
			data += "}";

			var th_class = jQuery(this).attr('class');
			if(String(th_class) != 'undefined') {
				classes += th_class + ' ';
			}
			delete(th_class);

			if((rowClickAction == '') || data) {
				if(rowClickAction != '') {
					classes += 'preventDefault ';
				}
				if(data) {
					classes += data;
				}
			}
			classes += '"';

			html += '<tr rel="#overlay" id="'+thisID+'" '+classes+dataStr+'>';

			jQuery(this).find('cell').each(function(index){
				htmlclass='';
				var th_class = jQuery(this).attr('htmlclass');
				if((th_class != undefined) || columnClass[index]){
					htmlclass =' class="'
					if(th_class != undefined){
						htmlclass +=th_class+'';
					}
					if(columnClass[index]){
						htmlclass +=' '+columnClass[index]+'';
					}
					htmlclass +='"';
				}
				delete(th_class);

				var content = jQuery(this).text();

				var fieldtype = collumnType[index];


				if(typeof window['formatted_'+fieldtype] == 'function') {
					content = window['formatted_'+fieldtype](content);
				}

				html 	+= '<td'+htmlclass+'>' + content + '</td>';
			});

			// adding buttons and actions
			if(rownavigation) {

				var thisData;

				if(thisType) {
					thisData	={id:	thisID, type: thisType};
				} else {
					thisData	={id:	thisID};
				}
				html += '<td class="preventDefault">'+parse_navigation(rownavigation , {
															data:		thisData,
															showImage:	true,
															showTitle:	false,
															idSuffix:	'_'+thisID,
															context: 'menu'
														})+'</td>';
			}

			html += '</tr>\n';
		});

		html += '</tbody>';

		/* Tablefoot */
		var foot = tabledata.find('tablefoot > cell');

		if(foot.length != 0) {
			html += '<tfoot><tr>';
			foot.each(function(index){
				var content = jQuery(this).text();
				var fieldtype = jQuery(this).attr('type') ? jQuery(this).attr('type') : false;
				if (!fieldtype) {
					fieldtype = collumnType[index];
				}
				if(typeof window['formatted_'+fieldtype] == 'function') {
					content = window['formatted_'+fieldtype](content);
				}
				var foot_class = jQuery(this).attr('footerClass') ? (' class="'+jQuery(this).attr('footerClass')+'"') : '';
				html 	+= '<th'+foot_class+'>' + content + '</th>';
			});
			if (rownavigation) {
				html += '<th></th>';
			}
			html += '<tr></tfoot>';
		}

		html += '</table>\n';

	}

	return html;
}

// events for tables
jxbf.bind('xmlparse.postparse', function bind_tabledata_postparse(){
	jQuery('table.jxbf_table:not(.eventsBound)').mouseenter(function bind_table(){

		jQuery(this).unbind('mouseenter').addClass('eventsBound');

		if(jQuery(this).is("table:not(.sortable)")) {
			jQuery(this).tablesorter().addClass('sortable');
		}

		jQuery(this).find('tr[rel]:not(.preventDefault)')
			.bind('mouseenter',function(){
					jQuery(this).find('td').addClass('hovered');
				})
			.bind('mouseleave',function(){
					jQuery(this).find('td').removeClass('hovered');
				})
			.mouseover(function bind_tr(){
				jQuery(this).find('td:not(.preventDefault)')
					.addClass('clickable')
					.bind('mouseenter',function(){
							jQuery(this).parent().find('td').addClass('hovered');
						})
					.bind('mouseleave',function(){
							jQuery(this).parent().find('td').removeClass('hovered');
						});
			});

	});
});


// bastel, removed tooltip

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

		html += '<table width="100%" border="0" cellpadding="0" cellspacing="0" '+tableID+(rowClickObject?' class="jxbf_table metadata '+rowClickObject+'"':'')+'>';
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

			var tooltipEl	= jQuery(this).find('tooltip');

			tooltipMetadata = false;
			if(tooltipEl.length != 0) {
				tooltipMetadata = "tooltip:'"+ escape(tooltipEl.text()) +"'";
			}

			var thisType = jQuery(this).attr('type') ? jQuery(this).attr('type') : false;

			var	typeMetadata = false;
			if(thisType) {
				typeMetadata = "clickaction:{type:'"+thisType+"'}";
			}

			var data = "metadata {";
			var setComma = false;
			if(typeMetadata) {
				setComma = true;
				data += typeMetadata;
			}
			if(tooltipMetadata) {
				if(setComma) {	data += ", ";}
				setComma = true;
				data += tooltipMetadata;
			}
				data += "}";

			var classes = 'class="';
			var th_class = jQuery(this).attr('class');
			if(String(th_class) != 'undefined') {
				classes += th_class + ' ';
			}
			delete(th_class);

			if(tooltipMetadata) {
				classes += 'toolTipRow ';
			}

			if((rowClickAction == '') || data) {
				if(rowClickAction != '') {
					classes += 'preventDefault ';
				}
				if(data) {
					classes += data;
				}
			}

				classes += '"';

			html += '<tr rel="#overlay" id="'+thisID+'" '+classes+'>';

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
				html 	+= '<td'+foot_class+'>' + content + '</td>';
			});
			if (rownavigation) {
				html += '<td></td>';
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
				//jQuery(this).unbind('mouseover');
				jQuery(this).find('td:not(.preventDefault)')
					//.unbind()														// remove old events
					.addClass('clickable')
					.bind('mouseenter',function(){
							jQuery(this).parent().find('td').addClass('hovered');
						})
					.bind('mouseleave',function(){
							jQuery(this).parent().find('td').removeClass('hovered');
						});
			});

	});
	$("table:not(.tooltipBound)").each(function(){
		$(this).addClass('tooltipBound');
		$("tr.toolTipRow td", this).bind('mouseenter',
			function(e){
				//var content = jQuery(this).siblings('.tooltip').html();
				var	content = unescape(jQuery(this).parents('tr').metadata().tooltip);
				if(jQuery('#tooltip_').length == 0) {
					jQuery('body').append('<div id="tooltip_"></div>');
					jQuery('#tooltip_').css({position:'absolute', width:'300px', top:'100px', left:'100px'});
				}
				var tt = jQuery('#tooltip_');
					tt.show();
					tt.html(content);
					tt_height = tt.height() + (parseInt(tt.css('padding-bottom'))*2) + (parseInt(tt.css('border-bottom-width'))*2);
					tt_width = tt.width();
			}).bind('mouseleave',
				function(){
					jQuery('#tooltip_').hide();
			}).bind('mousemove',
				function(e){
					var win_height = jQuery(window).height();
					var tt = jQuery('#tooltip_');
					var x = e.pageX - (tt_width / 2);
					var y = e.pageY + 5;
					if(e.pageY > (win_height/2)) {
						y = e.pageY - 5 - tt_height;
					}
					tt.css({top:y+'px', left:x+'px'});
				}
			);
	});
})
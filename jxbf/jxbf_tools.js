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

function site_init() {
	jQuery.tablesorter.addParser({
		id: "euroNumber",
		is: function(s) {
			return /^\d+,\d+ \u20AC$/.test(s);
		},
		format: function(s) {
			return jQuery.tablesorter.formatInt( s.replace(/[, \u20AC]/g,'') );
		},
		type: "numeric"
	});

}


function getIcon(value) {
	var icon = '';
	switch(value) {
		case '1':
		case 'yes':
			icon += '<img src="'+ jxbfRoot + 'img/icons/on.png" title="Ja" />';
			break;
		case '0':
		case '':
		case 'no':
			icon += '<img src="'+ jxbfRoot + 'img/icons/off.png" title="Nein" />';
			break;
	}

	return icon;
}

/* style-setter for jquery.growl */
function setMessageStyle(xml) {

	var growlImage = '';

	if(xml.attr('type')== 'warning') {
		jQuery.growl.settings.displayTimeout = 4000;
		jQuery.growl.settings.noticeCss = {
			opacity: 			.85,
			backgroundColor: 	'#885C00',
			color: 				'#ffffff',
			border: 			'1px solid',
			borderColor:		'#DDD #000 #000 #DDD',
			padding: 			'5px'
		};
		growlImage = jxbfRoot + 'icons/warning.png';

	} else if(xml.attr('type')== 'error') {
		jQuery.growl.settings.displayTimeout = 7000;
		jQuery.growl.settings.noticeCss = {
			opacity: 			.85,
			backgroundColor: 	'#A22',
			color: 				'#ffffff',
			border: 			'1px solid',
			borderColor:		'#DDD #000 #000 #DDD',
			padding: 			'5px'
		};
		growlImage = jxbfRoot + 'icons/error.png';

	} else {
		jQuery.growl.settings.displayTimeout = 2000;
		jQuery.growl.settings.noticeCss = {
			opacity: 			.85,
			backgroundColor: 	'#333',
			color: 				'#ffffff',
			border: 			'1px solid',
			borderColor:		'#DDD #000 #000 #DDD',
			padding: 			'5px'
		};
		growlImage = jxbfRoot + 'icons/info.png';
	}

	if(xml.attr('sticky')== 'yes') {
		jQuery.growl.settings.displayTimeout = 0;
		jQuery.growl.settings.noticeTemplate =
		'<div class="notice sticky">' +
		' <h3 style="margin-top: 15px; "><img style="position:relative; top:2px; margin-right:10px;" src="%image%" /><a rel="close">%title%</a></h3>' +
		' <p>%message%</p>' +
		'</div>';
	} else {
		jQuery.growl.settings.noticeTemplate =
		'<div class="notice">' +
		' <h3 style="margin-top: 15px; "><img style="position:relative; top:2px; margin-right:10px;" src="%image%" /><a rel="close">%title%</a></h3>' +
		' <p>%message%</p>' +
		'</div>';
	}

	return growlImage;
}

/*
* some formatter-functions
*/
function formatted_date(input){

	var formatted = '';

	if(input != '') {
		formatted = input.substr(8,2)+'.'+input.substr(5,2)+'.'+input.substr(0,4);
	} else {
		formatted = input;
	}
	return formatted;
}
function formatted_datetime(input){

	var formatted = '';

	if(input != '') {
		formatted = input.substr(8,2)+'.'+input.substr(5,2)+'.'+input.substr(0,4)+' - '+input.substr(11,5)+' Uhr';
	} else {
		formatted = input;
	}
	return formatted;
}
function formatted_time(input){
	var formatted = ((input!='')?input+' Uhr':'');
	return formatted;
}
function formatted_price(input){
	var formatted = '';
	if(input != '') {
		formatted = parseFloat(input).toFixed(2).replace(/\./,',')+' &euro;';
	}
	return formatted;
}
function formatted_longtext(input){
	var formatted = input.replace(/\r\n|\n/g,"<br>")
	.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;")
	.replace(/  /g," &nbsp;");
	return formatted;
}
function formatted_flag(input){
	var formatted = getIcon(input);
	return formatted;
}
function formatted_icon(input){
	var formatted = getIcon(input);
	return formatted;
}
function formatted_image(input){
	var formatted = '<img src="'+input+'" alt="Bild">';
	return formatted;
}
function formatted_thumb(input){
	var formatted = '<img src="'+input+'" alt="Bild" class="scaleThumb" width="200" style="margin-top: 5px">';
	return formatted;
}

function uiFunction_print(xml) {
	return 'javascript:window.print()';
}

var waitMessage = '<img style="margin-top:20px" src="'+ jxbfRoot + 'img/ajax-loader-white.gif" /><h1>Bitte warten...</h1>';
var waitBackgroundColor = '#fff';
var waitTextColor = '#000';

/* set datepicker defaults (german) */
jQuery(function($){
	$.datepicker.regional['de'] = {
		closeText: 'schließen',
		prevText: '&#x3c;zurück',
		nextText: 'Vor&#x3e;',
		currentText: 'heute',
		monthNames: ['Januar','Februar','März','April','Mai','Juni',
		'Juli','August','September','Oktober','November','Dezember'],
		monthNamesShort: ['Jan','Feb','Mär','Apr','Mai','Jun',
		'Jul','Aug','Sep','Okt','Nov','Dez'],
		dayNames: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
		dayNamesShort: ['So','Mo','Di','Mi','Do','Fr','Sa'],
		dayNamesMin: ['So','Mo','Di','Mi','Do','Fr','Sa'],
		weekHeader: 'Wo',
		dateFormat: 'yy-mm-dd',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
		$.datepicker.setDefaults($.datepicker.regional['de']);

		$.timepicker.regional['de'] = {
			timeOnlyTitle: 'Zeit Wählen',
			timeText: 'Zeit',
			hourText: 'Stunde',
			minuteText: 'Minute',
			secondText: 'Sekunde',
			millisecText: 'Millisekunde',
			timezoneText: 'Zeitzone',
			currentText: 'Jetzt',
			closeText: 'Fertig',
			timeFormat: 'hh:mm',
			amNames: ['vorm.', 'AM', 'A'],
			pmNames: ['nachm.', 'PM', 'P'],
			ampm: false
		};
		$.timepicker.setDefaults($.timepicker.regional['de']);
	})


jQuery(document).ready(function(){

/*
* global tooltip
*/
jQuery('body')
	.on('mouseenter', '.tooltipTrigger, tr.toolTipRow td:not(.preventDefault)', function() {
		var content = jQuery(this).data('tooltip');
		var ttShow = false;

		if (
			typeof content == 'undefined'
			&& (
				!(content = jQuery(this).parent().data('tooltip'))
				|| (typeof content == 'undefined')
				)
			) {
				// tooltip via other element

				var ttSelector = jQuery(this).data('tooltipelement');
				if (typeof ttSelector == 'undefined') {
				// no tooltip
				}
				else
				{
					if (jQuery(ttSelector).length > 0) {
						content = jQuery(ttSelector).html();
						ttShow = true;
					}
				}
			}
			else
			{ // tooltip via data-tooltip of trigger or parent
				content = unescape(content);
				ttShow = true;
			}

			if (ttShow) {
				var $tooltip = jQuery('#tooltip_');
				if($tooltip .length == 0)
				{
					jQuery('body').append('<div id="tooltip_"></div>');
					$tooltip  = jQuery('#tooltip_').css({position:'absolute', top:'-1000px', left:'-1000px'});
				}
				$tooltip.html(content).show();
			}
	})
	.on('mouseleave', '.tooltipTrigger, tr.toolTipRow td:not(.preventDefault)', function() {
		jQuery('#tooltip_').hide();
	})
	.on('mousemove', '.tooltipTrigger, tr.toolTipRow td:not(.preventDefault)', function(e) {
		var win_height = jQuery(window).height();
		var win_width = jQuery(window).width();
		var tt_height = jQuery('#tooltip_').height();
		var tt_width = jQuery('#tooltip_').width();

		var tt = jQuery('#tooltip_');

		var x;
		var y;

		if (e.pageX <= (win_width/2)) {
			// to right
			x = e.pageX + 20;
		}
		else {
			// to left
			x = e.pageX - 40 - tt_width;
		}

		if (e.pageY <= (win_height/2 - tt_height/2)) {
			// down
			y = e.pageY + 20;
		}
		else if (e.pageY <= (win_height/2 + tt_height/2)) {
			// middle
			y = e.pageY - (tt_height/2);
		}
		else {
			// up
			y = e.pageY - 40 - tt_height;
		}

		if (y <= 10 || (y + tt_height) > win_height) {
			y = 10;
		}

		tt.css({top:y+'px', left:x+'px'});
		});
});
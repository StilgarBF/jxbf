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
	var uid = jQuery('body').data('id').toString();
	var c1 = ((parseInt(uid.substr(-1,1))*26)+10).toString(16);
		c1 = (c1.length==1? '0'+c1 : c1);
	var c2 = ((parseInt(uid.substr(-2,1))*26)+10).toString(16);
		c2 = (c2.length==1? '0'+c2 : c2);
	var c3 = ((parseInt(uid.substr(-3,1))*26)+10).toString(16);
		c3 = (c3.length==1? '0'+c3 : c3);
	
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

function createButton(type, url){
	var button = '';
	button += '<a class="edit" rel="xml" href="'+url+'">';
	if(type == 'new') {
		button += '<img src="'+ jxbfRoot + 'img/icon/plus_16.png" alt="neu erstellen" />';
	} else if (type == 'edit') {
		button += '<img src="'+ jxbfRoot + 'img/icon/clipboard_16.png" alt="bearbeiten" />';
	} else if (type == 'delete') {
		button += '<img src="'+ jxbfRoot + 'img/icon/delete_16.png" alt="loeschen" />';
	}
	button += '</a>';
	return button;
}


function getIcon(value) {
	var icon = '';
	switch(value) {
		case '1':
			icon += '<img src="'+ jxbfRoot + 'img/icon/tick_16.png" title="Ja" />';
			break;
		case '0':
			icon += '<img src="'+ jxbfRoot + 'img/icon/block_16.png" title="Nein" />';
			break;
		case '':
			icon += '<img src="'+ jxbfRoot + 'img/icon/block_16.png" title="Nein" />';
			break;
		case 'yes':
			icon += '<img src="'+ jxbfRoot + 'img/icon/tick_16.png" title="Ja" />';
			break;
		case 'no':
			icon += '<img src="'+ jxbfRoot + 'img/icon/block_16.png" title="Nein" />';
			break;
		case 'mail_to':
			icon += '<img src="'+ jxbfRoot + 'img/icon/right_16.png" title="In" />';
			break;
		case 'mail_from':
			icon += '<img src="'+ jxbfRoot + 'img/icon/left_16.png" title="Out" />';
			break;
		case 'note':
			icon += '<img src="'+ jxbfRoot + 'img/icon/document_16.png" title="Notiz" />';
			break;
		case 'maillog':
			icon += '<img src="'+ jxbfRoot + 'img/icon/letter_16.png" title="Mail" />';
			break;
		case 'calllog':
			icon += '<img src="'+ jxbfRoot + 'img/icon/bubble_16.png" title="Anruf" />';
			break;
		case 'typ_g':
			icon += '<img src="'+ jxbfRoot + 'img/icon/label_16.png" title="Grundstueck" />';
			break;
		case 'typ_p':
			icon += '<img src="'+ jxbfRoot + 'img/icon/user_16.png" title="Adresse" />';
			break;
		case 'typ_b':
			icon += '<img src="'+ jxbfRoot + 'img/icon/user_16.png" title="Bearbeiter" />';
			break;
		case 'typ_a':
			icon += '<img src="'+ jxbfRoot + 'img/icon/user_16.png" title="Admin" />';
			break;
		case 'application/pdf':
			icon += '<img src="'+ jxbfRoot + 'img/fileicon2/icon_pdf.gif" title="pdf" />';
			break;
		case 'image/gif':
		case 'image/jpeg':
		case 'image/png':
		case 'image/tiff':
			icon += '<img src="'+ jxbfRoot + 'img/fileicon2/icon_image.gif" title="image" />';
			break;
		case 'text/plain':
			icon += '<img src="'+ jxbfRoot + 'img/fileicon2/icon_txt.gif" title="text" />';
			break;
		case 'application/msword':
			icon += '<img src="'+ jxbfRoot + 'img/fileicon2/icon_doc.gif" title="doc" />';
			break;
		case 'application/msexcel':
			icon += '<img src="'+ jxbfRoot + 'img/fileicon2/icon_xls.gif" title="xls" />';
			break;
		case 'directory':
			icon += '<img src="'+ jxbfRoot + 'img/icon/folder_16.png" title="Ordner" />';
			break;
		case 'attachment':
			icon += '<img src="'+ jxbfRoot + 'img/icon/attachment.png" title="Anhang" />';
			break;
		case 'related':
			icon += '<img src="'+ jxbfRoot + 'img/icon/related.png" title="Anhang" />';
			break;

		case 'backend':
			icon += '<img src="'+ jxbfRoot + 'img/icon/gear_16.png" title="Backend" />';
			break;
		case 'website':
			icon += '<img src="'+ jxbfRoot + 'img/icon/globe_16.png" title="Website" />';
			break;
		case 'user':
			icon += '<img src="'+ jxbfRoot + 'img/icon/user_16.png" title="Benutzer" />';
			break;

		case 'angebot':
			icon += '<img src="'+ jxbfRoot + 'img/icon/offer.gif" title="Angebot" />';
			break;
		case 'option':
			icon += '<img src="'+ jxbfRoot + 'img/icon/option.gif" title="Option" />';
			break;
		case 'best_option':
			icon += '<img src="'+ jxbfRoot + 'img/icon/oreservation.gif" title="bestaetigte Option" />';
			break;
		case 'option abgelaufen':
			icon += '<img src="'+ jxbfRoot + 'img/icon/option_expired.gif" title="Option abgelaufen" />';
			break;
		case 'reservierung':
			icon += '<img src="'+ jxbfRoot + 'img/icon/reserv.gif" title="Reservierung" />';
			break;
		case 'sperrung':
			icon += '<img src="'+ jxbfRoot + 'img/icon/na.gif" title="Sperrung" />';
			break;
		case 'blockierung':
			icon += '<img src="'+ jxbfRoot + 'img/icon/blocked.gif" title="Blockierung" />';
			break;
	}

	return icon;
}

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
		growlImage = jxbfRoot + 'img/icon/warning_16.png';

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
		growlImage = jxbfRoot + 'img/icon/stop_16.png';

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
		growlImage = jxbfRoot + 'img/icon/tick_16.png';
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


var zimmerplan = false;
jQuery(document).ready(function(){

	jQuery('#zp_link').bind('click',function(e){
		e.preventDefault();
		if(zimmerplan && (zimmerplan && !zimmerplan.closed)) {
			zimmerplan.focus();
		} else {
			var href=jQuery(this).attr('href')+'&uid='+jQuery('body').data('id');
			zimmerplan=window.open(href, 'zimmerplan', 'width=' + screen.width + ',height=' + screen.height + ',left=0,top=0,status=no,scrollbars=yes,resizable=yes,menubar=no,toolbar=no');
			zimmerplan.focus();
		}
	});
});


var waitMessage = '<img style="margin-top:20px" src="'+ jxbfRoot + 'img/ajax-loader-white.gif" /><h1>Bitte warten...</h1>';
var waitBackgroundColor = '#fff';
var waitTextColor = '#000';


function aplan_kalender_popup_dayclick(date, allDay, jsEvent, view) {
	var $thisCal = jQuery(jsEvent.currentTarget).parents('.fullCalendar.fc');
	if(view.name == 'agendaDay')
	{
                var startdate = jQuery.fullCalendar.formatDate(date, 'yyyy-MM-dd HH:mm');
		window.opener.jQuery('#n_termin_start').val(startdate);

                var enddateObj = new Date(Date.parse(date) + 1000*60*60);
                var enddate = jQuery.fullCalendar.formatDate(enddateObj, 'yyyy-MM-dd HH:mm');
                window.opener.jQuery('#n_termin_ende').val(enddate);

                window.close();
	}
	else
	{
		$thisCal.fullCalendar('gotoDate', date);
		$thisCal.fullCalendar('changeView', 'agendaDay');
	}
}

function aplan_kalender_popup_eventclick(event, jsEvent, view) {
    
}
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
	Calendar
 ****************************************************************/
function parse_calendar(xml) {
	var $calendar = jQuery(xml);
	var settings = $calendar.children('settings').text();
		settings =  settings.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
		
	var eventdata = '{';
	
	if($calendar.children('calendarnavigation').length != 0)
	{
		calnavigation = navigation2Object($calendar.children('calendarnavigation'));
		var first = true;
		jQuery.each(calnavigation.entries, function(i,e){

			if(this.context == 'dayclick') {

				eventdata	+= (first ? '' : ',') + '"dayclickaction":'+JSON.stringify(this);
				first = false;
				
			} else if(this.context == 'eventclick') {

				eventdata	+= (first ? '' : ',') + '"eventclickaction":'+JSON.stringify(this);
				first = false;
				
			}
		});
	}
	eventdata += '}';
	
	var feed = '';
	if($calendar.attr('feed') != undefined)
	{
		feed = '"feed":"'+$calendar.attr('feed')+'", ';
	}
	var html = '<div class="fullCalendar" id="'+$calendar.attr('name')+'" data-calendar=\'{'+feed+'"settings":"'+settings+'", "eventdata":'+eventdata+'}\'></div>';

	return html;
}

/*****************************
 * event-binding
 *****************************/
jxbf.bind('xmlparse.postparse', function(){
	var calDefaults = {
		weekMode: 'liquid',								// in monatsansicht nur so viele wochen wie nötig
		firstDay: 1,									// start mit Montag
		header: {										// navigation
			left: 'title',
			right: 'month,agendaWeek,agendaDay today prev,next'
		},
		
		dayClick: calDayClick,
		
		eventClick: calEventClick,
		
		eventMouseover: function(event,jsEvent, view) {
			if(event.tooltip != undefined)
			{
					// show tooltip for event
					if(jQuery('#tooltip_').length == 0) {
						jQuery('body').append('<div id="tooltip_"></div>');
						jQuery('#tooltip_').css({position:'absolute', width:'400px', top:'100px', left:'100px'});
						var tt = jQuery('#tooltip_');
							tt.show();
							tt.html(event.tooltip);
							
						var win_height = jQuery(window).height();
						var x = jsEvent.pageX - (tt_width / 2);
						var y = jsEvent.pageY + 10;

						if(jsEvent.pageY > (win_height/2)) {
							var tt_height = tt.outerHeight(true);
							y = jsEvent.pageY - 10 - tt_height;
						}
							tt.css({top:y+'px', left:x+'px'});
					}
			}
		},
		eventMouseout: function(event,jsEvent, view) {
			jQuery('#tooltip_').remove();
		},
		/*********
		 * translation
		 *********/
		monthNames: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
		monthNamesShort: ['Jan','Feb','März','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
		dayNames: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
		dayNamesShort: ['So','Mo','Di','Mi','Do','Fr','Sa'],
		buttonText: {
				today:    'heute',
				month:    'Monat',
				week:     'Woche',
				day:      'Tag'
			},
		titleFormat: {
				month: 'MMMM yyyy',                             // September 2009
				week: "d[ MMM][ yyyy]{ '-' d MMMM yyyy}", 		// 18 - 24 April 2011
				day: 'dddd, d. MMMM yyyy'                  		// Mittwoch, 20. April 2011
			},
		columnFormat: {
				month: 'ddd',
				week: 'ddd d.M.',
				day: 'dddd d.M.yyyy'
			},
		timeFormat: {
				agenda: 'H:mm{ - H:mm}',
				'': 'H:mm'
		},
		axisFormat: 'H:mm',
		allDayText: 'ganzt&auml;gig'
	};	// end defaults
	
	jQuery('.fullCalendar').not('.fc').each(function()
	{
		var $this = jQuery(this);
		var $container = $this.parents('.panel_content');
		var iH = $container.innerHeight() - parseInt($container.css('paddingTop')) - parseInt($container.css('paddingBottom')) -20;
		
		if($this.parents('.tab').length > 0)
		{
			// inside tab - sub tabhead
			iH = iH - $container.find('ul.tabs').outerHeight(true);
		}
		if($this.closest('.section').siblings('.section').length > 0)
		{
			// other sections in here!
			$.each($this.closest('.section').siblings('.section'),function(){
				iH = iH - $(this).outerHeight(true);
			});
		}

		var xmlSettings = {};
		if($this.data('calendar').settings)
		{
			eval( 'xmlSettings = '+$this.data('calendar').settings );
		}
		
		// default setting
		var feedUrl = $this.data('calendar').feed;
		var settings = {
				height: iH,
			};
		if(feedUrl)
		{
			settings.eventSources = [{url: feedUrl,
									type: 'POST'}];
		}
		
		var ts = jQuery.extend(calDefaults, settings, xmlSettings);
		
		$this.fullCalendar( jQuery.extend(settings, calDefaults, xmlSettings) );
	});
	
	$('.fc-event').live('mousemove', mouseMoveOverEvent);
	
});
// before parsing new content - remove delegated events fpr tooltip
jxbf.bind('xmlparse.preparse', function(){
	$('.fc-event').die('mousemove', mouseMoveOverEvent);
});

function mouseMoveOverEvent(e)
{
	var tt = jQuery('#tooltip_');
	if(tt.length > 0)
	{
		var win_height = jQuery(window).height();
		var win_width = jQuery(window).width();
		var x = e.pageX - (tt_width / 2);
		var y = e.pageY + 10;
		var tt_height = tt.outerHeight(true);
		var tt_Width = tt.outerWidth(true);
		if(e.pageY > (win_height/2)) {
			var tt_height = tt.outerHeight(true);
			y = e.pageY - 10 - tt_height;
		}
		if((x+tt_Width + 10) > (win_width)) {
			x = win_width - tt_Width - 10;
		}
			tt.css({top:y+'px', left:x+'px'});
	}
}

function calDayClick(date, allDay, jsEvent, view)
{
	var $thisCal = jQuery(jsEvent.currentTarget).parents('.fullCalendar.fc');
	if(view.name == 'agendaDay')
	{
		/*
		var data = {
			action : 'dayClick',
			clickedDate : jQuery.fullCalendar.formatDate(date, 'yyyy-MM-dd HH:mm:ss'),
			calendarID : $thisCal.attr('id')
		};

		jQuery.ajax({
					url:		buildURL(),
					data:		data,
					dataType:	'xml',
					type:		'get',
					success:	function(response) {
									parseXML(response);

									jQuery.unblockUI();
								}
				});
		*/
	}
	else
	{
		$thisCal.fullCalendar('gotoDate', date);
		$thisCal.fullCalendar('changeView', 'agendaDay');
	}
}
function calEventClick(event,jsEvent, view)
{
	var $thisCal = jQuery(jsEvent.currentTarget).parents('.fullCalendar.fc');
	
	if( (!$.browser.msie && jsEvent.button == 0) || ($.browser.msie &&  jsEvent.button == 1) ) {
		var click = $thisCal.data('calendar').eventdata.eventclickaction;

		if(click.relation == 'xml') {
			jQuery.ajax({
				url:		buildURL(click.target),
				data:		'id=' + event.id,
				dataType:	'xml',
				type:		'get',
				success:	function(response) {
								parseXML(response);

								jQuery.unblockUI();
							},
				jxbfDefault: true
			});
		} else if(click.linkTarget) {
			window.open(buildURL(click),click.linkTarget);
		}
	}
}


jxbf.bind('window.resize', function(){
	jQuery('.fullCalendar.fc').each(function()
	{
		var $container = jQuery(this).parents('.panel_content');
		var iH = $container.innerHeight() - parseInt($container.css('paddingTop')) - parseInt($container.css('paddingBottom')) -20;
		jQuery(this).fullCalendar('option', 'height', iH );
	});
})
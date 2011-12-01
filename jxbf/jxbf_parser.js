/*
 * jxbf v 1.2.5
 * JavaScript xml Browser Framework
 */

var jxbf = $(document);

jQuery(document).ready(function(){

	jQuery(window).resize(
		function(){setPanelHeight();
		// trigger resize
		jxbf.trigger('window.resize');
	});

	urlAppendChar = '';

	if (geturl.indexOf('?') >= 0) {
			urlAppendChar = '&';
	} else {
			urlAppendChar = '?';
	}

	jQuery(document)
		.ajaxStart(function(e, xhr, settings){
						jQuery.blockUI({
							message: waitMessage,
							css: { backgroundColor: waitBackgroundColor, color: waitTextColor },
							fadeOut:  0
						});
						$('#tooltip_').remove();
					})
		.ajaxError(function(event, request, settings, thrownError){
						var errorhtml='<h2>Fehler</h2><p>bei dieser Aktion ist ein Fehler aufgetreten.</p><p>Sollte dies wiederholt geschehen kontaktieren Sie bitte den zust&auml;ndigen Admin mit einer genauen Fehlerbeschreibung und Schritten zur Reproduktion</p><p>Wir bitten um Entschuldigung f&uuml;r die Unannehmlichkeiten.</p>';
							errorhtml+='<pre>'+htmlentities(request.responseText)+'</pre>';
						jQuery("#overlay div.ocWrapper").html(errorhtml);
						jQuery.unblockUI();
						openOverlay();
					})
		.ajaxComplete(function(e, xhr, settings){
			if(typeof(settings.jxbfDefault) != 'boolean')
			{
				jQuery.unblockUI();
			}
		});

	var loc=document.location.href;
	if(loc.indexOf('uid=')<1) {

		var newDate = new Date;
		jQuery('body').data('id',newDate.getTime());

		if(loc.indexOf('?')==-1) {
			document.location.href=loc+'?uid=' + jQuery('body').data('id');
		} else {
			document.location.href=loc+'&uid=' + jQuery('body').data('id');
		}

	} else {

		var a = urlparse(loc);
		jQuery.each(a[0]['args'],function(i,val){
			if(val['key']=='uid') {
				jQuery('body').data('id',val['value']);
			}
		});

		jQuery.ajax({
			url:		geturl,
			data:		'action=start&uid=' + jQuery('body').data('id'),
			dataType:	'xml',
			type:		'POST',
			
			success:	function(response) {
			
							parseXML(response);

							jQuery.unblockUI();

						},

			error:		function(event, request, settings, thrownError){
							var errorhtml='<h2>Fehler</h2><p>bei dieser Aktion ist ein Fehler aufgetreten.</p><p>Sollte dies wiederholt geschehen kontaktieren Sie bitte den zust&auml;ndigen Admin mit einer genauen Fehlerbeschreibung und Schritten zur Reproduktion</p><p>Wir bitten um Entschuldigung f&uuml;r die Unannehmlichkeiten.</p>';
								errorhtml+='<pre>'+htmlentities(request.responseText)+'</pre>';
							jQuery("#overlay div.ocWrapper").html(errorhtml);
							jQuery.unblockUI();
							openOverlay();
						},
						
			jxbfDefault: true

		}); // end initial ajax

		var api = jQuery("#overlay").overlay({
									api:true,
									closeOnClick: false,
									mask: {
								        color: '#333',
								        loadSpeed: 200,
								        opacity: 0.9
								    },
									expose: {
								        color: '#333',
								        loadSpeed: 200,
								        opacity: 0.9
								    }
								});
		// define function that opens the overlay
		window.openOverlay = function() {
			api.load();
			jQuery('.ocWrapper')[0].scrollTop=0;
			console.log('open');
		}

		api.onBeforeClose(function(){
			jQuery("#overlay .datetimepick, #overlay .timepick, #overlay .datepick").AnyTime_noPicker();
			jQuery("#overlay div.ocWrapper")[0].innerHTML = '';
		});

		window.closeOverlay = function() {
			api.close();

		}

		jQuery.growl.settings.displayTimeout = 3000;
		jQuery.growl.settings.dockCss = {
			position: 			'absolute',
			left: 				'10px',
			bottom: 			'30px',
			width: 				'200px',
			zIndex:				'1002'
		};
		jQuery.growl.settings.noticeCss = {
			opacity: 			.85,
			backgroundColor: 	'#333',
			color: 				'#ffffff',
			border: 			'1px solid',
			borderColor:		'#DDD #000 #000 #DDD',
			padding: 			'5px'
		};
		jQuery.growl.settings.noticeTemplate =
			'<div class="notice">' +
			' <h3 style="margin-top: 15px; "><img style="position:relative; top:2px; margin-right:10px;" src="%image%" /><a rel="close">%title%</a></h3>' +
			' <p>%message%</p>' +
			'</div>';

		site_init();

		bindLive();

	} // end check for uid in url - else

	jQuery(window).resize(function(){setPanelHeight();});

});

var tempObject	= {};
var lastUID		= 0;
var validate 	= new Array();

function flushTemp() {
	tempObject = {};
	tempObject.confirmMessage = new Array();
	tempObject.multiselect = new Array();
}
flushTemp();

function parseXML(xml) {

	// trigger pre-parse
	jxbf.trigger('xmlparse.preparse');

	// check for navigation
	if((jQuery(xml).find('mainnavigation').length > 0) && (jQuery('#mainnavigation').length > 0)) {
		//jQuery('#mainnavigation .navigation').replaceWith( parse_navigation( navigation2Object(jQuery(xml).find('mainnavigation')) ) );
		jQuery('#mainnavigation')[0].innerHTML=parse_navigation( navigation2Object(jQuery(xml).find('mainnavigation')) ) ;
	}

	// process panel

	validate = new Array();

	view='';

	if(jQuery(xml).find('statuspanel').length > 0) {
		jQuery(xml).find('statuspanel').each(function(){

			 view += parseStatusPanel(jQuery(this));

		});

		jQuery('#left_collumn #statusPanel').remove();
		jQuery('#left_collumn').append('<div id="statusPanel" class="left_panel">'+view+'</div>');

	}

	// process panel
	view='';

	var panels = jQuery(xml).find('panel');

	if(panels.length > 0) {

		panels.each(function(){
			 view += parsePanel(jQuery(this));
		});
		jQuery("#main_collumn .datetimepick, #main_collumn .timepick, #main_collumn .datepick").AnyTime_noPicker();
		document.getElementById("main_collumn").innerHTML = view;

		jQuery('#main_collumn script').each(function(){
			eval( jQuery(this).text() );
		});

	}


	// process overlay
	view = '';

	if(jQuery(xml).find('overlay').length > 0) {

		var overlay = jQuery(xml).find('overlay')[0];

		if(jQuery(overlay).attr('title') != undefined) {
			view += '<h2>'+jQuery(overlay).attr('title')+'</h2>';
		}

		jQuery(overlay).find('section').each(function(){

			view += parseSection(jQuery(this));

		});

		//jQuery("#overlay div.ocWrapper").html('').html(view);
		jQuery("#overlay div.ocWrapper")[0].innerHTML = view;
		openOverlay();
		jQuery('#overlay div.ocWrapper script').each(function(){
			eval( jQuery(this).text() );
		});

	} else {
		closeOverlay();
	}

	// messages (growl)
	if((jQuery(xml).find('clearStickyMessages').length > 0) && (jQuery(xml).find('clearStickyMessages').text() == 'yes')) {
		jQuery('#growlDock .sticky a[rel=close]').click();
	};
	jQuery(xml).find('message').each(function(){

		 parseMessage(jQuery(this));

	});

	bindEvents();

	bindMessages();

	// trigger pre-parse
	jxbf.trigger('xmlparse.postparse');

	flushTemp();

}

function parseStatusPanel(xml){
	var view = '';
	jQuery(xml).find('section').each(function(){
		view += parseSection(jQuery(this));
	});
	return view;
}

function parsePanel(xml) {
	var title	= jQuery(xml).attr('title');
	var width	= jQuery(xml).attr('width');
	var height	= jQuery(xml).attr('height');
	var pan_id	= jQuery(xml).attr('name');
	var state	= jQuery(xml).attr('state');

	var view	='';

	if (String(parseInt(width)) != width) { // string like half, full, third ..
		view		+= '<div class="fl_panel '+width+'" id="'+pan_id+'" '+((state == 'hidden')?'style="display:none;"':'')+'>';
	} else {								// int
		view		+= '<div class="fl_panel p_w_calc {W:'+width+'}" id="'+pan_id+'" '+((state == 'hidden')?'style="display:none;"':'')+'>';
	}


	view	+='<div class="panel_inner"><div class="panel_head"><div class="panel_head_inner">'+title+'</div></div>';

	if (String(parseInt(height)) != height) { 	// string like half, full, third ..
		view		+= '<div class="panel_content pc_h_'+height+'">';
	} else {									// int
		height = parseInt(height);
		if (height > 0) {
			view		+= '<div class="panel_content pc_h_calc {H:'+height+'}" style="height:'+height+'px;">';	//min-height:'+height+'px;height:auto!important;
		} else if (height < 0) {
			view		+= '<div class="panel_content pc_h_calc {H:'+height+'}" style="height:'+(height*(-1))+'px;">';
		} else {
			view		+= '<div class="panel_content">';
		}
	}

	jQuery(xml).children('section').each(function(){

		view += parseSection(jQuery(this));

	});

	view		+= '</div></div></div>';

	return view;
}

function parseSection(xml) {
	var sec_id	= jQuery(xml).attr('name');
	var state	= jQuery(xml).attr('state');
	var firstChild = xml.children(':first');

	var _view = '<div class="section" id="'+sec_id+'" '+((state == 'hidden')?'style="display:none;"':'')+'>';
	
	if(firstChild.length != 0)
	{
		tagname = firstChild[0].nodeName;

		if(typeof window['parse_'+tagname] == 'function') {
			_view += window['parse_'+tagname](firstChild);
		}
	}
	_view	+= '</div>';
	return _view
}

function parse_htmlcontent(xml) {
	return xml.text();
}


function parseMessage (xml){
	var title = xml.find('title').text();
	var text = xml.find('text').text();

	var growlImage = setMessageStyle(xml);		// site.js

	jQuery.growl(title ,text, growlImage);
}

/************************************
 * bind events to new Elements		*
 ************************************/

function bindLive() {
	// called only once on document ready
	// bind all jQuery.live() events

	jQuery('td:not(.preventDefault)')
		.live('click',function(e){
			if( (!$.browser.msie && e.button == 0) || ($.browser.msie &&  e.button == 1) ) {
					var click = jQuery.extend({}	,jQuery(this).parents('table').metadata().clickaction);
						click.para = jQuery.extend(click.para	,jQuery(this).parents('tr').metadata().clickaction);

					if(click.relation == 'xml') {
						jQuery.ajax({
							url:		buildURL(click),
							data:		'id=' + jQuery(this).parent().attr('id'),
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

			});

	jQuery('ul.tabs a')
		.live('click', function(e){
			e.preventDefault();
			var target = jQuery(this).attr('href');
				target = target.substring(1);

			jQuery(this).parents('ul.tabs').find('li').removeClass('tab_active');
			jQuery(this).parents('ul.tabs li').addClass('tab_active');

			var parent = jQuery(this).parents('div.section');
			var tabs = parent.find('div.tab');
			jQuery.each(tabs, function (i, e){
				if(jQuery(this).is('#'+target)) {
					jQuery(this).show();
				} else {
					jQuery(this).hide();
				}
			});
		});


	jQuery('input.select_all').live('click', function() {
		if(jQuery(this).is(':checked')) {
			jQuery(this).parents('table').find('tbody .row_select').attr('checked','checked');
		} else {
			jQuery(this).parents('table').find('tbody .row_select').removeAttr('checked');
		}
	});



	jQuery('a[rel^=toggle]')
		.live('click', function(e){
				e.preventDefault();
				var target = jQuery(this).attr('rel').replace(/toggle_/g,'');
				jQuery('#'+target).toggle();
			});



	jQuery('li.dir > span').live('click',function(){
		jQuery(this).siblings('ul').toggle();
	});

	jQuery('a[rel=xml]').live('click', function(e){
			if( (!$.browser.msie && e.button == 0) || ($.browser.msie &&  e.button == 1) ) {
				e.preventDefault();

				var check = false;

				if(jQuery(this).hasClass('confirmation')) {
					var question="Soll diese Aktion wirklich gel�scht werden?";
					if(jQuery(this).data('confirmMessage') != '') {
						question=jQuery(this).data('confirmMessage');
					}
					check = confirm(question);
				} else {
					check = true;
				}

				if(check) {

					var add_data = false;
					if(jQuery(this).is('[class*=multiselect]')) {
						var target_id=jQuery(this).attr('class').replace(/^[\w\W]*?multiselect_([^ ]+)[\w\W]*$/,'$1');
						add_data = jQuery('#'+target_id).parents('form').serialize();
					}

					XMLUrl(jQuery(this).attr('href'), add_data);
				}
			}
	});

}

var tt_height	= 50;
var tt_width	= 300;
function bindEvents(){
	if (jQuery('.metadata').length > 0) {
		jQuery('.metadata').metadata();
	}

	setPanelHeight();

	jQuery('.scaleThumb').bind('mouseenter',scaleThumb);

}
/*****************************************/
/* set size of panels					 */
/*****************************************/
var space_around_panel = 0;
var additionalSpace = 2;  // gegen rundungsfehler
function setPanelHeight() {
	// calculate dif betw. inner and outer pannel size
	if( !space_around_panel) {
		var first_panel = jQuery('.fl_panel:first');
		var first_panel_content = jQuery('.panel_content', first_panel);
		space_around_panel = parseInt(first_panel_content.css('padding-top')) + parseInt(first_panel_content.css('padding-bottom'));
		space_around_panel += (parseInt(first_panel_content.css('border-top-width')) + parseInt(first_panel_content.css('border-bottom-width')));
		space_around_panel += parseInt(first_panel_content.siblings('.panel_head').height());
		space_around_panel += parseInt(jQuery('.panel_inner', first_panel).css('margin-bottom'));
	}

	var win_height = jQuery(window).height()
						- ( parseInt(jQuery('body').css('padding-top')) + parseInt(jQuery('body').css('padding-bottom')) )
						- additionalSpace;
		win_height = parseInt(win_height);

	var win_width = parseInt(jQuery('#main_collumn').width());

	jQuery(".fl_panel .panel_content[class*='pc_h_']").each(function() {
		var panel_height = win_height;

			if (jQuery(this).hasClass('pc_h_half')){
				panel_height = Math.round(panel_height / 2);

			} else if (jQuery(this).hasClass('pc_h_third')){
				panel_height = Math.round(panel_height / 3);

			} else if (jQuery(this).hasClass('pc_h_twothird')){
				panel_height = Math.round(panel_height / 3 * 2);

			} else if (jQuery(this).hasClass('pc_h_fourth')){
				panel_height = Math.round(panel_height / 4);

			} else if (jQuery(this).hasClass('pc_h_threefourth')){
				panel_height = Math.round(panel_height / 4 * 2);


			} else if (jQuery(this).hasClass('pc_h_calc')){
				var h = jQuery(this).metadata().H;
				if(h < 0) {
					panel_height = win_height + h;
				} else {
					panel_height = h;
				}

			}

			panel_height = panel_height - space_around_panel;
			panel_height = panel_height + 'px';

		jQuery(this).css({
			height: panel_height
		});
	});

	// setting width
	jQuery(".fl_panel.p_w_calc").each(function() {
		var w = jQuery(this).metadata().W;
		var panel_width = 0;

		if(w > 0) {
			panel_width = w;
		} else {
			panel_width = win_width + w;
		}

		jQuery(this).css({
			width: panel_width+'px'
		});
	});
}
/*****************************************/
/* scale up a thumbnail					 */
/*****************************************/
function scaleThumb() {

	jQuery('#thumbBig').remove();

	var src	= jQuery(this).attr('src');

		// dimensions of thumbnail
	var w	= parseInt(jQuery(this).width());
	var h	= parseInt(jQuery(this).height());

		// real dimensions of image
	var nw	= jQuery(this).context.naturalWidth;
	var nh	= jQuery(this).context.naturalHeight;

		// position of thumbnail
	var x	= Math.floor(jQuery(this).offset().left);
	var y	= Math.floor(jQuery(this).offset().top);

	var big = jQuery('<img src="'+src+'" width="'+w+'" height="'+h+'" id="thumbBig" style="position:absolute; top:'+y+'px; left:'+x+'px;z-index:1000;" />');
	jQuery('body').append(big);

	jQuery('#thumbBig')
		.animate({'width':nw+'px','height':nh+'px'},400)
		.bind('mouseleave',function(){jQuery(this).remove();});
}


/*****************************************/
/* get a url - fetch content - parse xml */
/*****************************************/
function XMLUrl(url , data) {
	jQuery.ajax({
		url:		url,
		dataType:	'xml',
		type:		'post',
		data:		data,
		success:	function(response) {
						parseXML(response);
						jQuery.unblockUI();
					},
		jxbfDefault: true
	});
}

function addSuggest(element) {
	var html = '<div class="dyn_suggest"><ul>';

	var options = element.data('options');
	jQuery.each(options,function(){
		html += '<li>'+this+'</li>';
	});
		html += '</ul></div>';
	element.after(html);

	element.siblings('.dyn_suggest').find('li').bind('click', function(){
		jQuery(this).parents('.block').find('.inputSuggest').val(jQuery(this).html());
		jQuery(this).parents('.dyn_suggest').hide();
	})
}

function mergeDateTime(field) {
	var parent = field.parents('.block');
	var date   = ((parent.find('.date').val() != '') ? parent.find('.date').val() : '0000-00-00');
	var time   = ((parent.find('.time').val() != '') ? parent.find('.time').val() : '00:00');
	parent.find('.datetime').val(date +' '+ time);
}

function getUID() {
	if(lastUID >= 10000000){lastUID = 500}
	++lastUID;
	return lastUID;
}


function urlparse( str )
{
    var arr = str.split('#');

    var result = new Array();
    var ctr=0;
    jQuery.each(arr, function(i,part)
    {
        var qindex = part.indexOf('?');
        result[ctr] = {};
        if( qindex==-1 )
        {
            result[ctr].mid=part;
            result[ctr].args = [];
            ctr++;
            //continue;
			return 'x';
        }
        result[ctr].mid = part.substring(0,qindex);
        var args = part.substring(qindex+1);
        args = args.split('&');
        var localctr = 0;
        result[ctr].args = new Array();

		jQuery.each(args, function(i,val)
        {
            var keyval = val.split('=');
            result[ctr].args[localctr] = new Object();
            result[ctr].args[localctr].key = keyval[0];
            result[ctr].args[localctr].value = keyval[1];
            localctr++;
        });
        ctr++;
    });
    return result;
}

function htmlentities(string,quote_style){var hash_map={},symbol='',tmp_str='',entity='';tmp_str=string.toString();if(false===(hash_map=this.get_html_translation_table('HTML_ENTITIES',quote_style))){return false;}
hash_map["'"]='&#039;';for(symbol in hash_map){entity=hash_map[symbol];tmp_str=tmp_str.split(symbol).join(entity);}
return tmp_str;}
function get_html_translation_table(table,quote_style){var entities={},hash_map={},decimal=0,symbol='';var constMappingTable={},constMappingQuoteStyle={};var useTable={},useQuoteStyle={};constMappingTable[0]='HTML_SPECIALCHARS';constMappingTable[1]='HTML_ENTITIES';constMappingQuoteStyle[0]='ENT_NOQUOTES';constMappingQuoteStyle[2]='ENT_COMPAT';constMappingQuoteStyle[3]='ENT_QUOTES';useTable=!isNaN(table)?constMappingTable[table]:table?table.toUpperCase():'HTML_SPECIALCHARS';useQuoteStyle=!isNaN(quote_style)?constMappingQuoteStyle[quote_style]:quote_style?quote_style.toUpperCase():'ENT_COMPAT';if(useTable!=='HTML_SPECIALCHARS'&&useTable!=='HTML_ENTITIES'){throw new Error("Table: "+useTable+' not supported');}
entities['38']='&amp;';if(useTable==='HTML_ENTITIES'){entities['160']='&nbsp;';entities['161']='&iexcl;';entities['162']='&cent;';entities['163']='&pound;';entities['164']='&curren;';entities['165']='&yen;';entities['166']='&brvbar;';entities['167']='&sect;';entities['168']='&uml;';entities['169']='&copy;';entities['170']='&ordf;';entities['171']='&laquo;';entities['172']='&not;';entities['173']='&shy;';entities['174']='&reg;';entities['175']='&macr;';entities['176']='&deg;';entities['177']='&plusmn;';entities['178']='&sup2;';entities['179']='&sup3;';entities['180']='&acute;';entities['181']='&micro;';entities['182']='&para;';entities['183']='&middot;';entities['184']='&cedil;';entities['185']='&sup1;';entities['186']='&ordm;';entities['187']='&raquo;';entities['188']='&frac14;';entities['189']='&frac12;';entities['190']='&frac34;';entities['191']='&iquest;';entities['192']='&Agrave;';entities['193']='&Aacute;';entities['194']='&Acirc;';entities['195']='&Atilde;';entities['196']='&Auml;';entities['197']='&Aring;';entities['198']='&AElig;';entities['199']='&Ccedil;';entities['200']='&Egrave;';entities['201']='&Eacute;';entities['202']='&Ecirc;';entities['203']='&Euml;';entities['204']='&Igrave;';entities['205']='&Iacute;';entities['206']='&Icirc;';entities['207']='&Iuml;';entities['208']='&ETH;';entities['209']='&Ntilde;';entities['210']='&Ograve;';entities['211']='&Oacute;';entities['212']='&Ocirc;';entities['213']='&Otilde;';entities['214']='&Ouml;';entities['215']='&times;';entities['216']='&Oslash;';entities['217']='&Ugrave;';entities['218']='&Uacute;';entities['219']='&Ucirc;';entities['220']='&Uuml;';entities['221']='&Yacute;';entities['222']='&THORN;';entities['223']='&szlig;';entities['224']='&agrave;';entities['225']='&aacute;';entities['226']='&acirc;';entities['227']='&atilde;';entities['228']='&auml;';entities['229']='&aring;';entities['230']='&aelig;';entities['231']='&ccedil;';entities['232']='&egrave;';entities['233']='&eacute;';entities['234']='&ecirc;';entities['235']='&euml;';entities['236']='&igrave;';entities['237']='&iacute;';entities['238']='&icirc;';entities['239']='&iuml;';entities['240']='&eth;';entities['241']='&ntilde;';entities['242']='&ograve;';entities['243']='&oacute;';entities['244']='&ocirc;';entities['245']='&otilde;';entities['246']='&ouml;';entities['247']='&divide;';entities['248']='&oslash;';entities['249']='&ugrave;';entities['250']='&uacute;';entities['251']='&ucirc;';entities['252']='&uuml;';entities['253']='&yacute;';entities['254']='&thorn;';entities['255']='&yuml;';}
if(useQuoteStyle!=='ENT_NOQUOTES'){entities['34']='&quot;';}
if(useQuoteStyle==='ENT_QUOTES'){entities['39']='&#39;';}
entities['60']='&lt;';entities['62']='&gt;';for(decimal in entities){symbol=String.fromCharCode(decimal);hash_map[symbol]=entities[decimal];}
return hash_map;}
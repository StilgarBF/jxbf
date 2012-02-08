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

/************************************
 * parse Main Navigation			*
 * and some utility-functions		*
 ************************************/
function parse_navigation(navObject, settings) {
	
	if(!jQuery.isArray(navObject.entries) )
	{
		// if parsed from a section navObject is not the object but XML - convert
		navObject = navigation2Object(navObject);
	}

	settings=jQuery.extend({
		data:		false,
		showImage:	true,
		showTitle:	true,
		context:	false,
		idSuffix:	false
	},settings);

	// a navigation will always replace the old naviagtion
	v_class="navigation clearfix "+((navObject.v_class) ? navObject.v_class : '');

	var html = '<ul class="'+v_class+'">';
	html += createNavLevel(navObject,settings);
	html += '</ul>';

	return html;
}

function navigation2Object(xml) {

	var navObject = {};
	navObject.v_class=((jQuery(xml).is('[class]')) ? jQuery(xml).attr('class') : false);

	navObject.entries=new Array();
	jQuery(xml).children('entry').each(function(){

		var thisEntry		= {};

		var thisXML			= jQuery(this);

		thisEntry.id		= getUID();

		thisEntry.relation	=((thisXML.children('relation').length > 0) ? thisXML.children('relation').text() : false);
		if(thisXML.find('target > name').length != 0) {
			thisEntry.relation += '_'+thisXML.find('target > name').text();
		}

		thisEntry.confirm	= ((thisXML.attr('confirm') == 'yes') ? true : false);
		thisEntry.confirmMessage= ((thisXML.children('confirmationMessage').text() != '') ? thisXML.children('confirmationMessage').text() : false);

		thisEntry.context	= ((thisXML.attr('context') != undefined) ? 		thisXML.attr('context') : false);

		thisEntry.title		= ((thisXML.children('title').text() != '') ?		thisXML.children('title').text() : 		false);

		thisEntry.image		= ((thisXML.children('image').text() != '') ?		thisXML.children('image').text() : 		false);

		thisEntry.tooltip	= ((thisXML.children('tooltip').text() != '') ? 	thisXML.children('tooltip').text() : 	false);

		thisEntry.multiselect=((thisXML.children('multiselect').length > 0) ? 	thisXML.children('multiselect').find('table').text() : false);

		thisEntry.linkTarget= ((thisXML.children('linktarget').text() != '') ? 	thisXML.children('linktarget').text() : 	false);

		if (thisXML.children('multiselect').length > 0) {
			tempObject.multiselect.push(thisXML.children('multiselect').find('table').text());
		}

		thisEntry.target	= parseUrlData(thisXML);

		thisEntry.subnav	= false;
		thisXML.children('subnavigation').each(function(){
			var subnav = navigation2Object(jQuery(this));
			thisEntry.subnav=subnav;
		});

		navObject.entries.push(thisEntry);

	});

	return navObject;
}

function createNavLevel(navObject, settings) {
	html = '';

	settings=jQuery.extend({
		data:		false,
		showImage:	true,
		showTitle:	true,
		context:	false,
		idSuffix:	false
	},settings);


	jQuery.each(navObject.entries, function(i, thisEntryOrig){

		if(thisEntryOrig.context==settings.context) {

			var thisEntry = jQuery.extend(true, {}, thisEntryOrig);
			var thisID	= thisEntry.id;

			if(settings.data) {
				jQuery.each(settings.data, function(index, Element){

					eval('thisEntry.target.para.'+index+'=\''+Element+'\'');

				});
			}

			html += '<li>';

			var thisClass	='';
			if(thisEntry.multiselect) {
				thisClass	+=	'metadata {multitarget:\''+thisEntry.multiselect+'\'} multiselect_'+thisEntry.multiselect;
			}

			if(settings.idSuffix) {
				thisID += settings.idSuffix;
			}

			if(thisEntry.confirm) {
				thisClass	+=	' confirmation';

				if(thisEntry.confirmMessage) {
					tempObject.confirmMessage.push({navId:thisID, message:thisEntry.confirmMessage});
				}

			}

			var target	=	((thisEntry.linkTarget)?' target="'+thisEntry.linkTarget+'"':'');

			var href	=	'';
			if(!thisEntry.target.funct) {
				// no special function - just parse url
				href	=	buildURL(thisEntry.target);
			} else {
				// special function like "print"
				if(typeof window['uiFunction_'+thisEntry.target.funct] == 'function') {
					href = window['uiFunction_'+thisEntry.target.funct](thisEntry.target);
				}
			}

			html += '<a rel="'+thisEntry.relation+'" href="'+href+'" class="'+thisClass+'" id="nav_a_'+thisID+'"'+target+'>';

			if((thisEntry.image != '') && settings.showImage) {
				var tooltip='';
				if(thisEntry.tooltip) {
					tooltip=' title="'+thisEntry.tooltip+'"';
				}
				html += '<img src="'+thisEntry.image+'"'+tooltip+' />';
			}
			if((thisEntry.title != '') && settings.showTitle) {
				html += '<span>'+thisEntry.title+'</span>';
			}
			html += '</a>';

			if(thisEntry.subnav) {
				html += '<ul>';
				html += createNavLevel(thisEntry.subnav);
				html += '</ul>';
			}

			html += '</li>';
		} // end context-check
	});

	return html;
}

function bindMessages() {
	jQuery.each(tempObject.confirmMessage, function(){
		jQuery('#nav_a_'+this.navId).data('confirmMessage',this.message);
	});
}


/************************************
 * parse a URL						*
 ************************************/

function parseUrlData(xml) {

	var linkObject 			= {};
		linkObject.para 	= {};
	var target 		= jQuery(xml).children('target');
	if(target.find('action').length != 0)	{linkObject.para.action	= target.find('action').text();}

	if(target.find('type').length	!= 0)	{linkObject.para.type	= target.find('type').text();}

	if(target.find('id').length	!= 0)		{linkObject.para.id		= target.find('id').text();}

	if(target.find('getData').length != 0)	{linkObject.para.getData= target.find('getData').text();}

	if(target.find('url').length != 0)		{linkObject.url			= target.find('url').text();}
	else {									linkObject.url			= false;}

	if(target.find('function').length != 0)	{linkObject.funct		= target.find('function').text();}
	else {									linkObject.funct		= false;}

	return linkObject;
}

function buildURL(linkObject) {

	var url		= '';

	if(linkObject && linkObject.url) {
                if (linkObject.url.indexOf('?') >= 0) {
                	url		= linkObject.url + '&';
                } else {
                	url		= linkObject.url + '?';
                }
	} else {
		url		= geturl + urlAppendChar;
	}

	var first	= true;
	if(linkObject)
	{
		jQuery.each(linkObject.para, function(i,e) {
			if(first) {
				first = false;
			} else {
				url += "&";
			}

			if (i!='getData') {
				url += i + '=' + e;
			} else {
				url += e;
			}
		});
	}

	url += '&uid=' + jQuery('body').data('id');

	return url;
}


// events for forms
jxbf.bind('xmlparse.postparse', function bind_navigation_postparse(){
	var last ='';
	jQuery.each(tempObject.multiselect, function(i,e){
		if(last!=e) {
			last=e;
			jQuery('#'+e+' tbody tr').each(function(){
					jQuery(this).prepend('<td class="preventDefault"><input type="checkbox" class="row_select" name="'+e+'[]" value="'+jQuery(this).attr('id')+'"></td>');
				});

			var colspan=jQuery('#'+e+' tbody td').length;

			jQuery('#'+e+' thead tr').prepend('<th class="nosort flag"></th>');
			jQuery('#'+e+' tfoot tr:first').prepend('<td class="nosort flag" colspan="1"></td>');
			jQuery('#'+e).append('<tfoot><tr><td class="preventDefault"><input type="checkbox" class="select_all" id="all_'+e+'"></td><td class="preventDefault" colspan="'+colspan+'"><label for="all_'+e+'">alle w&auml;hlen</label></td></tr></tfoot>');
			jQuery('#'+e).wrap('<form></form>');
		}
	});
});

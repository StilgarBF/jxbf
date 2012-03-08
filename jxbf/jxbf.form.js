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
	Forms
 ****************************************************************/
function parse_form(xml) {

	var formvalidate = new Array();
	var html = '<div class="editData">';

	html += '<form action="'+buildURL(parseUrlData( jQuery(xml) ))+'" method="post" id="'+jQuery(xml).attr('name')+'" enctype="multipart/form-data" acceptCharset="UTF-8" class="form-horizontal">';

	// errorhandling
	if(jQuery(xml).find('field[hasError=true]').length > 0) {
		html += '<div class="block error">';
		jQuery(xml).find('field[hasError=true]').each(function(){
			if(jQuery(this).attr('errorMessage') != undefined) {
				html += jQuery(this).attr('errorMessage')+'<br />';
			}
		});
		html += '</div>';
	}

	html += '<div class="row-fluid">';

	jQuery(xml).find('datagroup').each(function(){

		html += parse_form_datagroup(this);

	});

	html += '</div>';

	if (jQuery(xml).find('buttons').length > 0) {
		jQuery(xml).find('buttons button').each(function(){
			var buttontype = 'btn-primary';
			if(jQuery(this).attr('type') != undefined) {
				buttontype = 'btn-'+jQuery(this).attr('type');
			}
			html += '<input type="submit" class="btn '+buttontype+'" name="'+jQuery(this).attr('value')+'" value="'+jQuery(this).text()+'" /> ';
		});
	} else {
		html += '<input class="btn btn-primary" type="submit" value="absenden" /> ';
	}

	html += '</form>';

	html += '</div>';

	// validation
	if((jQuery(xml).find('field[regex]').length > 0) || (jQuery(xml).find('field[required=yes]').length > 0)) {
		validate.push({
			formname: jQuery(xml).attr('name'),
			fields:formvalidate
		});
	}

	return html;

}

function parse_form_field(xml) {

	var $this = jQuery(xml);

	var html = '';

	var addFieldClass	= '';
	var addGroupClass	= '';

	if($this.attr('hasError') == 'true') {
		addGroupClass +=' error';
	}

	if($this.attr('setFocus') == 'true') {
		addFieldClass +=' setFocus';
	}

	if($this.attr('class')) {
		addFieldClass +=' '+$this.attr('class');
	}

	// prepare validation

	var thisID = $this.attr('fieldName').replace(/\[|\]/g,'_');

	if(($this.attr('required') == 'yes') || $this.attr('regex')) {

		var field={};

		field.name=thisID;

		if($this.attr('required') == 'yes') {
			field.required			=	true;									}

		if($this.attr('regex')) {
			field.regex				=	$this.attr('regex');				}

		if($this.attr('validateMessage')) {
			field.validateMessage	=	$this.attr('validateMessage');	}

		if($this.attr('requiredMessage')) {
			field.requiredMessage	=	$this.attr('requiredMessage');	}

		formvalidate.push(field);

	}


	var fieldtype 	= $this.attr('type');

	if (fieldtype == 'hidden') {

		html += '<input type="hidden" name="'+$this.attr('fieldName')+'" value="'+$this.attr('value').replace(/&/g, "&amp;").replace(/\"/g, "&quot;")+'" />';

	} else {
		html += '<div class="control-group '+addGroupClass+'">';
		html += '<label for="'+thisID+'" class="control-label">'+$this.attr('title')+'</label>';
		html += '<div class="controls">';

		if (fieldtype == 'select') {
// select
			var attributes = '';
			if($this.attr('multiple') == 'yes') {
				attributes = ' name="'+$this.attr('fieldName')+'[]" multiple="multiple" size="5"';
			} else {
				attributes = ' name="'+$this.attr('fieldName')+'"';
			}
			html += '<select id="'+thisID+'" class="selectInput '+addFieldClass+'" '+attributes+'>';

			selected = $this.find('value').text();

			$this.find('option').each(function(){
				html += '<option value="'+jQuery(this).attr('id')+'"';
				if($this.attr('preselect') == 'yes') {
					html += 'selected="selected"';
				}
				html += '>'+jQuery(this).text()+'</option>';
			});
			html += '</select>';


		} else if (fieldtype == 'flag') {
// checkbox
			if($this.text()=='1') {
				html += '<input type="checkbox" checked="checked" ';
			} else {
				html += '<input type="checkbox" ';
			}
			html += 'name="'+$this.attr('fieldName')+'" id="'+thisID+'" value="1" class="'+addFieldClass+'" />';


		} else if (fieldtype == 'flagToggle') {
// checkbox - toggled

			var v_class	= 'class="inputToggle metadata {target:\''+$this.attr('target')+'\'} '+addFieldClass+'"';

			if($this.text()=='1') {
				html += '<input type="checkbox" checked="checked" ';
			} else {
				html += '<input type="checkbox" ';
			}
			html += v_class+' name="'+$this.attr('fieldName')+'" id="'+thisID+'" value="1" />';


		} else if (fieldtype == 'toggleRadios') {
// toggle radiogroup
			var fieldname = $this.attr('fieldName');

			$this.find('option').each(function(){

				var v_class	= 'class="inputToggle metadata {target:\''+jQuery(this).attr('target')+'\'} '+addFieldClass+'"';

				html += '<div class="check">';
				html += '<label for="'+thisID+'_'+jQuery(this).attr('id')+'">'+jQuery(this).text()+'</label>';
				html += '<input type="radio" '+v_class;
					html += ((jQuery(this).attr('preselect') == 'yes') ? 'checked="checked" ' : ' ');
					html += 'value="'+jQuery(this).attr('id')+'" ';
					html += 'name="'+fieldname+'[]" ';
					html += 'id="'	+thisID+'_'+jQuery(this).attr('id')+'">';
				html += '</div>';
			});


		} else if (fieldtype == 'radios') {
// radiogroup
			var fieldname = $this.attr('fieldName');

			$this.find('option').each(function(){
				html += '<label class="radio">';
				//html += '<label for="'+thisID+'_'+jQuery(this).attr('id')+'">'+jQuery(this).text()+'</label>';
				html += '<input type="radio" ';
					html += ((jQuery(this).attr('preselect') == 'yes') ? 'checked="checked" ' : ' ');
					html += 'class="'+addFieldClass+'" ';
					html += 'value="'+jQuery(this).attr('id')+'" ';
					html += 'name="'+fieldname+'[]" ';
					html += 'id="'	+thisID+'_'+jQuery(this).attr('id')+'">';
				html += jQuery(this).text()+'</label>';
			});


		} else if (fieldtype == 'flags') {
// multiple checkboxes
			var fieldname = $this.attr('fieldName');

			$this.find('option').each(function(){
				html += '<label class="checkbox">';
				//html += '<label for="'+thisID+'_'+jQuery(this).attr('id')+'">'+jQuery(this).text()+'</label>';
				html += '<input type="checkbox" ';
					html += ((jQuery(this).attr('preselect') == 'yes') ? 'checked="checked" ' : ' ');
					html += 'class="'+addFieldClass+'" ';
					html += 'value="'+jQuery(this).attr('id')+'" ';
					html += 'name="'+fieldname+'[]" ';
					html += 'id="'	+thisID+'_'+jQuery(this).attr('id')+'">';
				html += jQuery(this).text()+'</label>';
			});

		} else if (fieldtype == 'longtext') {
// textarea
			html += '<textarea id="'+thisID+'" name="'+$this.attr('fieldName')+'" class="textInput '+addFieldClass+'">'+$this.text()+'</textarea>';
		} else if (fieldtype == 'superlongtext') {
// textarea - long
			html += '<textarea id="'+thisID+'" name="'+$this.attr('fieldName')+'" class="textInput superlong '+addFieldClass+'">'+$this.text()+'</textarea>';

		} else if (fieldtype == 'date') {
// datepicker
			html += '<input type="text" class="datepick textInput '+addFieldClass+'" id="'+thisID+'" name="'+$this.attr('fieldName')+'" value="'+$this.text()+'" />';

		} else if (fieldtype == 'time') {
// timepicker
			html += '<input type="text" class="timepick textInput '+addFieldClass+'" id="'+thisID+'" name="'+$this.attr('fieldName')+'" value="'+$this.text()+'" />';

		} else if (fieldtype == 'datetime') {
// date / time
			html += '<input type="text" id="'+thisID+'" class="textInput datetimepick '+addFieldClass+'" name="'+$this.attr('fieldName')+'" value="'+$this.text()+'" />';

		} else if (fieldtype == 'suggest') {
// suggest
			html += '<input type="text" name="'+$this.attr('fieldName')+'" id="'+thisID+'" value="'+$this.find('value').text()+'"';
			if($this.attr('editable') == 'no') {
				html += ' disabled="disabled"';
			}
			html += ' class="textInput inputSuggest '+addFieldClass+'">';
			var values = '';
			$this.find('options option').each(function() {
				values += ((values == '') ? '':'-|-')+jQuery(this).text();
			});
			html += '<input type="hidden" value="'+values+'" id="h_'+thisID+'" />';


		} else if (fieldtype == 'upload') {
// upload
			html += '<input type="file" name="'+$this.attr('fieldName')+'[]" id="'+thisID+'" value="'+$this.find('value').text()+'"';
			if($this.attr('editable') == 'no') {
					html += ' disabled="disabled"';
				}
			html += ' class="textInput multifile '+addFieldClass+'">';

		} else if (fieldtype == 'password') {
// password
			var v_class = ' class="textInput '+addFieldClass + '"';

			html += '<input type="password" name="'+$this.attr('fieldName')+'" id="'+thisID+'" value="'+$this.text()+'"';
			if($this.attr('editable') == 'no') {
				html += ' disabled="disabled"';
			}
			html += ' '+v_class+' />';



		} else {
// text			if (fieldtype == 'text')
			var v_class = ' class="textInput '+addFieldClass;
			if(fieldtype == 'decimal') {
				v_class += ' decimal_'+$this.attr('decimals');
			}
			v_class += '"';

			html += '<input type="text" name="'+$this.attr('fieldName')+'" id="'+thisID+'" value="'+$this.text()+'"';
			if($this.attr('editable') == 'no') {
				html += ' disabled="disabled"';
			}
			html += ' '+v_class+' />';

		}

		if($this.attr('note') != undefined) {
			html	+= '<span class="help-inline">'+$this.attr('note')+'</span>';
		}
		html += '</div></div>';

	}
	return html;
}

// parse a datagroup
function parse_form_datagroup(xml) {

	var $this = jQuery(xml);

	var html = '';

	var closeGridItem = false;

	if($this.attr('cols') != undefined) {
		var cols = parseInt($this.attr('cols'));
		if(cols != 0) {
			closeGridItem = true;
			html += '<div class="span'+cols+'">';
		}
	}

	if($this.attr('title') != undefined) {
		html += '<fieldset'+(($this.attr('name') != undefined)?' id="'+$this.attr('name')+'"':'')+'>';
		html += '<legend>'+$this.attr('title')+'</legend>';
	}

	$this.find('field').each(function(){

		html += parse_form_field(this);

	});

	if(jQuery(this).attr('title') != undefined) {
		html += '</fieldset>';
	}
	if(closeGridItem) {
		html += '</div>';
	}
	return html;
}

// events for forms
jxbf.bind('xmlparse.postparse', function bind_form_postparse(){
	jQuery("form")
		.unbind('submit')
		.one('submit',function (e){
			formSubmit(e, jQuery(this));
		});
	jQuery('form input[type=submit]').bind('click',function(){lastFormButton(true,jQuery(this));});
	jQuery('form input[type=submit]').bind('focus',function(){lastFormButton(true,jQuery(this));}).bind('blur',function(){lastFormButton(false,jQuery(this));});

	jQuery('form input[class*=decimal]').bind('blur',function(){

		var decimals	= jQuery(this).attr('class').replace(/^[\w\W]*?decimal_([^ ]+)[\w\W]*$/,'$1');

		var value		= jQuery(this).val().replace(/,/,'.');
			value		= value.replace(/[^0-9\.]/g,'');
			value		= parseFloat((value!='') ? value : '0').toFixed(decimals);
			value		= value.replace(/\./,',');
		jQuery(this).val(value);
		jQuery(this).validate();

	}).each(function(){
		var decimals	= jQuery(this).attr('class').replace(/^[\w\W]*?decimal_([^ ]+)[\w\W]*$/,'$1');
		var value 		= jQuery(this).val();
		if(value=='') {
			value		= '0';
		}
			value = parseFloat(value).toFixed(decimals).replace(/\./,',');
		jQuery(this).val(value);
	});

	$('.datepick').datepicker();

	$('.datetimepick').datetimepicker();

	$('.timepick').timepicker();

   	 jQuery('.inputSuggest').each(function(){
		var options = jQuery(this).siblings('input[type=hidden]').val().split('-|-');
		jQuery(this).data('options',options);
		jQuery(this).bind('focus',function(){
			if(jQuery(this).siblings('.dyn_suggest').length == 0) {
				addSuggest(jQuery(this));
			} else {
				jQuery(this).siblings('.dyn_suggest').show();
			}
		}).bind('blur',function(){
			jQuery(this).siblings('.dyn_suggest').fadeOut('slow');
		});
	});

	jQuery('.inputToggle').each(function(){
		var target = jQuery(this).metadata().target;
		if(jQuery(this).is(':checked')) {
			jQuery('#'+target).show().find('input, textarea').removeAttr('disabled');
		} else {
			jQuery('#'+target).hide().find('input, textarea').attr('disabled','disabled');
		}
	}).bind('change',function() {

		var target = jQuery(this).metadata().target;

		if(jQuery(this).attr('type')=='radio') {
			jQuery(this).parents('.value').find('input.inputToggle').each(function(){
				if(jQuery(this).is(':checked')) {
					jQuery('#'+target).show().find('input, textarea').removeAttr('disabled');
				} else {
					jQuery('#'+target).hide().find('input, textarea').attr('disabled','disabled');
				}
			});
			jQuery('#'+target).show().find('input, textarea').removeAttr('disabled');
		} else {
			if(jQuery(this).is(':checked')) {
				jQuery('#'+target).show().find('input, textarea').removeAttr('disabled');
			} else {
				jQuery('#'+target).hide().find('input, textarea').attr('disabled','disabled');
			}
		}
	});

	// prepare formvalidation

	jQuery(validate).each(function(i,form){

		jQuery('#'+form.formname).validate({ignore: ".metadata"});

		jQuery('#'+form.formname).find('input, textarea, select').each(function(){
			if(jQuery(this).attr('id')) {
				var myid='#'+jQuery(this).attr('id');
				jQuery(myid).rules("remove");
			}
		});

		jQuery(form.fields).each(function(j,field){

			if(field.required) {
				jQuery('#'+field.name).rules("add", {required:field.required});
			}
			if(field.regex) {
				jQuery('#'+field.name).rules("add", {regex:field.regex});
			}
			if(field.validateMessage) {
				jQuery('#'+field.name).rules("add", {messages:{
						regex: field.validateMessage
					}
				});
			}
			if(field.requiredMessage) {
				jQuery('#'+field.name).rules("add", {messages:{
						required: field.requiredMessage
					}
				});
			}
		});
	});

	jQuery('input.multifile').MultiFile({
		STRING:{
			remove:'<img class="multiFile_remove" src="'+ jxbfRoot + 'img/icon/delete_16.png" height="16" width="16" alt="x"/>'
			},
		onFileAppend: function(element, value, master_element){
			jQuery(element).parents('form').data('hasfiles',true);
		}
	});

	jQuery('form .setFocus:first').focus();
});

/************************************
 * function to submit a form - eventhandler	*
 ************************************/
function formSubmit(e, form) {
	e.preventDefault();
	action  = form.attr('action');
	form.validate({ignore: "input"});

	if(form.valid()){

		form.find('input[class*=decimal]').each(function(){

			var decimals	= jQuery(this).attr('class').replace(/^[\w\W]*?decimal_([^ ]+)[\w\W]*$/,'$1');
			var value		= jQuery(this).val();
				value		= value.replace(/,/,'.');
				value		= parseFloat(value).toFixed(decimals);
			jQuery(this).val(value);

		});

		if(form.data('hasfiles')) {

			if(jQuery('#formtarget').length ==0) {
				var iFrame	= '<iframe id="formtarget" name="formtarget" width="1" height="1" style="display:none"></iframe>';
				jQuery('#main_collumn').after(iFrame);
			}
			form.attr('target','formtarget');

			jQuery('#formtarget').load(function(){
				jQuery.unblockUI();
				var theXML = jQuery('#formtarget')[0].contentWindow.document;
				if(jQuery(theXML).children('parsererror').length== 0) {
					parseXML(theXML);
				} else {
					var errorhtml='<h2>Fehler</h2><p>bei dieser Aktion ist ein Fehler aufgetreten.</p><p>Sollte dies wiederholt geschehen kontaktieren Sie bitte den zust&auml;ndigen Admin mit einer genauen Fehlerbeschreibung und Schritten zur Reproduktion</p><p>Wir bitten um Entschuldigung f&uuml;r die Unannehmlichkeiten.</p>';
					jQuery("#overlay div.ocWrapper").html(errorhtml);
					openOverlay();
				}

				jQuery('#formtarget').unbind('load');

			});

			jQuery.blockUI({
				message: '<img style="margin-top:20px" src="'+ jxbfRoot + 'img/ajax-loader.gif" /><h1>Bitte warten...</h1>',
				css: { backgroundColor: '#658B8C', color: '#fff' }
			});
			form.submit();


		} else {
			data	= form.serialize();
			jQuery.ajax({
				url:		action,
				data:		data,
				dataType:	'xml',
				type:		'post',
				success:	function(response) {
								parseXML(response);
								jQuery.unblockUI();
							}
			});
		}
	} else {
		form.one('submit',function (e){
			formSubmit(e, jQuery(this));
		});
	}
}

function lastFormButton(dir, el) {
	var elname	= el.attr('name');
	var form	= el.parents('form');
	var	i_id = 'lastubmit_'+form.attr('id');
	if(dir) {
		if(form.find('#'+i_id).length == 0) {
			form.append('<input type="hidden" id="'+i_id+'" name="'+elname+'" value="1" />');
		} else {
			form.find('#'+i_id).attr('name',elname);
		}
	} else {
		if(form.find('#'+i_id).attr('name') == elname){
			form.find('#'+i_id).remove();
		}
	}
}
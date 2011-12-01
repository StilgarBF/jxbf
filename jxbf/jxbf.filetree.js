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
 * parse filetree					*
 ************************************/
function parse_filetree(xml) {
	var style="";
	if(xml.is('directory')) {
		style='style="display:none;"';
	}
	var html = '<ul class="directory" '+style+'>';
	jQuery(xml).children('directory').each(function(){
		var $this = jQuery(this);
		html += '<li class="dir"><span>'
		html += getIcon('directory');
		html += $this.attr('title');
		html += '</span>';
		html += parse_filetree($this);
		html += '</li>';
	});
	jQuery(xml).children('file').each(function(){
		var $this = jQuery(this);
		html += '<li class="file"><a target="_blank" href="'+$this.find('url').text()+'">';
		if($this.find('mime').text()!='') {
			html += getIcon($this.find('mime').text());
		}
		html += $this.find('name').text()+'</a>';
		html += '<div class="fileinfo">Datum: '+$this.find('date').text()+(($this.find('subject').text())?'<br />Betreff: '+$this.find('subject').text():'')+'</div>';
		html += '</li>';
	});
	html += '</ul>';
	return html;
}
// events for filetree
jxbf.bind('xmlparse.postparse', function bind_filetree_postparse(){
	jQuery('li.file a').unbind().bind('mouseenter',function(){
		jQuery(this).parent().find('div.fileinfo').show();
	}).bind('mouseleave',function(){
		jQuery(this).parent().find('div.fileinfo').hide();
	});
});
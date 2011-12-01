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
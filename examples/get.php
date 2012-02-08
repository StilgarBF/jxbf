<?php
	header('Content-type: application/xml; charset=UTF-8');
	
	$file = false;
	if(isset($_REQUEST['file']))
	{
		$file = $_REQUEST['file'];
	}
	else
	{
		$file = 'start.xml';
	}
	if($file)
	{
		$content = file_get_contents($file);
		echo $content;
		echo '<!-- '.$file.'-->';
	}
	
?>

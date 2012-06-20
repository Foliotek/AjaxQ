<?php
	$req = array_merge($_GET, $_POST);
	if (isset($req["delay"])) {
		sleep($req["delay"]);
	}


	header('Content-type: application/json');
	echo json_encode($req);
?>
<?php
header('Access-Control-Allow-Origin: *');  

if (isset($_POST["devOrientationData"])) {	
	$devOrData_raw = $_POST["devOrientationData"];
	
	$devOrData_dec = json_decode($devOrData_raw);
	$devOrData_dec = $devOrData_dec->{"devOrData"};
	
	$documentURL = $_POST["documentURL"];
	
	$filename = "sensorData/DeviceOrientation.txt";
	
	if (file_exists($filename)) {
		$output = "";
	} else {
		$output = "URL;OCC;timestamp;alpha;beta;gamma\n";
	}
	
	foreach($devOrData_dec as $devOrData) {
		$output .= "" . $documentURL . ";GYROSCOPE;" . $devOrData->timestamp . ";" . $devOrData->devOrAlpha . ";" . $devOrData->devOrBeta . ";" . $devOrData->devOrGamma . "\n";
	}
	$datei_handle=fopen($filename,a);
	fwrite($datei_handle, "" . $output . "");
	fclose($datei_handle);
} 

?>
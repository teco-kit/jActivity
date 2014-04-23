<?php
/* Copyright (c) 2014 Michael Hauber, TECO (Karlsruhe Institute of Technology, KIT)

/* IMPORTANT: This Script is not save to use on the Internet, it has no Cross-Site-Scripting protection. */
header('Access-Control-Allow-Origin: *');  

if (isset($_POST["devMotionData"])) {
	$devMoData_raw = $_POST["devMotionData"];

	$devMoData_dec = json_decode($devMoData_raw);
	$devMoData_dec = $devMoData_dec->{'devMoData'};

	$documentURL = $_POST["documentURL"];
	
	$filename = "sensorData/DeviceMotion.txt";
	
	if (file_exists($filename)) {
		$output = "";
	} else {
		$output = "URL;OCC;timestamp;x-acc;y-acc;z-acc;x-zerograv;y-zerograv;z-zerograv;alpha-rot;beta-rot;gamma-rot\n";
	}
	
	foreach ($devMoData_dec as $devMoData) {
	  $output .= "" . $documentURL . ";ACCELEROMETER;" . $devMoData->timestamp . ";" . $devMoData->devMoX . ";" . $devMoData->devMoY . ";" . $devMoData->devMoZ . ";" . $devMoData->devMoXWithoutGrav . ";" . $devMoData->devMoYWithoutGrav . ";" . $devMoData->devMoZWithoutGrav . ";" . $devMoData->devMoRotAlpha . ";" . $devMoData->devMoRotBeta . ";" . $devMoData->devMoRotGamma . "\n";
	}
	
	$datei_handle=fopen($filename,a);
	fwrite($datei_handle, "" . $output . "");
	fclose($datei_handle);
}
?>
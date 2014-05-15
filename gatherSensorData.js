<script type="text/javascript">
/* Copyright (c) 2014 Michael Hauber, TECO (Karlsruhe Institute of Technology, KIT)
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

// DeviceMotion
function trackMotionEvent(event) {
	var devMotionData = {
		devMoData: []
	};
	
	var devMoX = event.accelerationIncludingGravity.x;
	var devMoY = event.accelerationIncludingGravity.y;
	var devMoZ = event.accelerationIncludingGravity.z;
	var devMoXWithoutGrav = event.acceleration.x;
	var devMoYWithoutGrav = event.acceleration.y;
	var devMoZWithoutGrav = event.acceleration.z;

	if (event.rotationRate) {
		var devMoRotAlpha = event.rotationRate.alpha;
		var devMoRotBeta = event.rotationRate.beta;
		var devMoRotGamma = event.rotationRate.gamma;
	}
		
	var devMoTimestamp = new Date().getTime();
		
	devMotionData.devMoData.push({ 
		"timestamp" : devMoTimestamp, // in ms/
		"devMoX"      : devMoX,
		"devMoY"      : devMoY,
		"devMoZ"      : devMoZ,
		"devMoXWithoutGrav"  : devMoXWithoutGrav,
		"devMoYWithoutGrav"  : devMoYWithoutGrav,
		"devMoZWithoutGrav"  : devMoZWithoutGrav,
		"devMoRotAlpha"  : devMoRotAlpha,
		"devMoRotBeta"   : devMoRotBeta,
		"devMoRotGamma"  : devMoRotGamma
	});
				
	$.ajax({
		// IMPORTANT: Change for your needs, to your Server.
		url: "saveDeviceMotionData.php",
		data: {devMotionData: JSON.stringify(devMotionData),
			   documentURL: document.URL},
		datatype: "jsonp",
		type: "POST",
		// Callback
		success: function(data) { console.log("DeviceMotion: AJAX succeded."); }
	});
				
	devMotionData = {
		devMoData: []
	};
}

if (window.DeviceMotionEvent == undefined) {
	console.log("Device does not support DeviceMotion functionality.");
} else {
	window.addEventListener("devicemotion", trackMotionEvent, false);
}

// DeviceOrientation
function trackOrientationEvent(event) {
	var devOrAlpha = event.alpha;
	var devOrBeta =  event.beta;
	var devOrGamma = event.gamma;
		
	var devOrientationData = {
		devOrData: []
	};	

	var devOrTimestamp = new Date().getTime();
		
	devOrientationData.devOrData.push({ 
		"timestamp" : devOrTimestamp, // in ms
		"devOrAlpha"  : devOrAlpha,
		"devOrBeta"   : devOrBeta,
		"devOrGamma"  : devOrGamma
	});
		
	$.ajax({
		// IMPORTANT: Change for your needs, to your Server.
		url: "saveDeviceOrientationData.php",
		data: {devOrientationData: JSON.stringify(devOrientationData),
			   documentURL: document.URL},
		datatype: "json",
		type: "POST",
		// Callback
		success: function(data) { console.log("DeviceOrientation: AJAX succeded."); }
	});
				
	devOrientationData = {
		devOrData: []
	};	
}
	
window.addEventListener("deviceorientation", trackOrientationEvent, true);
</script>
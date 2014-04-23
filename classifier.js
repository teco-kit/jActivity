/* Copyright (c) 2014 Michael Hauber, TECO (Karlsruhe Institute of Technology, KIT)
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

// DeviceMotion
var devMotionData = {
	devMoData: []
};

var devMoX = 0;
var devMoY = 0;
var devMoZ = 0;
var devMoXWithoutGrav = 0;
var devMoYWithoutGrav = 0;
var devMoZWithoutGrav = 0;

var devMoRotAlpha = 0;
var devMoRotBeta = 0;
var devMoRotGamma = 0;
	
function trackMotionEvent(event) {
	devMoX = event.accelerationIncludingGravity.x;
	devMoY = event.accelerationIncludingGravity.y;
	devMoZ = event.accelerationIncludingGravity.z;
	devMoXWithoutGrav = event.acceleration.x;
	devMoYWithoutGrav = event.acceleration.y;
	devMoZWithoutGrav = event.acceleration.z;

	if (event.rotationRate) {
		devMoRotAlpha = event.rotationRate.alpha;
		devMoRotBeta = event.rotationRate.beta;
		devMoRotGamma = event.rotationRate.gamma;
	}
}

if (window.DeviceMotionEvent == undefined) {
	console.log("Device does not support DeviceMotion functionality.");
} else {
	window.addEventListener("devicemotion", trackMotionEvent, false);
}

var devOrTimestamp = 0;
var length = 0;

var devOrientationData = {
	devOrData: []
};	

var devOrAlpha = 0;
var devOrBeta =  0;
var devOrGamma = 0;

// DeviceOrientation
function trackOrientationEvent(event) {
	devOrAlpha = event.alpha;
	devOrBeta =  event.beta;
	devOrGamma = event.gamma;	
}
	
window.addEventListener("deviceorientation", trackOrientationEvent, true);


var classInterval = 0

var sampledDM = new Array(100);
var array_devMoX = new Array(100);
var array_devMoY = new Array(100);
var array_devMoZ = new Array(100);
var array_devMoXWithoutGrav = new Array(100);
var array_devMoYWithoutGrav = new Array(100);
var array_devMoZWithoutGrav = new Array(100);

var array_devMoRotAlpha = new Array(100);
var array_devMoRotBeta = new Array(100);
var array_devMoRotGamma = new Array(100);

var array_devOrAlpha = new Array(100);
var array_devOrBeta =  new Array(100);
var array_devOrGamma = new Array(100);


function classify()
{
    if (classInterval < 100) {
        array_devMoX[classInterval] = devMoX;
        array_devMoY[classInterval] = devMoY;
        array_devMoZ[classInterval] = devMoZ;
        array_devMoXWithoutGrav[classInterval] = devMoXWithoutGrav;
        array_devMoYWithoutGrav[classInterval] = devMoYWithoutGrav;
        array_devMoZWithoutGrav[classInterval] = devMoZWithoutGrav;
        
        array_devMoRotAlpha[classInterval] = devMoRotAlpha;
        array_devMoRotBeta[classInterval] = devMoRotBeta;
        array_devMoRotGamma[classInterval] = devMoRotGamma;
        
        array_devOrAlpha[classInterval] = devOrAlpha;
        array_devOrBeta[classInterval] =  devOrBeta;
        array_devOrGamma[classInterval] = devOrGamma; 
        
        classInterval++;
    } else {
        // Array voll -> Klassifiziere.
        var devMoX_sum = 0;
        var devMoY_sum = 0;
        var devMoZ_sum = 0;
        var devMoXWithoutGrav_sum = 0;
        var devMoYWithoutGrav_sum = 0;
        var devMoZWithoutGrav_sum = 0;
        var devMoRotAlpha_sum = 0;
        var devMoRotBeta_sum = 0;
        var devMoRotGamma_sum = 0;
        
        for (var i = 0; i < 100; i++) {
            devMoX_sum += array_devMoX[i];
            devMoY_sum += array_devMoY[i];
            devMoZ_sum += array_devMoZ[i];
            devMoXWithoutGrav_sum += array_devMoXWithoutGrav[i];
            devMoYWithoutGrav_sum += array_devMoYWithoutGrav[i];
            devMoZWithoutGrav_sum += array_devMoZWithoutGrav[i];
            devMoRotAlpha_sum += array_devMoRotAlpha[i];
            devMoRotBeta_sum += array_devMoRotBeta[i];
            devMoRotGamma_sum += array_devMoRotGamma[i];
        }
        
        var devMoX_avg = devMoX_sum / 100;
        var devMoY_avg = devMoX_sum / 100;
        var devMoZ_avg = devMoX_sum / 100;
        var devMoXWithoutGrav_avg = devMoXWithoutGrav_sum / 100;
        var devMoYWithoutGrav_avg = devMoXWithoutGrav_sum / 100;
        var devMoZWithoutGrav_avg = devMoYWithoutGrav_sum / 100;
        var devMoRotAlpha_avg = devMoRotAlpha_sum / 100;
        var devMoRotBeta_avg = devMoRotBeta_sum / 100;
        var devMoRotGamma_avg = devMoRotGamma_sum / 100;
        
        var devMoX_var = 0;
        var devMoY_var = 0;
        var devMoZ_var = 0;
        var devMoXWithoutGrav_var = 0;
        var devMoYWithoutGrav_var = 0;
        var devMoZWithoutGrav_var = 0;
        var devMoRotAlpha_var = 0;
        var devMoRotBeta_var = 0;
        var devMoRotGamma_var = 0;
        
        for (var i = 0; i < 100; i++) {
            devMoX_var += Math.pow((array_devMoX[i] - devMoX_avg), 2);
            devMoY_var += Math.pow((array_devMoY[i] - devMoY_avg), 2);
            devMoZ_var += Math.pow((array_devMoZ[i] - devMoZ_avg), 2);
            devMoXWithoutGrav_var += Math.pow((array_devMoXWithoutGrav[i] - devMoXWithoutGrav_avg), 2);
            devMoYWithoutGrav_var += Math.pow((array_devMoYWithoutGrav[i] - devMoYWithoutGrav_avg), 2);
            devMoZWithoutGrav_var += Math.pow((array_devMoZWithoutGrav[i] - devMoZWithoutGrav_avg), 2);
            devMoRotAlpha_var += Math.pow((array_devMoRotAlpha[i] - devMoRotAlpha_avg), 2);
            devMoRotBeta_var += Math.pow((array_devMoRotBeta[i] - devMoRotBeta_avg), 2);
            devMoRotGamma_var += Math.pow((array_devMoRotGamma[i] - devMoRotGamma_avg), 2);
        }
        
        devMoX_var /= 100;
        devMoY_var /= 100;
        devMoZ_var /= 100;
        devMoXWithoutGrav_var /= 100;
        devMoYWithoutGrav_var /= 100;
        devMoZWithoutGrav_var /= 100;
        devMoRotAlpha_var /= 100;
        devMoRotBeta_var /= 100;
        devMoRotGamma_var /= 100;
        
        var devOrAlpha_sum = 0;
        var devOrBeta_sum = 0;
        var devOrGamma_sum = 0;
        
        for (var i = 0; i < array_devOrAlpha.length; i++) {
            devOrAlpha_sum += array_devOrAlpha[i];
            devOrBeta_sum += array_devOrBeta[i];
            devOrGamma_sum += array_devOrGamma[i];
        }
        
        var devOrAlpha_avg = devOrAlpha_sum / array_devOrAlpha.length;
        var devOrBeta_avg = devOrBeta_sum / array_devOrAlpha.length;
        var devOrGamma_avg = devOrGamma_sum / array_devOrAlpha.length;
        
        var devOrAlpha_var = 0;
        var devOrBeta_var = 0;
        var devOrGamma_var = 0;
        
        for (var i = 0; i < array_devOrAlpha.length; i++) {
            devOrAlpha_var += Math.pow((array_devOrAlpha[i] - devOrAlpha_avg), 2);
            devOrBeta_var += Math.pow((array_devOrBeta[i] - devOrBeta_avg), 2);
            devOrGamma_var += Math.pow((array_devOrGamma[i] - devOrGamma_avg), 2);
        }
        
        devOrAlpha_var /= array_devOrAlpha.length;
        devOrBeta_var /= array_devOrAlpha.length;
        devOrGamma_var /= array_devOrAlpha.length;
        
        var classified = getDecisionOfDT(devMoX_avg, devMoX_var, devMoY_avg, devMoY_var, devMoZ_avg, devMoZ_var, devMoXWithoutGrav_avg, devMoXWithoutGrav_var, devMoYWithoutGrav_avg, devMoYWithoutGrav_var, devMoZWithoutGrav_avg, devMoZWithoutGrav_var, devMoRotAlpha_avg, devMoRotAlpha_var, devMoRotBeta_avg, devMoRotBeta_var, devMoRotGamma_avg, devMoRotGamma_var, devOrAlpha_avg, devOrAlpha_var, devOrBeta_avg, devOrBeta_var, devOrGamma_avg, devOrGamma_var);       
        
        classInterval = 0
        
        sampledDM = new Array(100);
        array_devMoX = new Array(100);
        array_devMoY = new Array(100);
        array_devMoZ = new Array(100);
        array_devMoXWithoutGrav = new Array(100);
        array_devMoYWithoutGrav = new Array(100);
        array_devMoZWithoutGrav = new Array(100);
        
        array_devMoRotAlpha = new Array(100);
        array_devMoRotBeta = new Array(100);
        array_devMoRotGamma = new Array(100);
        
        array_devOrAlpha = new Array(100);
        array_devOrBeta =  new Array(100);
        array_devOrGamma = new Array(100);
        
        array_devMoX[classInterval] = devMoX;
        array_devMoY[classInterval] = devMoY;
        array_devMoZ[classInterval] = devMoZ;
        array_devMoXWithoutGrav[classInterval] = devMoXWithoutGrav;
        array_devMoYWithoutGrav[classInterval] = devMoYWithoutGrav;
        array_devMoZWithoutGrav[classInterval] = devMoZWithoutGrav;
        
        array_devMoRotAlpha[classInterval] = devMoRotAlpha;
        array_devMoRotBeta[classInterval] = devMoRotBeta;
        array_devMoRotGamma[classInterval] = devMoRotGamma;
        
        array_devOrAlpha[classInterval] = devOrAlpha;
        array_devOrBeta[classInterval] =  devOrBeta;
        array_devOrGamma[classInterval] = devOrGamma; 
        
        classInterval++;
        
		// Do whatever you want with it.
		return classified;
    }
}

function getDecisionOfDT(devMoX_avg, devMoX_var, devMoY_avg, devMoY_var, devMoZ_avg, devMoZ_var, devMoXWithoutGrav_avg, devMoXWithoutGrav_var, devMoYWithoutGrav_avg, devMoYWithoutGrav_var, devMoZWithoutGrav_avg, devMoZWithoutGrav_var, devMoAlphaRot_avg, devMoAlphaRot_var, devMoBetaRot_avg, devMoBetaRot_var, devMoGammaRot_avg, devMoGammaRot_var, devOrAlpha_avg, devOrAlpha_var, devOrBeta_avg, devOrBeta_var, devOrGamma_avg, devOrGamma_var) {

	/* Features and Variables are just an example: You can insert your own classifier here with own features and so on. */
	/* This checks for high variances, for example to detect activity of a mobile device. */
    if (devMoX_var > 0.5 || devMoXWithoutGrav_var > 0.5 || devMoYWithoutGrav_var > 0.5 || devMoZWithoutGrav_var > 0.5 || devMoAlphaRot_var > 0.1 || devMoBetaRot_var > 0.1 || devMoGammaRot_var > 0.1) {
        return "Movement detected.";
    } else {
     	return "No Movement detected.";   
    }
}

var iFrequency = 1; // expressed in milliseconds
var myInterval = 0;

// STARTS and Resets the loop if any
function startLoop() {
    if(myInterval > 0) clearInterval(myInterval);  // stop
    myInterval = setInterval(function(){classify()}, iFrequency );  // run
}

startLoop();
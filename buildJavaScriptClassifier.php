<?php
/* Copyright (c) 2014 Michael Hauber, TECO (Karlsruhe Institute of Technology, KIT)

/* This Script enables you to take any WEKA-generated J48 (pruned or unpruned) Decision Tree (as txt file),
 * to generate an if-else of it and then generate a JavaScript classifier out of it, which can be included in any mobile website or webapplication. */

/* IMPORT: It is only allowed to use a-Z, A-Z, 0-9 and underscore (_), if you want to use it as JavaScript-Code. */
	
/* IMPORTANT2: You have to erase all not necessary empty and comment files of the WEKA-export. If you don't it will not work correctly. */

/* Change for your needs! */
define("WEKADECISIONTREE", "Entscheidungsbaum 1 - Gehen-vs-anderes.txt");
define("ACTIVITIES", "Strassenbahn|Sitzen|Stehen|Gehen|anderes|Still|Bewegung");
define("SAMPLERATE", "20");
define("WINDOWLENGTH", "2000"); // in milliseconds
define("SAMPLEPERMINUTE", WINDOWLENGTH / SAMPLERATE);

function addIf($line) {
	$output = 0;
	if (preg_match("/[a-zA-Z_-]+\s<=\s[\-+]?[0-9]*\.?[0-9]+:/", $line, $output) == 1)  {
		$activity = "";
		preg_match("/(" . ACTIVITIES . ")/", $line, $activity);
		preg_match("/[a-zA-Z_-]+\s<=\s[\-+]?[0-9]*\.?[0-9]+/", $line, $output);
		return "if (" . $output[0] . ") { return \"" . $activity[0] . "\";\n";
	} else if (preg_match("/[a-zA-Z_-]+\s<=\s[\-+]?[0-9]*\.?[0-9]+/", $line, $output) == 1) {
		return "if (" . $output[0] . ") {\n";
	} else {
		return "// " . $line;
	}
}

function addElse($line) {
	$output = 0;
	if (preg_match("/[a-zA-Z_-]+\s>\s[\-+]?[0-9]*\.?[0-9]+:/", $line, $output) == 1)  {
		$activity = "";
		preg_match("/(" . ACTIVITIES . ")/", $line, $activity);
		return "} else { return \"" . $activity[0] . "\"; }\n";
	} else if (preg_match("/[a-zA-Z_-]+\s>\s[\-+]?[0-9]*\.?[0-9]+/", $line, $output) == 1) {
		return "} else {\n";
	} else {
		return "// " . $line;
	}
}

function countDivides($line) {
	$result = 0;
	for ($i = 0; $i < strlen($line); $i++) {
		if ($line[$i] == "|") {
			$result++;
		}
	}
	return $result;
}

$dtIfElse = "";

$handle = fopen(WEKADECISIONTREE, "r");
if ($handle) {
	$prevCountDivide = -1;
    while (($line = fgets($handle)) !== false) {
		$countDivide = countDivides($line);
		if ($countDivide > $prevCountDivide) {
			$dtIfElse .= str_repeat("\t", $countDivide) . addIf($line);
			$prevCountDivide = $countDivide;
			$countDivide = 0;
			continue;
		} elseif ($countDivide == $prevCountDivide) {
			$dtIfElse .= str_repeat("\t", $countDivide) . addElse($line);
			$prevCountDivide = $countDivide;
			$countDivide = 0;
			continue;
		} else {
			if (($prevCountDivide - $countDivide) > 1) {
				for ($j = 1, $countDown = $prevCountDivide - $countDivide; $j < ($prevCountDivide - $countDivide); $j++, $countDown--) {
					$dtIfElse .= str_repeat("\t", $countDivide + $countDown - 1) . "}\n";
				}
				$dtIfElse .= str_repeat("\t", $countDivide) . addElse($line);
				$prevCountDivide = $countDivide;
				$countDivide = 0;
				continue;
			} else {
				$dtIfElse .= str_repeat("\t", $countDivide) . addElse($line);
				$prevCountDivide = $countDivide;
				$countDivide = 0;
				continue;
			}
		}
	}
	$dtIfElse .=  str_repeat("\t", $countDivide) . "}\n";
} else {
    // error opening the file.
}
?>
<script type="text/javascript">
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

var sampledDM = new Array(<?php echo SAMPLEPERMINUTE; ?>);
var array_devMoX = new Array(<?php echo SAMPLEPERMINUTE; ?>);
var array_devMoY = new Array(<?php echo SAMPLEPERMINUTE; ?>);
var array_devMoZ = new Array(<?php echo SAMPLEPERMINUTE; ?>);
var array_devMoXWithoutGrav = new Array(<?php echo SAMPLEPERMINUTE; ?>);
var array_devMoYWithoutGrav = new Array(<?php echo SAMPLEPERMINUTE; ?>);
var array_devMoZWithoutGrav = new Array(<?php echo SAMPLEPERMINUTE; ?>);

var array_devMoRotAlpha = new Array(<?php echo SAMPLEPERMINUTE; ?>);
var array_devMoRotBeta = new Array(<?php echo SAMPLEPERMINUTE; ?>);
var array_devMoRotGamma = new Array(<?php echo SAMPLEPERMINUTE; ?>);

var array_devOrAlpha = new Array(<?php echo SAMPLEPERMINUTE; ?>);
var array_devOrBeta =  new Array(<?php echo SAMPLEPERMINUTE; ?>);
var array_devOrGamma = new Array(<?php echo SAMPLEPERMINUTE; ?>);


function classify()
{
    if (classInterval < <?php echo SAMPLEPERMINUTE; ?>) {
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
        
        for (var i = 0; i < <?php echo SAMPLEPERMINUTE; ?>; i++) {
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
        
        var devMoX_avg = devMoX_sum / <?php echo SAMPLEPERMINUTE; ?>;
        var devMoY_avg = devMoX_sum / <?php echo SAMPLEPERMINUTE; ?>;
        var devMoZ_avg = devMoX_sum / <?php echo SAMPLEPERMINUTE; ?>;
        var devMoXWithoutGrav_avg = devMoXWithoutGrav_sum / <?php echo SAMPLEPERMINUTE; ?>;
        var devMoYWithoutGrav_avg = devMoXWithoutGrav_sum / <?php echo SAMPLEPERMINUTE; ?>;
        var devMoZWithoutGrav_avg = devMoYWithoutGrav_sum / <?php echo SAMPLEPERMINUTE; ?>;
        var devMoRotAlpha_avg = devMoRotAlpha_sum / <?php echo SAMPLEPERMINUTE; ?>;
        var devMoRotBeta_avg = devMoRotBeta_sum / <?php echo SAMPLEPERMINUTE; ?>;
        var devMoRotGamma_avg = devMoRotGamma_sum / <?php echo SAMPLEPERMINUTE; ?>;
        
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
        
        devMoX_var /= <?php echo SAMPLEPERMINUTE; ?>;
        devMoY_var /= <?php echo SAMPLEPERMINUTE; ?>;
        devMoZ_var /= <?php echo SAMPLEPERMINUTE; ?>;
        devMoXWithoutGrav_var /= <?php echo SAMPLEPERMINUTE; ?>;
        devMoYWithoutGrav_var /= <?php echo SAMPLEPERMINUTE; ?>;
        devMoZWithoutGrav_var /= <?php echo SAMPLEPERMINUTE; ?>;
        devMoRotAlpha_var /= <?php echo SAMPLEPERMINUTE; ?>;
        devMoRotBeta_var /= <?php echo SAMPLEPERMINUTE; ?>;
        devMoRotGamma_var /= <?php echo SAMPLEPERMINUTE; ?>;
        
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
        
        sampledDM = new Array(<?php echo SAMPLEPERMINUTE; ?>);
        array_devMoX = new Array(<?php echo SAMPLEPERMINUTE; ?>);
        array_devMoY = new Array(<?php echo SAMPLEPERMINUTE; ?>);
        array_devMoZ = new Array(<?php echo SAMPLEPERMINUTE; ?>);
        array_devMoXWithoutGrav = new Array(<?php echo SAMPLEPERMINUTE; ?>);
        array_devMoYWithoutGrav = new Array(<?php echo SAMPLEPERMINUTE; ?>);
        array_devMoZWithoutGrav = new Array(<?php echo SAMPLEPERMINUTE; ?>);
        
        array_devMoRotAlpha = new Array(<?php echo SAMPLEPERMINUTE; ?>);
        array_devMoRotBeta = new Array(<?php echo SAMPLEPERMINUTE; ?>);
        array_devMoRotGamma = new Array(<?php echo SAMPLEPERMINUTE; ?>);
        
        array_devOrAlpha = new Array(<?php echo SAMPLEPERMINUTE; ?>);
        array_devOrBeta =  new Array(<?php echo SAMPLEPERMINUTE; ?>);
        array_devOrGamma = new Array(<?php echo SAMPLEPERMINUTE; ?>);
        
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
	<?php echo $dtIfElse; ?>
}

var iFrequency = <?php echo SAMPLERATE;?>; // expressed in milliseconds
var myInterval = 0;

// STARTS and Resets the loop if any
function startLoop() {
    if(myInterval > 0) clearInterval(myInterval);  // stop
    myInterval = setInterval(function(){classify()}, iFrequency );  // run
}

startLoop();
</script>
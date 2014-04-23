<?php
    /* Copyright (c) 2014 Michael Hauber, TECO (Karlsruhe Institute of Technology, KIT)

	/* This Script enables you to take any WEKA-generated J48 (pruned or unpruned) Decision Tree (as txt file),
	 * to generate an if-else of it. */

	/* IMPORT: It is only allowed to use a-Z, A-Z, 0-9 and underscore (_), if you want to use it as JavaScript-Code. */
	
	/* IMPORTANT2: You have to erase all not necessary empty and comment files of the WEKA-export. If you don't it will not work correctly. 
					If think it is quite easy to fix ;-). */
					
    /* You can format the output with for example Notedpad++ TextFX C++ Code Indent. */
	
function addIf($line) {
	$output = 0;
	if (preg_match("/[a-zA-Z_-]+\s<=\s[\-+]?[0-9]*\.?[0-9]+:/", $line, $output) == 1)  {
		$activity = "";
		preg_match("/(Strassenbahn|Sitzen|Stehen|Gehen|anderes|Still|Bewegung)/", $line, $activity);
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
		preg_match("/(Strassenbahn|Sitzen|Stehen|Gehen|anderes|Still|Bewegung)/", $line, $activity);
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

$handle = fopen("Entscheidungsbaum 3 - Bewegung-vs-Still.txt", "r");
if ($handle) {
	$prevCountDivide = -1;
    while (($line = fgets($handle)) !== false) {
		$countDivide = countDivides($line);
		if ($countDivide > $prevCountDivide) {
			echo addIf($line);
			$prevCountDivide = $countDivide;
			$countDivide = 0;
			continue;
		} elseif ($countDivide == $prevCountDivide) {
			echo addElse($line);
			$prevCountDivide = $countDivide;
			$countDivide = 0;
			continue;
		} else {
			if (($prevCountDivide - $countDivide) > 1) {
				for ($j = 1; $j < ($prevCountDivide - $countDivide); $j++) {
					echo "}\n";
				}
				echo addElse($line);
				$prevCountDivide = $countDivide;
				$countDivide = 0;
				continue;
			} else {
				echo addElse($line);
				$prevCountDivide = $countDivide;
				$countDivide = 0;
				continue;
			}
		}
	}
	echo "}\n";
} else {
    // error opening the file.
}

?>
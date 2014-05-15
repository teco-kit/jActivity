jActivity
=========
A Javascript and HTML5-based system to acquire sensor data out of a smartphones browser, use this data to train a classifier and provide the classifier as a JavaScript so that it can be embedded into a website.


HTML5 Events
-------
jActivity uses the two HTML5 events DeviceMotion and DeviceOrientation.
Specification can be found here: [DeviceOrientation Event Specification](http://www.w3.org/TR/orientation-event/).

DeviceOrientation
-------
DeviceOrientation offers the attributes: `alpha`, `beta` and `gamma`.
In the specification it is stated, that: 

> The event should fire whenever a significant change in orientation occurs. The definition of a significant change in this context is left to the implementation. In addition, when a new listener registers for the event, implementations should fire the event as soon as sufficiently fresh data is available.

This means, you cannot set a specific sample rate. You have to rely on your device to deliver fast enough sample rates.

> The alpha, beta and gamma properties of the event must specify the orientation of the device in terms of the transformation from a coordinate frame fixed on the Earth to a coordinate frame fixed in the device.

It is important to notice, that the compass is used to define the three attributes.

> The Earth coordinate frame is a 'East, North, Up' frame at the user's location. It has the following 3 axes, where the ground plane is tangent to the spheriod of the World Geodetic System 1984 [[WGS84]](http://w3c.github.io/deviceorientation/spec-source-orientation.html#ref-wgs84), at the user's location.

A more detailed feasibility study can be found in: [jActivity: Supporting Mobile Web Developers with HTML5/JavaScript based Human Activity Recognition](http://www.teco.edu/~budde/publications/MUM2013_poster_hauber.pdf).


DeviceMotion
-------
DeviceMotion is able to give you `acceleration` with or without gravity in three axes (`x`, `y` and `z`) and a `rotation rate` in three axes (`x`, `y` and `z`).

> The acceleration attribute must be initialized with the acceleration of the hosting device relative to the Earth frame, expressed in the body frame, as defined in section 4.1. The acceleration must be expressed in meters per second squared (m/s2).

> The rotationRate attribute must be initialized with the rate of rotation of the hosting device in space. It must be expressed as the rate of change of the angles defined in section 4.1 and must be expressed in degrees per second (deg/s).


Usage
-------
First you have to setup your data gathering module. An easy example is given in `gatherMotionData.js`.
Here is an example how the data is gathered and uploaded to a php script on a server (example code can be found in `saveDeviceMotionData.php` and `saveDeviceOrientationData.php`)

```javascript
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
```

Second step is then to build a classifier using a Decision Tree in [WEKA](http://www.cs.waikato.ac.nz/~ml/weka/)
This looks like:

```
devMoZWithoutGrav_avg <= -0.583389
|   devOrAlpha_avg <= 50.638302
|   |   devMoY_avg <= 3.319732: Gehen (10.0/1.0)
|   |   devMoY_avg > 3.319732: anderes (28.0)
|   devOrAlpha_avg > 50.638302
|   |   devMoZWithoutGrav_avg <= -0.739428
|   |   |   devMoY_avg <= 4.257332: Gehen (1073.0)
|   |   |   devMoY_avg > 4.25733
            [...]
```

There you can export the decision tree from the text field and use `buildJavaScriptClassifier.php` to create your personal classifier in JavaScript.
The script transforms your WEKA decision tree to something like this:

```
if (devMoZWithoutGrav_avg <= -0.583389) {
	if (devOrAlpha_avg <= 50.638302) {
		if (devMoY_avg <= 3.319732) { return "Gehen";
		} else { return "anderes"; }
	} else {
		if (devMoZWithoutGrav_avg <= -0.739428) {
			if (devMoY_avg <= 4.257332) { return "Gehen";
			} else {
			[...]
```

Finally you have to include the generated JavaScript code in your mobile website or webapplication.
You can use the function `getDecisionOfDT([...])` to access your classifier.
A very minimalistic, simple classification would be:

```javascript
    if (devMoX_var > 0.5 || devMoXWithoutGrav_var > 0.5 || devMoYWithoutGrav_var > 0.5 || devMoZWithoutGrav_var > 0.5 || devMoAlphaRot_var > 0.1 || devMoBetaRot_var > 0.1 || devMoGammaRot_var > 0.1) {
        return "Movement detected.";
    } else {
     	return "No Movement detected.";   
    }
```




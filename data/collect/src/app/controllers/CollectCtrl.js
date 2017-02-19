/*
	Copyright 2016 KIT Institute for Telematics TecO - David Greiner
	This file is subject to the terms and conditions defined in
	file 'LICENSE', which is part of this source code package.
*/

export default function($scope, $filter, $location, $templateRequest, $sce, host, sharedConfig) {
  'ngInject';

  /* Get previously defined features and labels */
  var features = sharedConfig.getFeatures();
  var labels = sharedConfig.getLabels();

  /* Parse UserAgent using darcyclarke/Detect.js */
  var ua = detect.parse(navigator.userAgent);

  /* Sandbox for all feature collect scripts */
  var sandbox = {
    send: function(data) {
      console.log(data);
      var useragent = ua.device.manufacturer + "_" + ua.device.name + "_" + ua.browser.family + "_" + ua.browser.major;
      var text = data.sensor + ",label=" + labels + ",useragent=" + useragent.replace(/\s/g,'') + " ";
      delete data.sensor;
      for(var sensorData in data) {
        text += sensorData + "=" + data[sensorData] + ",";
      }
      text = text.substring(0, text.length - 1);
      var req = new XMLHttpRequest();
      req.open('POST', "http://" + host + "/influxdb/write?db=jactivity");
      req.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
      req.send(text);
    }
  };

  $scope.HTML = "";

  var sensors = [];

  features.forEach(function(key) {
    if (typeof(key.html) != "undefined" && key.html !== "") {
      console.log("html/" + key.html);

      $templateRequest("html/" + key.html).then(function(html) {
        $scope.sensorHTML = $sce.trustAsHtml(html);
      });
    }
    //$scope.HTML = $scope.HTML + $templateCache.get("html/" + key.html);
    /*
    		// DOM: Create the script element
    	    var jsElm = document.createElement("script");
    	    // set the type attribute
    	    jsElm.type = "application/javascript";
    	    // make the script element load file
    	    jsElm.src = "scripts/" + key.script;
    	    // finally insert the element to the body element in order to load the script
    	    document.body.appendChild(jsElm);


    		jsElm.onload = function() {

    		};*/
    //inject.js("scripts/" + key.script, function() {

    var req = new XMLHttpRequest();
    var fileLocation = '../sensors/' + key.name + '/' + key.name + '.js';
    req.open('GET', fileLocation);
    req.onreadystatechange = function() {
      eval(client.responseText);
    };

    var sensor = new window[key.feature](sandbox);
    sensors.push(sensor);
    //});
  });

  $scope.timerRunning = false;

  $scope.start = function(deadline) {
    $scope.$broadcast('timer-start');
    $scope.timerRunning = true;
    sensors.forEach(function(sensor) {
      sensor.start();
    });
  };

  $scope.stop = function() {
    console.log("stop");
    $scope.timerRunning = false;
    sensors.forEach(function(sensor) {
      sensor.stop();
      delete window.sensor;
    });
    $location.path("/sensor");
  };

}

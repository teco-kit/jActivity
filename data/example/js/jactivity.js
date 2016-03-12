var evaluateInterval = 1000; // in milliseconds

var treeTransformationActivity = function(data) {

  var model = $.parseXML(data.pop());

  var XSLtransformationActivity = function(xsl_file) {

    var generated_code = transform(model, xsl_file);
    // generate a decision tree from the transformed file
    var decisionTree = eval(generated_code.textContent);


    // Includes all data
    var dataset = {};

    function evaluateDataActivity(event) {
      var averageData = {};

      for (var sensor in dataset) {
        averageData[sensor] = dataset[sensor].reduce(function(a, b) {
          return a + b;
        }, 0) / dataset[sensor].length;
        dataset[sensor] = [];
      }

      var res = decisionTree.evaluate(averageData).result;

      if (res == null) return;

      //define what to do with the result
      switch (res.toLowerCase()) {
        case "walking":
          document.body.style.fontSize = "1.2em";
          break;
        case "standing":
          document.body.style.fontSize = "1.0em";
          break;
        default:
          document.getElementById("test").innerHTML = averageData.toString();
          break;
      }

    }

    function devicemotionListener(event) {
      (dataset.accelerationX = dataset.accelerationX || []).push(event.acceleration.x);
      (dataset.accelerationY = dataset.accelerationY || []).push(event.acceleration.y);
      (dataset.accelerationZ = dataset.accelerationZ || []).push(event.acceleration.z);

      (dataset.accelerationIncludingGravityX = dataset.accelerationIncludingGravityX || []).push(event.accelerationIncludingGravity.x);
      (dataset.accelerationIncludingGravityY = dataset.accelerationIncludingGravityY || []).push(event.accelerationIncludingGravity.y);
      (dataset.accelerationIncludingGravityZ = dataset.accelerationIncludingGravityZ || []).push(event.accelerationIncludingGravity.z);

      (dataset.rotationRateBeta = dataset.rotationRateBeta || []).push(event.rotationRate.beta);
      (dataset.rotationRateGamma = dataset.rotationRateGamma || []).push(event.rotationRate.gamma);
      (dataset.rotationRateAlpha = dataset.rotationRateAlpha || []).push(event.rotationRate.alpha);
    }

    function deviceorientationListener(event) {
      (dataset.beta = dataset.beta || []).push(event.beta);
      (dataset.gamma = dataset.gamma || []).push(event.gamma);
      (dataset.alpha = dataset.alpha || []).push(event.alpha);
    }

    // add listener for sensors
    // devicemotion
    window.addEventListener('devicemotion', devicemotionListener);
    // deviceorientation
    window.addEventListener('deviceorientation', deviceorientationListener);
    // add listener for interval
    window.setInterval(evaluateDataActivity, evaluateInterval);

  }

  $.ajax({
    type: "GET",
    url: ("http://" + host + ":82/transformationstyles/pmml2js_decision_tree.xsl"),
    success: XSLtransformationActivity
  });


}

var treeTransformationHandedness = function(data) {

  var model = $.parseXML(data.pop());

  var XSLtransformationHandedness = function(xsl_file) {

    var generated_code = transform(model, xsl_file);
    // generate a decision tree from the transformed file
    var decisionTree = eval(generated_code.textContent);


    // Includes all data
    var dataset = {};

    function evaluateDataHandedness(event) {
      var averageData = {};

      for (var sensor in dataset) {
        averageData[sensor] = dataset[sensor].reduce(function(a, b) {
          return a + b;
        }, 0) / dataset[sensor].length;
        dataset[sensor] = [];
      }

      var res = decisionTree.evaluate(averageData).result;

      if (res == null) return;

      //define what to do with the result
      switch (res.toLowerCase()) {
        case "left":
          //add code to define that <div class="navbar navbar-default navbar-fixed-top" align="right"> with align="left"
          //add code to change <div class="navmenu navmenu-default navmenu-fixed-right offcanvas"> to <div class="navmenu navmenu-default navmenu-fixed-left offcanvas">
          //both have to be done if not yet set to "left"
          document.getElementById("test").innerHTML = "You are operating in left hand mode!";
          break;
        case "right":
          //add code to define that <div class="navbar navbar-default navbar-fixed-top" align="left"> with align="right"
          //add code to change <div class="navmenu navmenu-default navmenu-fixed-left offcanvas"> to <div class="navmenu navmenu-default navmenu-fixed-right offcanvas">
          //both have to be done if not yet set to "right"
          document.getElementById("test").innerHTML = "You are operating in right hand mode!";
          break;
        default:
          document.getElementById("test").innerHTML = averageData.toString();
          break;
      }

    }

    var firstTouchX = [];
    var firstTouchY = [];
    var lastTouchX = [];
    var lastTouchY = [];

    function touchstartListener(event) {
      for (var i = 0; i < event.changedTouches.length; i++) {
        if (typeof window.innerWidth != 'undefined') {
          xRatio = event.changedTouches[i].clientX / window.innerWidth;
          yRatio = event.changedTouches[i].clientY / window.innerHeight;
          (dataset.ratioX = dataset.ratioX || []).push(xRatio);
          firstTouchX[i] = xRatio;
          firstTouchY[i] = yRatio;
          lastTouchX[i] = firstTouchX[i];
          lastTouchY[i] = firstTouchY[i];
        }
      }
    }

    function touchendListener(event) {
      for (var i = 0; i < event.changedTouches.length; i++) {
        if (typeof window.innerWidth != 'undefined') {
          xRatio = event.changedTouches[i].clientX / window.innerWidth;
          yRatio = event.changedTouches[i].clientY / window.innerHeight;
          (dataset.ratioX = dataset.ratioX || []).push(xRatio);
          (dataset.totalVectorX = dataset.totalVectorX || []).push(xRatio - firstTouchX[i]);
          (dataset.totalVectorY = dataset.totalVectorY || []).push(yRatio - firstTouchY[i]);
          (dataset.stepVectorX = dataset.stepVectorX || []).push(xRatio - lastTouchX[i]);
          (dataset.stepVectorY = dataset.stepVectorY || []).push(yRatio - lastTouchY[i]);
          firstTouchX[i], firstTouchY[i] = "";
          lastTouchX[i], lastTouchY[i] = "";
        }
      }
    }

    function touchmoveListener(event) {
      for (var i = 0; i < event.changedTouches.length; i++) {
        if (typeof window.innerWidth != 'undefined') {
          xRatio = event.changedTouches[i].clientX / window.innerWidth;
          yRatio = event.changedTouches[i].clientY / window.innerHeight;
          (dataset.ratioX = dataset.ratioX || []).push(xRatio);
          (dataset.stepVectorX = dataset.stepVectorX || []).push(xRatio - lastTouchX[i]);
          (dataset.stepVectorY = dataset.stepVectorY || []).push(yRatio - lastTouchY[i]);
          lastTouchX[i] = xRatio;
          lastTouchY[i] = yRatio;
        }
      }
    }

    function touchcancelListener(event) {
      for (var i = 0; i < event.changedTouches.length; i++) {
        if (typeof window.innerWidth != 'undefined') {
          xRatio = event.changedTouches[i].clientX / window.innerWidth;
          yRatio = event.changedTouches[i].clientY / window.innerHeight;
          (dataset.ratioX = dataset.ratioX || []).push(xRatio);
          (dataset.totalVectorX = dataset.totalVectorX || []).push(xRatio - firstTouchX[i]);
          (dataset.totalVectorY = dataset.totalVectorY || []).push(yRatio - firstTouchY[i]);
          (dataset.stepVectorX = dataset.stepVectorX || []).push(xRatio - lastTouchX[i]);
          (dataset.stepVectorY = dataset.stepVectorY || []).push(yRatio - lastTouchY[i]);
          firstTouchX[i], firstTouchY[i] = "";
          lastTouchX[i], lastTouchY[i] = "";
        }
      }
    }

    // add listener for sensors
    // touchevents
    document.addEventListener('touchstart', touchstartListener); // when the user places a touch point on the touch surface
    document.addEventListener('touchend', touchendListener); // when the user removes a touch point from the touch surface, also including cases where the touch point physically leaves the touch surface, such as being dragged off of the screen.
    document.addEventListener('touchmove', touchmoveListener); // when the user moves a touch point along the touch surface
    document.addEventListener('touchcancel', touchcancelListener); // when a touch point has been disrupted in an implementation-specific manner

    // add listener for interval
    window.setInterval(evaluateDataHandedness, evaluateInterval);

  }

  $.ajax({
    type: "GET",
    url: ("http://" + host + ":82/transformationstyles/pmml2js_decision_tree.xsl"),
    success: XSLtransformationHandedness
  });


}

//get PMML in XML format and transform it via XSL to a file

host = "docker.teco.edu"
url = "http://" + host + ":8004/ocpu/library/jActivity2PMML/R/getPMML/json"

$.ajax({
  type: "POST",
  url: url,
  data: 'json_data={"sensor": ["devicemotion", "deviceorientation"],"label": ["walking", "standing"],"classifier": "rpart"}',
  success: treeTransformationActivity,
  dataType: "json"
});

$.ajax({
  type: "POST",
  url: url,
  data: 'json_data={"sensor": ["touchevents"],"label": ["left", "right"],"classifier": "rpart"}',
  success: treeTransformationHandedness,
  dataType: "json"
});

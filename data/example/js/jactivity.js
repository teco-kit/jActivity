var evaluateInterval = 1000; // in milliseconds

var treeTransformation = function(data) {

  var model = $.parseXML(data.pop());

  var XSLtransformation = function(xsl_file) {

    var generated_code = transform(model, xsl_file);
    // generate a decision tree from the transformed file
    var decisionTree = eval(generated_code.textContent);


    // Includes all data
    var dataset = {};
    var dataset2 = {};

    function evaluateData(event) {
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
          break;
        case "right":
          //add code to define that <div class="navbar navbar-default navbar-fixed-top" align="left"> with align="right"
          //add code to change <div class="navmenu navmenu-default navmenu-fixed-left offcanvas"> to <div class="navmenu navmenu-default navmenu-fixed-right offcanvas">
          //both have to be done if not yet set to "right"
          break;
        case "walking":
          document.body.style.fontSize = "1.2em";
          document.getElementById("test").innerHTML = "You are walking!";
          break;
        case "standing":
          document.body.style.fontSize = "1.0em";
          document.getElementById("test").innerHTML = "You are not moving!";
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


    var firstTouchX, firstTouchY = new Array(10);
    var lastTouchX, lastTouchY = new Array(10);

    function touchstartListener(event) {
      for (var i = 0; i < event.changedTouches.length; i++) {
        if (typeof window.innerWidth != 'undefined') {
          xRatio = event.changedTouches[i].clientX / window.innerWidth;
          yRatio = event.changedTouches[i].clientY / window.innerHeight;
          (dataset2.ratioX = dataset2.ratioX || []).push(xRatio);
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
          (dataset2.ratioX = dataset2.ratioX || []).push(xRatio);
          (dataset2.totalVectorX = dataset2.totalVectorX || []).push(xRatio - firstTouchX[i]);
          (dataset2.totalVectorY = dataset2.totalVectorY || []).push(yRatio - firstTouchY[i]);
          (dataset2.stepVectorX = dataset2.stepVectorX || []).push(xRatio - lastTouchX[i]);
          (dataset2.stepVectorY = dataset2.stepVectorY || []).push(yRatio - lastTouchY[i]);
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
          (dataset2.ratioX = dataset2.ratioX || []).push(xRatio);
          (dataset2.stepVectorX = dataset2.stepVectorX || []).push(xRatio - lastTouchX[i]);
          (dataset2.stepVectorY = dataset2.stepVectorY || []).push(yRatio - lastTouchY[i]);
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
          (dataset2.ratioX = dataset2.ratioX || []).push(xRatio);
          (dataset2.totalVectorX = dataset2.totalVectorX || []).push(xRatio - firstTouchX[i]);
          (dataset2.totalVectorY = dataset2.totalVectorY || []).push(yRatio - firstTouchY[i]);
          (dataset2.stepVectorX = dataset2.stepVectorX || []).push(xRatio - lastTouchX[i]);
          (dataset2.stepVectorY = dataset2.stepVectorY || []).push(yRatio - lastTouchY[i]);
          firstTouchX[i], firstTouchY[i] = "";
          lastTouchX[i], lastTouchY[i] = "";
        }
      }
    }

    // add listener for sensors
    // devicemotion
    window.addEventListener('devicemotion', devicemotionListener);
    // deviceorientation
    window.addEventListener('deviceorientation', deviceorientationListener);
    // touchevents
    document.addEventListener('touchstart', touchstartListener); // when the user places a touch point on the touch surface
    document.addEventListener('touchend', touchendListener); // when the user removes a touch point from the touch surface, also including cases where the touch point physically leaves the touch surface, such as being dragged off of the screen.
    document.addEventListener('touchmove', touchmoveListener); // when the user moves a touch point along the touch surface
    document.addEventListener('touchcancel', touchcancelListener); // when a touch point has been disrupted in an implementation-specific manner

    // add listener for interval
    window.setInterval(evaluateData, evaluateInterval);

  }

  $.ajax({
    type: "GET",
    url: ("http://" + host + ":82/transformationstyles/pmml2js_decision_tree.xsl"),
    success: XSLtransformation
  });


}

//get PMML in XML format and transform it via XSL to a file

host = "docker.teco.edu"
url = "http://" + host + ":8004/ocpu/library/jActivity2PMML/R/getPMML/json"

$.ajax({
  type: "POST",
  url: url,
  data: 'json_data={"sensor": ["devicemotion", "deviceorientation"],"label": ["walking", "standing"],"classifier": "rpart"}',
  success: treeTransformation,
  dataType: "json"
});

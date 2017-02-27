/*
	Copyright 2016 KIT Institute for Telematics TecO - David Greiner
	This file is subject to the terms and conditions defined in
	file 'LICENSE', which is part of this source code package.
*/

export default function($scope, $filter, $location, $http, ModelService, host, sharedConfig) {
  'ngInject';
  /* Parse UserAgent using darcyclarke/Detect.js */
  $scope.ua = detect.parse(navigator.userAgent);

  /* Get Features using AJAX and generate sensor dependency list */
  $scope.features = [];
  $scope.sensors = [];

  ModelService.getFeatures().then(function(data) {
    $scope.features = data.data;
    $scope.sensors = $filter('feature')($scope.features.sensors);
  });

  /* Watch for newly selected features and change sensor depency list accordingly */
  $scope.$watch('features', function(newVal, oldVal, scope) {
    $scope.sensors = $filter('feature')($scope.features.sensors);
  }, true);


  /* Get Labels and prepare them using mbenford/ngTagsInput */
  $scope.labels = [];

  $scope.loadLabels = function($query) {
    return ModelService.getLabels().then(function(response) {
	  const series = response.data.results[0].series;
      //var labels = response.data;
      var data = [].concat.apply([], series.map(e=>e.values.filter(x=>x[0]==='label').map(x=>x[1]))).filter((e,i,s)=>s.indexOf(e)===i);
      //const labels = [];
      //var labels = series.map(e=>e.values.filter(x=>x[0]==='label').map(x=>x[1])).reduce((a,b)=>a.IndexOf(b)<0?a.concat(b):a);
      var labels = data.map(e=> ({name:e}));
	  //series.forEach(e => e.values.forEach(v => { if (v[0] === 'label' && labels.indexOf(v[1]) === -1) labels.push({name: v[1]});}));
      return labels.filter(function(label) {
        return label.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    });
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  $scope.updateJavaScript = function() {
    console.log("updateJavaScript");
    var features = $filter('filter')($scope.features.sensors, {
      value: true
    });
    var labels = $scope.labels;
    if(!$scope.name && !features && !labels) {
      return;
    }
    var jActivityTemplate = `class jActivity {
      constructor(host) {
        this.host = host
        //if(localStorage.getItem("decisionTree")) {
        //	resolve(localStorage.getItem('decisionTree', xsl_file))
        //} else {
    	    this.XSL = new Promise((resolve, reject) => {
    	      var onSuccess = function(xsl_file) {
    	        localStorage.setItem('decisionTree', xsl_file)
    	        resolve(xsl_file)
    	      }
    	      $.ajax({
    	        type: "GET",
    	        url: ("http://" + host + "/transformationstyles/pmml2js_decision_tree.xsl"),
    	        success: onSuccess
    	      })
    	    })
    	//}

      }

      %CLASSIFIER%
    }

    class Classifier {
      constructor(sensors, callback, label, interval, host, XSL) {
        this.sensors = sensors
        this.callback = callback
        this.label = label
        this.interval = interval
        this.host = host
        this.XSL = XSL
        this.decisionTree = null
        const scope = this
        this.createDecisionTree(scope)
        this.dataset = {}
        window.setInterval((...args) => this.evaluateDataActivity(...args), interval)
      }

      createDecisionTree(scope) {
        function onSuccess(data, XSL) {
          let model = $.parseXML(data.pop())
          let generated_code = transform(model, XSL)
          scope.decisionTree = eval(generated_code.textContent)
        }
        this.XSL.then(function(XSL) {
          $.ajax({
            type: "POST",
            url: ("http://" + scope.host + "/ocpu/ocpu/library/jActivity2PMML/R/getPMML/json"),
            data: 'json_data={"sensor": ' + JSON.stringify(scope.sensors) + ',"label": ' + JSON.stringify(scope.label) + ',"classifier": "rpart"}',
            success: function(data) {
              onSuccess(data, XSL)
            },
            dataType: "json"
          })
        })
      }

      evaluateDataActivity() {
        throw new Error("Not implemented")
      }

    }
`;
    var classifierTemplate = `class %NAME%Classifier extends Classifier {
      constructor(callback, label, interval, host, XSL) {
        super(%FEATURES%, callback, label, interval, host, XSL)
        %INITIALIZE%
      }

      %HELPERFUNCTIONS%

      evaluateDataActivity() {
        let averageData = {}

        for (var feature in this.dataset) {
          averageData[feature] = this.dataset[feature].reduce(function(a, b) {
            return a + b
          }, 0) / this.dataset[feature].length
          this.dataset[feature] = []
        }

        if (this.decisionTree == null) return

        let res = this.decisionTree.evaluate(averageData).result

        if (res == null) return

        this.callback(res.toLowerCase())
      }
    }`;
    var implementTemplate = `let %NAME%Callback = function(result) {
      switch (result) {
        %LABELSWITCH%
      }
    }

    let %NAME%Classifier = jactivity.%NAME%Classifier(%NAME%Callback, %LABELS%, 1000)
    `;

    var initialize = "";
    var helper = "";
    var classifierJS = "";
    var options = {presets: ["es2015"]};

    var featureArray = feature.map(function(array) {
      return array.feature;
    });

    var classifierImpl = $scope.name.toLowerCase() + "Classifier(callback, label, interval) {\nreturn new " + capitalizeFirstLetter($scope.name) + "Classifier(callback, label, interval, this.host, this.XSL)\n}\n";

    features.forEach(function(key) {
      $http.get('../sensors/' + key.feature + '/' + key.feature + '.initialize.js')
        .then(function(response) {
           initialize += response.data;
           return $http.get('../sensors/' + key.feature + '/' + key.feature + '.helper.js');
        })
        .then(function(response) {
           helper += response.data;
        });
    });
    var replacementsClassifier = {"%NAME%":capitalizeFirstLetter($scope.name), "%FEATURES%":JSON.stringify(features), "%INITIALIZE%": initialize, "%HELPERFUNCTIONS%": helper};
    classifierJS += classifierTemplate.replace(/%\w+%/g, function(all) {
       return replacementsClassifier[all] || all;
    });
    classifierJS += '\n';

    var replacementsjActivity = {"%CLASSIFIER%":classifierImpl};

    var jactivityJS = jActivityTemplate.replace(/%\w+%/g, function(all) {
       return replacementsjActivity[all] || all;
    });
    var jActivity = jactivityJS + classifierJS;

    var code = Babel.transform(jActivity, options).code;

    console.log(code);
  };

}

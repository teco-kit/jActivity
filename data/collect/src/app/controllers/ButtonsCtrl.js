export default function($scope, $filter, $location, ModelService, sharedConfig) {
  'ngInject';

  $scope.ua = detect.parse(navigator.userAgent);
  $scope.labelMessage = "";

  console.log(detect.parse(navigator.userAgent));

  var features = ModelService.getFeatures();
  features.then(function(data) {
    $scope.features = data;
    $scope.sensors = $filter('sensor')($scope.features.data);
    console.log($scope.sensors);
  });

  var labels = ModelService.getLabels();
  labels.then(function(data) {
    $scope.labels = data.data;
    $scope.myName = $scope.labels[0].name;
  });

  function machineReadableString(string) {
    return string.replace(/([^a-z0-9]+)/gi, '-').toLowerCase();
  }

  $scope.changeLabel = function(newName) {
    $scope.myName = newName;
  };

  $scope.$watch(function(scope) {
    return $scope.myName;
  }, function() {
    if ($scope.labels.map(function(e) {
        return e.name;
      }).indexOf($scope.myName) == -1) {
      $scope.labelMessage = "You're creating a new label " + $scope.myName + " (" + machineReadableString($scope.myName) + ")";
    } else {
      $scope.labelMessage = "";
    }
  });

  $scope.next = function() {
    var features = $filter('filter')($scope.features.data, {
      value: true
    });
    var myLabel;
    var index = $scope.labels.map(function(e) {
      return e.name;
    }).indexOf($scope.myName);
    // Check if Label Name exists in Array
    if (index == -1) {
      myLabel = machineReadableString($scope.myName);
			var data = { label: myLabel, name: $scope.myName};
      var json = JSON.stringify(data);
      if (json !== '{}') {
        var req = new XMLHttpRequest();
        req.open('POST', "http://docker.teco.edu:3000/labels");
        req.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        req.send(json);
      }
    } else {
      myLabel = $scope.labels[index].label;
    }
    console.log("Label: " + myLabel);
    sharedConfig.setConfig(features, myLabel);
    $location.path("/sensor");
  };


  $scope.$watch('features', function(newVal, oldVal, scope) {
    $scope.sensors = $filter('sensor')($scope.features.data);
    console.log($scope.sensors);
  }, true);

}

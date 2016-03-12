export default function($scope, $filter, $location, ModelService, sharedConfig) {
  'ngInject';


  $scope.ua = detect.parse(navigator.userAgent);


  $scope.features = [];
  $scope.sensors = [];

  ModelService.getFeatures().then(function(data) {
    $scope.features = data;
    $scope.sensors = $filter('sensor')($scope.features.data);
  });

  $scope.$watch('features', function(newVal, oldVal, scope) {
    $scope.sensors = $filter('sensor')($scope.features.data);
  }, true);


  function machineReadableString(string) {
    return string.replace(/([^a-z0-9]+)/gi, '-').toLowerCase();
  }

  $scope.labels = [];

  $scope.loadLabels = function($query) {
    return ModelService.getLabels().then(function(response) {
      var labels = response.data;
      return labels.filter(function(label) {
        return label.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    });
  };


  $scope.next = function() {
    var labels = [];
    $scope.labels.forEach(function(label, index) {
      if (typeof label.label === 'undefined') {
        $scope.labels[index].label = machineReadableString(label.name);
        var data = {
          label: label.label,
          name: label.name
        };
        var json = JSON.stringify(data);
        if (json !== '{}') {
          var req = new XMLHttpRequest();
          req.open('POST', "http://docker.teco.edu:3000/api/labels");
          req.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
          req.send(json);
        }
      }
      labels.push(label.label);
    });

    var features = $filter('filter')($scope.features.data, {
      value: true
    });

    sharedConfig.setConfig(features, labels);
    $location.path("/sensor");
  };

}

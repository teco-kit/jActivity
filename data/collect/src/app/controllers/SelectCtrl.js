/*
	Copyright 2016 KIT Institute for Telematics TecO - David Greiner
	This file is subject to the terms and conditions defined in
	file 'LICENSE', which is part of this source code package.
*/

export default function($scope, $filter, $location, ModelService, host, sharedConfig) {
  'ngInject';
  /* Parse UserAgent using darcyclarke/Detect.js */
  $scope.ua = detect.parse(navigator.userAgent);

  /* Get Features using AJAX and generate sensor dependency list */
  $scope.features = [];
  $scope.sensors = [];

  ModelService.getFeatures().then(function(data) {
    $scope.features = data;
    $scope.sensors = $filter('feature')($scope.features.data);
  });

  /* Watch for newly selected features and change sensor depency list accordingly */
  $scope.$watch('features', function(newVal, oldVal, scope) {
    $scope.sensors = $filter('feature')($scope.features.data);
  }, true);


  /* Get Labels and prepare them using mbenford/ngTagsInput */
  $scope.labels = [];

  $scope.loadLabels = function($query) {
    return ModelService.getLabels().then(function(response) {
	  const series = response.data.results[0].series;
      //var labels = response.data;
      const labels = [].concat.apply([], series.map(e=>e.values.filter(x=>x[0]==='label').map(x=>x[1]))).filter((e,i,s)=>s.indexOf(e)===i);
      //const labels = [];
	  //response.data.results[0].series.forEach(e => e.values.forEach(v => { if (v[0] === 'label' && labels.indexOf(v[1]) === -1) labels.push(v[1]);}));
      return labels.filter(function(label) {
        return label.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    });
  };

  /* Advance to collect page */
  $scope.next = function() {
    /* Add new labels to database */
    var labels = [];
    $scope.labels.forEach(function(label, index) {
      /* Label variable is undefined for new labels */
      if (typeof label.label === 'undefined') {
        /* Generate machine-readable string as identifier (only alphanumeric with dash) */
        $scope.labels[index].label = label.name.replace(/([^a-z0-9]+)/gi, '-').toLowerCase();
        var data = {
          label: label.label,
          name: label.name
        };
      }
      /* Push each defined label on array */
      labels.push(label.label);
    });

    /* Only pass on selected features */
    var features = $filter('filter')($scope.features.data, {
      value: true
    });

    sharedConfig.setConfig(features, labels);
    $location.path("/collect");
  };

}

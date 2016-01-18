export default function($scope, $filter, $location, ModelService, sharedConfig) {
	'ngInject';

	$scope.ua = detect.parse(navigator.userAgent);

	console.log(detect.parse(navigator.userAgent));

	var features = ModelService.getFeatures();
	features.then(function (data)
	{
		$scope.features = data;
		$scope.sensors = $filter('sensor')($scope.features.data);
		console.log($scope.sensors);
	});

	var labels = ModelService.getLabels();
	labels.then(function (data)
	{
		$scope.labels = data;
		$scope.mylabel = $scope.labels.data[0].name;
	});

	$scope.changeLabel = function(newLabel) {
        $scope.mylabel= newLabel;
    };

    $scope.next = function (){
		var config = $filter('filter')($scope.features.data, {value: true});
		config.label = $scope.mylabel;
		sharedConfig.setConfig(config);
    	$location.path("/sensor");
	};


	$scope.$watch('features', function (newVal, oldVal, scope) {
		$scope.sensors = $filter('sensor')($scope.features.data);
		console.log($scope.sensors);
	}, true);

}

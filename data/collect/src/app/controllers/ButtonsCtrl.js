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
		$scope.myName = $scope.labels.data[0].name;
		$scope.myLabel = $scope.labels.data[0].label;
	});

	$scope.changeLabel = function(newName, newLabel) {
        $scope.myName= newName;
        $scope.myLabel= newLabel;
    };

    $scope.next = function (){
		var features = $filter('filter')($scope.features.data, {value: true});
		sharedConfig.setConfig(features, $scope.myLabel);
    	$location.path("/sensor");
	};


	$scope.$watch('features', function (newVal, oldVal, scope) {
		$scope.sensors = $filter('sensor')($scope.features.data);
		console.log($scope.sensors);
	}, true);

}

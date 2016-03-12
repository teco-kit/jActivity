/*
  Import all Angular components via ES6 imports and register them
  at your module via their corresponding functions (controller, service, etc.).
  Copyright 2016 KIT Institute for Telematics TecO - David Greiner
*/

import ButtonsCtrl from './controllers/ButtonsCtrl';
import SensorCtrl from './controllers/SensorCtrl';
import ModelService from './services/ModelService';
import sensorFilter from './filters/sensorFilter';
import labelFilter from './filters/labelFilter';

angular.module('myApp', ['ui.bootstrap', 'ui.router', 'ngTagsInput', 'timer'])
	.service('ModelService', ModelService)
	.controller('ButtonsCtrl', ButtonsCtrl)
	.controller('SensorCtrl', SensorCtrl)
	.filter('sensor', sensorFilter)
	.filter('label', labelFilter)
	.service('sharedConfig', function () {
        var features = {};
        var labels = {};

        return {
            getFeatures: function () {
                return features;
            },
            getLabels: function () {
                return labels;
            },
            setConfig: function(_features, _labels) {
                features = _features;
                labels = _labels;
            }
        };
	 })
	.config(['$httpProvider', '$stateProvider', '$urlRouterProvider',
  function($httpProvider, $stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('collect', {
        url: '/collect',
        templateUrl: 'collect.html',
        controller: 'ButtonsCtrl'
      })
      .state('sensor', {
        url: '/sensor',
        templateUrl: 'sensor.html',
        controller: 'SensorCtrl',
      });

    $urlRouterProvider.otherwise('/collect');
  }
]);

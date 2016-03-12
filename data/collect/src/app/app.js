/*
	Copyright 2016 KIT Institute for Telematics TecO - David Greiner
	This file is subject to the terms and conditions defined in
	file 'LICENSE', which is part of this source code package.
*/

import SelectCtrl from './controllers/SelectCtrl';
import CollectCtrl from './controllers/CollectCtrl';
import ModelService from './services/ModelService';
import featureFilter from './filters/featureFilter';
import labelFilter from './filters/labelFilter';

angular.module('myApp', ['ui.bootstrap', 'ui.router', 'ngTagsInput', 'timer'])
	.service('ModelService', ModelService)
	.controller('SelectCtrl', SelectCtrl)
	.controller('CollectCtrl', CollectCtrl)
	.filter('feature', featureFilter)
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
      .state('select', {
        url: '/select',
        templateUrl: 'select.html',
        controller: 'SelectCtrl'
      })
      .state('collect', {
        url: '/collect',
        templateUrl: 'collect.html',
        controller: 'CollectCtrl',
      });

    $urlRouterProvider.otherwise('/select');
  }
]);

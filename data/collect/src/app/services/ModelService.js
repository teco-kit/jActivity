/*
	Copyright 2016 KIT Institute for Telematics TecO - David Greiner
	This file is subject to the terms and conditions defined in
	file 'LICENSE', which is part of this source code package.
*/

export default class ModelService {

  /*@ngInject*/
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;
  }

  getFeatures() {
    var deferred = this.$q.defer();
    this.$http.get('http://jactivity.teco.edu:3000/api/features').then(function(data) {
      deferred.resolve(data);
    });

    return deferred.promise;
  }
  getLabels() {
    var deferred = this.$q.defer();
    this.$http.get('http://jactivity.teco.edu:3000/api/labels').then(function(data) {
      deferred.resolve(data);
    });

    return deferred.promise;
  }
}

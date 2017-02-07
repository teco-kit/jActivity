/*
	Copyright 2016 KIT Institute for Telematics TecO - David Greiner
	This file is subject to the terms and conditions defined in
	file 'LICENSE', which is part of this source code package.
*/

export default class ModelService {

  /*@ngInject*/
  constructor($http, $q, host) {
    this.$http = $http;
    this.$q = $q;
    this.$host = host;
  }

  getFeatures() {
    var deferred = this.$q.defer();
    this.$http.get('http://' + this.$host + '/sensors/sensors.json').then(function(data) {
      deferred.resolve(data);
    });

    return deferred.promise;
  }
  getLabels() {
    var deferred = this.$q.defer();
    var req = {
	  method: 'GET',
	  url: 'http://' + this.$host + '/influxdb/query',
	  params: { db: 'jactivity',
		  		q: 'SHOW TAG VALUES WITH KEY IN (label)' }
	};
    this.$http(req).then(function(data) {
      deferred.resolve(data);
    });

    return deferred.promise;
  }
}

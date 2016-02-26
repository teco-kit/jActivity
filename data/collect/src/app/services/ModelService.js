export default class ModelService {

	/*@ngInject*/
    constructor($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
        
    getFeatures() {
    	var deferred = this.$q.defer();
	    this.$http.get('http://docker.teco.edu:3000/api/features').then(function(data)
	    {
		    deferred.resolve(data);
		});

        return deferred.promise;
    }
    getLabels() {
	    var deferred = this.$q.defer();
	    this.$http.get('http://docker.teco.edu:3000/api/labels').then(function(data)
	    {
		    deferred.resolve(data);
		});

        return deferred.promise;
    }
}
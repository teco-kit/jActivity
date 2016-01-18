export default class ModelService {

	/*@ngInject*/
    constructor($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
        
    getFeatures() {
    	var deferred = this.$q.defer();
	    this.$http.get('json/features.json').then(function(data)
	    {
		    deferred.resolve(data);
		});

        return deferred.promise;
    }
    getLabels() {
	    var deferred = this.$q.defer();
	    this.$http.get('json/labels.json').then(function(data)
	    {
		    deferred.resolve(data);
		});

        return deferred.promise;
    }
}
function evaluateRandomForest(randomforest, dataset) {
	
var resultdict = {};

for (var tree in randomforest) {
	var score = randomforest[tree].evaluate(dataset).result;
	
	if(score in resultdict){
		resultdict[score]++;
	}
	else{
		resultdict[score] = 1;
	}
}

/*
var majorityVote = Array.max(resultdict);
var result (_.invert(resultdict))[majorityVote] 

or
*/
var result = ( _(resultdict).invert()[_(resultdict).max()] )
// requries inclusion underscore.js (https://github.com/jashkenas/underscore/blob/master/underscore.js)
// taken from http://codereview.stackexchange.com/questions/51053/get-the-key-of-the-highest-value-in-javascript-object
// see also: http://underscorejs.org/docs/underscore.html

return result;


}

# PMML to Javascript (pmml2js)

This projects aims on allowing PMML to JavaScript Code transformation so that you can run it in your browser.

Currently supported are:

* Decision Trees
* Random Forests (comming soon)
* Baysian Classifiers (comming soon)

## Decision Trees

The decision tree engine was created by artistoex.

Code Attribution

* Author: artistoex
* Source: http://stackoverflow.com/questions/8368698/how-to-implement-a-decision-tree-in-javascript-looking-for-a-better-solution-th/8369235#8369235
* Date:  Dec 3 '11 at 16:50
* SO License: CC-Wiki
* No other License Mentioned (Checked on Dec. 11 2015)

Notes (Andrei Miclaus):

* Depth First Search through the tree.
* Supports non-binary decision trees.

### Decision Tree Usage Examples

All examples are available as QUnit tests.

#### Example 1: Creating a decision tree for binary sorting

```
/**
Tree (Sort):
              5
     3                 8
<3       >3       <8       >8

**/
QUnit.test("binary search tree as decision tree test", function(assert){
    var decisionTree = 
        new Case( true, Array(
                      new Case ( function(n){ return n < 5; },  Array(
                                                              new Case ( function(n){ return n < 3; }, "<3"),
                                                              new Case ( function(n){ return n > 3; }, ">3" )
                                                              )),
                      new Case ( function(n){ return n > 5; }, Array(
                                                              new Case ( function(n){ return n < 8; }, "<8"),
                                                              new Case ( function(n){ return n > 8; }, ">8" )
                                                              ))
                      ));

    assert.ok(decisionTree.evaluate(1).result == "<3", "Passed <3!");
    assert.ok(decisionTree.evaluate(10).result == ">8", "Passed >8!");
})
```

#### Example 2: Creating a decision tree for the Iris Dataset
```
/**
Tree (Sort):
           Petal.Length < 2.45
		  /                  \ 
     "setosa"		Petal.Width >= 2.45         
					/				  \
              "versicolor"        "virginica"

**/
QUnit.test("binary search tree as decision tree test", function(assert){
    var decisionTree = 
        new Case( true, Array(
                      new Case ( function(observation){ return observation.Petal_Length < 2.45; },  "setosa" ),
                      new Case ( function(observation){ return observation.Petal_Length >= 2.45; }, Array(
                                                              new Case ( function(observation){ return observation.Petal_Width < 1.75 }, "versicolor"),
                                                              new Case ( function(observation){ return observation.Petal_Width >= 1.75 }, "virginica" )
                                                              ))
                      ));

	dataset = new Array()
	// setosa test object
	dataset[0] = {
        Petal_Length : "2",
        Petal_Width : "3",
        Sepal_Length : "5",
		Sepal_Width : "13"
	}
	
	// versicolor test object
	dataset[1] = {
        Petal_Length : "3",
        Petal_Width : "1.5",
        Sepal_Length : "5",
		Sepal_Width : "13"
	}

	// virginica test object
	dataset[2] = {
        Petal_Length : "2.45",
        Petal_Width : "1.75",
        Sepal_Length : "5",
		Sepal_Width : "13"
	}

	
    assert.ok(decisionTree.evaluate(dataset[0]).result == "setosa", "Correctly classified as setosa!");
	assert.ok(decisionTree.evaluate(dataset[1]).result == "versicolor", "Correctly classified as versicolor!");
	assert.ok(decisionTree.evaluate(dataset[2]).result == "virginica", "Correctly classified as virginica!");
})
```

### Using the API for Generating Executable Models

To use the examples, you need resolvable URLs to xml and xsl files. You can get and run the server used in the example below (including xml and xsl example files) from here [Analytics Host](https://github.com/frostyandy2k/analytics_host).

##### Example 1: Requesting a decision tree for the Iris Dataset

```
var decisionTree;
//define the callback function used to evaluate the model
function evaluate(generatedDecisionTree){
  //initialise your variable with the value of the generated model
  decisionTree = generatedDecisionTree;

  //test methods
  assert.ok(decisionTree.evaluate(dataset[0]).result == "setosa", "Correctly classified as setosa!");
  assert.ok(decisionTree.evaluate(dataset[1]).result == "versicolor", "Correctly classified as versicolor!");
  assert.ok(decisionTree.evaluate(dataset[2]).result == "virginica", "Correctly classified as virginica!");

  //qunit helper for asynchronous tasks
  done();
}

initiateExecutableModel("http://localhost:3000/models/test_rpart.xml", "http://localhost:3000/pmml2js_decision_tree.xsl", evaluate);
```

### Running the Tests 

To run the tests open ./pmml2js/tests/*.html in the browser of your choice.


QUnit.test("Generated Decision Tree Iris Set Test", function(assert){
/**PMML**/ /**Header**/ /* Decision Tree RPart_Model*/ var decisionTree = new Case /*1*/( true , Array( new Case /*2*/( function(observation) {return observation.Petal_Length<2.45 } , "setosa" ) , new Case /*3*/( function(observation) {return observation.Petal_Length>=2.45 } , Array( new Case /*6*/( function(observation) {return observation.Petal_Width<1.75 } , "versicolor" ) , new Case /*7*/( function(observation) {return observation.Petal_Width>=1.75 } , "virginica" ) ) ) ) )


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

QUnit.test("Generated Decision Tree Iris Set EVAL Test", function(assert){
  "use strict";
//need to wrap as string and remove the "var decisiontree declaration"
var decisionTree = eval('/**PMML**/ /**Header**/ /* Decision Tree RPart_Model*/ new Case /*1*/( true , Array( new Case /*2*/( function(observation) {return observation.Petal_Length<2.45 } , "setosa" ) , new Case /*3*/( function(observation) {return observation.Petal_Length>=2.45 } , Array( new Case /*6*/( function(observation) {return observation.Petal_Width<1.75 } , "versicolor" ) , new Case /*7*/( function(observation) {return observation.Petal_Width>=1.75 } , "virginica" ) ) ) ) )'); 

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


var decisionTreeObj;
QUnit.test("Decision Tree With Live Generation Test RPart", function(assert){

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

    var done = assert.async();

    var decisionTree;
    function evaluate(generatedDecisionTree){
      //initialise your variable with the value of the generated model
      decisionTree = generatedDecisionTree;

      assert.ok(decisionTree.evaluate(dataset[0]).result == "setosa", "Correctly classified as setosa!");
      assert.ok(decisionTree.evaluate(dataset[1]).result == "versicolor", "Correctly classified as versicolor!");
      assert.ok(decisionTree.evaluate(dataset[2]).result == "virginica", "Correctly classified as virginica!");

      //qunit helper for asynchronous tasks
      done();
    }

    initiateExecutableModel("http://localhost:3000/models/test_rpart.xml", "http://localhost:3000/pmml2js_decision_tree.xsl", evaluate);
    
})
QUnit.test("decision tree test 1", function(assert){
    var decisionTree = 
        new Case( true, Array(
                      new Case ( function(n){ return n < 0; }, Math.sin ),
                      new Case ( function(n){ return n < 2; }, "0<= n < 2" ),
                      new Case ( true, "Greater than two " )));

    decisionTree.evaluate(1); // evaluates to string "0<= n < 2"
    decisionTree.evaluate(-Math.PI/2); // evaluates to -1
    decisionTree.evaluate(5); // evaluates to string "Greater than two"

    console.log( decisionTree.evaluate(-Math.PI/2));
    assert.ok(decisionTree.evaluate(-Math.PI/2).result == -1, "Passed -pi/2!")
})

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

/**
Tree (Sort):
           Petal.Length < 2.45
      /                  \ 
     "setosa"   Petal.Width >= 2.45         
          /         \
              "versicolor"        "virginica"

**/
QUnit.test("Decision Tree Iris Set Test", function(assert){
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

/**
Tree (Sort):
           Petal.Length < 2.45
      /                  \ 
     "setosa"   Petal.Width >= 2.45         
          /         \
              "versicolor"        "virginica"

**/
QUnit.test("Decision Tree Forest Test", function(assert){
  

  var decisionTree1 = 
        new Case( true, Array(
                      new Case ( function(observation){ return observation.Petal_Length < 2.45; },  "setosa" ),
                      new Case ( function(observation){ return observation.Petal_Length >= 2.45; }, Array(
                                                              new Case ( function(observation){ return observation.Petal_Width < 1.75 }, "versicolor"),
                                                              new Case ( function(observation){ return observation.Petal_Width >= 1.75 }, "virginica" )
                                                              ))
                      ));
            
  var decisionTree2 = 
        new Case( true, Array(
                      new Case ( function(observation){ return observation.Petal_Length < 2.45; },  "setosa" ),
                      new Case ( function(observation){ return observation.Petal_Length >= 2.45; }, Array(
                                                              new Case ( function(observation){ return observation.Petal_Width < 1.75 }, "versicolor"),
                                                              new Case ( function(observation){ return observation.Petal_Width >= 1.75 }, "virginica" )
                                                              ))
                      ));
            
            
    var decisionTreeBad = 
        new Case( true, Array(
                      new Case ( function(observation){ return observation.Petal_Length < 1.45; },  "setosa" ),
                      new Case ( function(observation){ return observation.Petal_Length >= 1.45; }, Array(
                                                              new Case ( function(observation){ return observation.Petal_Width < 1.75 }, "versicolor"),
                                                              new Case ( function(observation){ return observation.Petal_Width >= 1.75 }, "virginica" )
                                                              ))
                      ));

            
  var myRandomForest = {
    dt1 : decisionTree1,
    dt2 : decisionTree2,
    dt3 : decisionTreeBad 
  }

  
  // TESTDATA 
            
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
  
    assert.ok(evaluateRandomForest(myRandomForest, dataset[0]) == "setosa", "Correctly classified as setosa!");
  assert.ok(evaluateRandomForest(myRandomForest, dataset[1]) == "versicolor", "Correctly classified as versicolor!");
  assert.ok(evaluateRandomForest(myRandomForest, dataset[2]) == "virginica", "Correctly classified as virginica!");
})
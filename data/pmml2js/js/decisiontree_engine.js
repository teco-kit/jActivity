// Sample Usage
// var decisionTree = 
//     new Case( true, Array(
//                   new Case ( function(n){ return n < 0; }, Math.sin ),
//                   new Case ( function(n){ return n < 2; }, "0<= n < 2" ),
//                   new Case ( true, "Greater than two " )));

// decisionTree.evaluate(1); // evaluates to string "0<= n < 2"
// decisionTree.evaluate(-Math.PI/2); // evaluates to -1
// decisionTree.evaluate(5); // evaluates to string "Greater than two"


/**
Code Attribution
Author: artistoex
Source: http://stackoverflow.com/questions/8368698/how-to-implement-a-decision-tree-in-javascript-looking-for-a-better-solution-th/8369235#8369235
Date:  Dec 3 '11 at 16:50
SO License: CC-Wiki
No other License Mentioned (Checked on Dec. 11 2015)

Notes (Andrei Miclaus):
Depth First Search through the tree.
Supports non-binary decision trees.

**/

// Represents a predicate and corresponding action to take if predicate is a
// match.
//
// predicate : true or Function( object ) returning a boolean.
//
// action : One of Function, Case, Array of Cases or other value (see
//          Case.evaluate as to how each is applied)
//
//
Case = function (predicate, action) {  
    this.predicate = predicate;
    this.action = action;
};


Case.prototype = {
    nomatch : { match : false },
    match : function (v) { return { match : true, result :v }; },


    // Recursively test Cases and applies corresponding action on
    // `object`.
    //
    // The action applied depends on the datatype of `action`:
    //
    // - Function : evaluates to `action( object )`
    // 
    // - Case : A subsequent test is performed.  Evaluates to whatever
    //          the Cases action evaluates to.
    //          
    // - Array of Cases : Subsequent tests are performed.  Evaluates to whatever
    //          the action of the first matching Case evaluates to.
    //
    // - Any other Value : Evaluates to itself
    // 
    // returns object containing fields:
    //
    //     match:  boolean, indicates if Case was a match
    //
    //     result:  result of action applied
    // 
    evaluate : function( object ) {
        var match = this.predicate;

        if ( match instanceof Function )
            match = match( object );

        if ( match ) {

            if (this.action instanceof Function )
                return this.match( this.action(object) );

            if ( this.action instanceof Case )
                return this.action.evaluate( object );

            if ( this.action instanceof Array ) {
                var decision;
                var result;
                for (var c = 0; c < this.action.length; c++ ) {
                    decision = this.action[c];
                    if ( decision instanceof Case )  {
                        result = decision.evaluate( object );
                        if (result.match)
                            return result;
                    } else throw("Array of Case expected");
                }

                return this.nomatch;
            }

            return this.match(this.action);
        } 
        return this.nomatch;
    }
};
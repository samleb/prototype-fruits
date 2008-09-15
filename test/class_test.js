/**
 * Simple test/example to demonstrate Mixin abstraction.
**/

// a Comparable object is an object that implements "compareTo"
var Comparable = new Mixin({
  greaterThan: function(other) {
    return this.compareTo(other) > 0;
  },

  lowerThan: function(other) {
    return this.compareTo(other) < 0;
  },
  
  // Default equalTo implementation
  equalTo: function(other) {
    return this.compareTo(other) == 0;
  }
  // etc....
});

Number.addMethods({
  compareTo: function(number) {
    if (!Object.isNumber(number)) throw { type: "ArgumentError" };
    return this - number;
  },
  
  // specialized/faster equalTo implementation
  equalTo: function(number) {
    return this === number;
  }
});

Number.addMethods(Comparable);

var Set = Class.create(Enumerable, {
  initialize: function(elements) {
    this.elements = [ ];
    $A(elements).each(this.add, this);
  },
  
  _each: function(callback) {
    this.elements.each(callback);
  },
  
  add: function(element) {
    if (this.elements.include(element))
      return false;
    this.elements.push(element);
  }
});

// An Enumerable whose elements are Comparable...
var Sortable = new Mixin(Enumerable, {
  sort: function() {
    return this.sortBy(function(a, b) { return a.compareTo(b) });
  }
});

var NumberSet = Class.create(Set, Sortable, {
  add: function($super, number) {
    if (!Object.isNumber(number)) throw { type: "ArgumentError" };
    return $super(number);
  },
});

new Test.Unit.Runner({
  testMixin: function() {
    this.assertInstanceOf(Mixin, Comparable);
    this.assertRespondsTo('addMethod', Comparable);
    this.assertEnumEqual([Number], Comparable.implementors);
  },
  
  testClassWithMixin: function() {
    this.assert( (3).lowerThan(4) );
    this.assertNothingRaised(function() {
      // remember we just added typecheck on NumberSet#add,
      // just checking Comparable didn't override this method !
      this.assert(!(3).equalTo("3"), "mixin shoudn't override prototype methods");
    }.bind(this));
  },
  
  testNumberSet: function() {
    var sortableSet = new NumberSet([3, 2, 2, 2, 1]);
    this.assertEnumEqual([1, 2, 3], sortableSet.sort());
  }
});
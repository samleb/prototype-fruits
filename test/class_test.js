var Comparable = new Mixin({
  greaterThan: function(other) {
    return this.compareTo(other) > 0;
  },

  lowerThan: function(other) {
    return this.compareTo(other) < 0;
  },
  
  equalTo: function(other) {
    return this.compareTo(other) == 0;
  }
  // etc....
});

Number.addMethods({
  compareTo: function(number) {
    if (!Object.isNumber(number)) throw { type: "ArgumentError" };
    if (this > number) return 1;
    if (this < number) return -1;
    return 0
  },
  
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
  
  add: function(element) {
    if (this.elements.include(element))
      return false;
    this.elements.push(element);
  },
});

// An Enumerable whose elements are Comparable...
var Sortable = new Mixin(Enumerable, {
  sort: function() {
    return this.toArray().sort(function(a, b) { return a.compareTo(b) });
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
    this.assert((3).lowerThan(4));
    this.assertNothingRaised(function() {
      this.assert(!(3).equalTo("3"), "mixin shoudn't override class methods");
    }.bind(this));
  }
});
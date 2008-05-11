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
});

Number.addMethod('compareTo', function(other) {
  if (this > other) return 1;
  if (this < other) return -1;
  else return 0;
});

var Player = Class.create(Comparable, {
  initialize: function(name, skill) {
    this.name = name;
    this.skill = skill;
  },

  compareTo: function(other) {
    return this.skill.compareTo(other.skill);
  }
});

// An Enumerable whose elements are Comparable !
var Sortable = new Mixin(Enumerable, {
  sort: function() {
    return this.toArray().sort(function(a, b) { return a.compareTo(b) });
  }
});

var Set = Class.create(Sortable, {
  initialize: function(enumerable) {
    this.elements = $A(enumerable);
  },

  _each: function(iterator, context) {
    return this.elements._each(iterator, context);
  }
});

new Test.Unit.Runner({
  testMixin: function() {
    this.assertInstanceOf(Mixin, Comparable);
    this.assertRespondsTo('addMethod', Comparable);
    this.assertEnumEqual([Player], Comparable.implementors);

    var bobby = new Player('bobby', 20);
    var billy = new Player('billy', 30);

    this.assert(bobby.lowerThan(billy));

    Comparable.addMethod('lowerThanOrEqualTo', function(other) {
      return this.compareTo(other) <= 0;
    });

    this.assertRespondsTo('lowerThanOrEqualTo', bobby);
    this.assert(bobby.lowerThanOrEqualTo(billy));

    var set = new Set([billy, bobby]);
    this.assertEnumEqual([bobby, billy], set.sort());
  }
});
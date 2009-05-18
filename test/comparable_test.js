var Person = Class.create(Comparable, {
  initialize: function(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  },
  fullName: function() {
    return this.firstName + " " + this.lastName;
  },
  compareTo: function(other) {
    if (other instanceof Person) {
      return this.fullName().compareTo(other.fullName());
    }
  }
});

new Test.Unit.Runner({
  testComparableMethods: function() {
    var foo = new Person("foo", "FOO");
    var bar = new Person("bar", "BAR");
    this.assert(bar.isLowerThan(foo));
    this.assert(bar.isLowerThanOrEqualTo(foo));
    this.assert(foo.equals(foo));
    this.assert(!foo.equals(bar));
    this.assert(foo.isGreaterThanOrEqualTo(bar));
    this.assert(foo.isGreaterThan(bar));
    this.assertEqual(-1, Object.compare(bar, foo));
    this.assertEqual(0, Object.compare(foo, foo))
    this.assertEqual(1, Object.compare(foo, bar));
    this.assert(Object.equal(foo, foo));
    this.assert(!Object.equal(foo, bar));
  },
  testArrayComparison: function() {
    this.assert([1,2,3].equals([1,2,3]));
  }
});

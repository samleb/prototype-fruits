new Test.Unit.Runner({
  testRemoveAt: function(){with(this){
    var array = $R(1, 5).toArray();
    array.removeAt(0);
    assertEnumEqual([ 2, 3, 4, 5 ], array);
    assertEqual(4, array.removeAt(-2));
    assertEnumEqual([ 2, 3, 5 ], array);
    assertEqual(5, array.removeAt(-1));
    assertEnumEqual([ 2, 3 ], array);
    assertUndefined(array.removeAt(6));
    assertUndefined(array.removeAt(-6));
    assertEnumEqual([ 2, 3 ], array);
    assertUndefined(array.removeAt(2));
    assertEqual(3, array.removeAt(1));
    assertEqual(2, array.removeAt(-1));
    assertEqual(0, array.length);
  }},
  
  testRemoveIf: function(){with(this){
    var array = $R(1, 5).toArray();
    assertEnumEqual([ ], array.removeIf(function() { return false }));
    assertEnumEqual([ 1, 2, 3, 4, 5 ], array);
    
    assertEnumEqual([ 1, 2, 3, 4, 5 ], array.removeIf(function(n) { return true }));
    assertEnumEqual([ ], array);
    
    array = $R(1, 5).toArray();
    assertEnumEqual([ 4, 5 ], array.removeIf(function(n) { return n > 3 }));
    assertEnumEqual([ 1, 2, 3 ], array);
  }},
  
  testStaticSlice: function() {
    var array = ["foo", "bar", "baz"];
    var arrayLookalike = { length: 3, 0: "foo", 1: "bar", 2: "baz" };
    var args = (function() { return arguments })("foo", "bar", "baz");
    this.assertEnumEqual(array, Array.slice(array));
    this.assertNotIdentical(array, Array.slice(array));
    this.assertEnumEqual(array, Array.slice(arrayLookalike));
    this.assertEnumEqual(array, args);
    this.assertEnumEqual(["bar", "baz"], Array.slice(array, 1));
    this.assertEnumEqual(["bar", "baz"], Array.slice(arrayLookalike, 1));
    this.assertEnumEqual(["bar", "baz"], Array.slice(args, 1));
    this.assertEnumEqual(["bar"], Array.slice(array, 1, 2));
    this.assertEnumEqual(["bar"], Array.slice(arrayLookalike, 1, 2));
    this.assertEnumEqual(["bar"], Array.slice(args, 1, 2));
  },
  
  testBenchmarkSliceOver$A: function() {
    function bench1() { $A(arguments).slice(1) }
    function bench2() { Array.slice(arguments, 1) }
    var array = $R(1, 500).toArray();
    this.benchmark(function() { bench1.apply(null, array) }, 100);
    this.benchmark(function() { bench2.apply(null, array) }, 100);
  }
});

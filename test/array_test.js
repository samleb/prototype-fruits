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
  }}
});

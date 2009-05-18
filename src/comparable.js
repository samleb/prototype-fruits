Object.extend(Object, (function() {
  function hasMethod(object, property) {
    return object && Object.isFunction(object[property]);
  }
  
  function equal(object, other) {
    if (object === other) return true;
    if (hasMethod(object, "equals")) return object.equals(other);
    if (hasMethod(other, "equals")) return other.equals(object);
    return false;
  }
  
  function compare(object, other) {
    if (object === other) return 0;
    if (hasMethod(object, "compareTo")) return object.compareTo(other);
    if (hasMethod(object, "compareTo")) return other.compareTo(object);
  }
  
  return {
    equal: equal,
    compare: compare
  };
})());

var Comparable = (function() {
  var ComparisonError = Class.create({
    name: "ComparisonError",
    message: "Comparison of #{0} with #{1} failed",
    initialize: function(object, other) {
      this.message = this.message.interpolate(arguments);
    },
    toString: function() {
      return this.name + ": " + this.message;
    }
  });
  
  function compare(object, other) {
    var result = object.compareTo(other);
    if (!Object.isNumber(result)) {
      throw new ComparisonError(object, other);
    }
    return result;
  }
  
  function equals(other) {
    if (this === other) return true;
    var result = this.compareTo(other);
    return Object.isNumber(result) ? result === 0 : null;
  }
  
  function isLowerThan(other) {
    return compare(this, other) < 0;
  }
  
  function isGreaterThan(other) {
    return compare(this, other) > 0;
  }
  
  function isLowerThanOrEqualTo(other) {
    return compare(this, other) <= 0;
  }
  
  function isGreaterThanOrEqualTo(other) {
    return compare(this, other) >= 0;
  }
  
  function isBetween(min, max) {
    return compare(this, min) >= 0 && compare(this, max) <= 0;
  }
  
  return {
    ComparisonError:        ComparisonError,
    equals:                 equals,
    isLowerThan:            isLowerThan,
    isGreaterThan:          isGreaterThan,
    isLowerThanOrEqualTo:   isLowerThanOrEqualTo,
    isGreaterThanOrEqualTo: isGreaterThanOrEqualTo,
    isBetween:              isBetween
  };
})();

(function() {
  function nativelyComparable(constructor) {
    function equals(other) {
      return this === other;
    }
    
    function compareTo(other) {
      if (!other instanceof constructor) {
        throw new ComparisonError(this, other);
      }
      if (this > other) return 1;
      if (this < other) return -1;
      return 0;
    }
    
    Object.extend(Object.extend(constructor.prototype, Comparable), {
      equals:    equals,
      compareTo: compareTo
    });
  }
  
  nativelyComparable(Number);
  nativelyComparable(String);
  nativelyComparable(Date);
})();

Object.extend(Array.prototype, (function() {
  function equals(other) {
    if (this === other) return true;
    if (!Object.isArray(other) || this.length !== other.length) {
      return false;
    }
    return this.all(function(value, index) {
      return Object.equal(value, other[index]);
    });
  }
  
  return {
    equals: equals
  };
})());

Object.extend(Enumerable, function() {
  sort: function() {
    return this.toArray().sort(Object.compare);
  }
});
Object.extend(Object, {
  /**
   * Object.dynamicClone(object) -> Object
   * Fast and dangerous alternative to Object.clone.
   * Returns an object whose properties are dynamically resolved in the 
   * given object (through prototype chain).
   *
   * So: +delete+ may not act as expected.
   * Changes on the original object affect the clone.
   **/
  dynamicClone: function(object) {
    function constructor() { }
    constructor.prototype = object;
    return new constructor;
  },
  
  /**
   * Object.merge(a, b) -> Object
   **/
  merge: function(a, b) {
    return Object.extend(Object.clone(a), b);
  }
});

// Convenient alias for dynamicClone
Object.dclone = Object.dynamicClone;

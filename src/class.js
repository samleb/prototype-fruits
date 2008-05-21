var Class = {
  create: function(superclass) {
    var properties = $A(arguments);
    superclass = Object.isFunction(properties[0]) ? properties.shift() : Object.Base;

    function klass() {
      this.initialize.apply(this, arguments);
    }

    Object.extend(klass, Class.Methods);
    Object.extend(klass, {
      superclass: superclass,
      prototype:  Object.dynamicClone(superclass.prototype),
      subclasses: [ ]
    });
    
    superclass.subclasses.push(klass);

    for (var i = 0; i < properties.length; i++)
      klass.addMethods(properties[i]);

    klass.prototype.constructor = klass;
    // convenient access to ancestor object, holder of $super methods...
    klass.prototype.ancestor = superclass.prototype;

    return klass;
  }
};

Class.Methods = {
  addMethod: function(name, block) {
    if (Object.isFunction(block) && block.argumentNames()[0] == "$super") {
      var method = block, $super = function() {
        // this.ancestor is a shortcut for this.constructor.superclass.prototype
        // see below in Class.create
        return this.ancestor[name].apply(this, arguments);
      };
      block = $super.wrap(method);
      block.toString = function() { return method.toString() };
      block.valueOf  = function() { return method };
    }
    this.prototype[name] = block;
    return this;
  },

  addMethods: function(source) {
    if (!Object.isUndefined(window.Mixin) && source instanceof Mixin) {
      source.mixIn(this);
    } else {
      for (var property in source) {
        this.addMethod(property, source[property]);
      }
    }
    return this;
  }
};

Object.Base = Object.extend(function ObjectBase() { }, Class.Methods).addMethods({
  initialize: Prototype.emptyFunction,
  extend:     Object.extend.methodize()
});

Object.Base.subclasses = [ ];

[ Function, Number, Array, String, Date ].each(function(konstructor) {
  Object.extend(konstructor, Class.Methods);
});

var Mixin = Class.create(Class.Methods, (function() {
  function addMethodResolver(implementor, mixin, name) {
    if (!implementor.prototype[name]) {
      implementor.addMethod(name, function() {
        return mixin.prototype[name].apply(this, arguments);
      });
    }
  }
  
  return {
    initialize: function() {
      this.prototype = { };
      this.implementors = [ ];
      for (var i = 0; i < arguments.length; i++)
        this.addMethods(arguments[i]);
    },

    mixIn: function(implementor) {
      if (this.implementors.indexOf(implementor) > -1) return;
      for (var property in this.prototype)
        addMethodResolver(implementor, this, property);
      this.implementors.push(implementor);
      return this;
    },

    addMethod: function(name, block) {
      Class.Methods.addMethod.call(this, name, block);
      for (var i = 0; i < this.implementors.length; i++)
        addMethodResolver(this.implementors[i], this, name);
      return this;
    }
  };
})());

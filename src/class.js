// Common methods of Mixin and Class...
var Concept = {
  addMethod: function(name, block) {
    if (Object.isFunction(block) && block.argumentNames()[0] == "$super") {
      var method = block, $super = function() {
        return this.constructor.superclass.prototype[name].apply(this, arguments);
      };
      block = $super.wrap(method);
      block.toString = method.toString.bind(method);
      block.valueOf = function() { return method };
    }
    this.prototype[name] = block;
    return this;
  },

  addMethods: function(source) {
    if (source instanceof Mixin)
      return this.mixin(source);
    for (var property in source)
      this.addMethod(property, source[property]);
    return this;
  },

  mixin: function(mixin) {
    mixin.__mixIn__(this);
    return this;
  }
};

Object.Base = Object.extend(function Base() { }, Concept);
Object.Base.subclasses = [ ];
Object.Base.addMethod('initialize', Prototype.emptyFunction);

var Class = {
  create: function(superclass) {
    var properties = $A(arguments);
    superclass = Object.isFunction(properties[0]) ? properties.shift() : Object.Base;
    
    function klass() {
      this.initialize.apply(this, arguments);
    }
    
    Object.extend(klass, superclass);
    Object.extend(klass, {
      superclass: superclass,
      prototype:  Object.dynamicClone(superclass.prototype),
      subclasses: [ ]
    });
    superclass.subclasses.push(klass);
    
    for (var i = 0; i < properties.length; i++)
      klass.addMethods(properties[i]);
    
    klass.prototype.constructor = klass;
    return klass;
  }
};

var Mixin = function(){};
Mixin = Class.create(Concept, (function() {  
  return {
    initialize: function(body) {
      this.prototype = body || { };
      this.implementors = [ ];
    },

    addMethod: Concept.addMethod.wrap(function(addMethod, name, block) {
      addMethod(name, block);
      this.implementors.each(function(implementor) {
        addMethodResolver(this, implementor, name);
      }, this);
    }),

    __mixIn__: function(implementor) {
      if (this.implementors.include(implementor)) return;
      Object.keys(this.prototype).each(addMethodResolver.curry(this, implementor));
      this.implementors.push(implementor);
    } 
  };
  
  function addMethodResolver(mixin, implementor, name) {
    if (!implementor.prototype[name]){
      implementor.addMethod(name, function() {
        return mixin.prototype[name].apply(this, arguments);
      });
    }
  }
})());

[ Function, Number, Array, String, Date ].each(function(konstructor) {
  Object.extend(konstructor, Concept);
});

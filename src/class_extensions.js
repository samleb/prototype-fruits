var ClassExtensions = {
  getMethod: function(name) {
    return this.prototype[name];
  },
  
  wrapMethod: function(name, wrapper) {
    this.addMethod(name, this.getMethod(name).wrap(wrapper));
    return this;
  },
  
  wrapMethods: function(wrappers) {
    Object.keys(wrappers).each(function(property) {
      this.wrapMethod(property, wrappers[property]);
    }, this);
  },
  
  addOwnMethod: function(name, block) {
    this[name] = block;
    return this;
  },
  
  addOwnMethods: function(source) {
    for (var property in source)
      this.addOwnMethod(property, source[property]);
    return this;
  },
  
  aliasMethod: function(newName, oldName) {
    this.addMethod(newName, this.getMethod(oldName));
    return this;
  },
  
  aliasMethodChain: function(name, feature) {
    this.aliasMethod(name + 'Without' + feature.capitalize(), name);
    this.aliasMethod(name, name + 'With' + feature.capitalize());
    return this;
  },
  
  ancestors: function() {
    if (!this.superclass) return [ ];
    return [ this.superclass ].concat(this.superclass.ancestors());
  }
};

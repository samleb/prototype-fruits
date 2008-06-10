if (!Event.delegate) {
  Event.delegate = function(element, selector, eventName, handler, context) {
    element = $(element);
    element.observe(eventName, function(event) {
      var target = event.findElement(selector);
      if (target) handler.call(context || element, event, target);
    });
  };
}

var Routable = {
  initialize: function(element) {
    this.element = $(element);
  },
  
  toElement: function() {
    return this.element;
  },
  
  addBehavior: function(behavior) {
    this.behavior = this.behavior || {};
    for (var route in behavior) {
      route = route.strip();
      (this.behavior[route] = this.behavior[route] || []).push(behavior[route]);
    }
  },

  /**
   * Routable#attachTo(selector[, element=document]);
   **/
  attachTo: function(selector, element) {
    var klass = this.constructor, behavior = this.behavior;
    Object.keys(behavior).each(function(route) {
      var parts = route.split('@'),
          eventName = parts.shift().strip(),
          subselector = (parts.pop() || '').strip();

      Event.delegate(element || document, selector+' '+subselector, eventName, function(event, target) {
        var element = subselector ? target.up(selector) : target;
        behavior[route].invoke('call', new klass(element), event, event.memo);
      });
    });
  }
};
var Picture = Class.create(Routable, {
  // empty body
});

var args, context, calls;

Picture.prototype.addBehavior({
  "test:callHandler": function() {
    calls.push("handler");
  },
  
  "test:argumentsAndContext": function() {
    args = arguments, context = this;
  },

  "test:stopEvent": function(event) {
    event.stop();
  },
  
  "test:subselectors @ .controls a": function() {
    calls.push("subselectors");
  },
  
  "test:multipleHandlersWithSameRoute": function() {
    calls.push("multiple-1");
  }
});

Picture.prototype.addBehavior({
  "test:multipleHandlersWithSameRoute": function(event, data) {
    calls.push("multiple-2");
  }
});

Picture.prototype.attachTo(".picture");

new Test.Unit.Runner({
  setup: function() {
    p1 = $('picture_1');
    p2 = $('picture_2');
    calls = [];
  },
  
  testShouldCallHandler: function() {
    p1.fire('test:callHandler');
    this.assertEnumEqual(["handler"], calls);
  },
  
  testHandlerArgumentsAndContext: function() {
    var event = p1.fire('test:argumentsAndContext');
    this.assertInstanceOf(Picture, context);
    this.assertIdentical(p1, context.element);
    this.assertEnumEqual([event, event.memo], args);
    
    var event = p2.fire('test:argumentsAndContext');
    this.assertIdentical(p2, context.element);
    
  },
  
  testHandlerCanStopEvent: function() {
    this.assert(!p1.fire('test:callHandler').stopped);
    this.assert(p1.fire('test:stopEvent').stopped);
  },
  
  testShouldHandleSubselectors: function() {
    p1.down(".controls a").fire("test:subselectors");
    this.assertEnumEqual(["subselectors"], calls);
  },
  
  testMultipleHandlersWithSameRoute: function() {
    p1.fire("test:multipleHandlersWithSameRoute");
    this.assertEnumEqual(["multiple-1", "multiple-2"], calls);
  },
});
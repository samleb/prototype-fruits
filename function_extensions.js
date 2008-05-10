Object.extend(Function.prototype, {
  /**
   * Function#withOptions([defaultOptions = { }]) -> Function
   *
   * Encapsulates the common pattern where function's last argument 
   * holds unordered optional named arguments with eventual default values.
   * By convention, last argument must be named $options otherwise the
   * original function is returned.
   * 
   * Example:
   *    var hideItem = function(element, $options) {
   *      if (!$option.confirmation || confirm($options.confirmation))
   *        $options.hideMethod(element);
   *    }.withOptions({ confirmation: "sure ?", hideMethod: Element.fade });
   *    
   *    hideItem("item_222", { hideMethod: Element.hide });
   *    // -> Requests confirmation and hides element using Element.hide.
   *    hideItem("item_34", { confirmation: false });
   *    // -> Hides element using Element.fade without any confirmation.
   *    hideItem("item_34");
   *    // -> Hides element using default options.
   *
   * Default options are accessible through defaultOptions property.
   *
   * Example:
   *     hideItem.defaultOptions.confirmation = false;
   *     // -> future calls to hideItem won't request confirmation by default.
   **/
  withOptions: function(defaultOptions) {
    var lambda = this, argumentNames = lambda.argumentNames();
    var optionsIndex = argumentNames.indexOf('$options');

    if (optionsIndex < 0) return lambda;

    return Object.extend(function() {
      var args = $A(arguments), options = args[optionsIndex];

      args[optionsIndex] = Object.clone(arguments.callee.defaultOptions);
      Object.extend(args[optionsIndex], options || { });

      return lambda.apply(this, args);

    }, { defaultOptions: defaultOptions || { } });
  },
  
  /**
   * Function#benchmark([iterations = 1]) -> Number
   *
   * Returns time elapsed in milliseconds to execute the function
   * +iterations+ times.
   **/
  benchmark: function(iterations) {
    iterations = iterations || 1;
    var date = new Date;
    // not doing sweet (iterations || 1).times(this) to ensure
    // we're measuring the right stuff.
    while (iterations--) this();
    return new Date - date;
  }
});
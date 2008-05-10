/**
 * Fires 'focus:in' and 'focus:out' when corresponding browser-specific events occur.
 **/

(function() {
  function onFocus(event) {
    event.element().fire('focus:in');
  }
  
  function onBlur(event) {
    event.element().fire('focus:out');
  }
  
  if (Prototype.Browser.IE) { 
    document.observe('focusin', onFocus);
    document.observe('focusout', onBlur);

  } else {
    document.addEventListener('focus', onFocus, true);
    document.addEventListener('blur', onBlur, true);
  }
})();

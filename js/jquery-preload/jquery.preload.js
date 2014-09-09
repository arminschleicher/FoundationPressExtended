/**
 * jQuery.preload
 *
 * Preload images using the promise pattern.
 *
 * Usage:
 *
 *     $.preload(img_uri, img_uri, ...).done(function(img, img, ...) {
 *       // Do stuff with the arguments
 *     });
 *
 * Since $.preload returns a jQuery.Deferred[1] promise, you can attach
 * callbacks the same way you'll attach them to an AJAX request
 *
 * If you preload multiple images the script will wait until all of them are
 * loaded usign $.when.
 *
 * [1]: http://api.jquery.com/category/deferred-object/
 */
 
;(function($, window, undefined) {
  "use strict";
 
  /**
   * Image preloader
   * @return {jQuery.Deferred.promise}
   */
  $.preload = function() {
    var images = arguments.length > 1 ? arguments : arguments[0];
 
    // Use $.when to recursively preload multiple images
    if ($.isArray(images)) {
      return $.when.apply(window, $.map(images, function(image) { return $.preload(image); }) );
    }
 
    // Single image
    var def = $.Deferred();
    var img = new Image();
 
    img.onload = function() {
      def.resolve(img);
    };
    img.onerror = function() {
      def.reject(img);
    };
 
    img.src = images;
 
    return def.promise();
  };


  $.preloadImgs = function() {
    var elements = arguments.length > 1 ? arguments : arguments[0];

    // Use $.when to recursively warmup elements
    if ($.isArray(elements)) {
      return $.when.apply(window, $.map(elements, function(element) { return $.preloadImgs(element); }) );
    }
    
    elements.each(function(i){
      // Single element
      var element = $(this);
      var def = $.Deferred();
      if(element instanceof jQuery) {
        if(element.attr("data-background-src")!=undefined) {
          $.preload(element.attr("data-background-src")).done(function(img) {
            element.css("background-image","url("+img.src+")");
            def.resolve(element);
          });
        }else if(element.attr("data-img-src")!=undefined) {
          $.preload(element.attr("data-img-src")).done(function(img) {
            element.attr("src",img.src);
            def.resolve(element);
          });
        }else {
          def.reject("element has no source attribute");
        }
      }else{
        def.reject("argument is not a valid jQuery object");
      }
   
      return def.promise();
    });
    
  };
 
})(jQuery, window);
//scripts for sticky-nav
$.fn.scrollStopped = function(callback) {           
    $(this).scroll(function(){
        var self = this, $this = $(self);
        if ($this.data('scrollTimeout')) {
            clearTimeout($this.data('scrollTimeout'));
        }
        $this.data('scrollTimeout', setTimeout(callback,250,self));
    });
 };

$.highlightNav = function(element) {
	var def = $.Deferred();
	$(".sticky-nav-content h5").removeClass("highlight");
	element.addClass("highlight");
    def.resolve(element);
    return def.promise();
}

$.moveNav = function(element) {
	
	var offset = $(".sticky-mate").offset().top - 60;
	
	var element_offset = $("#"+element.attr("data-scroll")).offset().top -60;
	var def = $.Deferred();
	
	$("#sticky-nav").animate({
    	top: $("#"+element.attr("data-scroll")).offset().top - offset
    },1000,function(){
    	def.resolve(element);
    });	
	
    return def.promise();
}

$.scrollNav = function(element) {
	$.highlightNav(element);
	var def = $.Deferred();
    if(element instanceof jQuery) {
        if(element.attr("data-scroll")!=undefined) {
        	$('html, body').animate({
           		scrollTop: $("#"+element.attr("data-scroll")).offset().top
        	}, 1000,function() {
        		$.moveNav(element);
  			});
            def.resolve(element);
        }else {
          def.reject("element has no scroll attribute");
        }
    }else{
        def.reject("argument is not a valid jQuery object");
    }
   
    return def.promise();
    
};

jQuery(document).ready(function ($) {
	$("#sticky-nav").css("top",60);

	$('.scroll').click(function() {
   		$.scrollNav($(this));	
    });
   	

    $(window).scrollStopped(function() {
    	var window_top = $(window).scrollTop();
    	var element;
		var min_dist = 100000;
   		$.each($('.scroll'),function(){
    		var ref_top = $("#"+$(this).attr("data-scroll")).offset().top;
    		var min_dist_ref = Math.abs(window_top - ref_top);
    		if(min_dist_ref < min_dist) {
    			element = $(this);
    			min_dist = min_dist_ref;
    			var offset = $(".sticky-mate").offset().top;
    			
    			
    		}
	    });

   		$('.scroll').promise().done(function() {
   			
   			if(element != undefined) {
   				$.moveNav(element);
   				$.highlightNav(element);
   			}
   			
   		});		
    });

    //$(window).scroll(sticky_relocate);
	$("#sticky-nav").fadeIn(1000);
});
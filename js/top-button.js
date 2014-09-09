jQuery(document).ready(function ($) {
	$('.top-button').click(function() {
      $('html, body').animate({
         scrollTop: 0
      }, 1000);
    });

   

    $(window).scroll(function() {
    	
    	var window_top_pos = $(window).scrollTop();
    	
    	if(window_top_pos >= 400) {
    		$(".top-button").fadeIn();

    	}else{
    		$(".top-button").fadeOut();
    	}
    });
});
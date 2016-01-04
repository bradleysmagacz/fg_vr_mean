$(document).ready(function(){ 
	
	var width = $(window).width();

	$(window).on('resize orientationchange load', function() { 
		if (width>767) {
			$('.form-group').addClass('form-group-lg');
		}
	}); 
});
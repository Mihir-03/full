 // toggle menus
 $(document).ready(function() {
	$('.like').click(function() {
		if ($('#add').is(':visible')) {
			$('#add').slideUp();
		}
		if ($('#share').is(':visible')) {
			$('#share').slideUp();
		}
		if ($('#report').is(':visible')) {
			$('#report').slideUp();
		}
		$('#like').slideToggle();
	});

	$('.add').click(function() {
		if ($('#like').is(':visible')) {
			$('#like').slideUp();
		}
		if ($('#share').is(':visible')) {
			$('#share').slideUp();
		}
		if ($('#report').is(':visible')) {
			$('#report').slideUp();
		}
		$('#add').slideToggle();
	});

	$('.share').click(function() {
		if ($('#like').is(':visible')) {
			$('#like').slideUp();
		}
		if ($('#add').is(':visible')) {
			$('#add').slideUp();
		}
		$('#share').slideToggle();
	});
	
	$('.report').click(function() {
		if ($('#like').is(':visible')) {
			$('#like').slideUp();
		}
		if ($('#add').is(':visible')) {
			$('#add').slideUp();
		}
		$('#report').slideToggle();
	});
});




 // Toggle the liking state
	$(document).ready(function() {
		var likingState = false; // Initial state of liking

		$('.liking').click(function() {
			likingState = !likingState; 

			if (likingState) {
				$(this).css('background-image', 'url(img/icon-heart-set.png)');
				$('.like').css('background-image', 'url(img/icon-heart-set.png)');
				$(this).text('liked');
			} else {
				$(this).css('background-image', 'url(img/icon-heart.png)');
				$('.like').css('background-image', 'url(img/icon-heart.png)');
				$(this).text('like');
			}
		});
	});
 // Toggle search
	$(document).ready(function() {
		var searchstate = false; // Initial state of liking

		$('.search').click(function() {
			searchstate = !searchstate; 

			if (searchstate) {
				$(this).css('width', '190px');
				$('.search').css('width', '190px');
				$(this).css('height', '20px');
				$(this).css('bottom', '-45px');
				$(this).css('border-radius', '27px');
				$(this).css('font-size', '18px');
				$(this).css('padding', '6px 4px 6px 12px');

			} else {
				$(this).css('width', '15px');
				$('.search').css('width', '15px');
				$(this).css('height', '15px');
				$(this).css('bottom', '-30px');
				$(this).css('border-radius', '10px');
				$(this).css('font-size', '0');
				$(this).css('padding', '0');
			
			}
		});
	});




   // fake search result page
$(document).ready(function(){
	$('.search').keydown(function(event){
		if(event.keyCode == 13) {
			// Redirect to searchresult.php
			window.location.href = 'searchresults.php';
		}
	});
});


    var element = document.documentElement; // Fullscreen the entire document

    // Toggle fullscreen mode when the user taps the document
    document.addEventListener("click", function() {
      toggleFullscreen();
    });

    // Request fullscreen
    function requestFullscreen(element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { /* IE/Edge */
        element.msRequestFullscreen();
      } else if (element.webkitEnterFullscreen) { /* iOS Safari */
        element.addEventListener("touchstart", function() {
          element.webkitEnterFullscreen(); // This is specific to iOS Safari
          document.getElementById("fullscreenButton").style.display = "block"; // Show exit fullscreen button
        });
      }
    }

    // Exit fullscreen
    function exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
      } else if (document.webkitExitFullscreen) { /* iOS Safari */
        document.webkitExitFullscreen();
      }
      document.getElementById("fullscreenButton").style.display = "none"; // Hide exit fullscreen button
    }

    // Toggle fullscreen mode
    function toggleFullscreen() {
      if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        requestFullscreen(element); // Enter fullscreen mode
      }
    }
	 // Add event listener to fullscreen button (if exists)
	 window.onload = function() {
        var fullscreenButton = document.getElementById("fullscreenButton");
        if (fullscreenButton) {
            fullscreenButton.addEventListener("click", function() {
                toggleFullscreen();
            });
        }
    };

    // Check if fullscreen mode is active on page load
    document.addEventListener("DOMContentLoaded", function() {
        if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
            document.getElementById("fullscreenButton").style.display = "block"; // Show exit fullscreen button
        } else {
            document.getElementById("fullscreenButton").style.display = "none"; // Hide exit fullscreen button
        }
    });

var touchevents = function(sandbox) {
  var firstTouchX = 0;
  var firstTouchY = 0;
  var threshold = 0.01;

  function touchstart(event) {
    if(event.changedTouches.length == 1) {
      if (typeof window.innerWidth != 'undefined') {
        xRatio = event.changedTouches[i].clientX / window.innerWidth;
        yRatio = event.changedTouches[i].clientY / window.innerHeight;
        firstTouchX = xRatio;
        firstTouchY = yRatio;
      }
    }
  }

  function touchend(event) {
    if(event.changedTouches.length == 1) {
      if (typeof window.innerWidth != 'undefined') {
        xRatio = event.changedTouches[i].clientX / window.innerWidth;
        yRatio = event.changedTouches[i].clientY / window.innerHeight;
        var json = {
          sensor: 'touchevents',
          firstTouchX:firstTouchX,
          firstTouchY:firstTouchY,
          lastTouchX:xRatio,
          lastTouchY:yRatio,
          vector: Math.sqrt(Math.pow(firstTouchX - xRatio) + Math.pow(firstTouchY - yRatio))
        }
        firstTouchX, firstTouchY = "";
        if(vector > threshold) {
        	sandbox.send(json);
        }
      }
    }
  }

  return {
    start: function() {
      document.addEventListener('touchstart', touchstart); // when the user places a touch point on the touch surface
      document.addEventListener('touchend', touchend); // when the user removes a touch point from the touch surface, also including cases where the touch point physically leaves the touch surface, such as being dragged off of the screen.
      document.addEventListener('touchcancel', touchend); // when a touch point has been disrupted in an implementation-specific manner

    },
    stop: function() {
		document.removeEventListener('touchstart', touchstart);
		document.removeEventListener('touchend', touchend);
		document.removeEventListener('touchcancel', touchend);
    }
  }
};

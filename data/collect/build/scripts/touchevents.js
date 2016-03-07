var touchevents = function(sandbox) {
  function touchstart(event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
      if (typeof window.innerWidth != 'undefined') {
        xRatio = event.changedTouches[i].clientX / window.innerWidth;
        yRatio = event.changedTouches[i].clientY / window.innerHeight;
        var json = {
          sensor: 'touchevents',
          ratioX: event.changedTouches[i].clientX / window.innerWidth
        }
        firstTouchX[i] = xRatio;
        firstTouchY[i] = yRatio;
        lastTouchX[i] = firstTouchX[i];
        lastTouchY[i] = firstTouchY[i];

        sandbox.send(json);
      }
    }
  }

  function touchend(event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
      if (typeof window.innerWidth != 'undefined') {
        xRatio = event.changedTouches[i].clientX / window.innerWidth;
        yRatio = event.changedTouches[i].clientY / window.innerHeight;
        var json = {
          sensor: 'touchevents',
          ratioX: event.changedTouches[i].clientX / window.innerWidth,
          stepVectorX: xRatio - lastTouchX[i],
          stepVectorY: yRatio - lastTouchY[i],
          totalVectorX: xRatio - firstTouchX[i],
          totalVectorY: yRatio - firstTouchY[i]
        }
        firstTouchX[i], firstTouchY[i] = "";
        lastTouchX[i], lastTouchY[i] = "";
        sandbox.send(json);
      }
    }
  }

  function touchmove(event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
      if (typeof window.innerWidth != 'undefined') {
        xRatio = event.changedTouches[i].clientX / window.innerWidth;
        yRatio = event.changedTouches[i].clientY / window.innerHeight;
        var json = {
          sensor: 'touchevents',
          ratioX: event.changedTouches[i].clientX / window.innerWidth,
          stepVectorX: xRatio - lastTouchX[i],
          stepVectorY: yRatio - lastTouchY[i]
        }
        lastTouchX[i] = xRatio;
        lastTouchY[i] = yRatio;
        sandbox.send(json);
      }
    }
  }

  function touchcancel(event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
      if (typeof window.innerWidth != 'undefined') {
        xRatio = event.changedTouches[i].clientX / window.innerWidth;
        yRatio = event.changedTouches[i].clientY / window.innerHeight;
        var json = {
          sensor: 'touchevents',
          ratioX: event.changedTouches[i].clientX / window.innerWidth,
          stepVectorX: xRatio - lastTouchX[i],
          stepVectorY: yRatio - lastTouchY[i],
          totalVectorX: xRatio - firstTouchX[i],
          totalVectorY: yRatio - firstTouchY[i]
        }
        firstTouchX[i], firstTouchY[i] = "";
        lastTouchX[i], lastTouchY[i] = "";
        sandbox.send(json);
      }
    }
  }

  return {
    start: function() {
      var firstTouchX, firstTouchY = new Array(10);
      var lastTouchX, lastTouchY = new Array(10);
      document.addEventListener('touchstart', touchstart); // when the user places a touch point on the touch surface
      document.addEventListener('touchend', touchend); // when the user removes a touch point from the touch surface, also including cases where the touch point physically leaves the touch surface, such as being dragged off of the screen.
      document.addEventListener('touchmove', touchmove); // when the user moves a touch point along the touch surface
      document.addEventListener('touchcancel', touchcancel); // when a touch point has been disrupted in an implementation-specific manner

    },
    stop: function() {

    }
  }
};

this.firstTouchX = [];
this.firstTouchY = [];
this.lastTouchX = [];
this.lastTouchY = [];
document.addEventListener('touchstart', this.touchstartListener); // when the user places a touch point on the touch surface
document.addEventListener('touchend', this.touchendListener); // when the user removes a touch point from the touch surface, also including cases where the touch point physically leaves the touch surface, such as being dragged off of the screen.
document.addEventListener('touchmove', this.touchmoveListener); // when the user moves a touch point along the touch surface
document.addEventListener('touchcancel', this.touchcancelListener); // when a touch point has been disrupted in an implementation-specific manner

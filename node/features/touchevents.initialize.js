this.firstTouchX = [];
this.firstTouchY = [];
this.lastTouchX = [];
this.lastTouchY = [];
document.addEventListener('touchstart', (...args) => this.touchstartListener(...args)) // when the user places a touch point on the touch surface
document.addEventListener('touchend', (...args) => this.touchendListener(...args)) // when the user removes a touch point from the touch surface, also including cases where the touch point physically leaves the touch surface, such as being dragged off of the screen.
document.addEventListener('touchmove', (...args) => this.touchmoveListener(...args)) // when the user moves a touch point along the touch surface
document.addEventListener('touchcancel', (...args) => this.touchcancelListener(...args)) // when a touch point has been disrupted in an implementation-specific manner

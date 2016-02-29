var touchevents = function (sandbox) {

    function touchstart(event) {
		for(var i = 0; i < event.changedTouches.length; i++) {
			var json = {
				sensor : 'touchevents',
				identifier : event.changedTouches[i].identifier,
				target : event.changedTouches[i].target.id,
				event : "touchstart",
				screenX : event.changedTouches[i].screenX,
				screenY : event.changedTouches[i].screenY,
				clientX : event.changedTouches[i].clientX,
				clientY : event.changedTouches[i].clientY,
				pageX : event.changedTouches[i].pageX,
				pageY : event.changedTouches[i].pageY
			}
			
			sandbox.send(json);
		}
	}
	
	function touchend(event) {
		for(var i = 0; i < event.changedTouches.length; i++) {
			var json = {
				sensor : 'touchevents',
				identifier : event.changedTouches[i].identifier,
				target : event.changedTouches[i].target.id,
				event : "touchend",
				screenX : event.changedTouches[i].screenX,
				screenY : event.changedTouches[i].screenY,
				clientX : event.changedTouches[i].clientX,
				clientY : event.changedTouches[i].clientY,
				pageX : event.changedTouches[i].pageX,
				pageY : event.changedTouches[i].pageY
			}
			
			sandbox.send(json);
		}
	}
	
	function touchmove(event) {
		for(var i = 0; i < event.changedTouches.length; i++) {
			var json = {
				sensor : 'touchevents',
				identifier : event.changedTouches[i].identifier,
				target : event.changedTouches[i].target.id,
				event : "touchmove",
				screenX : event.changedTouches[i].screenX,
				screenY : event.changedTouches[i].screenY,
				clientX : event.changedTouches[i].clientX,
				clientY : event.changedTouches[i].clientY,
				pageX : event.changedTouches[i].pageX,
				pageY : event.changedTouches[i].pageY
			}
			
			sandbox.send(json);
		}
	}
	
	function touchcancel(event) {
		for(var i = 0; i < event.changedTouches.length; i++) {
			var json = {
				sensor : 'touchevents',
				identifier : event.changedTouches[i].identifier,
				target : event.changedTouches[i].target.id,
				event : "touchcancel",
				screenX : event.changedTouches[i].screenX,
				screenY : event.changedTouches[i].screenY,
				clientX : event.changedTouches[i].clientX,
				clientY : event.changedTouches[i].clientY,
				pageX : event.changedTouches[i].pageX,
				pageY : event.changedTouches[i].pageY
			}
			
			sandbox.send(json);
		}
	}

    return {
        start : function () {
			document.addEventListener('touchstart', touchstart); // when the user places a touch point on the touch surface
			document.addEventListener('touchend', touchend); // when the user removes a touch point from the touch surface, also including cases where the touch point physically leaves the touch surface, such as being dragged off of the screen.
			document.addEventListener('touchmove', touchmove); // when the user moves a touch point along the touch surface
			document.addEventListener('touchcancel', touchcancel); // when a touch point has been disrupted in an implementation-specific manner

		},
        stop : function () {

        }
    }
};

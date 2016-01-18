var deviceorientation = function (sandbox) {

    function listener(event) {
		var json = {
            sensor : 'deviceorientation',
			beta : event.beta,
			gamma : event.gamma,
			alpha : event.alpha,
			absolute : event.absolute
		}

		sandbox.send(json);
	}

    return {
        start : function () {
		    window.addEventListener('deviceorientation', listener);
		},
        stop : function () {
           	 window.removeEventListener('deviceorientation', listener);
        }
    }
};

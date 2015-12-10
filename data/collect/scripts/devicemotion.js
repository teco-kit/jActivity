var devicemotion = function (sandbox) {

    function listener(event) {
		var json = {
            sensor : 'devicemotion',
            accelerationX : event.acceleration.x,
			accelerationY : event.acceleration.y,
			accelerationZ : event.acceleration.z,
			accelerationIncludingGravityX : event.accelerationIncludingGravity.x,
			accelerationIncludingGravityY : event.accelerationIncludingGravity.y,
			accelerationIncludingGravityZ : event.accelerationIncludingGravity.z,
			rotationRateBeta : event.rotationRate.beta,
			rotationRateGamma : event.rotationRate.gamma,
			rotationRateAlpha : event.rotationRate.alpha,
			interval : event.interval
		}

		sandbox.send(json);
	}

    return {
        start : function () {
		    window.addEventListener('devicemotion', listener);
		},
        stop : function () {
           	 window.removeEventListener('devicemotion', listener);
        }
    }
};

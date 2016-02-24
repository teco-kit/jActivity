export default function labelFilter() {
	return function(input) {
		if (typeof input !== 'undefined') {
			var result = [];
			input.forEach(function(entry) {
				if(entry.value === true) {
					result.concat(entry.sensors);
				}
			});
			result = [...new Set(result)];
			var sensors = [];
			result.forEach(function(entry) {
				var sensor = {};
				sensor.name = entry;
				sensor.support = Modernizr[entry];
				sensors.push(sensor);
			});
			console.log(sensors);
			return sensors;
		}
	};
}

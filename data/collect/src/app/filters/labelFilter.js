/*
	Copyright 2016 KIT Institute for Telematics TecO - David Greiner
	This file is subject to the terms and conditions defined in
	file 'LICENSE', which is part of this source code package.
*/

export default function labelFilter() {
  return function(input) {
    if (typeof input !== 'undefined') {
      var result = [];
      input.forEach(function(entry) {
        if (entry.value === true) {
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
      return sensors;
    }
  };
}

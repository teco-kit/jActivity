/*
	Copyright 2016 KIT Institute for Telematics TecO - David Greiner
	This file is subject to the terms and conditions defined in
	file 'LICENSE', which is part of this source code package.
*/

export default function featureFilter() {
  return function(input) {
    if (typeof input !== 'undefined') {
      var result = [];
      input.forEach(function(entry) {
        if (entry.value === true) {
          result.push(entry.feature);
        }
      });
      result = [...new Set(result)];
      var features = [];
      result.forEach(function(entry) {
        var feature = {};
        feature.name = entry;
        feature.support = Modernizr[entry];
        features.push(feature);
      });
      return features;
    }
  };
}

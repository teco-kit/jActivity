var meter = DecibelMeter.create('meter-1');

var audioSources;

meter.on('ready', function (meter, sources) {
  audioSources = sources;
});
meter.connect(audioSources[0]); // connect to first source, assumes meter is ready
meter.on('sample', (...args) => this.sampleEvent(...args));
meter.listen();
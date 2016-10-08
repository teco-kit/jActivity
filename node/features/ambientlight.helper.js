ambientlightListener(event) {
	// Read out the lux value
    var lux = event.value;
    (this.dataset.lux = this.dataset.lux || []).push(lux);
    console.log(lux);
}
devicemotionListener(event) {
    (this.dataset.accelerationX = this.dataset.accelerationX || []).push(event.acceleration.x);
    (this.dataset.accelerationY = this.dataset.accelerationY || []).push(event.acceleration.y);
    (this.dataset.accelerationZ = this.dataset.accelerationZ || []).push(event.acceleration.z);

    (this.dataset.accelerationIncludingGravityX = this.dataset.accelerationIncludingGravityX || []).push(event.accelerationIncludingGravity.x);
    (this.dataset.accelerationIncludingGravityY = this.dataset.accelerationIncludingGravityY || []).push(event.accelerationIncludingGravity.y);
    (this.dataset.accelerationIncludingGravityZ = this.dataset.accelerationIncludingGravityZ || []).push(event.accelerationIncludingGravity.z);

    (this.dataset.rotationRateBeta = this.dataset.rotationRateBeta || []).push(event.rotationRate.beta);
    (this.dataset.rotationRateGamma = this.dataset.rotationRateGamma || []).push(event.rotationRate.gamma);
    (this.dataset.rotationRateAlpha = this.dataset.rotationRateAlpha || []).push(event.rotationRate.alpha);
}

touchstartListener(event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
      if (typeof window.innerWidth != 'undefined') {
        let xRatio = event.changedTouches[i].clientX / window.innerWidth;
        let yRatio = event.changedTouches[i].clientY / window.innerHeight;
        (this.dataset.ratioX = this.dataset.ratioX || []).push(xRatio);
        this.firstTouchX[i] = xRatio;
        this.firstTouchY[i] = yRatio;
        this.lastTouchX[i] = this.firstTouchX[i];
        this.lastTouchY[i] = this.firstTouchY[i];
      }
    }
  }

  touchendListener(event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
      if (typeof window.innerWidth != 'undefined') {
        let xRatio = event.changedTouches[i].clientX / window.innerWidth;
        let yRatio = event.changedTouches[i].clientY / window.innerHeight;
        (this.dataset.ratioX = this.dataset.ratioX || []).push(xRatio);
        (this.dataset.totalVectorX = this.dataset.totalVectorX || []).push(xRatio - this.firstTouchX[i]);
        (this.dataset.totalVectorY = this.dataset.totalVectorY || []).push(yRatio - this.firstTouchY[i]);
        (this.dataset.stepVectorX = this.dataset.stepVectorX || []).push(xRatio - this.lastTouchX[i]);
        (this.dataset.stepVectorY = this.dataset.stepVectorY || []).push(yRatio - this.lastTouchY[i]);
        this.firstTouchX[i], this.firstTouchY[i] = "";
        this.lastTouchX[i], this.lastTouchY[i] = "";
      }
    }
  }

  touchmoveListener(event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
      if (typeof window.innerWidth != 'undefined') {
        let xRatio = event.changedTouches[i].clientX / window.innerWidth;
        let yRatio = event.changedTouches[i].clientY / window.innerHeight;
        (this.dataset.ratioX = this.dataset.ratioX || []).push(xRatio);
        (this.dataset.stepVectorX = this.dataset.stepVectorX || []).push(xRatio - this.lastTouchX[i]);
        (this.dataset.stepVectorY = this.dataset.stepVectorY || []).push(yRatio - this.lastTouchY[i]);
        this.lastTouchX[i] = xRatio;
        this.lastTouchY[i] = yRatio;
      }
    }
  }

  touchcancelListener(event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
      if (typeof window.innerWidth != 'undefined') {
        let xRatio = event.changedTouches[i].clientX / window.innerWidth;
        let yRatio = event.changedTouches[i].clientY / window.innerHeight;
        (this.dataset.ratioX = this.dataset.ratioX || []).push(xRatio);
        (this.dataset.totalVectorX = this.dataset.totalVectorX || []).push(xRatio - this.firstTouchX[i]);
        (this.dataset.totalVectorY = this.dataset.totalVectorY || []).push(yRatio - this.firstTouchY[i]);
        (this.dataset.stepVectorX = this.dataset.stepVectorX || []).push(xRatio - this.lastTouchX[i]);
        (this.dataset.stepVectorY = this.dataset.stepVectorY || []).push(yRatio - this.lastTouchY[i]);
        this.firstTouchX[i], this.firstTouchY[i] = "";
        this.lastTouchX[i], this.lastTouchY[i] = "";
      }
    }
  }

import { Vector3 } from 'three';

import app from 'App';

export default (cameraAmpl = { x: 5, y: 5 }, velocity = 0.1, lookAt = new Vector3()) =>
  (Target) => class HandleCameraOrbit extends Target {
    constructor(props) {
      super(props);

      this.cameraAmpl = cameraAmpl;
      this.cameraVelocity = velocity;
      this.lookAt = lookAt;

      this.mousePosition = { x: 0, y: 0 };
      this.normalizedOrientation = new Vector3();

      this.update = this.update.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleOrientationMove = this.handleOrientationMove.bind(this);

      if (app.isMobile) {
        window.addEventListener('deviceorientation', this.handleOrientationMove);
      } else {
        window.addEventListener('mousemove', this.handleMouseMove);
      }
    }

    handleMouseMove(event) {
      this.mousePosition.x = event.clientX || (event.touches && event.touches[0].clientX) || this.mousePosition.x;
      this.mousePosition.y = event.clientY || (event.touches && event.touches[0].clientY) || this.mousePosition.y;

      this.normalizedOrientation.set(
        -((this.mousePosition.x / this.width) - 0.5) * this.cameraAmpl.x,
        ((this.mousePosition.y / this.height) - 0.5) * this.cameraAmpl.y,
        0.5,
      );
    }

    handleOrientationMove(event) {
      // https://stackoverflow.com/questions/40716461/how-to-get-the-angle-between-the-horizon-line-and-the-device-in-javascript
      const rad = Math.atan2(event.gamma, event.beta);
      if (Math.abs(rad) > 1.5) return;
      this.normalizedOrientation.x = -(rad) * this.cameraAmpl.y;
      // TODO handle orientation.y
    }

    update() {
      super.update();

      this.camera.position.x += (this.normalizedOrientation.x - this.camera.position.x) * this.cameraVelocity;
      this.camera.position.y += (this.normalizedOrientation.y - this.camera.position.y) * this.cameraVelocity;
      this.camera.lookAt(this.lookAt);
    }
  }
;
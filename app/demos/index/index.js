
import { Color, Vector3, SphereGeometry, MeshBasicMaterial, Mesh } from 'three';
import { TimelineLite } from 'gsap';

import CameraPositionHandlerWithMouse from 'decorators/CameraPositionHandlerWithMouse';
import FullScreenInBackground from 'decorators/FullScreenInBackground';

import Engine from 'utils/engine';
import AnimatedText3D from 'objects/AnimatedText3D';
import LineGenerator from 'objects/LineGenerator';

import getRandomFloat from 'utils/getRandomFloat';

import app from 'App';
import './style.styl';


/**
 * * *******************
 * * ENGINE
 * * *******************
 */
@FullScreenInBackground
@CameraPositionHandlerWithMouse({ x: 2, y: 3 }, 0.05)
class CustomEngine extends Engine {}

const engine = new CustomEngine();


/**
 * * *******************
 * * TITLE
 * * *******************
 */
const text = new AnimatedText3D('Shooting Stars', { color: '#dc2c5a' });
text.position.x -= text.basePosition * 0.5;
// text.position.y -= 0.5;
engine.add(text);


/**
 * * *******************
 * * LIGNES
 * * *******************
 */
const STATIC_PROPS = {
  width: 0.05,
  nbrOfPoints: 1,
  turbulence: new Vector3(),
  orientation: new Vector3(-1, -1, 0),
  color: new Color('#e6e0e3'),
};

class CustomLineGenerator extends LineGenerator {
  addLine() {
    super.addLine({
      length: getRandomFloat(5, 10),
      visibleLength: getRandomFloat(0.05, 0.2),
      speed: getRandomFloat(0.01, 0.02),
      position: new Vector3(
        getRandomFloat(-4, 8),
        getRandomFloat(-3, 5),
        getRandomFloat(-2, 5),
      ),
    });
  }
}
const lineGenerator = new CustomLineGenerator({ frequency: 0.1 }, STATIC_PROPS);
engine.add(lineGenerator);


/**
 * * *******************
 * * STARS
 * * *******************
 */
const starGeometry = new SphereGeometry(0.5, 2, 2);
const starMaterial = new MeshBasicMaterial({ color: 0xECF0F1, transparent: true, opacity: 0.3 });
class Star extends Mesh {
  constructor() {
    super(starGeometry, starMaterial);

    this.t = Math.random() * 10;
    this.position.set(
      Math.random() - 0.5,
      Math.random() - 0.5,
      -Math.random() * 0.5
    ).normalize().multiplyScalar(getRandomFloat(100, 300));

    this.update = this.update.bind(this);
  }

  update() {
    this.t += 0.01;
    this.scale.x = this.scale.y = this.scale.z = Math.sin( this.t ) + 1;
  }
}
// TODO make instancied Stars
for (let i = 0; i < 300; i++) {
  const star = new Star();
  engine.add(star);
}

/**
 * * *******************
 * * START
 * * *******************
 */
// Show
engine.start();
const tlShow = new TimelineLite({ delay: 0.2, onStart: () => {
  lineGenerator.start();
}});
tlShow.to('.overlay', 2, { opacity: 0 });
tlShow.to('.background', 2, { y: -300 }, 0);
tlShow.fromTo(engine.lookAt, 2, { y: -8 }, { y: 0, ease: Power2.easeOut }, 0);
tlShow.add(text.show, '-=1');

// Hide
app.onHide((onComplete) => {
  const tlHide = new TimelineLite();
  tlHide.to(engine.lookAt, 2, { y: -6, ease: Power3.easeInOut });
  tlHide.add(text.hide, 0);
  tlHide.add(lineGenerator.stop);
  tlHide.to('.overlay', 0.5, { autoAlpha: 1, onComplete }, '-=1.5');
});
